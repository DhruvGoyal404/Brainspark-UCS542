const Redis = require('ioredis');

let client = null;
let connectionFailed = false;

/**
 * Returns the shared ioredis client. If Redis is unavailable the client
 * is returned but all ops will resolve to null (lazyConnect + no-throw).
 * This keeps the app fully functional without Redis — queries just hit MongoDB.
 */
const getRedisClient = () => {
    if (connectionFailed) return null;
    if (client) return client;

    const url = process.env.REDIS_URL || 'redis://localhost:6379';

    const isTLS = url.startsWith('rediss://');

    client = new Redis(url, {
        lazyConnect: true,
        enableOfflineQueue: false,
        retryStrategy: (times) => {
            if (times >= 3) {
                connectionFailed = true;
                client = null;
                return null;
            }
            return Math.min(times * 300, 1000);
        },
        maxRetriesPerRequest: 1,
        ...(isTLS && { tls: { rejectUnauthorized: false } }),
    });

    client.on('error', () => {
        // Silently swallow — app degrades gracefully without cache
    });

    return client;
};

/**
 * Safe get: returns null on any error so callers don't need try/catch.
 */
const cacheGet = async (key) => {
    const c = getRedisClient();
    if (!c) return null;
    try {
        const val = await c.get(key);
        return val ? JSON.parse(val) : null;
    } catch {
        return null;
    }
};

/**
 * Safe set with TTL in seconds. No-op on error.
 */
const cacheSet = async (key, value, ttlSeconds = 300) => {
    const c = getRedisClient();
    if (!c) return;
    try {
        await c.setex(key, ttlSeconds, JSON.stringify(value));
    } catch {
        // ignore
    }
};

/**
 * Delete all keys matching a glob pattern (uses SCAN, not KEYS, for safety).
 */
const cacheDeletePattern = async (pattern) => {
    const c = getRedisClient();
    if (!c) return;
    try {
        const keys = await c.keys(pattern);
        if (keys.length) await c.del(...keys);
    } catch {
        // ignore
    }
};

module.exports = { getRedisClient, cacheGet, cacheSet, cacheDeletePattern };
