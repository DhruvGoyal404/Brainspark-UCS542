# 🚀 Azure Web App Deployment Guide

## Step 1: Create Azure Web App

1. **Go to Azure Portal:** https://portal.azure.com
2. **Click "Create a resource"**
3. **Search for "Web App"** and click Create

### Configuration:

**Basics Tab:**
- **Subscription:** Your subscription
- **Resource Group:** Create new → `brainspark-rg`
- **Name:** `brainspark-api` (this will be brainspark-api.azurewebsites.net)
- **Publish:** Code
- **Runtime stack:** Node 20 LTS
- **Operating System:** Linux
- **Region:** Choose nearest (e.g., Central India)

**Pricing:**
- **Linux Plan:** Create new → `brainspark-plan`
- **Pricing tier:** Free F1 (for testing) or Basic B1 ($13/month)

**Click "Review + Create"** → **Create**

Wait 2-3 minutes for deployment.

---

## Step 2: Configure Application Settings

1. Go to your Web App → **Configuration** (left sidebar)
2. Click **"+ New application setting"** and add:

```
MONGO_URI = your_mongodb_atlas_connection_string
JWT_SECRET = your_super_secret_key_here
NODE_ENV = production
PORT = 8080
```

3. **Click "Save"** at the top
4. Click "Continue" when prompted to restart

---

## Step 3: Deploy Code to Azure

### Option A: GitHub Actions (Recommended)

1. In Azure Web App → **Deployment Center** (left sidebar)
2. **Source:** GitHub
3. **Sign in** to GitHub
4. **Organization:** Your GitHub username
5. **Repository:** brainspark (or your repo name)
6. **Branch:** main
7. **Build Provider:** GitHub Actions
8. **Click "Save"**

Azure will:
- Create `.github/workflows/main_brainspark-api.yml`
- Auto-deploy on every push to main branch

### Option B: VS Code Extension (Quick)

1. **Install:** "Azure App Service" extension in VS Code
2. **Sign in** to Azure
3. **Right-click "server" folder** → **Deploy to Web App**
4. **Select your Web App** → brainspark-api
5. **Confirm deployment**

### Option C: ZIP Deploy (Manual)

```bash
cd server
zip -r deploy.zip . -x "node_modules/*" -x ".env"
```

Then in Azure Web App → **Deployment Center** → **ZIP Deploy** → Upload `deploy.zip`

---

## Step 4: Set Startup Command

1. Go to **Configuration** → **General settings**
2. **Startup Command:** 
```
node server.js
```
3. Click **Save**

---

## Step 5: Enable CORS

In your `server/server.js`, make sure CORS allows your Vercel domain:

```javascript
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://brainspark.dhruvgoyal.tech',
        'https://your-vercel-domain.vercel.app'
    ],
    credentials: true
}));
```

Redeploy after this change.

---

## Step 6: Test Your API

Visit: `https://brainspark-api.azurewebsites.net/api/health`

You should see: `{ status: 'OK', timestamp: '...' }`

---

## Step 7: Update Vercel Environment Variable

1. Go to **Vercel Dashboard** → Your project
2. **Settings** → **Environment Variables**
3. **Add:**
   - Name: `VITE_API_URL`
   - Value: `https://brainspark-api.azurewebsites.net`
4. **Redeploy** your Vercel frontend

---

## Troubleshooting

### Check Logs:
1. Azure Portal → Your Web App
2. **Log stream** (left sidebar)
3. Look for errors

### Common Issues:

**"Application Error"**
- Check **Log stream** for specific errors
- Verify environment variables are set
- Check MongoDB connection string

**Port issues:**
- Use `process.env.PORT || 5000` in server.js
- Azure automatically sets PORT to 8080

**Module not found:**
- Make sure `package.json` has all dependencies
- Run `npm install` before deploying

---

## ✅ Done!

Your API is now live at: `https://brainspark-api.azurewebsites.net`

Test endpoints:
- GET `/api/health` - Health check
- POST `/api/auth/login` - Login
- GET `/api/quizzes` - Get quizzes
