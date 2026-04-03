const express = require('express');
const router = express.Router();
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const Bookmark = require('../models/Bookmark');
const { protect } = require('../middleware/auth');
const { ACHIEVEMENTS } = require('../utils/xpCalculator');
const { getRecommendations } = require('../utils/recommendations');
const { addBookmarkValidation, preferencesValidation, paginationValidation } = require('../middleware/validate');

// ─────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────

// @route   GET /api/user/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/user/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const { username, email } = req.body;
        const user = await User.findById(req.user.id);
        if (username) user.username = username;
        if (email) user.email = email;
        await user.save();
        const updated = await User.findById(req.user.id).select('-password');
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/user/preferences
// @access  Private
router.put('/preferences', protect, preferencesValidation, async (req, res) => {
    try {
        const { theme, fontSize, soundEnabled, reducedMotion } = req.body;
        const user = await User.findById(req.user.id);

        if (theme !== undefined) user.preferences.theme = theme;
        if (fontSize !== undefined) user.preferences.fontSize = fontSize;
        if (soundEnabled !== undefined) user.preferences.soundEnabled = soundEnabled;
        if (reducedMotion !== undefined) user.preferences.reducedMotion = reducedMotion;

        await user.save();
        res.json({ success: true, data: user.preferences });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─────────────────────────────────────────────────────
// STATS + ANALYTICS
// ─────────────────────────────────────────────────────

// @route   GET /api/user/stats
// @desc    Full stats including category breakdown via aggregation
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const results = await QuizResult.find({ user: req.user.id })
            .populate('quiz', 'title category difficulty');

        // Category breakdown using aggregation
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
                    _id: '$quizData.category',
                    avgScore: { $avg: '$percentage' },
                    count: { $sum: 1 },
                    totalXP: { $sum: '$xpEarned' }
                }
            },
            {
                $project: {
                    category: '$_id',
                    avgScore: { $round: ['$avgScore', 1] },
                    count: 1,
                    totalXP: 1,
                    _id: 0
                }
            }
        ]);

        // Daily goal with auto-reset
        const todayStr = new Date().toDateString();
        const lastResetStr = user.dailyGoal?.lastResetDate
            ? new Date(user.dailyGoal.lastResetDate).toDateString()
            : null;

        let todayCount = user.dailyGoal?.todayCount || 0;
        if (lastResetStr !== todayStr) todayCount = 0;

        // Recent results for trend (up to 30)
        const recentResults = results.slice(0, 30).map(r => ({
            quizId: r.quizId,
            quizTitle: r.quiz?.title || r.quizId,
            category: r.quiz?.category || 'other',
            difficulty: r.quiz?.difficulty || 'medium',
            percentage: r.percentage,
            xpEarned: r.xpEarned,
            timeSpent: r.timeSpent,
            createdAt: r.createdAt
        }));

        // Map achievements with full metadata
        const unlockedIds = new Set((user.achievements || []).map(a => a.achievementId));
        const enrichedAchievements = ACHIEVEMENTS.map(def => {
            const unlocked = unlockedIds.has(def.id);
            const record = (user.achievements || []).find(a => a.achievementId === def.id);
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
                preferences: user.preferences
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/user/daily-goal
// @desc    Update daily goal target
// @access  Private
router.put('/daily-goal', protect, async (req, res) => {
    try {
        const { targetQuizzes } = req.body;
        if (!targetQuizzes || targetQuizzes < 1 || targetQuizzes > 20) {
            return res.status(400).json({ success: false, message: 'targetQuizzes must be between 1 and 20' });
        }
        const user = await User.findById(req.user.id);
        user.dailyGoal.targetQuizzes = targetQuizzes;
        await user.save();
        res.json({ success: true, data: user.dailyGoal });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─────────────────────────────────────────────────────
// LEADERBOARD
// ─────────────────────────────────────────────────────

// @route   GET /api/user/leaderboard
// @desc    XP-based leaderboard with optional timeRange filter (paginated)
// @access  Private
router.get('/leaderboard', protect, paginationValidation, async (req, res) => {
    try {
        const { timeRange = 'all', category = 'all' } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const skip = (page - 1) * limit;

        // For all-time: rank by totalXP in user stats
        if (timeRange === 'all' && category === 'all') {
            // Count total users first
            const totalUsers = await User.countDocuments({ role: 'user' });
            
            const users = await User.find({ role: 'user' })
                .select('username stats')
                .sort({ 'stats.currentXP': -1 })
                .skip(skip)
                .limit(limit);

            const leaderboard = users.map((u, index) => ({
                rank: skip + index + 1,
                username: u.username,
                totalScore: u.stats.currentXP,
                level: u.stats.level,
                quizzesTaken: u.stats.totalQuizzes,
                currentStreak: u.stats.currentStreak,
                averageScore: u.stats.averageScore || 0
            }));

            // Find current user's rank across all users
            const currentUserRank = await User.countDocuments({
                role: 'user',
                'stats.currentXP': { $gt: (req.user.stats?.currentXP || 0) }
            }).then(count => count + 1);

            return res.json({
                success: true,
                count: leaderboard.length,
                data: leaderboard,
                currentUserRank,
                pagination: { page, limit, total: totalUsers, pages: Math.ceil(totalUsers / limit) }
            });
        }

        // For time-filtered: sum XP from QuizResults in period
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

        // Category filter on quiz
        let categoryMatchStage = {};
        if (category !== 'all') {
            categoryMatchStage = { 'quizData.category': category };
        }

        const pipeline = [
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
                    _id: '$user',
                    totalXP: { $sum: '$xpEarned' },
                    quizzesTaken: { $sum: 1 },
                    avgScore: { $avg: '$percentage' }
                }
            },
            { $sort: { totalXP: -1 } },
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
                    username: '$userData.username',
                    level: '$userData.stats.level',
                    currentStreak: '$userData.stats.currentStreak',
                    totalScore: '$totalXP',
                    quizzesTaken: 1,
                    avgScore: { $round: ['$avgScore', 1] }
                }
            }
        ];

        // Get total count for pagination (without skip/limit)
        const countPipeline = pipeline.filter((stage, i) => {
            const keys = Object.keys(stage)[0];
            return keys !== '$skip' && keys !== '$limit';
        });
        const totalResults = await QuizResult.aggregate([
            ...countPipeline.slice(0, -1)
        ]).then(docs => docs.length);

        const results = await QuizResult.aggregate(pipeline);
        const leaderboard = results.map((r, i) => ({ rank: skip + i + 1, ...r }));

        res.json({
            success: true,
            count: leaderboard.length,
            data: leaderboard,
            pagination: { page, limit, total: totalResults, pages: Math.ceil(totalResults / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─────────────────────────────────────────────────────
// BOOKMARKS
// ─────────────────────────────────────────────────────

// @route   GET /api/user/bookmarks
// @desc    Get user's bookmarks (paginated)
// @access  Private
router.get('/bookmarks', protect, paginationValidation, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip = (page - 1) * limit;

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
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/user/bookmarks
// @desc    Add a bookmark
// @access  Private
router.post('/bookmarks', protect, addBookmarkValidation, async (req, res) => {
    try {
        const { quizId, quizTitle, questionIndex, questionText, explanation, options, difficulty } = req.body;

        if (!quizId || questionIndex === undefined || !questionText) {
            return res.status(400).json({ success: false, message: 'quizId, questionIndex and questionText are required' });
        }

        // Find the quiz document ObjectId
        const Quiz = require('../models/Quiz');
        const quiz = await Quiz.findOne({ id: quizId });
        if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

        // Upsert — ignore if already bookmarked
        const bookmark = await Bookmark.findOneAndUpdate(
            { user: req.user.id, quizId, questionIndex },
            { user: req.user.id, quiz: quiz._id, quizId, quizTitle, questionIndex, questionText, explanation, options, difficulty },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(201).json({ success: true, data: bookmark });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(200).json({ success: true, message: 'Already bookmarked' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/user/bookmarks/:bookmarkId
// @access  Private
router.delete('/bookmarks/:bookmarkId', protect, async (req, res) => {
    try {
        const bookmark = await Bookmark.findOneAndDelete({
            _id: req.params.bookmarkId,
            user: req.user.id
        });
        if (!bookmark) return res.status(404).json({ success: false, message: 'Bookmark not found' });
        res.json({ success: true, message: 'Bookmark removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   DELETE /api/user/bookmarks/quiz/:quizId/question/:questionIndex
// @desc    Remove bookmark by quiz+question (frontend convenience)
// @access  Private
router.delete('/bookmarks/quiz/:quizId/question/:questionIndex', protect, async (req, res) => {
    try {
        await Bookmark.findOneAndDelete({
            user: req.user.id,
            quizId: req.params.quizId,
            questionIndex: parseInt(req.params.questionIndex)
        });
        res.json({ success: true, message: 'Bookmark removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─────────────────────────────────────────────────────
// RECOMMENDATIONS (FEAT-02)
// ─────────────────────────────────────────────────────

// @route   GET /api/user/recommendations
// @desc    Get personalized quiz recommendations
// @access  Private
router.get('/recommendations', protect, async (req, res) => {
    try {
        const recommendations = await getRecommendations(req.user.id);
        res.json({ success: true, data: recommendations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
