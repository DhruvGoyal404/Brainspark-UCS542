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
