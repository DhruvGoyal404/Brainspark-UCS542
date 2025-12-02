# 🚀 Azure Deployment - Quick Fix Guide

## ✅ What I Did:
1. Created new workflow: `.github/workflows/azure-deploy.yml` ✅
2. Deleted old broken file: `deploy-backend.yml` ✅

## 📝 What You Need To Do:

### Step 1: Add Publish Profile to GitHub Secrets

1. **Open** the downloaded file `brainspark-api.PublishSettings` in Notepad
2. **Select ALL** text (Ctrl+A) and **Copy** (Ctrl+C)
3. **Go to:** https://github.com/DhruvGoyal404/Brainspark---UI-UX/settings/secrets/actions
4. **Click:** "New repository secret"
5. Fill in:
   - **Name:** `AZURE_WEBAPP_PUBLISH_PROFILE`
   - **Value:** Paste the entire XML content
6. **Click:** "Add secret"

---

### Step 2: Push to GitHub

```bash
cd c:\Users\Dell\Desktop\UI\UX_Project

git add .
git commit -m "Add Azure deployment workflow"
git push origin main
```

---

### Step 3: Watch Deployment

1. Go to: https://github.com/DhruvGoyal404/Brainspark---UI-UX/actions
2. You'll see "Deploy to Azure Web App" running
3. Wait 3-5 minutes for it to complete
4. Should turn green ✅

---

### Step 4: Test Your API

Visit: https://brainspark-api.azurewebsites.net/api/health

You should see:
```json
{
  "status": "OK",
  "timestamp": "..."
}
```

---

## 🔧 If Something Goes Wrong

### Check Logs:
- **GitHub:** Actions tab → Click on the workflow run → View logs
- **Azure:** Portal → brainspark-api → Log stream

### Common Issues:

**"Publish profile secret not found"**
- Make sure secret name is EXACTLY: `AZURE_WEBAPP_PUBLISH_PROFILE`
- Re-check you copied the entire XML content

**"Application error"**
- Check environment variables in Azure Configuration
- Make sure MONGO_URI has `/brainspark` at the end
- Check Log stream for specific errors

---

## ✅ Success Checklist

- [ ] Publish profile added to GitHub secrets
- [ ] Code pushed to GitHub
- [ ] GitHub Actions workflow ran successfully (green checkmark)
- [ ] API responds at https://brainspark-api.azurewebsites.net/api/health
- [ ] No errors in Azure Log stream

---

**Do these steps now and let me know when deployment completes! 🚀**
