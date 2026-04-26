/**
 * Centralised error normalisation.
 * Routes call next(error) and this shapes the response so
 * raw DB / internal messages never reach the client in production.
 */

const normalizeError = (err) => {
    // ── MongoDB duplicate-key ──────────────────────────────────
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        return { statusCode: 409, message: `A record with this ${field} already exists` };
    }

    // ── Mongoose validation ────────────────────────────────────
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map((e) => e.message);
        return { statusCode: 400, message: messages[0] || 'Validation failed' };
    }

    // ── Invalid ObjectId cast ──────────────────────────────────
    if (err.name === 'CastError') {
        return { statusCode: 400, message: `Invalid value for field '${err.path}'` };
    }

    // ── JWT errors ─────────────────────────────────────────────
    if (err.name === 'JsonWebTokenError') {
        return { statusCode: 401, message: 'Invalid token' };
    }
    if (err.name === 'TokenExpiredError') {
        return { statusCode: 401, message: 'Token expired, please log in again' };
    }

    // ── Explicit statusCode set by route code ──────────────────
    if (err.statusCode && err.statusCode < 500) {
        return { statusCode: err.statusCode, message: err.message };
    }

    // ── Default 500 — never leak internals in production ───────
    const message =
        process.env.NODE_ENV === 'development'
            ? err.message
            : 'Internal server error';

    return { statusCode: 500, message };
};

module.exports = { normalizeError };
