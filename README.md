# 🎓 BrainSpark - Interactive Quiz Platform

A modern, full-stack quiz application built with React and Node.js for Computer Science students. Features gamification, real-time leaderboards, and comprehensive analytics.

## ✨ Features

- 🎯 **Interactive Quizzes** - DSA, OS, DBMS, and more
- 📊 **Analytics Dashboard** - Track your performance over time
- 🏆 **Leaderboard** - Compete with peers
- 🎨 **Modern UI/UX** - Dark/Light themes with smooth animations
- 🔐 **User Authentication** - Secure JWT-based auth
- 👨‍💼 **Admin Panel** - Quiz management and CRUD operations
- 📱 **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Framer Motion (animations)
- Chart.js (analytics)
- Lucide React (icons)
- CSS Variables (theming)

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt (password hashing)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/brainspark.git
cd brainspark
```

2. **Install dependencies**
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. **Setup environment variables**

Create `server/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

4. **Seed the database** (optional)
```bash
cd server
npm run seed
```

5. **Run the application**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Visit `http://localhost:5173` to see the app! 🎉

## 📝 Default Admin Credentials

After seeding:
- Email: `admin@brainspark.com`
- Password: `admin123`

## 📂 Project Structure

```
brainspark/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Auth, Theme)
│   │   ├── styles/        # Global styles
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── server/                # Node.js backend
    ├── models/            # MongoDB models
    ├── routes/            # API routes
    ├── middleware/        # Auth middleware
    └── seed.js           # Database seeder
```

## 🎨 Features Demo

- **Quiz Taking**: Real-time feedback with sound effects
- **Progress Tracking**: Visual XP and level system
- **Analytics**: Performance trends with interactive charts
- **Admin Panel**: Complete CRUD for quiz management
- **Responsive**: Mobile-first design approach

## 🌟 Highlights

- ✅ **100% SEO Optimized** - Meta tags, sitemap, robots.txt
- ✅ **Accessible** - WCAG 2.1 compliant with ARIA labels
- ✅ **Semantic HTML5** - Proper use of modern HTML elements
- ✅ **Form Validation** - Client-side regex validation
- ✅ **Confirmation Modals** - Better UX for critical actions

## 📄 License

This project is created for academic purposes.

## 👤 Author

**Dhruv Goyal**

---

Made with ❤️ for the UI/UX Course Project
