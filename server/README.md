# BrainSpark Backend API

Backend server for BrainSpark Quiz Application built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Compass running on port 27017

### Setup

1. **Ensure MongoDB is running** (Compass on port 27017)

2. **Seed the database:**
```bash
npm run seed
```

3. **Start the server:**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Quizzes
- `GET /api/quiz` - Get all quizzes (Protected)
- `GET /api/quiz/:id` - Get quiz by ID with questions (Protected)
- `POST /api/quiz/:id/submit` - Submit quiz answers (Protected)
- `GET /api/quiz/results/my` - Get user's quiz history (Protected)

### User
- `GET /api/user/profile` - Get user profile (Protected)
- `PUT /api/user/profile` - Update user profile (Protected)
- `PUT /api/user/preferences` - Update preferences (Protected)
- `GET /api/user/stats` - Get user statistics (Protected)
- `GET /api/user/leaderboard` - Get leaderboard (Protected)

### Admin (Admin Only)
- `POST /api/admin/quiz` - Create new quiz
- `PUT /api/admin/quiz/:id` - Update quiz
- `DELETE /api/admin/quiz/:id` - Delete quiz (soft delete)
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/role` - Update user role

## 👤 Demo Accounts

After seeding, use these accounts:

**Admin:**
- Email: `admin@brainspark.com`
- Password: `admin123`

**Demo User:**
- Email: `demo@example.com`
- Password: `demo123`

## 🗄️ Database Schema

### User
- username, email, password (hashed)
- role (user/admin)
- stats (totalQuizzes, currentXP, level, streaks)
- achievements
- preferences (theme, fontSize, sound, reducedMotion)

### Quiz
- id, title, description, category, difficulty
- questions (with options and explanations)
- metadata (estimated time, passing score)
- createdBy, isActive

### QuizResult
- user, quiz, quizId
- answers, score, percentage
- timeSpent, xpEarned

## 🔐 Authentication

Uses JWT tokens. Include in requests:
```
Authorization: Bearer <token>
```

## 📊 Features

✅ User authentication with JWT
✅ Password hashing with bcrypt
✅ Quiz management
✅ Score calculation & XP system
✅ Streak tracking
✅ Leaderboard
✅ Admin panel
✅ CORS enabled for frontend

## 🛠️ Scripts

- `npm start` - Start production server
- `npm run dev` - Start with nodemon (hot reload)
- `npm run seed` - Seed database with initial data

## 🌐 Environment Variables

Create `.env` file:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/brainspark
JWT_SECRET=your_secret_key
NODE_ENV=development
```

## 📝 Notes

- MongoDB connection on port 27017
- Mongoose models with validation
- Error handling middleware
- RESTful API design
- Ready for deployment
