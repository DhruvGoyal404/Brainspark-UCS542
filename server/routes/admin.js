const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @route   POST /api/admin/quiz
// @desc    Create a new quiz
// @access  Private/Admin
router.post('/quiz', protect, adminOnly, async (req, res) => {
    try {
        const { id, title, description, category, difficulty, questions, metadata } = req.body;

        // Validation
        if (!id || !title || !description || !category || !difficulty || !questions || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if quiz with this ID already exists
        const existingQuiz = await Quiz.findOne({ id });
        if (existingQuiz) {
            return res.status(400).json({
                success: false,
                message: 'Quiz with this ID already exists'
            });
        }

        const quiz = await Quiz.create({
            id,
            title,
            description,
            category,
            difficulty,
            questions,
            metadata: {
                ...metadata,
                totalQuestions: questions.length
            },
            createdBy: req.user.id
        });

        res.status(201).json({
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

// @route   PUT /api/admin/quiz/:id
// @desc    Update a quiz
// @access  Private/Admin
router.put('/quiz/:id', protect, adminOnly, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ id: req.params.id });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        Object.assign(quiz, req.body);

        if (req.body.questions) {
            quiz.metadata.totalQuestions = req.body.questions.length;
        }

        await quiz.save();

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

// @route   DELETE /api/admin/quiz/:id
// @desc    Delete a quiz (soft delete)
// @access  Private/Admin
router.delete('/quiz/:id', protect, adminOnly, async (req, res) => {
    try {
        const quiz = await Quiz.findOne({ id: req.params.id });

        if (!quiz) {
            return res.status(404).json({
                success: false,
                message: 'Quiz not found'
            });
        }

        quiz.isActive = false;
        await quiz.save();

        res.json({
            success: true,
            message: 'Quiz deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private/Admin
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/admin/users/:id/role
// @desc    Update user role
// @access  Private/Admin
router.put('/users/:id/role', protect, adminOnly, async (req, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

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

module.exports = router;
