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
    avatar: { type: String, default: null },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    // Soft-delete flag — deactivated users are blocked at auth layer but data is preserved
    isActive: {
        type: Boolean,
        default: true
    },
    stats: {
        totalQuizzes:  { type: Number, default: 0 },
        currentXP:     { type: Number, default: 0 },
        level:         { type: Number, default: 1 },
        currentStreak: { type: Number, default: 0 },
        longestStreak: { type: Number, default: 0 },
        lastQuizDate:  { type: Date },
        averageScore:  { type: Number, default: 0 },
        bestScore:     { type: Number, default: 0 },    // updated with $max on each quiz submit
        worstScore:    { type: Number, default: 100 },  // updated with $min on each quiz submit
        lastActive:    { type: Date },                   // set with $currentDate (MongoDB native date op)
        recentScores:  [{                               // capped at 10 entries via $push+$slice+$sort
            score:    Number,
            quizId:   String,
            category: String,
            date:     { type: Date, default: Date.now }
        }]
    },
    // System notifications — new entries prepended at index 0 via $push+$position
    notifications: [{
        message:   String,
        type:      { type: String, enum: ['info', 'warning', 'success'], default: 'info' },
        createdAt: { type: Date, default: Date.now },
        read:      { type: Boolean, default: false }
    }],
    dailyGoal: {
        targetQuizzes: { type: Number, default: 3 },
        todayCount:    { type: Number, default: 0 },
        lastResetDate: { type: Date, default: Date.now }
    },
    achievements: [{
        achievementId: String,
        unlockedAt: { type: Date, default: Date.now }
    }],
    preferences: {
        theme:          { type: String, default: 'light' },
        fontSize:       { type: String, default: 'medium' },
        soundEnabled:   { type: Boolean, default: true },
        reducedMotion:  { type: Boolean, default: false }
    },
    passwordResetToken:   String,
    passwordResetExpires: Date
}, {
    timestamps: true
});

// ── Indexes ───────────────────────────────────────────────────────────────────
// Leaderboard: sorts active users by XP descending — covers both role filter and XP sort
userSchema.index({ role: 1, 'stats.currentXP': -1, isActive: 1 });
// Admin soft-delete filter + role filter
userSchema.index({ isActive: 1, role: 1 });
// Full-text search for admin user management
userSchema.index({ username: 'text', email: 'text' });
// Partial index: only indexes active regular users — deactivated accounts and admins are excluded,
// keeping the index small and making leaderboard queries faster
userSchema.index(
    { 'stats.currentXP': -1 },
    { partialFilterExpression: { isActive: true, role: 'user' }, name: 'activeUsersLeaderboard_partial' }
);
// Sparse index: only indexes documents where lastActive has been set;
// users who registered but never completed a quiz are skipped entirely
userSchema.index({ 'stats.lastActive': -1 }, { sparse: true });

// ── Hooks ─────────────────────────────────────────────────────────────────────
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ── Methods ───────────────────────────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
