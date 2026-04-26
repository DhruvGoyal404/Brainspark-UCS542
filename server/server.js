const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

// Load env vars
dotenv.config();

const app = express();

// ─── Security Middleware ──────────────────────────────────────
// Helmet: sets various HTTP headers for security (XSS, HSTS, content-type sniffing, etc.)
app.use(helmet());

// Request logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ─── Rate Limiting ────────────────────────────────────────────
// Global rate limit: 200 requests per 15 minutes per IP
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use(globalLimiter);

// Strict rate limit for auth routes: 10 attempts per 15 minutes per IP
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many login attempts, please try again after 15 minutes.' }
});

// ─── CORS (from env variable) ─────────────────────────────────
const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(s => s.trim())
    : ['http://localhost:5173'];

app.use(cors({
    origin: corsOrigins,
    credentials: true
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Database Connection ──────────────────────────────────────
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
})
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Graceful shutdown — close MongoDB connection on process termination
const gracefulShutdown = async (signal) => {
    console.log(`\n🛑 Received ${signal}. Closing MongoDB connection...`);
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed. Exiting.');
    process.exit(0);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// ─── Import Routes ────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const quizRoutes = require('./routes/quiz');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

// ─── Routes ───────────────────────────────────────────────────
// Apply strict rate limit to auth routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'BrainSpark API is running!',
        environment: process.env.NODE_ENV,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'BrainSpark API is running!' });
});

// Root route for ELB health check
app.get('/', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'BrainSpark API is healthy!' });
});

// ─── Global Error Handler ─────────────────────────────────────
// All routes call next(error) — normalizeError sanitises the message so
// raw DB internals (connection strings, schema details) never reach the client.
const { normalizeError } = require('./utils/errorHandler');

app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error:', {
            message: err.message,
            statusCode: err.statusCode,
            stack: err.stack,
            path: req.path,
            method: req.method
        });
    } else {
        console.error(`❌ ${req.method} ${req.path} → ${err.statusCode || 500}`);
    }

    const { statusCode, message } = normalizeError(err);

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// ─── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔒 CORS Origins: ${corsOrigins.join(', ')}`);
});
