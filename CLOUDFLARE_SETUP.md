# 🌐 Cloudflare DNS Setup for Vercel Subdomain

## What You'll Create:
`brainspark.dhruvgoyal.tech` → Your Vercel app

---

## Step 1: Get Your Vercel Domain

1. Go to **Vercel Dashboard** → your project
2. Click **"Settings"** → **"Domains"**
3. You'll see something like: `brainspark-xyz123.vercel.app`
4. **Copy this domain** (you'll need it)

---

## Step 2: Add Domain to Vercel

1. Still in **Settings → Domains**
2. In the **"Add a domain"** box, type: `brainspark.dhruvgoyal.tech`
3. Click **"Add"**
4. Vercel will say **"Invalid Configuration"** - that's normal!
5. You'll see instructions showing a **CNAME value** like:
   ```
   cname.vercel-dns.com
   ```
6. **Keep this page open!**

---

## Step 3: Configure Cloudflare DNS

1. **Go to:** https://dash.cloudflare.com
2. **Select your domain:** `dhruvgoyal.tech`
3. **Click "DNS"** in the left sidebar
4. **Click "Add record"** button

### Add CNAME Record:

**Fill in:**
- **Type:** CNAME
- **Name:** `brainspark` (this becomes brainspark.dhruvgoyal.tech)
- **Target:** `cname.vercel-dns.com` (from Vercel)
- **Proxy status:** 🟠 **DNS only** (click the cloud icon to turn proxy OFF - it should be grey/orange, NOT orange cloud)
- **TTL:** Auto

**Click "Save"**

---

## Step 4: Verify in Vercel

1. **Go back to Vercel** → Domains page
2. **Wait 30-60 seconds**
3. **Refresh the page**
4. You should see: ✅ **Valid Configuration**

If not:
- Wait 5 more minutes (DNS propagation)
- Check Cloudflare record is correct
- Make sure proxy is **OFF** (grey cloud, not orange)

---

## Step 5: SSL Certificate (Automatic)

Vercel automatically generates SSL certificate. Wait 5-10 minutes, then:

Visit: `https://brainspark.dhruvgoyal.tech`

You should see your app! 🎉

---

## Cloudflare Proxy Settings Explained

### 🟠 DNS only (Grey Cloud) - **USE THIS**
- Direct connection to Vercel
- Vercel handles SSL
- Faster (no Cloudflare proxy)
- **Recommended for Vercel**

### ☁️ Proxied (Orange Cloud) - Don't use
- Traffic goes through Cloudflare
- Can cause SSL issues with Vercel
- Slower

**Keep it on "DNS only" (grey cloud)!**

---

## Troubleshooting

### "Invalid Configuration" persists
1. Double-check CNAME value matches Vercel exactly
2. Make sure it's `cname.vercel-dns.com` not `76.76.21.21`
3. Proxy must be **OFF** (DNS only)

### "Too Many Redirects"
- Turn OFF Cloudflare proxy (make it "DNS only")
- Clear browser cache
- Wait 5 minutes

### DNS not resolving
1. Check Cloudflare record exists
2. Wait up to 10 minutes for propagation
3. Test with: `nslookup brainspark.dhruvgoyal.tech`

---

## Final Checklist

✅ Vercel domain added: `brainspark.dhruvgoyal.tech`  
✅ Cloudflare CNAME record created  
✅ Proxy status: **DNS only** (grey cloud)  
✅ Vercel shows "Valid Configuration"  
✅ SSL certificate issued (https works)  
✅ Site accessible at `https://brainspark.dhruvgoyal.tech`

---

## Update Environment Variables

Don't forget to update your backend CORS:

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

Redeploy Azure after this change!

---

## 🎉 You're Done!

Your app is now live at:
- **Frontend:** https://brainspark.dhruvgoyal.tech
- **Backend:** https://brainspark-api.azurewebsites.net

Test it thoroughly! 🚀
