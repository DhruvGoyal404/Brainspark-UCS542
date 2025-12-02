# 🎓 BrainSpark

Interactive quiz platform for CS students. Built with React + Node.js + MongoDB.

## Features

- 🎯 Interactive quizzes (DSA, OS, DBMS)
- 📊 Analytics & leaderboards
- 🎨 Dark/Light themes
- 🔐 User authentication
- 👨‍💼 Admin panel

## Tech Stack

**Frontend:** React + Vite + Framer Motion  
**Backend:** Node.js + Express + MongoDB  
**Auth:** JWT + bcrypt

## Quick Start

```bash
# Install dependencies
cd server && npm install
cd ../client && npm install

# Run
npm run dev (in both client & server folders)
```

## Environment Variables

**server/.env:**
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PORT=5000
```

**client/.env:**
```
VITE_API_URL=http://localhost:5000
```

## Default Admin

Email: `admin@brainspark.com`  
Password: `admin123`

---

**Made for UI/UX Course Project**
