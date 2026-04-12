# Backend OAuth2 Integration - DEENCORE Content API

## ✅ WHAT CHANGED

Your backend now implements the **official DEENCORE OAuth2 client credentials flow** instead of using a static token.

### Old Way (Deprecated) ❌
- Used a pre-generated static token: `QF_AUTH_TOKEN`
- Token manually obtained and stored in env file
- No token refresh mechanism
- Manual token renewal needed

### New Way (Official) ✅
- Uses `QF_CLIENT_ID` and `QF_CLIENT_SECRET` (OAuth2 credentials)
- Backend automatically requests access tokens via OAuth2 flow
- Tokens cached until near expiry
- Automatic token refresh on 401 errors
- Follows official DEENCORE security standards

---

## 🔐 ENVIRONMENT VARIABLES

**Remove old variables** (if they exist):
- ❌ `QF_AUTH_TOKEN` - NO LONGER USED

**Use new variables** (required):
- ✅ `QF_CLIENT_ID` - OAuth2 client ID
- ✅ `QF_CLIENT_SECRET` - OAuth2 client secret
- ✅ `PORT` - Backend port (default: 3001)

---

## 📋 HOW TO SET IT UP

### Step 1: Request Credentials from DEENCORE

1. Visit: **https://api-docs.quran.foundation/request-access**
2. Fill out the form:
   - **App Name**: Your app name (e.g., "My Quran Reader")
   - **Email**: Your email
   - **Description**: Brief description of your app
3. Click **Submit**
4. Wait for approval email (usually 24-48 hours)
5. You'll receive:
   - **Client ID** (QF_CLIENT_ID)
   - **Client Secret** (QF_CLIENT_SECRET)

### Step 2: Create Backend Environment File

1. In project folder, create: `server/.env`
   ```powershell
   Copy-Item server\.env.example server\.env
   ```

2. Edit `server/.env` and add your credentials:
   ```
   QF_CLIENT_ID=your_client_id_from_email
   QF_CLIENT_SECRET=your_client_secret_from_email
   PORT=3001
   ```

3. **IMPORTANT**: Never commit `server/.env` to git (it's in .gitignore already ✓)

### Step 3: Verify Setup

1. Check `server/.env` has all three variables:
   - `QF_CLIENT_ID` = actual value
   - `QF_CLIENT_SECRET` = actual value
   - `PORT` = 3001

2. Make sure `server/.env` is NOT in git:
   ```powershell
   git status
   ```
   Should NOT show `server/.env` in tracked files ✓

---

## 🚀 HOW TO RUN

### Terminal 1: Start Backend
```powershell
npm run server
```

You should see:
```
✅ Backend server running at http://localhost:3001
✅ DEENCORE OAuth2 credentials configured
   Using OAuth2 client credentials flow for token management

→ Requesting new access token from DEENCORE...
✓ Access token obtained (expires in 3600s)
```

### Terminal 2: Start Frontend
```powershell
npm run dev
```

Visit: `http://localhost:5173` (or whatever port shows)

---

## 🔄 HOW THE OAUTH2 FLOW WORKS

```
1. Frontend calls: GET http://localhost:3001/api/chapters
                    ↓
2. Backend checks: Do I have a cached valid access token?
                    ↓
3a. YES → Use cached token (fast ⚡)
                    ↓
3b. NO → Request new token from DEENCORE
         POST https://auth.quran.foundation/oauth/token
         with QF_CLIENT_ID and QF_CLIENT_SECRET
                    ↓
4. Cache token until near expiry (with 60s buffer)
                    ↓
5. Call DEENCORE Content API:
   GET https://apis.quran.foundation/content/api/v4/chapters
   Headers:
   - x-auth-token: [cached_access_token]
   - x-client-id: QF_CLIENT_ID
                    ↓
6. Return data to frontend
```

---

## 🧪 TESTING THE SETUP

### 1. Health Check
```
curl http://localhost:3001/api/health
```

Response:
```json
{
  "status": "ok",
  "credentials_configured": true,
  "access_token_cached": true,
  "message": "Backend is ready and configured"
}
```

### 2. Load Backend
```powershell
npm run server
```

Check console output for:
- ✅ "Backend server running at http://localhost:3001"
- ✅ "DEENCORE OAuth2 credentials configured"
- ✅ "Access token obtained" (after first API call)

### 3. Test Chapters Endpoint
Frontend will automatically fetch chapters when you click the "Quran" tab:
```
GET http://localhost:3001/api/chapters
```

### 4. Test Verses Endpoint
Frontend will fetch verses when you select a Surah:
```
GET http://localhost:3001/api/chapters/1/verses
```

### 5. Browser Console
Open DevTools (F12) and check:
- Filter by `/api/` requests
- Should see: `http://localhost:3001/api/chapters` ✅
- Should NOT see: `apis.quran.foundation` directly ✅
- Token is NOT visible in network requests ✅

---

## ⚡ TOKEN CACHING DETAILS

The backend:
- **Caches tokens** in memory (not in a file)
- **Uses token until near expiry** (with 60 second safety buffer)
- **Automatically refreshes** when token expires
- **Retries on 401** - If DEENCORE rejects the token, clears cache and requests a new one
- **No manual intervention needed** - All automatic!

---

## ❌ TROUBLESHOOTING

### Error: "Credentials not configured"
```
❌ DEENCORE credentials NOT found in server/.env
Required: QF_CLIENT_ID and QF_CLIENT_SECRET
```

**Fix**:
1. Make sure `server/.env` exists
2. Check it has: `QF_CLIENT_ID=...` and `QF_CLIENT_SECRET=...`
3. Restart backend: `npm run server`

### Error: "OAuth2 token request failed (401)"
```
Failed to get access token: OAuth2 token request failed (401): invalid_client
```

**Fix**:
1. Check `QF_CLIENT_ID` and `QF_CLIENT_SECRET` are correct
2. Make sure they match the email you received
3. No extra spaces or line breaks
4. Restart backend and try again

### Error: "OAuth2 token request failed (404)"
```
Failed to get access token: OAuth2 token request failed (404): Not found
```

**Fix**: 
- The OAuth2 endpoint might have changed
- Check: https://api-docs.quran.foundation/ for current endpoint
- Update the OAuth2 URL in `server/index.js` line 38

### Frontend shows "Failed to load chapters"
**Fix**:
1. Check backend is running: `npm run server`
2. Check health: `curl http://localhost:3001/api/health`
3. Check console for error messages
4. Make sure credentials are in `server/.env` (not root `.env`)

### Token keeps getting cleared
This is normal! The backend:
- Clears expired or invalid tokens automatically
- Requests new ones as needed
- Shows `⚠ Access token rejected, clearing cache...` in logs

Just wait a moment and try again.

---

## 🔐 SECURITY CHECKLIST

✅ QF_CLIENT_ID and QF_CLIENT_SECRET in `server/.env` (backend only)
✅ `server/.env` is in `.gitignore` (won't be committed)
✅ Frontend NEVER has access to credentials
✅ Access tokens NOT sent to frontend
✅ Backend handles all authentication
✅ All requests go through localhost:3001
✅ DEENCORE receives proper x-auth-token header
✅ Token refresh automatic (no manual management needed)

---

## 📚 API ROUTES AVAILABLE

### GET /api/health
Check backend status and credential configuration
```
curl http://localhost:3001/api/health
```

### GET /api/chapters
Get all 114 Surahs with English and Arabic names
```
curl http://localhost:3001/api/chapters
```

### GET /api/chapters/:chapterNumber/verses
Get all verses for a specific Surah with Arabic text and English translation
```
curl http://localhost:3001/api/chapters/1/verses
```

---

## 🎯 NEXT STEPS

1. ✅ Request credentials from DEENCORE (wait 24-48 hours)
2. ✅ Create `server/.env` with credentials
3. ✅ Start backend: `npm run server`
4. ✅ Start frontend: `npm run dev`
5. ✅ Test Quran tab - should load all Surahs and verses
6. ✅ Check Network tab - confirm backend calls are working
7. ✅ Deploy when ready!

---

## 📖 OFFICIAL DOCUMENTATION

- DEENCORE: https://api-docs.quran.foundation/
- Request Access: https://api-docs.quran.foundation/request-access
- Content API Docs: https://api-docs.quran.foundation/content/v4

---

**Status**: ✨ OAuth2 implementation complete! Backend is ready to receive your DEENCORE credentials.
