const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const Report = require('../models/Report');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { calculateXP, getLevelFromXP, checkAchievements } = require('../utils/xpCalculator');
const { getRecommendations } = require('../utils/recommendations');
const { submitQuizValidation, paginationValidation, reportQuestionValidation } = require('../middleware/validate');
const { cacheDeletePattern } = require('../utils/redisClient');

// ────────────────────────────────────────────────────────────────
// IMPORTANT: /results/my MUST come before /:id so Express does not
// treat the literal string "results" as the :id param.
// ────────────────────────────────────────────────────────────────

// @route   GET /api/quiz/results/my
// @desc    Get current user's quiz history (paginated, newest first)
// @access  Private
router.get('/results/my', protect, paginationValidation, async (req, res, next) => {
    try {
        const page  = parseInt(req.query.page)  || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip  = (page - 1) * limit;

        const [results, total] = await Promise.all([
            QuizResult.find({ user: req.user.id })
                .populate('quiz', 'title category difficulty')
                .sort({ createdAt: -1 })   // newest first — uses (user, createdAt) index
                .skip(skip)
                .limit(limit),
            QuizResult.countDocuments({ user: req.user.id })
        ]);

        res.json({
            success: true,
            count: results.length,
            data: results,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/quiz
// @desc    Get all active quizzes (no questions in list view).
//          Supports $text search, category/difficulty filters, and advanced operators:
//          ?excludeCategories=web,other  → $nin (exclude listed categories)
//          ?excludeDifficulties=easy,hard → $nor (match none of the listed values)
//          ?excludeSearch=term           → $not with $regex (inverse text filter on title)
//          ?tags=arrays,sorting          → $all (quiz must have ALL listed tags)
//          ?exactQuestions=10            → $size (exact array length match on questions)
// @access  Private
router.get('/', protect, paginationValidation, async (req, res, next) => {
    try {
        const { category, difficulty, search, excludeCategories, excludeDifficulties, excludeSearch, tags, exactQuestions } = req.query;
        const page  = parseInt(req.query.page)  || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip  = (page - 1) * limit;

        const filter = { isActive: true };

        // Standard inclusion filters
        if (category && category !== 'all') filter.category = category;
        if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;

        // $nin — exclude specific categories (e.g. ?excludeCategories=web,other)
        if (excludeCategories) {
            const excluded = excludeCategories.split(',').map(c => c.trim()).filter(Boolean);
            if (excluded.length) filter.category = { $nin: excluded };
        }

        // $nor — exclude quizzes matching ANY of the listed difficulties
        // (e.g. ?excludeDifficulties=easy,hard returns only medium quizzes)
        if (excludeDifficulties) {
            const excDiffs = excludeDifficulties.split(',').map(d => d.trim()).filter(Boolean);
            if (excDiffs.length) filter.$nor = excDiffs.map(d => ({ difficulty: d }));
        }

        // $not with $regex — inverse title search (e.g. ?excludeSearch=arrays excludes quizzes
        // whose title contains "arrays")
        if (excludeSearch && excludeSearch.trim()) {
            filter.title = { $not: { $regex: excludeSearch.trim(), $options: 'i' } };
        }

        // $all — quiz must have ALL of the requested tags (e.g. ?tags=sorting,arrays)
        if (tags) {
            const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);
            if (tagList.length) filter.tags = { $all: tagList };
        }

        // $size — match quizzes with exactly N questions (e.g. ?exactQuestions=10)
        if (exactQuestions) {
            const n = parseInt(exactQuestions);
            if (!isNaN(n)) filter.questions = { $size: n };
        }

        let queryBuilder;

        if (search && search.trim()) {
            // $text search uses the (title, description, category) text index.
            // Results are ordered by relevance score descending when no other sort is given.
            filter.$text = { $search: search.trim() };
            queryBuilder = Quiz.find(filter, { score: { $meta: 'textScore' } })
                .select('-questions')
                .sort({ score: { $meta: 'textScore' } })
                .skip(skip)
                .limit(limit);
        } else {
            queryBuilder = Quiz.find(filter)
                .select('-questions')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
        }

        const [quizzes, total] = await Promise.all([
            queryBuilder,
            Quiz.countDocuments(filter)
        ]);

        res.json({
            success: true,
            count: quizzes.length,
            data: quizzes,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/quiz/search/questions
// @desc    Find quizzes containing at least one question matching ALL given criteria.
//          Uses $elemMatch to require multiple conditions on the same array element —
//          plain $and on array fields would match conditions across different elements.
//          ?difficulty=hard&term=sorting → quizzes with a hard question about sorting
// @access  Private
router.get('/search/questions', protect, async (req, res, next) => {
    try {
        const { difficulty, term } = req.query;

        if (!difficulty && !term) {
            const err = new Error('Provide at least one of: difficulty, term');
            err.statusCode = 400;
            return next(err);
        }

        const elemCriteria = {};
        if (difficulty) elemCriteria.difficulty = difficulty;
        if (term && term.trim()) elemCriteria.questionText = { $regex: term.trim(), $options: 'i' };

        // $elemMatch: both conditions must be true on the SAME array element
        const quizzes = await Quiz.find(
            { isActive: true, questions: { $elemMatch: elemCriteria } },
            { title: 1, category: 1, difficulty: 1, id: 1, 'metadata.totalQuestions': 1 }
        ).limit(20);

        res.json({ success: true, count: quizzes.length, data: quizzes });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/quiz/:id
// @desc    Get quiz by string ID with all questions
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({ id: req.params.id, isActive: true });
        if (!quiz) {
            const err = new Error('Quiz not found');
            err.statusCode = 404;
            return next(err);
        }
        res.json({ success: true, data: quiz });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/quiz/:id/submit
// @desc    Submit quiz answers — score, save result, award XP, update streak,
//          check achievements.  Daily goal only increments once per quiz per day
//          to prevent farming the same quiz.
// @access  Private
router.post('/:id/submit', protect, submitQuizValidation, async (req, res, next) => {
    try {
        const { answers, timeSpent, quizMode } = req.body;
        const quiz = await Quiz.findOne({ id: req.params.id });

        if (!quiz) {
            const err = new Error('Quiz not found');
            err.statusCode = 404;
            return next(err);
        }

        // ── Score calculation ──────────────────────────────────────────────
        let correctAnswers = 0;
        const processedAnswers = answers.map((answer, index) => {
            const question = quiz.questions[index];
            if (!question) {
                return { questionId: answer.questionId, selectedOption: answer.selectedOption, isCorrect: false };
            }
            const correctOption = question.options.find(opt => opt.isCorrect);
            const isCorrect = answer.selectedOption === correctOption?.id;
            if (isCorrect) correctAnswers++;
            return { questionId: answer.questionId, selectedOption: answer.selectedOption, isCorrect };
        });

        const totalQuestions = quiz.questions.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        const isPerfect   = percentage === 100;

        // ── Atomically increment the quiz attempt counter ──────────────────
        // $inc is a single round-trip with no race condition
        await Quiz.updateOne({ _id: quiz._id }, { $inc: { attemptCount: 1 } });

        // ── Load user for stat calculations ───────────────────────────────
        const user = await User.findById(req.user.id);

        // ── Streak calculation ─────────────────────────────────────────────
        const today    = new Date();
        today.setHours(0, 0, 0, 0);

        const lastDate = user.stats.lastQuizDate
            ? new Date(user.stats.lastQuizDate).setHours(0, 0, 0, 0)
            : null;

        let newStreak = user.stats.currentStreak;
        if (lastDate) {
            const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) {
                newStreak += 1;
            } else if (daysDiff > 1) {
                newStreak = 1;
            }
            // daysDiff === 0 → same day, no change
        } else {
            newStreak = 1;
        }

        const newLongestStreak = Math.max(user.stats.longestStreak || 0, newStreak);

        // ── XP calculation ─────────────────────────────────────────────────
        const xpBreakdown = calculateXP(percentage, quiz.difficulty, newStreak, isPerfect);
        const xpEarned    = xpBreakdown.totalXP;
        const newXP       = (user.stats.currentXP || 0) + xpEarned;
        const newLevel    = getLevelFromXP(newXP);

        // Running average — computed before totalQuizzes is incremented
        const newTotalQuizzes = (user.stats.totalQuizzes || 0) + 1;
        const prevTotal       = (user.stats.averageScore || 0) * (newTotalQuizzes - 1);
        const newAvgScore     = Math.round((prevTotal + percentage) / newTotalQuizzes);

        // ── Daily goal uniqueness check ────────────────────────────────────
        // Only count the first submission of each quiz per calendar day.
        // Uses the compound index (user, quizId, createdAt) for a fast lookup.
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const alreadySubmittedToday = await QuizResult.findOne({
            user:      req.user.id,
            quizId:    quiz.id,
            mode:      quizMode || 'timed',
            createdAt: { $gte: startOfDay }
        });

        const needsReset   = new Date(user.dailyGoal?.lastResetDate).toDateString() !== today.toDateString();
        const incrementGoal = !alreadySubmittedToday;

        let newDailyCount;
        if (needsReset) {
            newDailyCount = incrementGoal ? 1 : 0;
        } else {
            newDailyCount = (user.dailyGoal?.todayCount || 0) + (incrementGoal ? 1 : 0);
        }

        // ── Achievement check ──────────────────────────────────────────────
        // Pass the user object with UPDATED stats so thresholds are evaluated correctly
        const userForAchievements = {
            ...user.toObject(),
            stats: { ...user.stats.toObject(), totalQuizzes: newTotalQuizzes, currentXP: newXP, currentStreak: newStreak }
        };
        const newAchievementIds = checkAchievements(userForAchievements, { percentage, difficulty: quiz.difficulty });

        // ── Atomic user update ─────────────────────────────────────────────
        // Single updateOne call combines seven different update operators:
        // $inc   — additive increments (no read-modify-write race)
        // $set   — derived/computed scalar fields
        // $max   — bestScore: only writes if percentage > current value
        // $min   — worstScore: only writes if percentage < current value
        // $currentDate — lastActive: uses MongoDB server time (not JS Date.now())
        // $push  — recentScores: capped array via $each+$slice+$sort modifiers
        // $push  — achievements: append new unlocks (duplicates prevented by checkAchievements)
        const updateDoc = {
            $inc: {
                'stats.currentXP':    xpEarned,
                'stats.totalQuizzes': 1
            },
            $set: {
                'stats.level':          newLevel,
                'stats.currentStreak':  newStreak,
                'stats.longestStreak':  newLongestStreak,
                'stats.lastQuizDate':   new Date(),
                'stats.averageScore':   newAvgScore,
                'dailyGoal.todayCount': newDailyCount,
                ...(needsReset && { 'dailyGoal.lastResetDate': new Date() })
            },
            $max: { 'stats.bestScore':  percentage },
            $min: { 'stats.worstScore': percentage },
            $currentDate: { 'stats.lastActive': true },
            // $push with $each+$slice+$sort: append new score, keep newest 10, sorted by date desc
            $push: {
                'stats.recentScores': {
                    $each:  [{ score: percentage, quizId: quiz.id, category: quiz.category, date: new Date() }],
                    $slice: -10,
                    $sort:  { date: -1 }
                }
            }
        };

        if (newAchievementIds.length > 0) {
            updateDoc.$push.achievements = {
                $each: newAchievementIds.map(id => ({ achievementId: id, unlockedAt: new Date() }))
            };
        }

        await User.updateOne({ _id: req.user.id }, updateDoc);

        // ── Save quiz result ───────────────────────────────────────────────
        await QuizResult.create({
            user:          req.user.id,
            quiz:          quiz._id,
            quizId:        quiz.id,
            answers:       processedAnswers,
            score:         percentage,
            totalQuestions,
            correctAnswers,
            percentage,
            timeSpent,
            xpEarned,
            mode: quizMode || 'timed'
        });

        // ── Invalidate leaderboard Redis cache ─────────────────────────────
        // A new quiz result changes XP rankings — stale cached leaderboards
        // must be evicted so the next request re-runs the aggregation.
        await cacheDeletePattern('lb:*');

        res.json({
            success: true,
            data: {
                score:           percentage,
                correctAnswers,
                totalQuestions,
                xpEarned,
                xpBreakdown,
                answers:         processedAnswers,
                newLevel,
                newXP,
                currentStreak:   newStreak,
                newAchievements: newAchievementIds,
                dailyGoal: {
                    todayCount:    newDailyCount,
                    targetQuizzes: user.dailyGoal?.targetQuizzes || 3,
                    completed:     newDailyCount >= (user.dailyGoal?.targetQuizzes || 3)
                }
            }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/quiz/results/:resultId
// @desc    Get detailed attempt review
// @access  Private
router.get('/results/:resultId', protect, async (req, res, next) => {
    try {
        const result = await QuizResult.findById(req.params.resultId)
            .populate('quiz')
            .populate('user', 'username');

        if (!result) {
            const err = new Error('Result not found');
            err.statusCode = 404;
            return next(err);
        }

        if (result.user._id.toString() !== req.user.id) {
            const err = new Error('Unauthorized');
            err.statusCode = 403;
            return next(err);
        }

        const quiz = result.quiz;
        const enrichedAnswers = result.answers.map((answer, index) => {
            const question      = quiz.questions[index];
            const correctOption = question?.options.find(opt => opt.isCorrect);
            return {
                ...answer.toObject(),
                questionText:         question?.questionText,
                questionDifficulty:   question?.difficulty,
                explanation:          question?.explanation,
                correctOption:        correctOption?.id,
                correctOptionText:    correctOption?.text,
                selectedOptionText:   question?.options.find(opt => opt.id === answer.selectedOption)?.text
            };
        });

        res.json({
            success: true,
            data: {
                resultId:       result._id,
                quizTitle:      quiz.title,
                quizCategory:   quiz.category,
                quizDifficulty: quiz.difficulty,
                score:          result.percentage,
                correctAnswers: result.correctAnswers,
                totalQuestions: result.totalQuestions,
                xpEarned:       result.xpEarned,
                timeSpent:      result.timeSpent,
                mode:           result.mode,
                completedAt:    result.createdAt,
                answers:        enrichedAnswers
            }
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/quiz/:quizId/questions/:questionIndex/report
// @access  Private
router.post('/:quizId/questions/:questionIndex/report', protect, reportQuestionValidation, async (req, res, next) => {
    try {
        const { reportType, description } = req.body;
        const { quizId, questionIndex }   = req.params;

        const quiz = await Quiz.findOne({ id: quizId });
        if (!quiz) {
            const err = new Error('Quiz not found');
            err.statusCode = 404;
            return next(err);
        }

        const question = quiz.questions[parseInt(questionIndex)];
        if (!question) {
            const err = new Error('Question not found');
            err.statusCode = 404;
            return next(err);
        }

        const existingReport = await Report.findOne({
            user:          req.user.id,
            quiz:          quiz._id,
            questionIndex: parseInt(questionIndex),
            status:        { $in: ['pending', 'reviewed'] }
        });

        if (existingReport) {
            const err = new Error('You have already reported this question');
            err.statusCode = 400;
            return next(err);
        }

        const report = await Report.create({
            user:          req.user.id,
            quiz:          quiz._id,
            quizId,
            quizTitle:     quiz.title,
            questionIndex: parseInt(questionIndex),
            questionText:  question.questionText,
            reportType,
            description
        });

        res.status(201).json({ success: true, data: report });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
