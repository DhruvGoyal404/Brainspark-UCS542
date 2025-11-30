const express = require('express');
const router = express.Router();
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const { protect } = require('../middleware/auth');

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const { username, email } = req.body;

        const user = await User.findById(req.user.id);

        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/user/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
    try {
        const { theme, fontSize, soundEnabled, reducedMotion } = req.body;

        const user = await User.findById(req.user.id);

        if (theme) user.preferences.theme = theme;
        if (fontSize) user.preferences.fontSize = fontSize;
        if (soundEnabled !== undefined) user.preferences.soundEnabled = soundEnabled;
        if (reducedMotion !== undefined) user.preferences.reducedMotion = reducedMotion;

        await user.save();

        res.json({
            success: true,
            data: user.preferences
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/user/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const results = await QuizResult.find({ user: req.user.id });

        // Calculate additional stats
        const totalScore = results.reduce((sum, result) => sum + result.percentage, 0);
        const averageScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;

        const categoryStats = {};
        results.forEach(result => {
            // You can expand this to group by category
            // For now, it's a placeholder
        });

        res.json({
            success: true,
            data: {
                ...user.stats,
                averageScore,
                totalAttempts: results.length
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/user/leaderboard
// @desc    Get leaderboard
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
    try {
        const { timeRange = 'all', category = 'all' } = req.query;

        const users = await User.find()
            .select('username stats')
            .sort({ 'stats.currentXP': -1 })
            .limit(100);

        const leaderboard = users.map((user, index) => ({
            rank: index + 1,
            username: user.username,
            totalScore: user.stats.currentXP,
            level: user.stats.level,
            quizzesTaken: user.stats.totalQuizzes,
            currentStreak: user.stats.currentStreak
        }));

        res.json({
            success: true,
            data: leaderboard
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
