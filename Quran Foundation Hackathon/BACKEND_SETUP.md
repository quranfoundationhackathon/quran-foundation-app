# Quran Reader - Backend Credentials Setup Guide

## ✅ What Was Fixed

### Problem
The app was trying to use frontend environment variables (VITE_) for Quran Foundation credentials, which exposed secrets and violated security best practices.

### Solution
- **Created a backend server** (`server/index.js`) that handles ALL credentials
- **Backend-only credentials** - Credentials now stored in `server/.env` only, never exposed to frontend
- **Updated frontend** - App.jsx now calls local backend routes instead of directly calling Quran Foundation API
- **Security-first architecture** - Frontend cannot access credentials; all API auth happens on the backend

---

## 📋 Files Changed/Created

### Created Files
- `server/index.js` - Express backend server with API routes
- `server/.env.example` - Example backend environment file

### Modified Files  
- `package.json` - Added express, cors, dotenv dependencies + server script
- `src/App.jsx` - Removed credential checks, now calls backend only
- `.env.example` - Updated to indicate credentials go in server/.env
- `.gitignore` - Added server/.env protection

### Deleted/Deprecated
- VITE_QURAN_AUTH_TOKEN - No longer used
- VITE_QURAN_CLIENT_ID - No longer used

---

## 🚀 How to Run

### Step 1: Set Up Backend Credentials

1. Copy the example file:
   ```powershell
   Copy-Item server\.env.example server\.env
   ```

2. Edit `server\.env` and add your Quran Foundation credentials:
   ```
   QF_CLIENT_ID=your_client_id_here
   QF_AUTH_TOKEN=your_access_token_here
   PORT=3001
   ```

   **Don't have credentials?** 
   - Go to: https://api-docs.quran.foundation/request-access
   - Fill out the form
   - Wait 24-48 hours for approval
   - You'll receive QF_CLIENT_ID and QF_AUTH_TOKEN

3. **IMPORTANT**: server/.env is in .gitignore and won't be committed to git ✅

### Step 2: Start Backend Server

```powershell
npm run server
```

You should see:
```
✅ Backend server running at http://localhost:3001
✅ Quran Foundation credentials loaded
```

### Step 3: In a New Terminal, Start Frontend

```powershell
npm run dev
```

Then visit `http://localhost:5173` in your browser.

---

## 🔍 How the Credentials Flow Works Now

```
Frontend (http://localhost:5173)
    ↓
Calls: http://localhost:3001/api/chapters
    ↓
Backend Server (server/index.js)
    ↓
Reads QF_CLIENT_ID & QF_AUTH_TOKEN from server/.env
    ↓
Authenticates with Quran Foundation API
    ↓
Returns data to frontend
```

**Key Point**: Frontend NEVER sees the credentials. They stay safely in server/.env.

---

## 🧪 Testing the Setup

### 1. Check Backend is Running
Open your browser and visit:
```
http://localhost:3001/api/health
```

You should see:
```json
{
  "status": "ok",
  "credentials_configured": true,
  "message": "Backend is ready"
}
```

### 2. Check Frontend Connects
- Visit http://localhost:5173
- Click the "Quran" tab
- You should see the list of Surahs loading
- Click a Surah to see verses

### 3. Check Credentials are Secure
- Open your browser's Network tab (F12)
- Look for requests to `http://localhost:3001/api/...` ✅
- Do NOT see any requests to `apis.quran.foundation` from the frontend ✅
- The credentials are NOT in the network requests ✅

---

## ❌ Common Errors & Fixes

### Error: "Backend is not configured"
```
Error: "Quran Foundation credentials are not configured in server/.env"
```
**Fix**: 
1. Copy `server/.env.example` to `server/.env`
2. Fill in QF_CLIENT_ID and QF_AUTH_TOKEN
3. Restart the backend server

### Error: "Failed to load Quran chapters. Make sure the backend server is running"
```
Failed to load Quran chapters: Failed to connect to localhost:3001
```
**Fix**:
1. Make sure backend is running with `npm run server`
2. Check that backend shows "running at http://localhost:3001"
3. Make sure nothing else is using port 3001

### Error: "API returned 401"
```
Error: Failed to fetch from Quran Foundation API: API returned 401
```
**Fix**:
1. Check that QF_CLIENT_ID and QF_AUTH_TOKEN in `server/.env` are correct
2. Go to https://api-docs.quran.foundation/request-access to verify your credentials
3. Make sure you didn't copy line breaks or extra spaces
4. Restart the backend server

---

## 📝 Environment Variables Explained

### server/.env (Backend - KEEP SECRET)
- `QF_CLIENT_ID` - Your Quran Foundation client ID (SECRET)
- `QF_AUTH_TOKEN` - Your Quran Foundation auth token (SECRET)
- `PORT` - Backend port (default: 3001)

### .env (Frontend Root - NOT USED)
- This file is now deprecated for credentials
- Keep it empty or delete it
- Frontend never needs credentials

---

## 🛡️ Security Checklist

✅ Frontend never reads credentials from environment variables
✅ Backend is the only place credentials are used
✅ server/.env is in .gitignore (won't be committed)
✅ Frontend calls http://localhost:3001 (local backend only)
✅ Backend authenticates with Quran Foundation securely
✅ Credentials are not visible in network requests

---

## 📚 Backend Routes Available

### GET /api/health
Check if backend and credentials are configured
```
curl http://localhost:3001/api/health
```

### GET /api/chapters
Get all Surah chapters
```
curl http://localhost:3001/api/chapters
```

### GET /api/chapters/:chapterNumber/verses
Get verses for a specific Surah
```
curl http://localhost:3001/api/chapters/1/verses
```

---

## 🚨 Do NOT Do This

❌ Put credentials in VITE_ variables (frontend)
❌ Commit server/.env to git
❌ Share your QF_CLIENT_ID or QF_AUTH_TOKEN
❌ Call Quran Foundation API directly from frontend
❌ Use public API keys in production

---

## ✨ Next Steps

Now that credentials are properly configured:

1. ✅ **Backend Security**: Credentials are in server/.env only
2. ✅ **Frontend Safety**: App.jsx calls backend only
3. ✅ **Architecture**: Clean separation of concerns

**You can now**:
- Run the app without credential errors
- Build new features knowing credentials are safe
- Share your code without exposing secrets
- Prepare for production deployment

---

**Questions?** Check the backend console output for detailed error messages.
