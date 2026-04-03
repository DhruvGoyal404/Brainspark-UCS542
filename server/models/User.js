const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    stats: {
        totalQuizzes: { type: Number, default: 0 },
        currentXP: { type: Number, default: 0 },
        level: { type: Number, default: 1 },
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastQuizDate: { type: Date },
        averageScore: { type: Number, default: 0 }
    },
    dailyGoal: {
        targetQuizzes: { type: Number, default: 3 },
        todayCount: { type: Number, default: 0 },
        lastResetDate: { type: Date, default: Date.now }
    },
    achievements: [{
        achievementId: String,
        unlockedAt: { type: Date, default: Date.now }
    }],
    preferences: {
        theme: { type: String, default: 'light' },
        fontSize: { type: String, default: 'medium' },
        soundEnabled: { type: Boolean, default: true },
        reducedMotion: { type: Boolean, default: false }
    },
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true
});

// Hash password before saving - FIXED for newer Mongoose
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
