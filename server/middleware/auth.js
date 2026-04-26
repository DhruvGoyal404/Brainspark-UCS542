const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');

// Protect routes - verify JWT token and check blacklist
exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        try {
            // Verify token signature and expiry
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check MongoDB token blacklist — O(1) lookup via unique index
            // Tokens land here after explicit logout; TTL index auto-purges expired entries
            const blacklisted = await TokenBlacklist.findOne({ token });
            if (blacklisted) {
                return res.status(401).json({
                    success: false,
                    message: 'Token has been invalidated. Please log in again.'
                });
            }

            // Get user — excludes password field
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            // Block soft-deleted accounts from all protected routes
            if (req.user.isActive === false) {
                return res.status(403).json({
                    success: false,
                    message: 'Your account has been deactivated. Please contact support.'
                });
            }

            // Attach raw token so the logout route can blacklist it
            req.token = token;
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error in authentication' });
    }
};

// Admin only middleware
exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
    }
};
