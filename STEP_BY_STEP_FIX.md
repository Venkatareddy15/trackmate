# 🔧 Step-by-Step Fix Guide

## Current Errors
1. ❌ `ERROR: VITE_GOOGLE_CLIENT_ID is not set in environment variables`
2. ❌ `WebSocket connection failed`
3. ❌ `Missing required parameter client_id`

---

## ✅ STEP 1: Redeploy Frontend on Vercel

### 1.1 Go to Vercel Dashboard
- Open: https://vercel.com/dashboard
- Login with your account

### 1.2 Find Your Frontend Project
- Look for project named `trackmate-six` (or similar)
- Click on it

### 1.3 Go to Deployments
- Click **Deployments** tab at the top
- Find the latest deployment (should be at the top)

### 1.4 Redeploy
- Click the **...** (three dots) menu on the latest deployment
- Click **Redeploy**
- Wait for it to say "Ready" (usually 2-3 minutes)

### 1.5 Verify Deployment
- Once it says "Ready", click on the deployment
- You should see a green checkmark

---

## ✅ STEP 2: Clear Browser Cache

### 2.1 Open Browser DevTools
- Press **Ctrl + Shift + Delete** (Windows)
- Or **Cmd + Shift + Delete** (Mac)

### 2.2 Clear Cache
- Make sure **Cookies and other site data** is checked
- Make sure **Cached images and files** is checked
- Click **Clear data**

### 2.3 Close Browser Completely
- Close all browser tabs and windows
- Wait 5 seconds
- Reopen browser

---

## ✅ STEP 3: Test Frontend

### 3.1 Open Your Frontend
- Go to: https://trackmate-six.vercel.app (or your actual URL)
- Wait for page to load completely

### 3.2 Open Browser Console
- Press **F12** (or **Cmd + Option + I** on Mac)
- Click **Console** tab

### 3.3 Check for Errors
Look for these messages:

**✅ GOOD - You should see:**
```
TrackMate Initializing with Client ID: CONNECTED
[SOCKET] Connecting to: https://ride-sharing-mu.vercel.app
[SOCKET] Connected successfully
```

**❌ BAD - You should NOT see:**
```
ERROR: VITE_GOOGLE_CLIENT_ID is not set
Missing required parameter client_id
WebSocket connection failed
```

---

## ✅ STEP 4: Test Google Login

### 4.1 Go to Login Page
- Click **Continue with Google** button

### 4.2 Sign In with Google
- Use your Google account
- Complete the login flow

### 4.3 Check Console Again
- Press **F12** to open console
- Look for success messages:
```
[LOGIN] Google OAuth Success
[AUTH_STORE] Backend response received
```

### 4.4 Verify Redirect
- You should be redirected to dashboard
- If error, check console for details

---

## ✅ STEP 5: If Still Getting Errors

### 5.1 Hard Refresh Browser
- Press **Ctrl + F5** (Windows)
- Or **Cmd + Shift + R** (Mac)
- This clears cache and reloads

### 5.2 Try Incognito Mode
- Press **Ctrl + Shift + N** (Windows)
- Or **Cmd + Shift + N** (Mac)
- Go to your frontend URL
- Test again

### 5.3 Check Vercel Build Logs
- Go to Vercel Dashboard
- Click your frontend project
- Click **Deployments**
- Click latest deployment
- Scroll down to see build logs
- Look for errors in the logs

---

## ✅ STEP 6: Verify Backend is Running

### 6.1 Check Backend Status
- Go to: https://ride-sharing-mu.vercel.app/api/auth/status
- You should see a response (not an error page)

### 6.2 If Backend is Down
- Go to Vercel Dashboard
- Click your backend project
- Click **Deployments**
- Click latest deployment
- Check if it says "Ready"
- If not, click **Redeploy**

---

## ✅ STEP 7: Update Google Cloud Console (If Needed)

### 7.1 Go to Google Cloud Console
- Open: https://console.cloud.google.com/apis/credentials
- Login with your Google account

### 7.2 Find Your OAuth Client
- Look for "TrackMate" or similar
- Click on it

### 7.3 Add Authorized Origins
- Scroll to **Authorized JavaScript origins**
- Click **Add URI**
- Add: `https://trackmate-six.vercel.app` (use your actual URL)
- Click **Save**

### 7.4 Add Authorized Redirect URIs
- Scroll to **Authorized redirect URIs**
- Click **Add URI**
- Add: `https://trackmate-six.vercel.app` (use your actual URL)
- Click **Save**

### 7.5 Wait for Google to Update
- Wait 5-10 minutes
- Google needs time to propagate changes

---

## ✅ STEP 8: Final Test

### 8.1 Go to Frontend
- Open: https://trackmate-six.vercel.app
- Press **F12** to open console

### 8.2 Check Console Messages
```
✅ TrackMate Initializing with Client ID: CONNECTED
✅ [SOCKET] Connecting to: https://ride-sharing-mu.vercel.app
✅ [SOCKET] Connected successfully
```

### 8.3 Test Google Login
- Click **Continue with Google**
- Sign in with Google
- Should redirect to dashboard

### 8.4 Success!
- If you see dashboard, everything is working! 🎉

---

## 🆘 Troubleshooting

### Problem: Still seeing "VITE_GOOGLE_CLIENT_ID is not set"

**Solution:**
1. Go to Vercel Dashboard
2. Click your frontend project
3. Click **Settings** → **Environment Variables**
4. Add these variables:
   - `VITE_GOOGLE_CLIENT_ID` = `652585055664-ctj6qs8hm54lt95j6ke9p4s9e0m2qc8i.apps.googleusercontent.com`
   - `VITE_API_URL` = `https://ride-sharing-mu.vercel.app/api`
   - `VITE_GOOGLE_MAPS_API_KEY` = `AIzaSyA9djTdmAgfyWFcejygfZxoUaMV5MFwfNE`
5. Click **Save**
6. Go to **Deployments** → **Redeploy**

### Problem: WebSocket connection failed

**Solution:**
1. This is normal - Socket.io falls back to polling
2. Check if backend is running: https://ride-sharing-mu.vercel.app/api/auth/status
3. If backend is down, redeploy it

### Problem: "Missing required parameter client_id"

**Solution:**
1. Hard refresh: **Ctrl + F5**
2. Clear cache: **Ctrl + Shift + Delete**
3. Try incognito mode: **Ctrl + Shift + N**
4. Wait 5 minutes for Google to update

### Problem: Google login not working

**Solution:**
1. Check Google Cloud Console has your URL added
2. Wait 5-10 minutes for Google to update
3. Try incognito mode
4. Check browser console for error messages

---

## 📋 Checklist

- [ ] Redeployed frontend on Vercel
- [ ] Cleared browser cache
- [ ] Closed and reopened browser
- [ ] Checked console for "CONNECTED" message
- [ ] Tested Google login
- [ ] Verified backend is running
- [ ] Updated Google Cloud Console (if needed)
- [ ] Waited 5-10 minutes for Google to update
- [ ] Tested again in incognito mode
- [ ] All errors are gone! ✅

---

## 🎯 Expected Results

After following all steps:

**Console should show:**
```
TrackMate Initializing with Client ID: CONNECTED
[SOCKET] Connecting to: https://ride-sharing-mu.vercel.app
[SOCKET] Connected successfully
```

**Google Login should work:**
- Click "Continue with Google"
- Sign in with Google
- Redirected to dashboard

**No errors should appear:**
- No "VITE_GOOGLE_CLIENT_ID is not set"
- No "Missing required parameter client_id"
- No "WebSocket connection failed"

---

## 📞 If Still Having Issues

1. Check all console messages (F12)
2. Check Vercel build logs
3. Check backend is running
4. Wait 5-10 minutes for Google to update
5. Try incognito mode
6. Clear all cache and cookies

---

Built with ⚡ by ZET-Technologies
