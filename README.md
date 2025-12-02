# 🎓 BrainSpark

![Deploy to Azure](https://github.com/DhruvGoyal404/Brainspark---UI-UX/actions/workflows/azure-deploy.yml/badge.svg)

**[Live Demo →](https://brainspark.dhruvgoyal.tech)**

Interactive quiz platform for students. Built for UI/UX Course Project.

## 🚀 Quick Start

```bash
# Install dependencies
cd server && npm install
cd client && npm install

# Run locally
npm run dev  # (in both client & server folders)
```

### Environment Variables

**server/.env:**
```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
PORT=5000
```

**client/.env:**
```env
VITE_API_URL=http://localhost:5000/api
```
