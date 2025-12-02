# 🎨 Logo Design Prompt for Gemini

## PROMPT FOR GEMINI 2.0 FLASH (EXPERIMENTAL) - IMAGEN 3:

```
Design a modern, professional logo for "BrainSpark" - an interactive quiz learning platform for computer science students.

Style Requirements:
- Modern, tech-forward aesthetic
- Clean and minimalist design
- Vibrant and energetic color palette
- Suitable for both light and dark backgrounds

Visual Elements:
- Incorporate a brain icon or neural network pattern (representing learning/intelligence)
- Add a spark/lightning bolt element (representing brilliance and instant knowledge)
- Combine the brain and spark creatively - maybe neurons lighting up with sparks
- The design should feel dynamic and energetic, not static

Color Palette:
- Primary: Electric blue (#6366f1) or vibrant purple (#8b5cf6)
- Accent: Bright orange/yellow (#f59e0b) for the spark element
- Optional gradient from blue to purple
- High contrast for visibility

Typography (if including text):
- Font style: Bold, modern sans-serif (like "Plus Jakarta Sans" or "Inter")
- Text: "BrainSpark" or just "BS" for icon version
- Option 1: Full wordmark with icon
- Option 2: Icon-only version (brain + spark symbol)

Technical Specs:
- Square format (1024x1024px)
- Transparent background (PNG)
- Should work at small sizes (favicon) and large sizes (hero)
- Must be recognizable even at 32x32px

Mood:
- Intelligent but approachable
- Energetic and motivating
- Modern and trustworthy
- Fun but professional

Please create 2 variations:
1. Full logo with "BrainSpark" text + icon
2. Icon-only version (just the brain-spark symbol)

The logo should inspire confidence in learning and make students excited to use the quiz platform!
```

## Alternative Shorter Prompt (if token limit):

```
Create a modern logo for "BrainSpark" quiz app. Combine a stylized brain with lightning/spark elements. Colors: vibrant blue (#6366f1) and orange (#f59e0b). Style: minimalist, tech-forward, energetic. Make it work on both light/dark backgrounds. Square 1024x1024px, transparent PNG. Should feel smart, dynamic, and approachable - perfect for a student learning platform.
```

## How to Use:

1. Go to Google AI Studio: https://aistudio.google.com/
2. Select "Imagen 3" mode
3. Paste the prompt above
4. Generate multiple variations
5. Download your favorite!
6. Save as `client/public/logo.png` and `client/public/favicon.ico`

Good luck! 🎨✨


# Deployment Configuration

## Frontend (Vercel)

### Steps to Deploy:
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Vercel will auto-detect Vite project
4. Set build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
   - Root Directory: `client`

### Environment Variables (Set in Vercel):
```
VITE_API_URL=https://your-azure-backend.azurewebsites.net
```

## Backend (Azure Web App)

### Steps to Deploy:
1. Create Azure Web App (Node.js 18)
2. Add GitHub secrets in repository settings:
   - `AZURE_WEBAPP_NAME`: Your Azure app name
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: Download from Azure portal
3. Push to main branch to trigger deployment

### Environment Variables (Set in Azure):
```
PORT=8080
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
NODE_ENV=production
```

### Azure Web App Configuration:
- Runtime Stack: Node 18 LTS
- Operating System: Linux
- Pricing: Free F1 or Basic B1
- Always On: Enabled (if using paid tier)
- CORS: Enable for your Vercel domain

## MongoDB Atlas Setup
1. Create cluster at mongodb.com/cloud/atlas
2. Add IP whitelist: 0.0.0.0/0 (allow all) for development
3. Create database user
4. Get connection string
5. Add to Azure environment variables

## Post-Deployment Checklist
- [ ] Frontend builds successfully on Vercel
- [ ] Backend deploys to Azure
- [ ] MongoDB Atlas connection works
- [ ] CORS configured properly
- [ ] Environment variables set correctly
- [ ] API calls work between frontend and backend
- [ ] Test all features in production
