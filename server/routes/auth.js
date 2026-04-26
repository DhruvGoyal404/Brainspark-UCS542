const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');
const { protect } = require('../middleware/auth');
const {
    registerValidation,
    loginValidation,
    changePasswordValidation,
    forgotPasswordValidation,
    resetPasswordValidation
} = require('../middleware/validate');
const { sendPasswordResetEmail } = require('../utils/email');

// Generate JWT token — 30-day expiry stored in the payload so the blacklist TTL matches
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerValidation, async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Check for existing user using a single query (OR on both fields)
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(409).json({
                success: false,
                message: 'A user with that email or username already exists'
            });
        }

        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    stats: user.stats,
                    preferences: user.preferences
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginValidation, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Block deactivated accounts before checking password (avoids timing oracle)
        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    stats: user.stats,
                    preferences: user.preferences
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/auth/me
// @access  Private
router.get('/me', protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/auth/logout
// @desc    Invalidate the current token by adding it to the MongoDB blacklist.
//          The TTL index on expiresAt means MongoDB auto-deletes the entry once
//          the JWT would have expired anyway — the collection stays bounded.
// @access  Private
router.post('/logout', protect, async (req, res, next) => {
    try {
        const token = req.token; // attached by protect middleware

        // Decode without verify — just to read exp (already verified by protect)
        const decoded = jwt.decode(token);
        const expiresAt = decoded?.exp
            ? new Date(decoded.exp * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // fallback: 30d

        // findOneAndUpdate with upsert: idempotent — safe to call twice
        await TokenBlacklist.findOneAndUpdate(
            { token },
            { token, expiresAt },
            { upsert: true, new: true }
        );

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/auth/change-password
// @desc    Change password for authenticated user
// @access  Private
router.post('/change-password', protect, changePasswordValidation, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Load user with password field (select('-password') was applied in protect)
        const user = await User.findById(req.user.id);
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            const err = new Error('Current password is incorrect');
            err.statusCode = 400;
            return next(err);
        }

        user.password = newPassword;
        await user.save(); // pre-save hook re-hashes

        // Blacklist the current token so the user must log in again with the new password
        const decoded = jwt.decode(req.token);
        if (decoded?.exp) {
            await TokenBlacklist.findOneAndUpdate(
                { token: req.token },
                { token: req.token, expiresAt: new Date(decoded.exp * 1000) },
                { upsert: true }
            );
        }

        res.json({
            success: true,
            message: 'Password changed successfully. Please log in again with your new password.'
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email.
//          SECURITY: Always returns 200 regardless of whether the email exists.
//          This prevents user enumeration attacks where an attacker can probe
//          which email addresses are registered.
// @access  Public
router.post('/forgot-password', forgotPasswordValidation, async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        // Always respond with generic 200 — don't reveal whether email is registered
        if (!user) {
            return res.json({
                success: true,
                message: 'If an account with that email exists, we\'ve sent a password reset link.'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Use updateOne with $set to avoid triggering the pre-save password hash hook
        await User.updateOne(
            { _id: user._id },
            {
                $set: {
                    passwordResetToken: resetTokenHash,
                    passwordResetExpires: new Date(Date.now() + 15 * 60 * 1000) // 15 min
                }
            }
        );

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
        const emailResult = await sendPasswordResetEmail(email, resetLink);

        if (!emailResult.success) {
            // Clear the token so it can be re-requested
            await User.updateOne(
                { _id: user._id },
                { $unset: { passwordResetToken: '', passwordResetExpires: '' } }
            );
            const err = new Error('Failed to send reset email: ' + emailResult.message);
            err.statusCode = 500;
            return next(err);
        }

        res.json({
            success: true,
            message: 'If an account with that email exists, we\'ve sent a password reset link.'
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/auth/reset-password
// @access  Public
router.post('/reset-password', resetPasswordValidation, async (req, res, next) => {
    try {
        const { token, password } = req.body;

        const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            passwordResetToken: resetTokenHash,
            passwordResetExpires: { $gt: new Date() }
        });

        if (!user) {
            const err = new Error('Invalid or expired reset token');
            err.statusCode = 400;
            return next(err);
        }

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successful. Please log in with your new password.' });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
