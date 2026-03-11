# 🔧 Fix Google OAuth "Access blocked: This app's request is invalid"

## Problem
Google is blocking the OAuth request because the app configuration is incomplete or incorrect.

## Solution Steps

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/apis/credentials

### 2. Select Your Project
Make sure you're in the correct project that contains your OAuth Client ID:
`652585055664-ctj6qs8hm54lt95j6ke9p4s9e0m2qc8i.apps.googleusercontent.com`

### 3. Configure OAuth Consent Screen
**CRITICAL STEP** - Click on "OAuth consent screen" in the left sidebar:

#### A. User Type
- Select **"External"** (unless you have a Google Workspace)
- Click "CREATE" or "EDIT APP"

#### B. App Information
- **App name**: TrackMate
- **User support email**: venkatareddy15052005@gmail.com
- **App logo**: (Optional, but recommended)
- **Application home page**: http://localhost:5173 (for development)
- **Authorized domains**: 
  - localhost (for development)
  - trackmate-rs.netlify.app (for production)
- **Developer contact email**: venkatareddy15052005@gmail.com

#### C. Scopes
Click "ADD OR REMOVE SCOPES" and add:
- `.../auth/userinfo.email`
- `.../auth/userinfo.profile`
- `openid`

Click "UPDATE" then "SAVE AND CONTINUE"

#### D. Test Users (IMPORTANT for External apps)
If your app is in "Testing" mode, you MUST add test users:
- Click "ADD USERS"
- Add: **venkatareddy15052005@gmail.com**
- Add any other email addresses that need to test the app
- Click "SAVE AND CONTINUE"

### 4. Configure OAuth 2.0 Client ID
Go back to "Credentials" → Click on your OAuth 2.0 Client ID

#### Update the following:

**Authorized JavaScript origins:**
```
http://localhost:5173
http://127.0.0.1:5173
https://trackmate-rs.netlify.app
```

**Authorized redirect URIs:**
```
http://localhost:5173
http://127.0.0.1:5173
https://trackmate-rs.netlify.app
http://localhost:5173/
http://127.0.0.1:5173/
https://trackmate-rs.netlify.app/
```

Click **SAVE**

### 5. Publish Your App (Optional - For Production)
If you want anyone to use Google login:
- Go to "OAuth consent screen"
- Click "PUBLISH APP"
- Submit for verification (takes a few days)

OR keep it in "Testing" mode and just add test users as needed.

### 6. Wait 5-10 Minutes
Google takes time to propagate changes. Clear your browser cache or use incognito mode.

### 7. Verify Your Configuration
Your current setup:
- **Client ID**: 652585055664-ctj6qs8hm54lt95j6ke9p4s9e0m2qc8i.apps.googleusercontent.com
- **Frontend (Dev)**: http://localhost:5173
- **Frontend (Prod)**: https://trackmate-rs.netlify.app
- **Backend Port**: 5001

## Common Issues

### Issue: "Access blocked: This app's request is invalid"
**Solution**: 
1. Make sure OAuth consent screen is fully configured
2. Add your email as a test user if app is in Testing mode
3. Verify all redirect URIs are correct

### Issue: "redirect_uri_mismatch"
**Solution**: 
1. The redirect URI must EXACTLY match what's in Google Console
2. Include both with and without trailing slash
3. Wait 5-10 minutes after making changes

### Issue: "invalid_client"
**Solution**: 
1. Verify GOOGLE_CLIENT_ID in both frontend and backend .env files match
2. Check for extra spaces or quotes in .env files

## Testing Checklist
- [ ] OAuth consent screen configured
- [ ] Test user added (venkatareddy15052005@gmail.com)
- [ ] Authorized JavaScript origins added
- [ ] Authorized redirect URIs added
- [ ] Waited 5-10 minutes
- [ ] Cleared browser cache / used incognito
- [ ] Backend running on port 5001
- [ ] Frontend running on port 5173

## Quick Test Command
After configuration, restart your servers:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

Then try Google login at: http://localhost:5173/login

---
Built with ⚡ by ZET-Technologies
