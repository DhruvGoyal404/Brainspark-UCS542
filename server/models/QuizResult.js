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
        questionId: Number,
        selectedOption: String,
        isCorrect: Boolean
    }],
    score: {
        type: Number,
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    correctAnswers: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    timeSpent: {
        type: Number // in seconds
    },
    xpEarned: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for faster queries
quizResultSchema.index({ user: 1, createdAt: -1 });
quizResultSchema.index({ quiz: 1 });

module.exports = mongoose.model('QuizResult', quizResultSchema);
