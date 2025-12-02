# 🚀 Complete Deployment Checklist

Follow these guides in order:

## ✅ 1. MongoDB Atlas (Done)
You mentioned this is already done! ✅

## ✅ 2. Vercel Frontend (Done)
You mentioned this is already deployed! ✅

## 📝 3. Azure Backend - **DO THIS NOW**
**Follow:** `AZURE_DEPLOYMENT.md`

Quick steps:
1. Create Azure Web App (Node 20, Linux)
2. Add environment variables (MONGO_URI, JWT_SECRET, etc.)
3. Deploy code (GitHub Actions recommended)
4. Test: https://brainspark-api.azurewebsites.net/api/health

## 🌐 4. Cloudflare DNS - **DO THIS AFTER AZURE**
**Follow:** `CLOUDFLARE_SETUP.md`

Quick steps:
1. Add domain in Vercel: `brainspark.dhruvgoyal.tech`
2. Get CNAME value from Vercel
3. Add CNAME record in Cloudflare
4. Turn proxy **OFF** (grey cloud ☁️)
5. Wait 5-10 minutes
6. Test: https://brainspark.dhruvgoyal.tech

## 🔧 5. Final Configuration

### Update Backend CORS:
```javascript
// server/server.js
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://brainspark.dhruvgoyal.tech'
    ],
    credentials: true
}));
```

### Update Frontend API URL:
In Vercel → Settings → Environment Variables:
```
VITE_API_URL = https://brainspark-api.azurewebsites.net
```

Redeploy both after changes!

## 🧪 6. Testing

Test these endpoints:

**Backend:**
- https://brainspark-api.azurewebsites.net/api/health
- https://brainspark-api.azurewebsites.net/api/quizzes

**Frontend:**
- https://brainspark.dhruvgoyal.tech
- Login with admin credentials
- Take a quiz
- Check leaderboard
- Try admin panel

## 📊 7. Monitor

**Azure:**
- Portal → Your Web App → Log stream

**Vercel:**
- Dashboard → Your project → Deployments

**Cloudflare:**
- DNS → Check analytics

---

## 🎉 Success Criteria

✅ Backend API responds at Azure URL  
✅ Frontend loads at Cloudflare subdomain  
✅ HTTPS works (padlock icon)  
✅ Login/Register works  
✅ Quizzes load and can be taken  
✅ Leaderboard shows data  
✅ Admin panel accessible  
✅ No CORS errors in browser console

---

## 📞 Need Help?

Common issues and solutions in each guide:
- `AZURE_DEPLOYMENT.md` → Troubleshooting section
- `CLOUDFLARE_SETUP.md` → Troubleshooting section

Good luck! 🚀
