const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
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
    reportType: {
        type: String,
        enum: ['unclear', 'incorrect_answer', 'typo', 'offensive', 'other'],
        required: true
    },
    description: {
        type: String,
        maxlength: 500
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
        default: 'pending'
    },
    adminNotes: {
        type: String,
        default: ''
    },
    reviewedAt: Date,
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for admin queries
reportSchema.index({ status: 1, createdAt: -1 });
reportSchema.index({ quiz: 1, questionIndex: 1 });
reportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
