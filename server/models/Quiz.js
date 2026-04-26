const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    options: [{
        id:        String,
        text:      String,
        isCorrect: Boolean
    }],
    explanation: { type: String, required: true },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    }
});

const quizSchema = new mongoose.Schema({
    // Custom slug used in URLs and frontend references
    id: { type: String, required: true, unique: true },
    title:       { type: String, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['dsa', 'operating-systems', 'dbms', 'networks', 'oops', 'web', 'other']
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    questions: [questionSchema],
    metadata: {
        estimatedTime: Number,
        totalQuestions: Number,
        passingScore: { type: Number, default: 70 }
    },
    // Atomically incremented via $inc on every quiz submission — no read-modify-write race
    attemptCount: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // Searchable tags — each element is indexed via the multikey index below
    tags: [{ type: String, trim: true }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// ── Indexes ───────────────────────────────────────────────────────────────────
// $text search across the three most searched fields
quizSchema.index({ title: 'text', description: 'text', category: 'text' });
// Covers the main list endpoint filter (isActive + category + difficulty)
quizSchema.index({ isActive: 1, category: 1, difficulty: 1 });
// "Popular quizzes" sort — descending attempt count among active quizzes
quizSchema.index({ attemptCount: -1, isActive: 1 });
// Multikey index: MongoDB creates one index entry per element in the tags array,
// enabling fast $all / $in / $elemMatch queries on tags
quizSchema.index({ tags: 1 });

module.exports = mongoose.model('Quiz', quizSchema);
