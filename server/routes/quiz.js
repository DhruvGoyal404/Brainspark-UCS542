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

// ────────────────────────────────────────────────────
// IMPORTANT: /results/my MUST come before /:id
// Otherwise Express matches "results" as the :id param
// ────────────────────────────────────────────────────

// @route   GET /api/quiz/results/my
// @desc    Get current user's quiz history (last 50)
// @access  Private
router.get('/results/my', protect, paginationValidation, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip = (page - 1) * limit;

        const [results, total] = await Promise.all([
            QuizResult.find({ user: req.user.id })
                .populate('quiz', 'title category difficulty')
                .sort({ createdAt: -1 })
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
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/quiz
// @desc    Get all active quizzes (no questions in list view)
// @access  Private
router.get('/', protect, paginationValidation, async (req, res) => {
    try {
        const { category, difficulty } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const skip = (page - 1) * limit;

        const filter = { isActive: true };
        if (category && category !== 'all') filter.category = category;
        if (difficulty && difficulty !== 'all') filter.difficulty = difficulty;

        const [quizzes, total] = await Promise.all([
            Quiz.find(filter)
                .select('-questions')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Quiz.countDocuments(filter)
        ]);

        res.json({
            success: true,
            count: quizzes.length,
            data: quizzes,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/quiz/:id
// @desc    Get quiz by string ID with all questions
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ id: req.params.id, isActive: true });

        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        res.json({ success: true, data: quiz });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/quiz/:id/submit
// @desc    Submit quiz answers — scores, saves result, awards XP, checks achievements
// @access  Private
router.post('/:id/submit', protect, submitQuizValidation, async (req, res) => {
    try {
        const { answers, timeSpent, quizMode } = req.body;
        const quiz = await Quiz.findOne({ id: req.params.id });

        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        // ── Score calculation ──
        let correctAnswers = 0;
        const processedAnswers = answers.map((answer, index) => {
            const question = quiz.questions[index];
            if (!question) return { questionId: answer.questionId, selectedOption: answer.selectedOption, isCorrect: false };
            const correctOption = question.options.find(opt => opt.isCorrect);
            const isCorrect = answer.selectedOption === correctOption?.id;
            if (isCorrect) correctAnswers++;
            return { questionId: answer.questionId, selectedOption: answer.selectedOption, isCorrect };
        });

        const totalQuestions = quiz.questions.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        const isPerfect = percentage === 100;

        // ── Load user ──
        const user = await User.findById(req.user.id);

        // ── Streak calculation ──
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastDate = user.stats.lastQuizDate
            ? new Date(user.stats.lastQuizDate).setHours(0, 0, 0, 0)
            : null;

        if (lastDate) {
            const daysDiff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) {
                user.stats.currentStreak += 1;
            } else if (daysDiff > 1) {
                user.stats.currentStreak = 1;
            }
            // daysDiff === 0 means same day — don't change streak
        } else {
            user.stats.currentStreak = 1;
        }

        if (user.stats.currentStreak > user.stats.longestStreak) {
            user.stats.longestStreak = user.stats.currentStreak;
        }
        user.stats.lastQuizDate = new Date();

        // ── XP calculation (unified formula) ──
        const xpBreakdown = calculateXP(percentage, quiz.difficulty, user.stats.currentStreak, isPerfect);
        const xpEarned = xpBreakdown.totalXP;

        // ── Update user stats ──
        user.stats.totalQuizzes += 1;
        user.stats.currentXP += xpEarned;
        user.stats.level = getLevelFromXP(user.stats.currentXP);

        // Update running average score
        const prevTotal = (user.stats.averageScore || 0) * (user.stats.totalQuizzes - 1);
        user.stats.averageScore = Math.round((prevTotal + percentage) / user.stats.totalQuizzes);

        // ── Daily goal ──
        const todayStr = new Date().toDateString();
        const lastResetStr = user.dailyGoal?.lastResetDate
            ? new Date(user.dailyGoal.lastResetDate).toDateString()
            : null;

        if (lastResetStr !== todayStr) {
            user.dailyGoal.todayCount = 0;
            user.dailyGoal.lastResetDate = new Date();
        }
        user.dailyGoal.todayCount += 1;

        // ── Achievement check ──
        const newAchievementIds = checkAchievements(user, { percentage, difficulty: quiz.difficulty });
        newAchievementIds.forEach(id => {
            user.achievements.push({ achievementId: id, unlockedAt: new Date() });
        });

        await user.save();

        // ── Save quiz result ──
        const quizResult = await QuizResult.create({
            user: req.user.id,
            quiz: quiz._id,
            quizId: quiz.id,
            answers: processedAnswers,
            score: percentage,
            totalQuestions,
            correctAnswers,
            percentage,
            timeSpent,
            xpEarned,
            mode: quizMode || 'timed'
        });

        res.json({
            success: true,
            data: {
                score: percentage,
                correctAnswers,
                totalQuestions,
                xpEarned,
                xpBreakdown,
                answers: processedAnswers,
                newLevel: user.stats.level,
                newXP: user.stats.currentXP,
                currentStreak: user.stats.currentStreak,
                newAchievements: newAchievementIds,
                dailyGoal: {
                    todayCount: user.dailyGoal.todayCount,
                    targetQuizzes: user.dailyGoal.targetQuizzes,
                    completed: user.dailyGoal.todayCount >= user.dailyGoal.targetQuizzes
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/quiz/results/:resultId
// @desc    Get detailed attempt review (FEAT-03)
// @access  Private
router.get('/results/:resultId', protect, async (req, res) => {
    try {
        const result = await QuizResult.findById(req.params.resultId)
            .populate('quiz')
            .populate('user', 'username');

        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found' });
        }

        // Verify user owns this result
        if (result.user._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        // Enrich with question-by-question comparison
        const quiz = result.quiz;
        const enrichedAnswers = result.answers.map((answer, index) => {
            const question = quiz.questions[index];
            const correctOption = question?.options.find(opt => opt.isCorrect);
            return {
                ...answer.toObject(),
                questionText: question?.questionText,
                questionDifficulty: question?.difficulty,
                explanation: question?.explanation,
                correctOption: correctOption?.id,
                correctOptionText: correctOption?.text,
                selectedOptionText: question?.options.find(opt => opt.id === answer.selectedOption)?.text
            };
        });

        res.json({
            success: true,
            data: {
                resultId: result._id,
                quizTitle: quiz.title,
                quizCategory: quiz.category,
                quizDifficulty: quiz.difficulty,
                score: result.percentage,
                correctAnswers: result.correctAnswers,
                totalQuestions: result.totalQuestions,
                xpEarned: result.xpEarned,
                timeSpent: result.timeSpent,
                mode: result.mode,
                completedAt: result.createdAt,
                answers: enrichedAnswers
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   POST /api/quiz/:quizId/questions/:questionIndex/report
// @desc    Report a question (FEAT-07)
// @access  Private
router.post('/:quizId/questions/:questionIndex/report', protect, reportQuestionValidation, async (req, res) => {
    try {
        const { reportType, description } = req.body;
        const { quizId, questionIndex } = req.params;

        const quiz = await Quiz.findOne({ id: quizId });
        if (!quiz) {
            return res.status(404).json({ success: false, message: 'Quiz not found' });
        }

        const question = quiz.questions[parseInt(questionIndex)];
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        // Check if user already reported this question
        const existingReport = await Report.findOne({
            user: req.user.id,
            quiz: quiz._id,
            questionIndex: parseInt(questionIndex),
            status: { $in: ['pending', 'reviewed'] }
        });

        if (existingReport) {
            return res.status(400).json({
                success: false,
                message: 'You have already reported this question'
            });
        }

        const report = await Report.create({
            user: req.user.id,
            quiz: quiz._id,
            quizId,
            quizTitle: quiz.title,
            questionIndex: parseInt(questionIndex),
            questionText: question.questionText,
            reportType,
            description
        });

        res.status(201).json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
