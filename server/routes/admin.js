const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const Report = require('../models/Report');
const { protect, adminOnly } = require('../middleware/auth');
const { createQuizValidation, paginationValidation } = require('../middleware/validate');


// @route   POST /api/admin/quiz
// @desc    Create a new quiz
// @access  Private/Admin
router.post('/quiz', protect, adminOnly, createQuizValidation, async (req, res) => {
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

        // Whitelist allowed fields to prevent mass-assignment attacks
        const { title, description, category, difficulty, questions, metadata, isActive } = req.body;
        if (title !== undefined) quiz.title = title;
        if (description !== undefined) quiz.description = description;
        if (category !== undefined) quiz.category = category;
        if (difficulty !== undefined) quiz.difficulty = difficulty;
        if (isActive !== undefined) quiz.isActive = isActive;
        if (questions !== undefined) {
            quiz.questions = questions;
            quiz.metadata.totalQuestions = questions.length;
        }
        if (metadata) {
            if (metadata.estimatedTime !== undefined) quiz.metadata.estimatedTime = metadata.estimatedTime;
            if (metadata.passingScore !== undefined) quiz.metadata.passingScore = metadata.passingScore;
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
// @desc    Get all users (paginated)
// @access  Private/Admin
router.get('/users', protect, adminOnly, paginationValidation, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find()
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments()
        ]);

        res.json({
            success: true,
            count: users.length,
            data: users,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
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

// @route   GET /api/admin/analytics
// @desc    Platform-wide analytics for admin dashboard
// @access  Private/Admin
router.get('/analytics', protect, adminOnly, async (req, res) => {
    try {
        const [totalUsers, totalQuizzes, totalResults] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            Quiz.countDocuments({ isActive: true }),
            QuizResult.countDocuments()
        ]);

        // New users this week
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const newUsersThisWeek = await User.countDocuments({
            role: 'user',
            createdAt: { $gte: weekAgo }
        });

        // Top 5 most attempted quizzes
        const topQuizzes = await QuizResult.aggregate([
            { $group: { _id: '$quizId', attempts: { $sum: 1 }, avgScore: { $avg: '$percentage' } } },
            { $sort: { attempts: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'quizzes',
                    localField: '_id',
                    foreignField: 'id',
                    as: 'quizData'
                }
            },
            { $unwind: { path: '$quizData', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    quizId: '$_id',
                    title: { $ifNull: ['$quizData.title', '$_id'] },
                    category: '$quizData.category',
                    attempts: 1,
                    avgScore: { $round: ['$avgScore', 1] },
                    _id: 0
                }
            }
        ]);

        // Category breakdown
        const categoryBreakdown = await QuizResult.aggregate([
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
                    attempts: { $sum: 1 },
                    avgScore: { $avg: '$percentage' }
                }
            },
            {
                $project: {
                    category: '$_id',
                    attempts: 1,
                    avgScore: { $round: ['$avgScore', 1] },
                    _id: 0
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalQuizzes,
                totalResults,
                newUsersThisWeek,
                topQuizzes,
                categoryBreakdown
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─────────────────────────────────────────────────────
// REPORTS (FEAT-07)
// ─────────────────────────────────────────────────────

// @route   GET /api/admin/reports
// @desc    Get all question reports (paginated)
// @access  Private/Admin
router.get('/reports', protect, adminOnly, paginationValidation, async (req, res) => {
    try {
        const { status = 'all' } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip = (page - 1) * limit;

        const filter = status && status !== 'all' ? { status } : {};

        const [reports, total] = await Promise.all([
            Report.find(filter)
                .populate('user', 'username email')
                .populate('quiz', 'title category')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Report.countDocuments(filter)
        ]);

        res.json({
            success: true,
            count: reports.length,
            data: reports,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   PUT /api/admin/reports/:reportId/status
// @desc    Update report status (reviewed, resolved, dismissed)
// @access  Private/Admin
router.put('/reports/:reportId/status', protect, adminOnly, async (req, res) => {
    try {
        const { status, adminNotes } = req.body;

        if (!['pending', 'reviewed', 'resolved', 'dismissed'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const report = await Report.findByIdAndUpdate(
            req.params.reportId,
            {
                status,
                adminNotes: adminNotes || '',
                reviewedAt: new Date(),
                reviewedBy: req.user.id
            },
            { new: true }
        )
            .populate('user', 'username email')
            .populate('quiz', 'title category');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        res.json({
            success: true,
            data: report
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @route   GET /api/admin/reports/stats
// @desc    Get report statistics
// @access  Private/Admin
router.get('/reports/stats', protect, adminOnly, async (req, res) => {
    try {
        const stats = await Report.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const byType = await Report.aggregate([
            {
                $group: {
                    _id: '$reportType',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                byStatus: stats,
                byType
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;

