# 🚀 Vercel Deployment Setup Guide

## ⚠️ Current Issues

1. **Missing Google Client ID** - `VITE_GOOGLE_CLIENT_ID` not set in Vercel environment
2. **WebSocket Connection Failing** - Socket.io can't connect to backend
3. **CORS Issues** - Frontend URL not whitelisted in backend

## ✅ Solution

### Step 1: Set Frontend Environment Variables in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Add these variables:

```
VITE_GOOGLE_CLIENT_ID=652585055664-ctj6qs8hm54lt95j6ke9p4s9e0m2qc8i.apps.googleusercontent.com
VITE_API_URL=https://ride-sharing-mu.vercel.app/api
VITE_GOOGLE_MAPS_API_KEY=AIzaSyA9djTdmAgfyWFcejygfZxoUaMV5MFwfNE
```

3. **Important**: Select which environments these apply to:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Click **Save** and **Redeploy** your frontend

### Step 2: Update Backend CORS (Already Done)

Your backend now includes `https://trackmate-inky.vercel.app` in allowed origins.

### Step 3: Redeploy Backend

```bash
cd backend
git push origin main
# Vercel will auto-deploy
```

### Step 4: Update Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Find your OAuth 2.0 Client ID
3. Add these URIs:

**Authorized JavaScript origins:**
- `https://trackmate-inky.vercel.app`
- `https://ride-sharing-mu.vercel.app`

**Authorized redirect URIs:**
- `https://trackmate-inky.vercel.app`
- `https://ride-sharing-mu.vercel.app`

4. Click **Save**
5. Wait 5-10 minutes for Google to update

## 🔍 Verification Checklist

After deployment, check browser console for:

```
✅ TrackMate Initializing with Client ID: CONNECTED
✅ No "Missing required parameter client_id" errors
✅ Socket.io connects (may show polling fallback, that's OK)
```

## 🐛 Troubleshooting

### Error: "Missing required parameter client_id"
**Solution:**
1. Go to Vercel → Settings → Environment Variables
2. Verify `VITE_GOOGLE_CLIENT_ID` is set
3. Redeploy: Click **Deployments** → Latest → **Redeploy**

### Error: "WebSocket connection failed"
**Solution:**
1. This is normal - Socket.io falls back to polling
2. Check backend logs for connection errors
3. Verify backend URL is correct in frontend

### Error: "CORS policy"
**Solution:**
1. Backend already updated with your frontend URL
2. Redeploy backend
3. Clear browser cache (Ctrl+Shift+Delete)

## 📋 Environment Variables Reference

### Frontend (.env.production)
```env
VITE_GOOGLE_MAPS_API_KEY=AIzaSyA9djTdmAgfyWFcejygfZxoUaMV5MFwfNE
VITE_API_URL=https://ride-sharing-mu.vercel.app/api
VITE_GOOGLE_CLIENT_ID=652585055664-ctj6qs8hm54lt95j6ke9p4s9e0m2qc8i.apps.googleusercontent.com
```

### Backend (.env)
```env
PORT=5001
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
GOOGLE_CLIENT_ID=652585055664-ctj6qs8hm54lt95j6ke9p4s9e0m2qc8i.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
ADMIN_EMAIL=Admin@ride.edu
```

## 🔗 Important URLs

- **Frontend**: https://trackmate-inky.vercel.app
- **Backend**: https://ride-sharing-mu.vercel.app
- **API Base**: https://ride-sharing-mu.vercel.app/api
- **Socket.io**: wss://ride-sharing-mu.vercel.app/socket.io

## 📝 Deployment Checklist

- [ ] Frontend environment variables set in Vercel
- [ ] Backend redeployed with updated CORS
- [ ] Google Cloud Console updated with new URLs
- [ ] Browser cache cleared
- [ ] Incognito mode test passed
- [ ] Google login working
- [ ] Socket.io connecting (polling is OK)
- [ ] API calls working

## 🚀 Quick Redeploy

**Frontend:**
```bash
cd frontend
git add .
git commit -m "Update environment variables"
git push origin main
# Vercel auto-deploys
```

**Backend:**
```bash
cd backend
git add .
git commit -m "Update CORS for Vercel frontend"
git push origin main
# Vercel auto-deploys
```

---
Built with ⚡ by ZET-Technologies
