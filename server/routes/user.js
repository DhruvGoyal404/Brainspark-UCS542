const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const Bookmark = require('../models/Bookmark');
const { protect } = require('../middleware/auth');
const { ACHIEVEMENTS } = require('../utils/xpCalculator');
const { getRecommendations } = require('../utils/recommendations');
const { cacheGet, cacheSet } = require('../utils/redisClient');
const { uploadBuffer } = require('../utils/cloudinary');
const {
    addBookmarkValidation,
    preferencesValidation,
    paginationValidation,
    updateProfileValidation
} = require('../middleware/validate');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files are allowed'));
        cb(null, true);
    }
});

// ─────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────

// @route   GET /api/user/profile
// @access  Private
router.get('/profile', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/user/profile
// @desc    Update username / email with format validation and uniqueness check.
//          Uses findByIdAndUpdate with $set for a single atomic write.
// @access  Private
router.put('/profile', protect, updateProfileValidation, async (req, res, next) => {
    try {
        const { username, email } = req.body;

        if (!username && !email) {
            const err = new Error('Provide at least one field to update');
            err.statusCode = 400;
            return next(err);
        }

        // Uniqueness checks — exclude the current user from the lookup
        if (username) {
            const taken = await User.findOne({ username, _id: { $ne: req.user.id } });
            if (taken) {
                const err = new Error('Username already taken');
                err.statusCode = 409;
                return next(err);
            }
        }

        if (email) {
            const taken = await User.findOne({ email, _id: { $ne: req.user.id } });
            if (taken) {
                const err = new Error('Email already in use by another account');
                err.statusCode = 409;
                return next(err);
            }
        }

        const updates = {};
        if (username) updates.username = username;
        if (email) updates.email = email;

        // findByIdAndUpdate with $set — avoids loading + re-saving the whole document
        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        res.json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/user/preferences
// @access  Private
router.put('/preferences', protect, preferencesValidation, async (req, res, next) => {
    try {
        const { theme, fontSize, soundEnabled, reducedMotion } = req.body;

        // Build $set map for only the fields that were sent
        const prefUpdates = {};
        if (theme         !== undefined) prefUpdates['preferences.theme']         = theme;
        if (fontSize      !== undefined) prefUpdates['preferences.fontSize']      = fontSize;
        if (soundEnabled  !== undefined) prefUpdates['preferences.soundEnabled']  = soundEnabled;
        if (reducedMotion !== undefined) prefUpdates['preferences.reducedMotion'] = reducedMotion;

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { $set: prefUpdates },
            { new: true, runValidators: true }
        ).select('preferences');

        res.json({ success: true, data: updated.preferences });
    } catch (error) {
        next(error);
    }
});

// ─────────────────────────────────────────────────────
// STATS + ANALYTICS
// ─────────────────────────────────────────────────────

// @route   GET /api/user/stats
// @desc    Full stats including category breakdown via aggregation pipeline
// @access  Private
router.get('/stats', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        // Load recent results sorted newest-first — uses (user, createdAt) index
        const results = await QuizResult.find({ user: req.user.id })
            .populate('quiz', 'title category difficulty')
            .sort({ createdAt: -1 });

        // Aggregation pipeline: per-category breakdown with $lookup + $group + $addFields + $project
        const categoryStats = await QuizResult.aggregate([
            { $match: { user: user._id } },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: 'quiz',
                    foreignField: '_id',
                    as: 'quizData'
                }
            },
            { $unwind: '$quizData' },
            {
                $group: {
                    _id:      '$quizData.category',
                    avgScore: { $avg: '$percentage' },
                    count:    { $sum: 1 },
                    totalXP:  { $sum: '$xpEarned' }
                }
            },
            {
                // $addFields + $switch + $case: derive a letter grade from the numeric average.
                // $addFields appends computed fields without removing existing ones (unlike $project).
                $addFields: {
                    grade: {
                        $switch: {
                            branches: [
                                { case: { $gte: ['$avgScore', 90] }, then: 'A+' },
                                { case: { $gte: ['$avgScore', 80] }, then: 'A'  },
                                { case: { $gte: ['$avgScore', 70] }, then: 'B'  },
                                { case: { $gte: ['$avgScore', 60] }, then: 'C'  }
                            ],
                            default: 'D'
                        }
                    }
                }
            },
            {
                $project: {
                    category: '$_id',
                    avgScore: { $round: ['$avgScore', 1] },
                    count:    1,
                    totalXP:  1,
                    grade:    1,
                    _id:      0
                }
            }
        ]);

        // Daily goal with auto-reset
        const todayStr     = new Date().toDateString();
        const lastResetStr = user.dailyGoal?.lastResetDate
            ? new Date(user.dailyGoal.lastResetDate).toDateString()
            : null;

        let todayCount = user.dailyGoal?.todayCount || 0;
        if (lastResetStr !== todayStr) todayCount = 0;

        // Recent results trend (up to 30)
        const recentResults = results.slice(0, 30).map(r => ({
            quizId:    r.quizId,
            quizTitle: r.quiz?.title || r.quizId,
            category:  r.quiz?.category || 'other',
            difficulty:r.quiz?.difficulty || 'medium',
            percentage:r.percentage,
            xpEarned:  r.xpEarned,
            timeSpent: r.timeSpent,
            createdAt: r.createdAt
        }));

        // Enrich achievements with metadata
        const unlockedIds = new Set((user.achievements || []).map(a => a.achievementId));
        const enrichedAchievements = ACHIEVEMENTS.map(def => {
            const unlocked = unlockedIds.has(def.id);
            const record   = (user.achievements || []).find(a => a.achievementId === def.id);
            return { ...def, unlocked, unlockedAt: record?.unlockedAt || null };
        });

        res.json({
            success: true,
            data: {
                ...user.stats.toObject(),
                dailyGoal: {
                    targetQuizzes: user.dailyGoal?.targetQuizzes || 3,
                    todayCount,
                    completed: todayCount >= (user.dailyGoal?.targetQuizzes || 3)
                },
                categoryStats,
                recentResults,
                achievements: enrichedAchievements,
                preferences:  user.preferences
            }
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/user/daily-goal
// @desc    Update daily goal target
// @access  Private
router.put('/daily-goal', protect, async (req, res, next) => {
    try {
        const { targetQuizzes } = req.body;
        if (!targetQuizzes || targetQuizzes < 1 || targetQuizzes > 20) {
            const err = new Error('targetQuizzes must be between 1 and 20');
            err.statusCode = 400;
            return next(err);
        }

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { 'dailyGoal.targetQuizzes': targetQuizzes } },
            { new: true }
        );

        res.json({ success: true, data: updated.dailyGoal });
    } catch (error) {
        next(error);
    }
});

// ─────────────────────────────────────────────────────
// LEADERBOARD
// ─────────────────────────────────────────────────────

// @route   GET /api/user/leaderboard
// @desc    XP-based leaderboard with optional timeRange filter (paginated).
//          Redis cache (TTL 5 min) avoids re-running the aggregation pipeline on every page load.
//          Cache is invalidated by quiz submission so scores stay fresh.
// @access  Private
router.get('/leaderboard', protect, paginationValidation, async (req, res, next) => {
    try {
        const { timeRange = 'all', category = 'all' } = req.query;
        const page  = parseInt(req.query.page)  || 1;
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const skip  = (page - 1) * limit;

        // ── Redis cache check ──────────────────────────────────────────────
        // Key encodes all query dimensions so different filters get separate cache entries.
        const cacheKey = `lb:${timeRange}:${category}:${page}:${limit}`;
        const cached = await cacheGet(cacheKey);
        if (cached) return res.json({ ...cached, fromCache: true });

        // ── All-time leaderboard: rank active users by stored XP ──────────
        if (timeRange === 'all' && category === 'all') {
            const [users, totalUsers] = await Promise.all([
                User.find({ role: 'user', isActive: true })
                    .select('username stats')
                    .sort({ 'stats.currentXP': -1 }) // uses compound index
                    .skip(skip)
                    .limit(limit),
                User.countDocuments({ role: 'user', isActive: true })
            ]);

            const leaderboard = users.map((u, index) => ({
                rank:          skip + index + 1,
                username:      u.username,
                totalScore:    u.stats.currentXP,
                level:         u.stats.level,
                quizzesTaken:  u.stats.totalQuizzes,
                currentStreak: u.stats.currentStreak,
                averageScore:  u.stats.averageScore || 0
            }));

            // Find current user's rank using countDocuments (no full-scan)
            const currentUserRank = await User.countDocuments({
                role:             'user',
                isActive:         true,
                'stats.currentXP': { $gt: req.user.stats?.currentXP || 0 }
            }).then(count => count + 1);

            const payload = {
                success: true,
                count: leaderboard.length,
                data: leaderboard,
                currentUserRank,
                pagination: { page, limit, total: totalUsers, pages: Math.ceil(totalUsers / limit) }
            };
            await cacheSet(cacheKey, payload, 300); // 5-minute TTL
            return res.json(payload);
        }

        // ── Time-filtered leaderboard: aggregate XP from QuizResults ─────
        let dateFilter = {};
        const now = new Date();
        if (timeRange === 'weekly') {
            const weekAgo = new Date(now);
            weekAgo.setDate(weekAgo.getDate() - 7);
            dateFilter = { createdAt: { $gte: weekAgo } };
        } else if (timeRange === 'monthly') {
            const monthAgo = new Date(now);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            dateFilter = { createdAt: { $gte: monthAgo } };
        }

        const basePipeline = [
            { $match: dateFilter },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: 'quiz',
                    foreignField: '_id',
                    as: 'quizData'
                }
            },
            { $unwind: '$quizData' },
            ...(category !== 'all' ? [{ $match: { 'quizData.category': category } }] : []),
            {
                $group: {
                    _id:         '$user',
                    totalXP:     { $sum: '$xpEarned' },
                    quizzesTaken:{ $sum: 1 },
                    avgScore:    { $avg: '$percentage' }
                }
            },
            { $sort: { totalXP: -1 } }
        ];

        // Get current user's period XP for rank calculation (no category lookup needed if 'all')
        const userPeriodPipeline = [
            { $match: { user: req.user._id, ...dateFilter } },
            ...(category !== 'all' ? [
                { $lookup: { from: 'quizzes', localField: 'quiz', foreignField: '_id', as: 'quizData' } },
                { $unwind: '$quizData' },
                { $match: { 'quizData.category': category } }
            ] : []),
            { $group: { _id: null, totalXP: { $sum: '$xpEarned' } } }
        ];

        // Use $count aggregation stage — no full document load into JS memory
        const [countResult, results, userPeriodResult] = await Promise.all([
            QuizResult.aggregate([...basePipeline, { $count: 'total' }]),
            QuizResult.aggregate([
                ...basePipeline,
                { $skip: skip },
                { $limit: limit },
                {
                    $lookup: {
                        from: 'users',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'userData'
                    }
                },
                { $unwind: '$userData' },
                {
                    $project: {
                        username:      '$userData.username',
                        level:         '$userData.stats.level',
                        currentStreak: '$userData.stats.currentStreak',
                        totalScore:    '$totalXP',
                        quizzesTaken:  1,
                        avgScore:      { $round: ['$avgScore', 1] }
                    }
                }
            ]),
            QuizResult.aggregate(userPeriodPipeline)
        ]);

        const totalResults        = countResult[0]?.total || 0;
        const leaderboard         = results.map((r, i) => ({ rank: skip + i + 1, ...r }));
        const currentUserPeriodXP = userPeriodResult[0]?.totalXP || 0;

        // Count users with more period XP than current user (basePipeline without the trailing $sort)
        const basePipelineWithoutSort = basePipeline.slice(0, -1);
        const [rankAboveResult] = await QuizResult.aggregate([
            ...basePipelineWithoutSort,
            { $match: { totalXP: { $gt: currentUserPeriodXP } } },
            { $count: 'total' }
        ]);
        const currentUserRank = (rankAboveResult?.total || 0) + 1;

        const payload = {
            success: true,
            count: leaderboard.length,
            data: leaderboard,
            currentUserRank,
            pagination: { page, limit, total: totalResults, pages: Math.ceil(totalResults / limit) }
        };
        await cacheSet(cacheKey, payload, 300); // 5-minute TTL
        res.json(payload);
    } catch (error) {
        next(error);
    }
});

// ─────────────────────────────────────────────────────
// BOOKMARKS
// ─────────────────────────────────────────────────────

// @route   GET /api/user/bookmarks
// @access  Private
router.get('/bookmarks', protect, paginationValidation, async (req, res, next) => {
    try {
        const page  = parseInt(req.query.page)  || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip  = (page - 1) * limit;

        const [bookmarks, total] = await Promise.all([
            Bookmark.find({ user: req.user.id })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Bookmark.countDocuments({ user: req.user.id })
        ]);

        res.json({
            success: true,
            count: bookmarks.length,
            data: bookmarks,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/user/bookmarks
// @access  Private
router.post('/bookmarks', protect, addBookmarkValidation, async (req, res, next) => {
    try {
        const { quizId, quizTitle, questionIndex, questionText, explanation, options, difficulty } = req.body;

        const Quiz = require('../models/Quiz');
        const quiz = await Quiz.findOne({ id: quizId });
        if (!quiz) {
            const err = new Error('Quiz not found');
            err.statusCode = 404;
            return next(err);
        }

        // Strip isCorrect from stored options so the bookmark API does not
        // reveal correct answers to a client that queries all bookmarks.
        const safeOptions = (options || []).map(({ isCorrect: _, ...opt }) => opt);

        // findOneAndUpdate with upsert — idempotent, handles race conditions
        const bookmark = await Bookmark.findOneAndUpdate(
            { user: req.user.id, quizId, questionIndex },
            {
                user: req.user.id,
                quiz: quiz._id,
                quizId,
                quizTitle,
                questionIndex,
                questionText,
                explanation,
                options: safeOptions,
                difficulty
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(201).json({ success: true, data: bookmark });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).json({ success: true, message: 'Already bookmarked' });
        }
        next(error);
    }
});

// @route   DELETE /api/user/bookmarks/:bookmarkId
// @access  Private
router.delete('/bookmarks/:bookmarkId', protect, async (req, res, next) => {
    try {
        const bookmark = await Bookmark.findOneAndDelete({
            _id: req.params.bookmarkId,
            user: req.user.id
        });
        if (!bookmark) {
            const err = new Error('Bookmark not found');
            err.statusCode = 404;
            return next(err);
        }
        res.json({ success: true, message: 'Bookmark removed' });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/user/bookmarks/quiz/:quizId/question/:questionIndex
// @desc    Remove bookmark by quiz+question (frontend convenience)
// @access  Private
router.delete('/bookmarks/quiz/:quizId/question/:questionIndex', protect, async (req, res, next) => {
    try {
        await Bookmark.findOneAndDelete({
            user:          req.user.id,
            quizId:        req.params.quizId,
            questionIndex: parseInt(req.params.questionIndex)
        });
        res.json({ success: true, message: 'Bookmark removed' });
    } catch (error) {
        next(error);
    }
});

// ─────────────────────────────────────────────────────
// RECOMMENDATIONS
// ─────────────────────────────────────────────────────

// @route   GET /api/user/recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res, next) => {
    try {
        const recommendations = await getRecommendations(req.user.id);
        res.json({ success: true, data: recommendations });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/user/avatar
// @desc    Upload profile picture to Cloudinary and save URL
// @access  Private
router.post('/avatar', protect, upload.single('avatar'), async (req, res, next) => {
    try {
        if (!req.file) {
            const err = new Error('No image file provided');
            err.statusCode = 400;
            return next(err);
        }

        const secureUrl = await uploadBuffer(
            req.file.buffer,
            'brainspark/avatars',
            `user_${req.user.id}`
        );

        const updated = await User.findByIdAndUpdate(
            req.user.id,
            { $set: { avatar: secureUrl } },
            { new: true }
        ).select('-password');

        res.json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
