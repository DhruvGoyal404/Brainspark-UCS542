const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const User = require('../models/User');
const QuizResult = require('../models/QuizResult');
const Report = require('../models/Report');
const LeaderboardSnapshot = require('../models/LeaderboardSnapshot');
const { protect, adminOnly } = require('../middleware/auth');
const { createQuizValidation, paginationValidation } = require('../middleware/validate');
const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// @route   POST /api/admin/quiz/generate
// @desc    Use Claude AI (claude-sonnet-4-6) to generate N MCQ questions for a given topic.
//          Returns draft questions the admin can review, edit, and optionally save as a new quiz.
//          Body: { topic, category, difficulty, count (default 10), saveAsQuiz, quizTitle, quizId }
// @access  Private/Admin
router.post('/quiz/generate', protect, adminOnly, async (req, res, next) => {
    try {
        const {
            topic,
            category = 'other',
            difficulty = 'medium',
            count = 10,
            saveAsQuiz = false,
            quizTitle,
            quizId,
            description
        } = req.body;

        if (!topic || !topic.trim()) {
            const err = new Error('topic is required');
            err.statusCode = 400;
            return next(err);
        }

        const n = Math.min(Math.max(parseInt(count) || 10, 1), 20);

        // ── Prompt Claude to generate structured MCQ questions ─────────────
        const prompt = `You are a computer science educator creating quiz questions for undergraduate students at an engineering college.

Generate exactly ${n} multiple-choice questions about the topic: "${topic.trim()}"

Category: ${category}
Difficulty: ${difficulty}

Return ONLY a valid JSON array. No markdown, no explanation text, no code fences — just the raw JSON array.

Each element must follow this exact structure:
{
  "questionText": "Clear, precise question text?",
  "options": [
    { "id": "a", "text": "First option", "isCorrect": false },
    { "id": "b", "text": "Second option", "isCorrect": true },
    { "id": "c", "text": "Third option", "isCorrect": false },
    { "id": "d", "text": "Fourth option", "isCorrect": false }
  ],
  "explanation": "Concise explanation of why the correct answer is correct and why distractors are wrong.",
  "difficulty": "${difficulty}"
}

Rules:
- Exactly one option must have isCorrect: true in each question
- Options must be plausible — avoid obviously wrong distractors
- Questions must test conceptual understanding, not just memorization
- ${difficulty === 'hard' ? 'Include edge cases and nuanced scenarios' : difficulty === 'easy' ? 'Focus on fundamental definitions and basic applications' : 'Balance theory with practical application'}
- Return the array starting with [ and ending with ]`;

        const message = await anthropic.messages.create({
            model:      'claude-sonnet-4-6',
            max_tokens: 6000,
            messages:   [{ role: 'user', content: prompt }]
        });

        const rawText = message.content[0]?.text?.trim() || '';

        // Parse — Claude may occasionally wrap in backticks despite instructions
        let questions;
        try {
            questions = JSON.parse(rawText);
        } catch {
            const match = rawText.match(/\[[\s\S]*\]/);
            if (!match) {
                const err = new Error('Claude returned malformed JSON — try again');
                err.statusCode = 502;
                return next(err);
            }
            questions = JSON.parse(match[0]);
        }

        if (!Array.isArray(questions) || questions.length === 0) {
            const err = new Error('No questions returned by Claude');
            err.statusCode = 502;
            return next(err);
        }

        // ── Validate each question has exactly one correct option ──────────
        const validated = questions.map((q, i) => {
            const correctCount = (q.options || []).filter(o => o.isCorrect).length;
            if (correctCount !== 1) {
                // Fix: force first option as correct if Claude got it wrong
                q.options = q.options.map((o, idx) => ({ ...o, isCorrect: idx === 0 }));
            }
            return { ...q, difficulty: q.difficulty || difficulty };
        });

        // ── Optionally save directly as a quiz document ────────────────────
        let savedQuiz = null;
        if (saveAsQuiz && quizTitle && quizId) {
            const existingQuiz = await Quiz.findOne({ id: quizId });
            if (existingQuiz) {
                const err = new Error('Quiz with this ID already exists');
                err.statusCode = 409;
                return next(err);
            }

            savedQuiz = await Quiz.create({
                id:          quizId,
                title:       quizTitle,
                description: description || `AI-generated quiz on ${topic}`,
                category,
                difficulty,
                questions:   validated,
                tags:        ['ai-generated', topic.toLowerCase().replace(/\s+/g, '-')],
                metadata:    { totalQuestions: validated.length, estimatedTime: validated.length * 1.5 },
                createdBy:   req.user.id
            });
        }

        res.status(saveAsQuiz && savedQuiz ? 201 : 200).json({
            success:   true,
            data: {
                questions:  validated,
                topic,
                category,
                difficulty,
                count:      validated.length,
                savedQuiz:  savedQuiz ? { id: savedQuiz.id, title: savedQuiz.title } : null,
                tokensUsed: message.usage
            }
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/admin/quiz
// @access  Private/Admin
router.post('/quiz', protect, adminOnly, createQuizValidation, async (req, res, next) => {
    try {
        const { id, title, description, category, difficulty, questions, metadata } = req.body;

        if (!id || !title || !description || !category || !difficulty || !questions?.length) {
            const err = new Error('Please provide all required fields');
            err.statusCode = 400;
            return next(err);
        }

        const existingQuiz = await Quiz.findOne({ id });
        if (existingQuiz) {
            const err = new Error('Quiz with this ID already exists');
            err.statusCode = 409;
            return next(err);
        }

        const quiz = await Quiz.create({
            id,
            title,
            description,
            category,
            difficulty,
            questions,
            metadata: { ...metadata, totalQuestions: questions.length },
            createdBy: req.user.id
        });

        res.status(201).json({ success: true, data: quiz });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/admin/quiz/:id
// @access  Private/Admin
router.put('/quiz/:id', protect, adminOnly, async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({ id: req.params.id });
        if (!quiz) {
            const err = new Error('Quiz not found');
            err.statusCode = 404;
            return next(err);
        }

        const { title, description, category, difficulty, questions, metadata, isActive } = req.body;
        if (title       !== undefined) quiz.title       = title;
        if (description !== undefined) quiz.description = description;
        if (category    !== undefined) quiz.category    = category;
        if (difficulty  !== undefined) quiz.difficulty  = difficulty;
        if (isActive    !== undefined) quiz.isActive    = isActive;
        if (questions   !== undefined) {
            quiz.questions = questions;
            quiz.metadata.totalQuestions = questions.length;
        }
        if (metadata) {
            if (metadata.estimatedTime !== undefined) quiz.metadata.estimatedTime = metadata.estimatedTime;
            if (metadata.passingScore  !== undefined) quiz.metadata.passingScore  = metadata.passingScore;
        }

        await quiz.save();
        res.json({ success: true, data: quiz });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/admin/quiz/:id/tags
// @desc    Manage quiz tags.
//          body.add    → $addToSet with $each (no duplicate entries ever)
//          body.remove → $pull (remove one specific tag)
//          body.removeAll → $pullAll (remove multiple tags at once)
//          body.pop    → $pop: 1 removes last tag, -1 removes first tag
// @access  Private/Admin
router.put('/quiz/:id/tags', protect, adminOnly, async (req, res, next) => {
    try {
        const quiz = await Quiz.findOne({ id: req.params.id });
        if (!quiz) {
            const err = new Error('Quiz not found');
            err.statusCode = 404;
            return next(err);
        }

        const { add, remove, removeAll, pop } = req.body;
        const updateOps = {};

        if (add && Array.isArray(add) && add.length) {
            // $addToSet + $each: adds each tag only if not already present — no duplicate tags possible
            updateOps.$addToSet = { tags: { $each: add } };
        }

        if (remove) {
            // $pull: removes all occurrences of the given tag value from the array
            updateOps.$pull = { tags: remove };
        }

        if (removeAll && Array.isArray(removeAll) && removeAll.length) {
            // $pullAll: removes every occurrence of each listed value in one operation
            updateOps.$pullAll = { tags: removeAll };
        }

        if (pop === 'first' || pop === 'last') {
            // $pop: -1 removes the first element, 1 removes the last element
            updateOps.$pop = { tags: pop === 'last' ? 1 : -1 };
        }

        if (!Object.keys(updateOps).length) {
            const err = new Error('Provide add, remove, removeAll, or pop in request body');
            err.statusCode = 400;
            return next(err);
        }

        // $addToSet and $pull cannot be combined in the same updateOne — run sequentially if both present
        if (updateOps.$addToSet && (updateOps.$pull || updateOps.$pullAll)) {
            await Quiz.updateOne({ id: req.params.id }, { $addToSet: updateOps.$addToSet });
            const rest = {};
            if (updateOps.$pull)    rest.$pull    = updateOps.$pull;
            if (updateOps.$pullAll) rest.$pullAll = updateOps.$pullAll;
            await Quiz.updateOne({ id: req.params.id }, rest);
        } else {
            await Quiz.updateOne({ id: req.params.id }, updateOps);
        }

        const updated = await Quiz.findOne({ id: req.params.id }).select('id title tags');
        res.json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/admin/quiz/:id/multiply-xp
// @desc    Apply a retroactive XP multiplier to all quiz results for this quiz.
//          Uses $mul — updates the stored value by multiplying it, not by setting an absolute number.
//          Useful when a quiz's difficulty rating is corrected after publication.
// @access  Private/Admin
router.put('/quiz/:id/multiply-xp', protect, adminOnly, async (req, res, next) => {
    try {
        const { multiplier } = req.body;

        if (!multiplier || multiplier <= 0) {
            const err = new Error('multiplier must be a positive number');
            err.statusCode = 400;
            return next(err);
        }

        const quiz = await Quiz.findOne({ id: req.params.id });
        if (!quiz) {
            const err = new Error('Quiz not found');
            err.statusCode = 404;
            return next(err);
        }

        // $mul: multiply xpEarned on every result for this quiz — one round-trip, no race condition
        const result = await QuizResult.updateMany(
            { quizId: quiz.id },
            { $mul: { xpEarned: multiplier } }
        );

        res.json({
            success: true,
            message: `Applied ×${multiplier} XP multiplier to ${result.modifiedCount} results for "${quiz.title}"`
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/admin/quiz/:id/replace
// @desc    Replace an entire quiz document (full document replacement, not partial update).
//          replaceOne() differs from updateOne(): the replacement doc cannot contain update operators —
//          it is the new document verbatim (minus _id).
// @access  Private/Admin
router.put('/quiz/:id/replace', protect, adminOnly, async (req, res, next) => {
    try {
        const { title, description, category, difficulty, questions, metadata, tags } = req.body;

        if (!title || !description || !category || !difficulty || !questions?.length) {
            const err = new Error('Provide all required fields for full replacement');
            err.statusCode = 400;
            return next(err);
        }

        // replaceOne: swaps the entire document body — no $set, no partial update
        const result = await Quiz.replaceOne(
            { id: req.params.id },
            {
                id: req.params.id,
                title,
                description,
                category,
                difficulty,
                questions,
                tags: tags || [],
                metadata: { ...metadata, totalQuestions: questions.length },
                isActive: true,
                createdBy: req.user.id,
                attemptCount: 0
            }
        );

        if (!result.matchedCount) {
            const err = new Error('Quiz not found');
            err.statusCode = 404;
            return next(err);
        }

        const updated = await Quiz.findOne({ id: req.params.id });
        res.json({ success: true, data: updated });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/admin/quiz/:id
// @desc    Soft-delete a quiz (sets isActive: false — data is preserved)
// @access  Private/Admin
router.delete('/quiz/:id', protect, adminOnly, async (req, res, next) => {
    try {
        const quiz = await Quiz.findOneAndUpdate(
            { id: req.params.id },
            { $set: { isActive: false } },
            { new: true }
        );
        if (!quiz) {
            const err = new Error('Quiz not found');
            err.statusCode = 404;
            return next(err);
        }
        res.json({ success: true, message: 'Quiz deactivated successfully' });
    } catch (error) {
        next(error);
    }
});

// ─────────────────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────────────────

// @route   GET /api/admin/users
// @desc    Get all users (paginated, newest first)
// @access  Private/Admin
router.get('/users', protect, adminOnly, paginationValidation, async (req, res, next) => {
    try {
        const page  = parseInt(req.query.page)  || 1;
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const skip  = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find()
                .select('-password')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments()
        ]);

        res.json({ success: true, count: users.length, data: users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
router.put('/users/:id/role', protect, adminOnly, async (req, res, next) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            const err = new Error('Invalid role');
            err.statusCode = 400;
            return next(err);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { role } },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            return next(err);
        }

        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/admin/users/:id
// @desc    Soft-delete a user (sets isActive: false).
//          The auth middleware blocks further logins from deactivated accounts.
//          All historical data (quiz results, bookmarks) is preserved.
// @access  Private/Admin
router.delete('/users/:id', protect, adminOnly, async (req, res, next) => {
    try {
        // Prevent admins from deactivating themselves
        if (req.params.id === req.user.id.toString()) {
            const err = new Error('You cannot deactivate your own account');
            err.statusCode = 400;
            return next(err);
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: { isActive: false } },
            { new: true }
        ).select('-password');

        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 404;
            return next(err);
        }

        res.json({ success: true, message: `User ${user.username} has been deactivated`, data: user });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/admin/users/deactivate-inactive
// @desc    Bulk-deactivate users who haven't played a quiz in 90+ days.
//          Uses updateMany for an efficient single-query bulk operation — no N+1 problem.
// @access  Private/Admin
router.put('/users/deactivate-inactive', protect, adminOnly, async (req, res, next) => {
    try {
        const daysInactive = parseInt(req.query.days) || 90;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysInactive);

        // updateMany: one MongoDB round-trip instead of a load-loop-save cycle
        const result = await User.updateMany(
            {
                role:     'user',
                isActive: true,
                $or: [
                    { 'stats.lastQuizDate': { $lt: cutoff } },
                    { 'stats.lastQuizDate': { $exists: false } }
                ]
            },
            { $set: { isActive: false } }
        );

        res.json({
            success: true,
            message: `Deactivated ${result.modifiedCount} inactive users (${daysInactive}+ days without activity)`
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/admin/users/:id/notify
// @desc    Prepend a system notification to a user's notifications array.
//          Uses $push with $position: 0 so the newest notification is always first
//          without needing a separate $sort pass.
// @access  Private/Admin
router.post('/users/:id/notify', protect, adminOnly, async (req, res, next) => {
    try {
        const { message, type = 'info' } = req.body;

        if (!message) {
            const err = new Error('message is required');
            err.statusCode = 400;
            return next(err);
        }

        const newNotification = { message, type, createdAt: new Date(), read: false };

        // $push + $position: 0 inserts at the beginning of the array (index 0 = most recent)
        await User.updateOne(
            { _id: req.params.id },
            { $push: { notifications: { $each: [newNotification], $position: 0 } } }
        );

        res.json({ success: true, message: 'Notification sent' });
    } catch (error) {
        next(error);
    }
});

// ─────────────────────────────────────────────────────
// MIGRATION & DATA QUALITY UTILITIES
// ─────────────────────────────────────────────────────

// @route   PUT /api/admin/migrate/rename-field
// @desc    Rename a field across an entire collection.
//          $rename moves data from oldField to newField in every document that has oldField.
//          Documents without the field are untouched — safe to run multiple times.
// @access  Private/Admin
router.put('/migrate/rename-field', protect, adminOnly, async (req, res, next) => {
    try {
        const { collection, oldField, newField } = req.body;

        if (!collection || !oldField || !newField) {
            const err = new Error('collection, oldField, and newField are required');
            err.statusCode = 400;
            return next(err);
        }

        const Model = { users: User, quizzes: Quiz, quizresults: QuizResult }[collection.toLowerCase()];
        if (!Model) {
            const err = new Error('collection must be one of: users, quizzes, quizresults');
            err.statusCode = 400;
            return next(err);
        }

        // $rename: moves the value and removes the old key — one atomic operation across all documents
        const result = await Model.updateMany({}, { $rename: { [oldField]: newField } });

        res.json({
            success: true,
            message: `Renamed "${oldField}" → "${newField}" in ${result.modifiedCount} documents`
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/admin/data-quality
// @desc    Scan collections for documents with unexpected BSON types or structural issues.
//          Demonstrates: $type (BSON type check), $size (exact array length), $exists
// @access  Private/Admin
router.get('/data-quality', protect, adminOnly, async (req, res, next) => {
    try {
        const [
            quizzesWithStringQuestionCount,
            quizzesWithNoQuestions,
            usersWithStringXP,
            quizzesWithEmptyTags
        ] = await Promise.all([
            // $type: find Quiz documents where metadata.totalQuestions was stored as a string (should be int)
            Quiz.find({ 'metadata.totalQuestions': { $type: 'string' } }, { id: 1, title: 1 }),

            // $size: quizzes with exactly 0 questions — these are broken/incomplete
            Quiz.find({ questions: { $size: 0 } }, { id: 1, title: 1 }),

            // $type: users where currentXP is a string (data integrity issue)
            User.find({ 'stats.currentXP': { $type: 'string' } }, { username: 1, email: 1 }),

            // $exists + $size: quizzes that have a tags field but it's empty
            Quiz.find({ tags: { $exists: true, $size: 0 } }, { id: 1, title: 1 })
        ]);

        res.json({
            success: true,
            data: {
                quizzesWithStringQuestionCount,
                quizzesWithNoQuestions,
                usersWithStringXP,
                quizzesWithEmptyTags,
                totalIssues: quizzesWithStringQuestionCount.length + quizzesWithNoQuestions.length +
                             usersWithStringXP.length
            }
        });
    } catch (error) {
        next(error);
    }
});

// ─────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────

// @route   GET /api/admin/analytics
// @desc    Platform-wide analytics.  Uses $facet to run multiple sub-pipelines
//          in a single aggregation pass, distinct() for category enumeration,
//          and bulkWrite to sync Quiz.attemptCount with live data.
// @access  Private/Admin
router.get('/analytics', protect, adminOnly, async (req, res, next) => {
    try {
        const [totalUsers, totalQuizzes, totalResults, newUsersThisWeek] = await Promise.all([
            User.countDocuments({ role: 'user', isActive: true }),
            Quiz.countDocuments({ isActive: true }),
            QuizResult.countDocuments(),
            User.countDocuments({
                role: 'user',
                createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            })
        ]);

        // distinct() — returns unique active categories without a full scan
        const activeCategories = await Quiz.distinct('category', { isActive: true });

        // $facet: run top-quizzes and category-breakdown in one aggregation pass
        const [facetResult] = await QuizResult.aggregate([
            {
                $facet: {
                    topQuizzes: [
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
                                quizId:   '$_id',
                                title:    { $ifNull: ['$quizData.title', '$_id'] },
                                category: '$quizData.category',
                                attempts: 1,
                                avgScore: { $round: ['$avgScore', 1] },
                                _id:      0
                            }
                        }
                    ],
                    categoryBreakdown: [
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
                                attempts: { $sum: 1 },
                                avgScore: { $avg: '$percentage' }
                            }
                        },
                        {
                            // $addFields + $switch + $case: compute a performance grade from the
                            // numeric average score — demonstrates conditional branching in aggregation
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
                                attempts: 1,
                                avgScore: { $round: ['$avgScore', 1] },
                                grade:    1,
                                _id:      0
                            }
                        }
                    ]
                }
            }
        ]);

        // bulkWrite: sync Quiz.attemptCount from live QuizResult data in one batch
        const attemptCounts = await QuizResult.aggregate([
            { $group: { _id: '$quizId', count: { $sum: 1 } } }
        ]);

        if (attemptCounts.length > 0) {
            const bulkOps = attemptCounts.map(({ _id: quizId, count }) => ({
                updateOne: {
                    filter: { id: quizId },
                    update: { $set: { attemptCount: count } }
                }
            }));
            await Quiz.bulkWrite(bulkOps, { ordered: false });
        }

        res.json({
            success: true,
            data: {
                totalUsers,
                totalQuizzes,
                totalResults,
                newUsersThisWeek,
                activeCategories,
                topQuizzes:       facetResult.topQuizzes,
                categoryBreakdown:facetResult.categoryBreakdown
            }
        });
    } catch (error) {
        next(error);
    }
});

// ─────────────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────────────

// @route   GET /api/admin/reports
// @access  Private/Admin
router.get('/reports', protect, adminOnly, paginationValidation, async (req, res, next) => {
    try {
        const { status = 'all' } = req.query;
        const page  = parseInt(req.query.page)  || 1;
        const limit = Math.min(parseInt(req.query.limit) || 20, 100);
        const skip  = (page - 1) * limit;

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

        res.json({ success: true, count: reports.length, data: reports, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/admin/reports/:reportId/status
// @access  Private/Admin
router.put('/reports/:reportId/status', protect, adminOnly, async (req, res, next) => {
    try {
        const { status, adminNotes } = req.body;

        if (!['pending', 'reviewed', 'resolved', 'dismissed'].includes(status)) {
            const err = new Error('Invalid status');
            err.statusCode = 400;
            return next(err);
        }

        const report = await Report.findByIdAndUpdate(
            req.params.reportId,
            {
                $set: {
                    status,
                    adminNotes:  adminNotes || '',
                    reviewedAt:  new Date(),
                    reviewedBy:  req.user.id
                }
            },
            { new: true }
        )
            .populate('user', 'username email')
            .populate('quiz', 'title category');

        if (!report) {
            const err = new Error('Report not found');
            err.statusCode = 404;
            return next(err);
        }

        res.json({ success: true, data: report });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/admin/analytics/snapshot
// @desc    Write the current leaderboard into the leaderboard_snapshots collection.
//          Uses $merge to upsert each user's document — existing entries are updated
//          (whenMatched: 'merge'), new users are inserted (whenNotMatched: 'insert').
//          This is the MongoDB equivalent of a materialised view or data warehouse write.
// @access  Private/Admin
router.post('/analytics/snapshot', protect, adminOnly, async (req, res, next) => {
    try {
        // Aggregate per-user XP totals, join with User for username + level, then $merge into
        // the leaderboard_snapshots collection.  $merge is the final pipeline stage — no cursor is returned.
        await QuizResult.aggregate([
            {
                $group: {
                    _id:     '$user',
                    totalXP: { $sum: '$xpEarned' }
                }
            },
            { $sort: { totalXP: -1 } },
            {
                $lookup: {
                    from:         'users',
                    localField:   '_id',
                    foreignField: '_id',
                    as:           'userData'
                }
            },
            { $unwind: '$userData' },
            {
                $addFields: {
                    username:     '$userData.username',
                    level:        '$userData.stats.level',
                    snapshotDate: '$$NOW'
                }
            },
            { $project: { userData: 0 } },
            // $merge: write aggregation output into leaderboard_snapshots;
            // match on _id (user ObjectId) — update if exists, insert if new
            {
                $merge: {
                    into:           'leaderboardsnapshots',
                    on:             '_id',
                    whenMatched:    'merge',
                    whenNotMatched: 'insert'
                }
            }
        ]);

        const count = await LeaderboardSnapshot.countDocuments();
        res.json({ success: true, message: `Leaderboard snapshot saved — ${count} user records` });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/admin/analytics/snapshot
// @desc    Fetch all leaderboard snapshot records sorted by XP desc (uses totalXP: -1 index)
// @access  Private/Admin
router.get('/analytics/snapshot', protect, adminOnly, async (req, res, next) => {
    try {
        const snapshots = await LeaderboardSnapshot.find()
            .sort({ totalXP: -1 })
            .lean();
        res.json({ success: true, count: snapshots.length, data: snapshots });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/admin/reports/cleanup
// @desc    Permanently hard-delete dismissed reports older than N days.
//          Uses deleteMany() — explicit mass hard-delete (contrast with soft-delete elsewhere).
//          Requires ?days query param (default 30) to prevent accidental bulk deletion.
// @access  Private/Admin
router.delete('/reports/cleanup', protect, adminOnly, async (req, res, next) => {
    try {
        const days   = parseInt(req.query.days) || 30;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);

        // deleteMany: hard-delete — unlike soft-delete patterns used for users/quizzes,
        // dismissed reports have no ongoing value and are safe to remove permanently
        const result = await Report.deleteMany({
            status:    'dismissed',
            createdAt: { $lt: cutoff }
        });

        res.json({
            success: true,
            message: `Permanently deleted ${result.deletedCount} dismissed reports older than ${days} days`
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/admin/reports/stats
// @access  Private/Admin
router.get('/reports/stats', protect, adminOnly, async (req, res, next) => {
    try {
        // $facet: compute byStatus and byType in a single aggregation pass
        const [result] = await Report.aggregate([
            {
                $facet: {
                    byStatus: [
                        { $group: { _id: '$status',     count: { $sum: 1 } } }
                    ],
                    byType: [
                        { $group: { _id: '$reportType', count: { $sum: 1 } } }
                    ]
                }
            }
        ]);

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
