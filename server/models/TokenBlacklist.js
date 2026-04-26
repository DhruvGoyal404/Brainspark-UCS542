const mongoose = require('mongoose');

/**
 * TokenBlacklist — stores invalidated JWT tokens until they naturally expire.
 *
 * MongoDB TTL index on `expiresAt` automatically purges documents once the
 * JWT would have expired anyway, so the collection never grows unboundedly.
 *
 * MongoDB features used:
 *   • TTL index  (automatic document expiry)
 *   • Unique index on token  (fast O(1) lookup)
 */
const tokenBlacklistSchema = new mongoose.Schema(
    {
        token: {
            type: String,
            required: true,
            unique: true,
        },
        // Store the exact exp timestamp from the JWT so MongoDB TTL can auto-delete
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);

// TTL index — MongoDB removes the document when Date.now() passes expiresAt
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);
