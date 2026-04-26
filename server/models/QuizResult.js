const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    quizId: {
        type: String,
        required: true
    },
    answers: [{
        questionId:     Number,
        selectedOption: String,
        isCorrect:      Boolean
    }],
    score:          { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    percentage:     { type: Number, required: true },
    timeSpent:      { type: Number }, // seconds
    xpEarned:       { type: Number, default: 0 },
    mode: {
        type: String,
        enum: ['timed', 'practice'],
        default: 'timed'
    }
}, {
    timestamps: true
});

// ── Indexes ───────────────────────────────────────────────────────────────────
// Primary access pattern: per-user history sorted newest first
quizResultSchema.index({ user: 1, createdAt: -1 });
// Quiz-level aggregations (category stats, leaderboard)
quizResultSchema.index({ quiz: 1 });
// Daily goal uniqueness check: findOne({ user, quizId, createdAt >= startOfDay })
quizResultSchema.index({ user: 1, quizId: 1, createdAt: 1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
