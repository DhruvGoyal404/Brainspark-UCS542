const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
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
    quizTitle: {
        type: String,
        required: true
    },
    questionIndex: {
        type: Number,
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        default: ''
    },
    options: [{
        id: String,
        text: String,
        isCorrect: Boolean
    }],
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    }
}, {
    timestamps: true
});

// Prevent duplicate bookmarks for same user + quiz + question
bookmarkSchema.index({ user: 1, quizId: 1, questionIndex: 1 }, { unique: true });
bookmarkSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
