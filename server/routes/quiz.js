const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const QuizResult = require('../models/QuizResult');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/quiz
// @desc    Get all quizzes
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const quizzes = await Quiz.find({ isActive: true })
            .select('-questions') // Don't send questions in list
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/quiz/:id
// @desc    Get quiz by ID with questions
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ id: req.params.id, isActive: true });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        res.json({
            success: true,
            data: quiz
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/quiz/:id/submit
// @desc    Submit quiz answers and get results
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
    try {
        const { answers, timeSpent } = req.body;
        const quiz = await Quiz.findOne({ id: req.params.id });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        // Calculate score
        let correctAnswers = 0;
        const processedAnswers = answers.map((answer, index) => {
            const question = quiz.questions[index];
            const correctOption = question.options.find(opt => opt.isCorrect);
            const isCorrect = answer.selectedOption === correctOption.id;

            if (isCorrect) correctAnswers++;

            return {
                questionId: answer.questionId,
                selectedOption: answer.selectedOption,
                isCorrect
            };
        });

        const totalQuestions = quiz.questions.length;
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        const xpEarned = percentage * 2; // 2 XP per percentage point

        // Save quiz result
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
            xpEarned
        });

        // Update user stats
        const user = await User.findById(req.user.id);
        user.stats.totalQuizzes += 1;
        user.stats.currentXP += xpEarned;

        // Calculate level (every 1000 XP = 1 level)
        user.stats.level = Math.floor(user.stats.currentXP / 1000) + 1;

        // Update streak
        const today = new Date().setHours(0, 0, 0, 0);
        const lastQuizDate = user.stats.lastQuizDate ?
            new Date(user.stats.lastQuizDate).setHours(0, 0, 0, 0) : null;

        if (lastQuizDate) {
            const daysDiff = Math.floor((today - lastQuizDate) / (1000 * 60 * 60 * 24));
            if (daysDiff === 1) {
                user.stats.currentStreak += 1;
            } else if (daysDiff > 1) {
                user.stats.currentStreak = 1;
            }
        } else {
            user.stats.currentStreak = 1;
        }

        if (user.stats.currentStreak > user.stats.longestStreak) {
            user.stats.longestStreak = user.stats.currentStreak;
        }

        user.stats.lastQuizDate = new Date();
        await user.save();

        res.json({
            success: true,
            data: {
                score: percentage,
                correctAnswers,
                totalQuestions,
                xpEarned,
                answers: processedAnswers,
                newLevel: user.stats.level,
                newXP: user.stats.currentXP,
                currentStreak: user.stats.currentStreak
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/quiz/results/my
// @desc    Get user's quiz history
// @access  Private
router.get('/results/my', protect, async (req, res) => {
    try {
        const results = await QuizResult.find({ user: req.user.id })
            .populate('quiz', 'title category difficulty')
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
