# Quran Reader Islamic App

A multi-tab Quran reader built for the Quran Foundation Hackathon. The app lets users browse all 114 surahs, read Arabic text with transliteration, and choose from multiple English/Urdu translations — all with a highly customizable reading experience.

## Features

- **Quran Reader** — Browse and read all 114 surahs with verse-by-verse Arabic text and translations
- **7 Translation Options** — Sahih International, Pickthall, Yusuf Ali, and more
- **Multiple Arabic Scripts** — Uthmani, Indo-Pak, Simple, Naskh
- **5 Themes** — Dark Navy, Light, Sepia, Mushaf Green, Deep Dark
- **Customizable Display** — Adjustable font sizes, line height, spacing, card/flat layout, and ayah number toggles
- **Persistent Settings** — All preferences saved to localStorage across sessions
- **Salah & Explore Tabs** — Placeholder tabs for future prayer times and Islamic knowledge features

## Tech Stack

- **Frontend:** React 18 + Vite
- **Backend:** Express with OAuth2 client credentials flow
- **API:** Quran Foundation API (`apis.quran.foundation`)
- **Styling:** CSS with custom properties for theming

## Architecture

The frontend calls a local Express backend (`localhost:3001`), which securely proxies requests to the Quran Foundation API using OAuth2 credentials stored in `server/.env`. This keeps API secrets off the client.

```
React Frontend → Express Backend → Quran Foundation API
       ↑                                     |
       └─────── JSON response ───────────────┘
```

## Getting Started

1. **Install dependencies:**
   ```bash
   cd "Quran Foundation Hackathon"
   npm install
   ```

2. **Set up credentials** — Create `server/.env` with your Quran Foundation API keys:
   ```
   QF_CLIENT_ID=your_client_id
   QF_CLIENT_SECRET=your_client_secret
   ```

3. **Start the backend:**
   ```bash
   npm start
   ```

4. **Start the frontend** (separate terminal):
   ```bash
   npm run dev
   ```

5. Open **http://localhost:5173** in your browser.

## Project Structure

```
Quran Foundation Hackathon/
├── server/index.js    # Express backend with OAuth2, pagination, API routes
├── src/
│   ├── App.jsx        # Main React component with Quran reader logic
│   ├── App.css        # Styling with 5 theme presets
│   └── main.jsx       # React entry point
├── index.html         # HTML template
├── vite.config.js     # Vite configuration
└── package.json       # Dependencies & scripts
```