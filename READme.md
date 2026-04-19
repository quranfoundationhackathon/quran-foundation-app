# Quran Foundation App

![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Build-Vite%205-646CFF?logo=vite&logoColor=white)
![Express](https://img.shields.io/badge/Backend-Express-1f1f1f?logo=express&logoColor=white)
![Node](https://img.shields.io/badge/Runtime-Node.js-339933?logo=nodedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

A full-stack Quran reading experience built with React + Vite on the frontend and an Express proxy backend for secure OAuth2 access to Quran Foundation content APIs.

```

## Highlights

- Surah, Juz, and Hizb reading modes
- Translation and tafsir support
- Word-by-word endpoint integration
- Ayah audio playback with reciter selection
- Global mini player with:
   - Repeat Ayah
   - Surah Loop
   - Transport, seek, speed, and volume
- Responsive UI with persistent user preferences

## Stack

- Frontend: React 18 + Vite 5
- Backend: Express + CORS + dotenv
- Auth/API: OAuth2 Client Credentials with Quran Foundation APIs

## Architecture

```text
Browser (Vite app) -> Local Express backend -> Quran Foundation API
```

The backend handles token creation/caching and keeps secrets out of the client.

## Quick Start

### 1. Install dependencies

```bash
cd DEENCORE
npm install
```

### 2. Configure backend environment

Create `DEENCORE/server/.env` (copy from `DEENCORE/server/.env.example`) and set:

```env
QF_CLIENT_ID=your_client_id
QF_CLIENT_SECRET=your_client_secret
QF_AUTH_URL=https://oauth2.quran.foundation/
QF_API_BASE=https://apis.quran.foundation/
PORT=3001
```

### 3. Run backend

```bash
cd DEENCORE
npm run server
```

Backend URL: http://localhost:3001

### 4. Run frontend

In a second terminal:

```bash
cd DEENCORE
npm run dev
```

Frontend URL: http://localhost:5173

## Scripts

From `DEENCORE`:

- `npm run dev` -> Start Vite dev server
- `npm run server` -> Start Express backend
- `npm start` -> Alias for backend
- `npm run build` -> Build frontend
- `npm run preview` -> Preview built frontend

## Key API Routes (Backend)

- `GET /api/health`
- `GET /api/chapters`
- `GET /api/chapters/:chapterNumber/verses/:translationId`
- `GET /api/juzs`, `GET /api/juzs/:juzNumber/verses/:translationId`
- `GET /api/hizbs`, `GET /api/hizbs/:hizbNumber/verses/:translationId`
- `GET /api/audio/chapter/:reciterId/:chapterNumber`
- `GET /api/audio/verse/:reciterId/:chapterNumber`
- `GET /api/recitations`
- `GET /api/tafsirs`, `GET /api/tafsir/:tafsirId/by_chapter/:chapterNumber`
- `GET /api/search`

## Project Layout

```text
quran-foundation-app/
|- READme.md
|- DEENCORE/
|  |- package.json
|  |- index.html
|  |- vite.config.js
|  |- server/
|  |  |- index.js
|  |  |- .env.example
|  |- src/
|     |- App.jsx
|     |- App.css
|     |- main.jsx
```

## Troubleshooting

- Backend says credentials missing:
   - Ensure `DEENCORE/server/.env` exists.
   - Ensure `QF_CLIENT_ID` and `QF_CLIENT_SECRET` are real values.

- Frontend loads but API calls fail:
   - Confirm backend is running on port `3001`.
   - Check `QF_AUTH_URL` and `QF_API_BASE` values.

- Build fails with terser message:
   - Install terser in `DEENCORE`:
      - `npm install -D terser`

## Security Notes

- Never expose `QF_CLIENT_SECRET` in frontend code.
- Keep `DEENCORE/server/.env` out of version control.
- Rotate credentials if they are ever leaked.
