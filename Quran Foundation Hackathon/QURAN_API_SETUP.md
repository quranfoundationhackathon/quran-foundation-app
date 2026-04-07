# ⚠️ DEPRECATED - See BACKEND_SETUP.md Instead

This file is **no longer used**. The app has been refactored to use a secure backend.

## 🔄 What Changed

The old system used frontend environment variables (VITE_QURAN_AUTH_TOKEN, VITE_QURAN_CLIENT_ID).

**This was a security problem** because:
- Credentials were exposed in the frontend code
- Anyone could see them in network requests
- Bad practice for API security

## ✅ New System

Credentials are now handled **securely in the backend**:
- Backend server reads credentials from `server/.env` (kept secret)
- Frontend calls local backend routes only
- Credentials never exposed to frontend or network

## 📖 Follow the New Guide

**See**: [BACKEND_SETUP.md](BACKEND_SETUP.md)

This guide has:
- ✅ Correct setup instructions
- ✅ How to run backend and frontend
- ✅ Troubleshooting for common errors
- ✅ Security explanation

---

**TLDR**: 
1. Follow instructions in `BACKEND_SETUP.md`
2. Delete this file if you want (it's deprecated)
3. Never put Quran Foundation credentials in frontend .env files again

   with your actual credentials from Quran Foundation.

### Step 3: Run the App

```bash
npm install
npm run dev
```

The app should now fetch Quran data from the official Quran Foundation API.

---

## API Structure

### Endpoints Used

1. **List Chapters (Surahs)**
   - Endpoint: `https://apis.quran.foundation/content/api/v4/chapters`
   - Returns: List of all 114 chapters with metadata
   - Authentication: Required (via headers)

2. **Get Verses by Chapter**
   - Endpoint: `https://apis.quran.foundation/content/api/v4/verses/by_chapter/{chapter_number}`
   - Params: `translations=131` (Sahih International)
   - Returns: All verses with Arabic text and English translation
   - Authentication: Required (via headers)

### Response Structure

**Chapter Object:**
```json
{
  "id": 1,
  "chapter_number": 1,
  "name": "الفاتحة",
  "name_simple": "Al-Fatihah",
  "verses_count": 7
}
```

**Verse Object:**
```json
{
  "id": 1,
  "verse_number": 1,
  "text_uthmani": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "translations": [
    {
      "id": 131,
      "language_name": "en",
      "text": "In the name of Allah, the Entirely Merciful, the Especially Merciful."
    }
  ]
}
```

---

## Features

✅ **Complete Quran Content** - All 114 chapters with authentic text
✅ **English Translations** - Sahih International translation by default
✅ **Dark Theme** - Premium dark reader interface (with light/sepia/other themes)
✅ **Customizable Reader** - Font size, line height, spacing controls
✅ **Settings Persistence** - Your preferences saved locally
✅ **Script Styles** - Uthmani, Indo-Pak, Simple script options
✅ **RTL Support** - Proper right-to-left Arabic text rendering

---

## Troubleshooting

### ❌ "API credentials not configured"
- Make sure you have created a `.env` file in the root directory
- Check that `VITE_QURAN_AUTH_TOKEN` and `VITE_QURAN_CLIENT_ID` are set
- Restart the dev server after updating `.env`

### ❌ "API returned 401" or "Unauthorized"
- Your credentials may be incorrect or expired
- Request new credentials from https://api-docs.quran.foundation/request-access
- Check that credentials are copied exactly (no extra spaces)

### ❌ "API returned 429" (Too Many Requests)
- You're making too many requests too quickly
- The app includes rate limiting protection
- Wait a few minutes before retrying

### ❌ "Failed to load Quran chapters"
- Your API access may not have been approved yet
- Check your email for the approval notification
- Verify credentials are correct in `.env`

---

## Advanced Configuration

### Changing the Translation

The app currently uses translation ID `131` (Sahih International). To use a different translation:

1. Check available translations: https://api-docs.quran.foundation/docs/content_apis_versioned/translations
2. Find the translation ID you want
3. Edit `App.jsx` and change this line:
   ```javascript
   `https://apis.quran.foundation/content/api/v4/verses/by_chapter/${selectedSurah}?language=en&translations=131&...`
   ```
4. Replace `131` with your translation ID

### Adding Multiple Translations

To show multiple translations, update the fetch to include comma-separated IDs:
```javascript
&translations=131,33,20  // Multiple translation IDs
```

---

## API Documentation

Full Quran Foundation API documentation:
- https://api-docs.quran.foundation/
- Official SDK: https://npmjs.com/package/@quranjs/api

## Support

- Discord: https://discord.gg/SpEeJ5bWEQ
- GitHub: https://github.com/quran
- Report issues: https://github.com/quran/qf-api-docs/issues

---

**Last Updated**: April 2026
