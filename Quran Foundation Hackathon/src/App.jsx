import { useState, useEffect, useRef, createContext, useContext } from "react";
import "./App.css";

// ─── Global Settings Context ───────────────────────────────

const defaultSettings = {
  theme: 'dark-navy',
  customAccent: '',
  arabicSize: 2.1,
  arabicLineHeight: 2.6,
  translationSize: 1.05,
  translationLineHeight: 1.7,
  globalTextScale: 1.0,
  showTranslation: true,
  showAyahBadges: true,
  viewMode: 'card',
  spacing: 'normal',
  layoutMode: 'normal',
  scriptStyle: 'uthmani',
  translationId: 85,
};

const SettingsContext = createContext();

function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('appSettings');
      const merged = saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
      const validIds = [85, 57, 234, 161, 80, 39, 33, 78, 208, 136, 140];
      if (!validIds.includes(merged.translationId)) merged.translationId = 85;
      return merged;
    } catch {
      return defaultSettings;
    }
  });

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, showSettings, setShowSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

function useSettings() {
  return useContext(SettingsContext);
}

// ─── SVG Icons ─────────────────────────────────────────────

const IconBook = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconClock = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconBookmark = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const IconCompass = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const IconStar = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconTarget = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const IconPlay = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconGear = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const IconHome = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const IconQuran = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconPrayer = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconExplore = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
  </svg>
);

const IconMapPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconSearchSmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconMasjid = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" />
    <path d="M5 21V12" />
    <path d="M19 21V12" />
    <path d="M5 12a7 7 0 0 1 14 0" />
    <line x1="12" y1="5" x2="12" y2="2" />
    <path d="M9 21v-3a3 3 0 0 1 6 0v3" />
  </svg>
);

// ─── Ayah Action Icons ─────────────────────────────────────

const IconBookmarkFill = ({ filled }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);

const IconPlaySmall = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const IconPause = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
);

const IconCopy = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconShare = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const IconTafsir = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ─── Prayer Times Scaffold Data ───────────────────────────

const WORLD_CITIES = [
  { id: 'mecca', name: 'Mecca', country: 'Saudi Arabia', tz: 'Asia/Riyadh' },
  { id: 'medina', name: 'Medina', country: 'Saudi Arabia', tz: 'Asia/Riyadh' },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', tz: 'Asia/Riyadh' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', tz: 'Asia/Dubai' },
  { id: 'doha', name: 'Doha', country: 'Qatar', tz: 'Asia/Qatar' },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', tz: 'Africa/Cairo' },
  { id: 'istanbul', name: 'Istanbul', country: 'Turkey', tz: 'Europe/Istanbul' },
  { id: 'london', name: 'London', country: 'UK', tz: 'Europe/London' },
  { id: 'paris', name: 'Paris', country: 'France', tz: 'Europe/Paris' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', tz: 'Europe/Berlin' },
  { id: 'newyork', name: 'New York', country: 'USA', tz: 'America/New_York' },
  { id: 'losangeles', name: 'Los Angeles', country: 'USA', tz: 'America/Los_Angeles' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', tz: 'America/Toronto' },
  { id: 'islamabad', name: 'Islamabad', country: 'Pakistan', tz: 'Asia/Karachi' },
  { id: 'dhaka', name: 'Dhaka', country: 'Bangladesh', tz: 'Asia/Dhaka' },
  { id: 'jakarta', name: 'Jakarta', country: 'Indonesia', tz: 'Asia/Jakarta' },
  { id: 'kualalumpur', name: 'Kuala Lumpur', country: 'Malaysia', tz: 'Asia/Kuala_Lumpur' },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', tz: 'Africa/Lagos' },
  { id: 'casablanca', name: 'Casablanca', country: 'Morocco', tz: 'Africa/Casablanca' },
  { id: 'beirut', name: 'Beirut', country: 'Lebanon', tz: 'Asia/Beirut' },
  { id: 'amman', name: 'Amman', country: 'Jordan', tz: 'Asia/Amman' },
  { id: 'tehran', name: 'Tehran', country: 'Iran', tz: 'Asia/Tehran' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', tz: 'Australia/Sydney' },
];

const CALC_METHODS = [
  { id: 'MWL', name: 'Muslim World League' },
  { id: 'ISNA', name: 'ISNA' },
  { id: 'Egypt', name: 'Egyptian Authority' },
  { id: 'Makkah', name: 'Umm al-Qura' },
  { id: 'Karachi', name: 'Karachi' },
];

/** Mock prayer times — replace with real API integration */
function generateMockTimes(cityId) {
  const baseMins = [312, 394, 738, 930, 1108, 1198];
  let hash = 0;
  for (let i = 0; i < cityId.length; i++) hash = ((hash << 5) - hash + cityId.charCodeAt(i)) | 0;
  const today = new Date();
  const dayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return baseMins.map((m, i) => {
    const offset = ((Math.abs(hash) >> (i * 3)) % 21) - 10;
    return new Date(dayStart.getTime() + (m + offset) * 60000);
  });
}

const PRAYER_DEFS = [
  { key: 'fajr', name: 'Fajr', arabic: '\u0627\u0644\u0641\u062C\u0631', idx: 0, isPrayer: true },
  { key: 'sunrise', name: 'Sunrise', arabic: '\u0627\u0644\u0634\u0631\u0648\u0642', idx: 1, isPrayer: false },
  { key: 'dhuhr', name: 'Dhuhr', arabic: '\u0627\u0644\u0638\u0647\u0631', idx: 2, isPrayer: true },
  { key: 'asr', name: 'Asr', arabic: '\u0627\u0644\u0639\u0635\u0631', idx: 3, isPrayer: true },
  { key: 'maghrib', name: 'Maghrib', arabic: '\u0627\u0644\u0645\u063A\u0631\u0628', idx: 4, isPrayer: true },
  { key: 'isha', name: 'Isha', arabic: '\u0627\u0644\u0639\u0634\u0627\u0621', idx: 5, isPrayer: true },
];

function formatPrayerTime(date) {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// ─── Script style class map ───────────────────────────────

const SCRIPT_CLASS_MAP = {
  uthmani: 'script-uthmani',
  indopak: 'script-indopak',
  simple: 'script-simple',
  naskh: 'script-naskh',
};

// ─── Settings Panel ────────────────────────────────────────

function SettingsPanel() {
  const { settings, updateSetting, setShowSettings } = useSettings();
  const [availableTranslations, setAvailableTranslations] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/translations')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.translations) setAvailableTranslations(data.translations); })
      .catch(() => {});
  }, []);

  const themes = [
    { value: 'dark-navy', label: 'Dark Navy' },
    { value: 'light', label: 'Light' },
    { value: 'sepia', label: 'Sepia' },
    { value: 'mushaf-green', label: 'Mushaf Green' },
    { value: 'deep-dark', label: 'Deep Dark' },
    { value: 'maroon', label: 'Maroon Night' },
    { value: 'cool-slate', label: 'Cool Slate' },
  ];

  return (
    <div className="settings-overlay" onClick={() => setShowSettings(false)}>
      <div className="settings-panel" onClick={e => e.stopPropagation()}>
        <div className="settings-header">
          <h3>Settings</h3>
          <button className="settings-close" onClick={() => setShowSettings(false)}>&#215;</button>
        </div>

        <div className="settings-content">
          {/* Theme */}
          <div className="settings-section">
            <h4 className="settings-section-title">Theme</h4>
            <div className="settings-options">
              {themes.map(t => (
                <button
                  key={t.value}
                  className={`theme-option ${settings.theme === t.value ? 'active' : ''} theme-${t.value}`}
                  onClick={() => updateSetting('theme', t.value)}
                  title={t.label}
                />
              ))}
            </div>
            <div className="accent-color-row">
              <input
                type="color"
                className="accent-color-input"
                value={settings.customAccent || '#5d9d94'}
                onChange={e => updateSetting('customAccent', e.target.value)}
              />
              <span className="accent-color-label">Custom accent</span>
              {settings.customAccent && (
                <button className="accent-reset-btn" onClick={() => updateSetting('customAccent', '')}>
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Typography */}
          <div className="settings-section">
            <h4 className="settings-section-title">Typography</h4>

            <div className="settings-control">
              <label>Global Text Scale: {settings.globalTextScale.toFixed(1)}x</label>
              <input type="range" min="0.8" max="2.0" step="0.1" value={settings.globalTextScale}
                onChange={e => updateSetting('globalTextScale', parseFloat(e.target.value))} className="settings-slider" />
            </div>

            <div className="settings-control">
              <label>Arabic Size: {settings.arabicSize.toFixed(1)}rem</label>
              <input type="range" min="1.2" max="10" step="0.1" value={settings.arabicSize}
                onChange={e => updateSetting('arabicSize', parseFloat(e.target.value))} className="settings-slider" />
            </div>

            <div className="settings-control">
              <label>Arabic Line Height: {settings.arabicLineHeight.toFixed(1)}</label>
              <input type="range" min="1.5" max="10" step="0.1" value={settings.arabicLineHeight}
                onChange={e => updateSetting('arabicLineHeight', parseFloat(e.target.value))} className="settings-slider" />
            </div>

            <div className="settings-control">
              <label>Translation Size: {settings.translationSize.toFixed(1)}rem</label>
              <input type="range" min="0.7" max="10" step="0.1" value={settings.translationSize}
                onChange={e => updateSetting('translationSize', parseFloat(e.target.value))} className="settings-slider" />
            </div>

            <div className="settings-control">
              <label>Translation Line Height: {settings.translationLineHeight.toFixed(1)}</label>
              <input type="range" min="1.2" max="10" step="0.1" value={settings.translationLineHeight}
                onChange={e => updateSetting('translationLineHeight', parseFloat(e.target.value))} className="settings-slider" />
            </div>

            <div className="settings-control">
              <label>Script Style</label>
              <div className="button-group">
                {[
                  { value: 'uthmani', label: 'Uthmani' },
                  { value: 'indopak', label: 'Indo-Pak' },
                  { value: 'simple', label: 'Simple' },
                  { value: 'naskh', label: 'Naskh' },
                ].map(s => (
                  <button key={s.value}
                    className={`btn-option ${settings.scriptStyle === s.value ? 'active' : ''}`}
                    onClick={() => updateSetting('scriptStyle', s.value)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quran Reader */}
          <div className="settings-section">
            <h4 className="settings-section-title">Quran Reader</h4>

            <div className="settings-control toggle">
              <label>Show Translation</label>
              <button className={`toggle-btn ${settings.showTranslation ? 'on' : 'off'}`}
                onClick={() => updateSetting('showTranslation', !settings.showTranslation)}>
                {settings.showTranslation ? 'ON' : 'OFF'}
              </button>
            </div>

            {settings.showTranslation && availableTranslations.length > 0 && (
              <div className="settings-control">
                <label>Translation</label>
                <select value={settings.translationId}
                  onChange={e => updateSetting('translationId', parseInt(e.target.value))} className="settings-select">
                  {availableTranslations.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.language})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="settings-control toggle">
              <label>Ayah Numbers</label>
              <button className={`toggle-btn ${settings.showAyahBadges ? 'on' : 'off'}`}
                onClick={() => updateSetting('showAyahBadges', !settings.showAyahBadges)}>
                {settings.showAyahBadges ? 'ON' : 'OFF'}
              </button>
            </div>

            <div className="settings-control">
              <label>View Mode</label>
              <div className="button-group">
                <button className={`btn-option ${settings.viewMode === 'card' ? 'active' : ''}`}
                  onClick={() => updateSetting('viewMode', 'card')}>Card</button>
                <button className={`btn-option ${settings.viewMode === 'flat' ? 'active' : ''}`}
                  onClick={() => updateSetting('viewMode', 'flat')}>Flat</button>
              </div>
            </div>
          </div>

          {/* Layout */}
          <div className="settings-section">
            <h4 className="settings-section-title">Layout</h4>

            <div className="settings-control">
              <label>Reader Width</label>
              <div className="button-group">
                <button className={`btn-option ${settings.layoutMode === 'normal' ? 'active' : ''}`}
                  onClick={() => updateSetting('layoutMode', 'normal')}>Normal</button>
                <button className={`btn-option ${settings.layoutMode === 'wide' ? 'active' : ''}`}
                  onClick={() => updateSetting('layoutMode', 'wide')}>Wide</button>
              </div>
            </div>

            <div className="settings-control">
              <label>Spacing</label>
              <div className="button-group">
                {['compact', 'normal', 'spacious', 'very-spacious'].map(s => (
                  <button key={s} className={`btn-option ${settings.spacing === s ? 'active' : ''}`}
                    onClick={() => updateSetting('spacing', s)}>
                    {s === 'very-spacious' ? 'XL' : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Home Component ────────────────────────────────────────

function Home({ onNavigate }) {
  const { settings } = useSettings();
  const [greeting, setGreeting] = useState('');
  const [hijriDate, setHijriDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');
  const [lastRead, setLastRead] = useState(null);
  const [nextPrayerPreview, setNextPrayerPreview] = useState(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const now = new Date();
    try {
      setHijriDate(new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
        year: 'numeric', month: 'long', day: 'numeric'
      }).format(now));
    } catch { setHijriDate(''); }

    setGregorianDate(now.toLocaleDateString('en-US', {
      weekday: 'long', month: 'short', day: 'numeric'
    }));

    try {
      const saved = localStorage.getItem('lastReadSurah');
      if (saved) setLastRead(JSON.parse(saved));
    } catch {}

    // Next prayer preview
    try {
      let cId = 'mecca';
      try { const sl = localStorage.getItem('salahLocation'); if (sl) cId = JSON.parse(sl).id; } catch {}
      const mt = generateMockTimes(cId);
      const prs = [{ name: 'Fajr', time: mt[0] }, { name: 'Dhuhr', time: mt[2] }, { name: 'Asr', time: mt[3] }, { name: 'Maghrib', time: mt[4] }, { name: 'Isha', time: mt[5] }];
      const np = prs.find(p => p.time > now);
      if (np) setNextPrayerPreview({ name: np.name, timeStr: formatPrayerTime(np.time) });
    } catch {}
  }, []);

  const scale = settings.globalTextScale || 1;

  return (
    <div className="home-page" style={{ fontSize: `${scale}rem` }}>
      <div className="home-geo-pattern" />

      {/* Hero */}
      <div className="home-hero">
        <div className="home-bismillah">{'\uFDFD'}</div>
        <h1 className="home-title" style={{ fontSize: `${2 * scale}rem` }}>As-Salamu Alaykum</h1>
        <p className="home-greeting">{greeting}</p>
        <div className="home-date-row">
          {hijriDate && <p className="home-hijri">{hijriDate}</p>}
          {hijriDate && gregorianDate && <span className="home-date-dot" />}
          {gregorianDate && <p className="home-gregorian">{gregorianDate}</p>}
        </div>
      </div>

      {/* Verse of the Day */}
      <div className="home-verse-card" onClick={() => onNavigate?.('quran')}>
        <div className="home-verse-label">Verse of the Day</div>
        <p className="home-verse-arabic">
          {'\u0625\u0650\u0646\u0651\u064E \u0645\u064E\u0639\u064E \u0671\u0644\u0652\u0639\u064F\u0633\u0652\u0631\u0650 \u064A\u064F\u0633\u0652\u0631\u064B\u0627\u06ED'}
        </p>
        <p className="home-verse-translation">
          &ldquo;Indeed, with hardship comes ease.&rdquo;
        </p>
        <div className="home-verse-footer">
          <p className="home-verse-ref">Surah Ash-Sharh 94:6</p>
          <button className="home-verse-action" onClick={e => { e.stopPropagation(); onNavigate?.('quran'); }}>
            Open in Quran
          </button>
        </div>
      </div>

      {/* Next Prayer Preview */}
      {nextPrayerPreview && (
        <div className="home-section-card" onClick={() => onNavigate?.('salah')}>
          <div className="home-section-header">
            <span className="home-section-icon"><IconPrayer /></span>
            <h4 className="home-section-title">Next Prayer</h4>
          </div>
          <div className="home-continue-info">
            <div className="home-continue-text">
              <h4>{nextPrayerPreview.name}</h4>
              <p>{nextPrayerPreview.timeStr}</p>
            </div>
            <span className="home-continue-arrow"><IconChevron /></span>
          </div>
        </div>
      )}

      {/* Continue Reading */}
      {lastRead && (
        <div className="home-section-card" onClick={() => onNavigate?.('quran')}>
          <div className="home-section-header">
            <span className="home-section-icon"><IconPlay /></span>
            <h4 className="home-section-title">Continue Reading</h4>
          </div>
          <div className="home-continue-info">
            <div className="home-continue-text">
              <h4>{lastRead.name || `Surah ${lastRead.number}`}</h4>
              <p>Ayah {lastRead.ayah || 1}</p>
            </div>
            <span className="home-continue-arrow"><IconChevron /></span>
          </div>
        </div>
      )}

      {/* Quick Access */}
      <div className="home-grid">
        <button className="home-card" onClick={() => onNavigate?.('quran')}>
          <span className="home-card-icon"><IconBook /></span>
          <span className="home-card-label">Read Quran</span>
          <span className="home-card-desc">114 Surahs</span>
        </button>
        <button className="home-card" onClick={() => onNavigate?.('salah')}>
          <span className="home-card-icon"><IconClock /></span>
          <span className="home-card-label">Salah Times</span>
          <span className="home-card-desc">Prayer schedule</span>
        </button>
        <button className="home-card" onClick={() => onNavigate?.('quran')}>
          <span className="home-card-icon"><IconBookmark /></span>
          <span className="home-card-label">Bookmarks</span>
          <span className="home-card-desc">Your saved ayahs</span>
        </button>
        <button className="home-card" onClick={() => onNavigate?.('explore')}>
          <span className="home-card-icon"><IconCompass /></span>
          <span className="home-card-label">Explore</span>
          <span className="home-card-desc">Learn more</span>
        </button>
      </div>

      {/* Daily Goal */}
      <div className="home-section-card">
        <div className="home-section-header">
          <span className="home-section-icon"><IconTarget /></span>
          <h4 className="home-section-title">Daily Goal</h4>
        </div>
        <div className="home-goal-row">
          <div className="home-goal-info">
            <h4>Read 1 page today</h4>
            <p>Keep your streak going</p>
          </div>
          <div className="home-goal-badge">0 / 1</div>
        </div>
        <div className="home-progress-bar">
          <div className="home-progress-fill" style={{ width: '0%' }} />
        </div>
      </div>

      {/* Reflection */}
      <div className="home-section-card" onClick={() => onNavigate?.('explore')}>
        <div className="home-section-header">
          <span className="home-section-icon"><IconStar /></span>
          <h4 className="home-section-title">Daily Reflection</h4>
        </div>
        <div className="home-continue-info">
          <div className="home-continue-text">
            <h4>The virtue of patience</h4>
            <p>Take a moment to reflect today</p>
          </div>
          <span className="home-continue-arrow"><IconChevron /></span>
        </div>
      </div>

      {/* Hadith */}
      <div className="home-hadith">
        <div className="home-hadith-deco">&ldquo;</div>
        <p className="home-hadith-text">
          The best among you are those who learn the Quran and teach it.
        </p>
        <p className="home-hadith-source">Sahih al-Bukhari</p>
      </div>

      <div className="home-spacer" />
    </div>
  );
}

// ─── Arabic Chapter Names ──────────────────────────────────

const ARABIC_NAMES = {
  1: '\u0627\u0644\u0641\u0627\u062A\u062D\u0629', 2: '\u0627\u0644\u0628\u0642\u0631\u0629',
  3: '\u0622\u0644 \u0639\u0645\u0631\u0627\u0646', 4: '\u0627\u0644\u0646\u0633\u0627\u0621',
  5: '\u0627\u0644\u0645\u0627\u0626\u062F\u0629', 6: '\u0627\u0644\u0623\u0646\u0639\u0627\u0645',
  7: '\u0627\u0644\u0623\u0639\u0631\u0627\u0641', 8: '\u0627\u0644\u0623\u0646\u0641\u0627\u0644',
  9: '\u0627\u0644\u062A\u0648\u0628\u0629', 10: '\u064A\u0648\u0646\u0633',
  11: '\u0647\u0648\u062F', 12: '\u064A\u0648\u0633\u0641',
  13: '\u0627\u0644\u0631\u0639\u062F', 14: '\u0625\u0628\u0631\u0627\u0647\u064A\u0645',
  15: '\u0627\u0644\u062D\u062C\u0631', 16: '\u0627\u0644\u0646\u062D\u0644',
  17: '\u0627\u0644\u0625\u0633\u0631\u0627\u0621', 18: '\u0627\u0644\u0643\u0647\u0641',
  19: '\u0645\u0631\u064A\u0645', 20: '\u0637\u0647',
  21: '\u0627\u0644\u0623\u0646\u0628\u064A\u0627\u0621', 22: '\u0627\u0644\u062D\u062C',
  23: '\u0627\u0644\u0645\u0624\u0645\u0646\u0648\u0646', 24: '\u0627\u0644\u0646\u0648\u0631',
  25: '\u0627\u0644\u0641\u0631\u0642\u0627\u0646', 26: '\u0627\u0644\u0634\u0639\u0631\u0627\u0621',
  27: '\u0627\u0644\u0646\u0645\u0644', 28: '\u0627\u0644\u0642\u0635\u0635',
  29: '\u0627\u0644\u0639\u0646\u0643\u0628\u0648\u062A', 30: '\u0627\u0644\u0631\u0648\u0645',
  31: '\u0644\u0642\u0645\u0627\u0646', 32: '\u0627\u0644\u0633\u062C\u062F\u0629',
  33: '\u0627\u0644\u0623\u062D\u0632\u0627\u0628', 34: '\u0633\u0628\u0623',
  35: '\u0641\u0627\u0637\u0631', 36: '\u064A\u0633',
  37: '\u0627\u0644\u0635\u0627\u0641\u0627\u062A', 38: '\u0635',
  39: '\u0627\u0644\u0632\u0645\u0631', 40: '\u063A\u0627\u0641\u0631',
  41: '\u0641\u0635\u0644\u062A', 42: '\u0627\u0644\u0634\u0648\u0631\u0649',
  43: '\u0627\u0644\u0632\u062E\u0631\u0641', 44: '\u0627\u0644\u062F\u062E\u0627\u0646',
  45: '\u0627\u0644\u062C\u0627\u062B\u064A\u0629', 46: '\u0627\u0644\u0623\u062D\u0642\u0627\u0641',
  47: '\u0645\u062D\u0645\u062F', 48: '\u0627\u0644\u0641\u062A\u062D',
  49: '\u0627\u0644\u062D\u062C\u0631\u0627\u062A', 50: '\u0642',
  51: '\u0627\u0644\u0630\u0627\u0631\u064A\u0627\u062A', 52: '\u0627\u0644\u0637\u0648\u0631',
  53: '\u0627\u0644\u0646\u062C\u0645', 54: '\u0627\u0644\u0642\u0645\u0631',
  55: '\u0627\u0644\u0631\u062D\u0645\u0646', 56: '\u0627\u0644\u0648\u0627\u0642\u0639\u0629',
  57: '\u0627\u0644\u062D\u062F\u064A\u062F', 58: '\u0627\u0644\u0645\u062C\u0627\u062F\u0644\u0629',
  59: '\u0627\u0644\u062D\u0634\u0631', 60: '\u0627\u0644\u0645\u0645\u062A\u062D\u0646\u0629',
  61: '\u0627\u0644\u0635\u0641', 62: '\u0627\u0644\u062C\u0645\u0639\u0629',
  63: '\u0627\u0644\u0645\u0646\u0627\u0641\u0642\u0648\u0646', 64: '\u0627\u0644\u062A\u063A\u0627\u0628\u0646',
  65: '\u0627\u0644\u0637\u0644\u0627\u0642', 66: '\u0627\u0644\u062A\u062D\u0631\u064A\u0645',
  67: '\u0627\u0644\u0645\u0644\u0643', 68: '\u0627\u0644\u0642\u0644\u0645',
  69: '\u0627\u0644\u062D\u0627\u0642\u0629', 70: '\u0627\u0644\u0645\u0639\u0627\u0631\u062C',
  71: '\u0646\u0648\u062D', 72: '\u0627\u0644\u062C\u0646',
  73: '\u0627\u0644\u0645\u0632\u0645\u0644', 74: '\u0627\u0644\u0645\u062F\u062B\u0631',
  75: '\u0627\u0644\u0642\u064A\u0627\u0645\u0629', 76: '\u0627\u0644\u0625\u0646\u0633\u0627\u0646',
  77: '\u0627\u0644\u0645\u0631\u0633\u0644\u0627\u062A', 78: '\u0627\u0644\u0646\u0628\u0623',
  79: '\u0627\u0644\u0646\u0627\u0639\u064A\u0627\u062A', 80: '\u0639\u0628\u0633',
  81: '\u0627\u0644\u062A\u0643\u0648\u064A\u0631', 82: '\u0627\u0644\u0627\u0646\u0641\u0637\u0627\u0631',
  83: '\u0627\u0644\u0645\u0637\u0641\u0641\u064A\u0646', 84: '\u0627\u0644\u0627\u0646\u0634\u0642\u0627\u0642',
  85: '\u0627\u0644\u0628\u0631\u0648\u062C', 86: '\u0627\u0644\u0637\u0627\u0631\u0642',
  87: '\u0627\u0644\u0623\u0639\u0644\u0649', 88: '\u0627\u0644\u063A\u0627\u0634\u064A\u0629',
  89: '\u0627\u0644\u0641\u062C\u0631', 90: '\u0627\u0644\u0628\u0644\u062F',
  91: '\u0627\u0644\u0634\u0645\u0633', 92: '\u0627\u0644\u0644\u064A\u0644',
  93: '\u0627\u0644\u0636\u062D\u0649', 94: '\u0627\u0644\u0634\u0631\u062D',
  95: '\u0627\u0644\u062A\u064A\u0646', 96: '\u0627\u0644\u0639\u0644\u0642',
  97: '\u0627\u0644\u0642\u062F\u0631', 98: '\u0627\u0644\u0628\u064A\u0646\u0629',
  99: '\u0627\u0644\u0632\u0644\u0632\u0644\u0629', 100: '\u0627\u0644\u0639\u0627\u062F\u064A\u0627\u062A',
  101: '\u0627\u0644\u0642\u0627\u0631\u0639\u0629', 102: '\u0627\u0644\u062A\u0643\u0627\u062B\u0631',
  103: '\u0627\u0644\u0639\u0635\u0631', 104: '\u0627\u0644\u0647\u0645\u0632\u0629',
  105: '\u0627\u0644\u0641\u064A\u0644', 106: '\u0642\u0631\u064A\u0634',
  107: '\u0627\u0644\u0645\u0627\u0639\u0648\u0646', 108: '\u0627\u0644\u0643\u0648\u062B\u0631',
  109: '\u0627\u0644\u0643\u0627\u0641\u0631\u0648\u0646', 110: '\u0627\u0644\u0646\u0635\u0631',
  111: '\u0627\u0644\u0645\u0633\u062F', 112: '\u0627\u0644\u0625\u062E\u0644\u0627\u0635',
  113: '\u0627\u0644\u0641\u0644\u0642', 114: '\u0627\u0644\u0646\u0627\u0633',
};

const getArabicChapterName = (id) => ARABIC_NAMES[id] || '\u0633\u0648\u0631\u0629';

// ─── Additional Quran Icons ────────────────────────────────

const IconMoreVert = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" />
  </svg>
);

const IconStop = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);

const IconNote = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

// ─── Available Reciters (from QF Chapter Reciters API) ─────

const RECITERS = [
  { id: 7, name: 'Mishary al-Afasy', style: 'Murattal' },
  { id: 6, name: 'Mahmoud Al-Husary', style: 'Murattal' },
  { id: 12, name: 'Al-Husary (Muallim)', style: 'Muallim' },
];

// ─── Ayah Dropdown Menu ───────────────────────────────────

function AyahDropdownMenu({ ayah, surahNumber, surahName, anchorRef, onClose, onPlayAyah, ayahPlaying }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);
  const [tafsirText, setTafsirText] = useState('');
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [tafsirError, setTafsirError] = useState('');
  const [tafsirSource, setTafsirSource] = useState(169);
  const [tafsirCache, setTafsirCache] = useState({});
  const [copied, setCopied] = useState(false);
  const menuRef = useRef(null);

  const verseKey = `${surahNumber}:${ayah.numberInSurah}`;

  // Load bookmark state
  useEffect(() => {
    try {
      const bm = JSON.parse(localStorage.getItem('ayahBookmarks') || '{}');
      setBookmarked(!!bm[verseKey]);
    } catch {}
  }, [verseKey]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          anchorRef?.current && !anchorRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, anchorRef]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const toggleBookmark = () => {
    try {
      const bm = JSON.parse(localStorage.getItem('ayahBookmarks') || '{}');
      if (bm[verseKey]) { delete bm[verseKey]; setBookmarked(false); }
      else { bm[verseKey] = { surah: surahName, ayah: ayah.numberInSurah, ts: Date.now() }; setBookmarked(true); }
      localStorage.setItem('ayahBookmarks', JSON.stringify(bm));
    } catch {}
  };

  const loadTafsir = (srcId) => {
    setTafsirLoading(true);
    setTafsirError('');
    setTafsirText('');
    setTafsirSource(srcId);
    const cacheKey = `${srcId}_${surahNumber}`;
    if (tafsirCache[cacheKey]) {
      const entry = tafsirCache[cacheKey].find(t => t.verse_key === verseKey || t.verse_number === ayah.numberInSurah);
      setTafsirText(entry?.text || 'Tafsir not available for this ayah.');
      setTafsirLoading(false);
      return;
    }
    fetch(`http://localhost:3001/api/tafsir/${srcId}/by_chapter/${surahNumber}`)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then(data => {
        const entries = data?.tafsirs || [];
        setTafsirCache(prev => ({ ...prev, [cacheKey]: entries }));
        const entry = entries.find(t => t.verse_key === verseKey || t.verse_number === ayah.numberInSurah);
        setTafsirText(entry?.text || 'Tafsir not available for this ayah.');
      })
      .catch(() => setTafsirError('Could not load tafsir. Server may be offline.'))
      .finally(() => setTafsirLoading(false));
  };

  const handleTafsir = () => {
    if (showTafsir) { setShowTafsir(false); return; }
    setShowTafsir(true);
    loadTafsir(tafsirSource);
  };

  const handleCopy = () => {
    const text = `${ayah.text}\n\n${ayah.translation}\n\n— Quran ${verseKey}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }).catch(() => {});
  };

  const handleShare = () => {
    const text = `${ayah.text}\n\n${ayah.translation}\n\n— Quran ${verseKey}`;
    if (navigator.share) {
      navigator.share({ title: `Quran ${verseKey}`, text }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="ayah-dropdown" ref={menuRef} onClick={e => e.stopPropagation()}>
      <div className="ayah-dropdown-header">
        <span className="ayah-dropdown-verse">Ayah {ayah.numberInSurah}</span>
        <button className="ayah-dropdown-close" onClick={onClose}><IconX /></button>
      </div>
      <div className="ayah-dropdown-items">
        <button className={`ayah-dropdown-item ${bookmarked ? 'active' : ''}`} onClick={toggleBookmark}>
          <IconBookmarkFill filled={bookmarked} />
          <span>{bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
        </button>
        <button className={`ayah-dropdown-item ${ayahPlaying ? 'active' : ''}`} onClick={() => onPlayAyah(ayah)}>
          {ayahPlaying ? <IconPause /> : <IconPlaySmall />}
          <span>{ayahPlaying ? 'Pause Ayah' : 'Play Ayah'}</span>
        </button>
        <button className={`ayah-dropdown-item ${showTafsir ? 'active' : ''}`} onClick={handleTafsir}>
          <IconTafsir />
          <span>Tafsir</span>
        </button>
        <button className={`ayah-dropdown-item ${copied ? 'active' : ''}`} onClick={handleCopy}>
          {copied ? <IconCheck /> : <IconCopy />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
        <button className="ayah-dropdown-item" onClick={handleShare}>
          <IconShare />
          <span>Share</span>
        </button>
        <button className="ayah-dropdown-item" disabled>
          <IconNote />
          <span>Reflect</span>
        </button>
      </div>

      {showTafsir && (
        <div className="ayah-tafsir-section">
          <div className="ayah-tafsir-header">
            <span className="ayah-tafsir-title">Tafsir</span>
            <div className="ayah-tafsir-sources">
              <button className={`ayah-tafsir-src ${tafsirSource === 169 ? 'active' : ''}`} onClick={() => loadTafsir(169)}>Ibn Kathir</button>
              <button className={`ayah-tafsir-src ${tafsirSource === 171 ? 'active' : ''}`} onClick={() => loadTafsir(171)}>Jalalayn</button>
            </div>
          </div>
          <div className="ayah-tafsir-body">
            {tafsirLoading && <p className="ayah-tafsir-loading">Loading tafsir&hellip;</p>}
            {tafsirError && <p className="ayah-tafsir-error">{tafsirError}</p>}
            {!tafsirLoading && !tafsirError && tafsirText && (
              <div className="ayah-tafsir-text" dangerouslySetInnerHTML={{ __html: tafsirText }} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Quran Component ───────────────────────────────────────

function Quran() {
  const { settings } = useSettings();
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(() => {
    try {
      const saved = localStorage.getItem('lastReadSurah');
      return saved ? JSON.parse(saved).number || 1 : 1;
    } catch { return 1; }
  });
  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const [error, setError] = useState(null);

  // ── Menu state ──
  const [openMenuAyah, setOpenMenuAyah] = useState(null);
  const menuAnchorRefs = useRef({});

  // ── Audio state (unified) ──
  const [audioMode, setAudioMode] = useState(null); // null | 'surah' | 'ayah'
  const [audioState, setAudioState] = useState('idle'); // 'idle' | 'loading' | 'playing' | 'paused'
  const [currentAyahAudio, setCurrentAyahAudio] = useState(null); // verse number being played
  const [selectedReciter, setSelectedReciter] = useState(7);
  const audioRef = useRef(null);
  const audioTimeupdateRef = useRef(null);

  // ── Cleanup audio ──
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      if (audioTimeupdateRef.current) {
        audioRef.current.removeEventListener('timeupdate', audioTimeupdateRef.current);
      }
      audioRef.current = null;
    }
    audioTimeupdateRef.current = null;
    setAudioMode(null);
    setAudioState('idle');
    setCurrentAyahAudio(null);
  };

  // ── Play single ayah ──
  const playAyah = (ayah) => {
    if (!surah) return;
    // If clicking same ayah that's playing, toggle pause
    if (audioMode === 'ayah' && currentAyahAudio === ayah.number) {
      if (audioState === 'playing') {
        audioRef.current?.pause();
        setAudioState('paused');
        return;
      }
      if (audioState === 'paused') {
        audioRef.current?.play();
        setAudioState('playing');
        return;
      }
    }
    // Stop any existing audio first
    stopAudio();
    setAudioMode('ayah');
    setCurrentAyahAudio(ayah.number);
    setAudioState('loading');

    const verseKey = `${surah.number}:${ayah.numberInSurah}`;
    fetch(`http://localhost:3001/api/audio/verse/${selectedReciter}/${surah.number}`)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then(data => {
        const files = data?.audio_files;
        if (!files || !files.length) throw new Error('No audio data');
        const match = files.find(f => f.verse_key === verseKey);
        if (!match) throw new Error('Verse not found');
        const audioUrl = match.url.startsWith('http') ? match.url : `https://audio.qurancdn.com/${match.url}`;

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.addEventListener('canplaythrough', () => {
          audio.play().then(() => setAudioState('playing')).catch(() => stopAudio());
        }, { once: true });

        audio.onended = () => stopAudio();
        audio.onerror = () => stopAudio();
        audio.load();
      })
      .catch(() => stopAudio());
  };

  // ── Play full surah ──
  const playSurah = () => {
    if (!surah) return;
    if (audioMode === 'surah') {
      if (audioState === 'playing') {
        audioRef.current?.pause();
        setAudioState('paused');
        return;
      }
      if (audioState === 'paused') {
        audioRef.current?.play();
        setAudioState('playing');
        return;
      }
    }
    stopAudio();
    setAudioMode('surah');
    setAudioState('loading');

    fetch(`http://localhost:3001/api/audio/chapter/${selectedReciter}/${surah.number}`)
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then(data => {
        const audioFile = data?.audio_file;
        if (!audioFile || !audioFile.audio_url) throw new Error('No audio data');
        const audioUrl = audioFile.audio_url.startsWith('http') ? audioFile.audio_url : `https://audio.qurancdn.com/${audioFile.audio_url}`;

        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.addEventListener('canplaythrough', () => {
          audio.play().then(() => setAudioState('playing')).catch(() => stopAudio());
        }, { once: true });

        audio.onended = () => stopAudio();
        audio.onerror = () => stopAudio();
        audio.load();
      })
      .catch(() => stopAudio());
  };

  // Cleanup on unmount or surah change
  useEffect(() => { return () => stopAudio(); }, []);
  useEffect(() => { stopAudio(); setOpenMenuAyah(null); }, [selectedSurah]);

  useEffect(() => {
    fetch('http://localhost:3001/api/chapters')
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then(data => {
        if (data.chapters) {
          setSurahs(data.chapters.map(ch => ({
            id: ch.id, chapter_number: ch.id,
            name: getArabicChapterName(ch.id),
            name_simple: ch.english_name || 'Chapter',
          })));
        }
      })
      .catch(err => setError(`Failed to load chapters: ${err.message}`))
      .finally(() => setLoadingSurahs(false));
  }, []);

  useEffect(() => {
    if (!selectedSurah || surahs.length === 0) return;
    setLoading(true);
    setError(null);

    fetch(`http://localhost:3001/api/chapters/${selectedSurah}/verses/${settings.translationId}`)
      .then(r => {
        if (r.status === 404) throw new Error('This surah is not yet available in the current API tier. Chapters 1\u20132 are available.');
        if (!r.ok) throw new Error(`Backend returned ${r.status}`);
        return r.json();
      })
      .then(data => {
        if (!data.verses) throw new Error('No verses found');
        const chapterInfo = surahs.find(s => s.id === selectedSurah);
        const getArabicText = (v) => {
          if (settings.scriptStyle === 'indopak') return v.text_indopak || v.text_uthmani;
          if (settings.scriptStyle === 'simple') return v.text_simple || v.text_uthmani;
          return v.text_uthmani;
        };
        const surahData = {
          number: selectedSurah,
          englishName: chapterInfo?.name_simple || 'Chapter',
          name: chapterInfo?.name || '\u0633\u0648\u0631\u0629',
          ayahs: data.verses.map(v => ({
            number: v.verse_number,
            numberInSurah: v.verse_number_in_surah || v.verse_number,
            text: getArabicText(v),
            translation: v.translation_text || 'Translation not available',
          })),
        };
        setSurah(surahData);
        localStorage.setItem('lastReadSurah', JSON.stringify({
          number: selectedSurah, name: surahData.englishName, ayah: 1
        }));
      })
      .catch(err => setError(`Failed to load verses: ${err.message}`))
      .finally(() => setLoading(false));
  }, [selectedSurah, surahs, settings.translationId, settings.scriptStyle]);

  const spacingValues = {
    compact: { gap: '6px', padding: '14px 14px 10px 44px' },
    normal: { gap: '14px', padding: '26px 26px 18px 58px' },
    spacious: { gap: '22px', padding: '32px 32px 24px 68px' },
    'very-spacious': { gap: '32px', padding: '40px 40px 32px 76px' },
  };
  const currentSpacing = spacingValues[settings.spacing] || spacingValues.normal;
  const scriptClass = SCRIPT_CLASS_MAP[settings.scriptStyle] || 'script-uthmani';
  const scale = settings.globalTextScale || 1;

  const toggleMenu = (ayahNum) => {
    setOpenMenuAyah(prev => prev === ayahNum ? null : ayahNum);
  };

  const isSurahPlaying = audioMode === 'surah' && audioState === 'playing';
  const isSurahPaused = audioMode === 'surah' && audioState === 'paused';
  const isSurahLoading = audioMode === 'surah' && audioState === 'loading';

  return (
    <div className={`quran-screen layout-${settings.layoutMode}`}>
      <div className="quran-container">
        <div className="surah-selector-wrapper">
          <div className="surah-selector-title">Surahs</div>
          <div className="surah-list">
            {loadingSurahs ? (
              <p className="loading-text">Loading...</p>
            ) : surahs.map(s => (
              <button key={s.id}
                className={`surah-item ${selectedSurah === s.id ? 'active' : ''}`}
                onClick={() => setSelectedSurah(s.id)}>
                <span className="surah-item-number">{s.chapter_number}</span>
                <div className="surah-item-text">
                  <div className="surah-item-name">{s.name_simple}</div>
                  <div className="surah-item-arabic">{s.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={`quran-reader view-${settings.viewMode}`}>
          {error && <div className="reader-error"><p>{error}</p></div>}

          {!error && surah && (
            <>
              <div className="reader-header">
                <h2 style={{ fontSize: `${2 * scale}rem` }}>{surah.englishName}</h2>
                <p className={`surah-arabic ${scriptClass}`}>{surah.name}</p>
                <p className="surah-info">Surah {surah.number} &middot; {surah.ayahs.length} Ayahs</p>

                {/* ─── Surah Audio Controls ─── */}
                <div className="surah-audio-bar">
                  <button
                    className={`surah-play-btn ${isSurahPlaying ? 'playing' : ''} ${isSurahLoading ? 'loading' : ''}`}
                    onClick={playSurah}
                    disabled={isSurahLoading}
                  >
                    {isSurahLoading ? (
                      <><span className="surah-play-spinner" /> Loading...</>
                    ) : isSurahPlaying ? (
                      <><IconPause /> Pause Surah</>
                    ) : isSurahPaused ? (
                      <><IconPlaySmall /> Resume Surah</>
                    ) : (
                      <><IconPlaySmall /> Play Surah</>
                    )}
                  </button>
                  {(isSurahPlaying || isSurahPaused) && (
                    <button className="surah-stop-btn" onClick={stopAudio} title="Stop">
                      <IconStop />
                    </button>
                  )}
                  <select
                    className="surah-reciter-select"
                    value={selectedReciter}
                    onChange={e => { stopAudio(); setSelectedReciter(Number(e.target.value)); }}
                  >
                    {RECITERS.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {loading ? (
                <p className="loading-text">Loading...</p>
              ) : (
                <div className="ayahs-container" style={{ gap: currentSpacing.gap }}>
                  {surah.ayahs.map(ayah => {
                    const isMenuOpen = openMenuAyah === ayah.number;
                    const isAyahPlaying = audioMode === 'ayah' && currentAyahAudio === ayah.number && audioState === 'playing';
                    const isAyahActive = isMenuOpen || isAyahPlaying;
                    if (!menuAnchorRefs.current[ayah.number]) {
                      menuAnchorRefs.current[ayah.number] = { current: null };
                    }
                    return (
                      <div key={ayah.number}
                        className={`ayah-card ${settings.viewMode === 'flat' ? 'flat' : ''} ${isAyahActive ? 'ayah-active' : ''}`}
                        style={{ padding: currentSpacing.padding }}>
                        {settings.showAyahBadges && <div className="ayah-number">{ayah.numberInSurah}</div>}
                        <button
                          className={`ayah-more-btn ${isMenuOpen ? 'open' : ''}`}
                          ref={el => { menuAnchorRefs.current[ayah.number].current = el; }}
                          onClick={e => { e.stopPropagation(); toggleMenu(ayah.number); }}
                          title="Ayah actions"
                        >
                          <IconMoreVert />
                        </button>
                        <p className={`arabic-text ${scriptClass}`}
                          style={{
                            fontSize: `${settings.arabicSize * scale}rem`,
                            lineHeight: settings.arabicLineHeight,
                          }}>
                          {ayah.text}
                        </p>
                        {settings.showTranslation && (
                          <p className="translation-text"
                            style={{
                              fontSize: `${settings.translationSize * scale}rem`,
                              lineHeight: settings.translationLineHeight,
                            }}>
                            {ayah.translation}
                          </p>
                        )}
                        {isMenuOpen && (
                          <AyahDropdownMenu
                            ayah={ayah}
                            surahNumber={surah.number}
                            surahName={surah.englishName}
                            anchorRef={menuAnchorRefs.current[ayah.number]}
                            onClose={() => setOpenMenuAyah(null)}
                            onPlayAyah={playAyah}
                            ayahPlaying={isAyahPlaying}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Salah — Premium Global Prayer Times ───────────────────

function Salah() {
  const { settings } = useSettings();
  const scale = settings.globalTextScale || 1;

  const [location, setLocation] = useState(() => {
    try {
      const saved = localStorage.getItem('salahLocation');
      return saved ? JSON.parse(saved) : WORLD_CITIES[0];
    } catch { return WORLD_CITIES[0]; }
  });
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [calcMethod, setCalcMethod] = useState('MWL');
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    localStorage.setItem('salahLocation', JSON.stringify(location));
  }, [location]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Build today's prayer schedule
  const mockTimes = generateMockTimes(location.id);
  const prayers = PRAYER_DEFS.map(d => ({ ...d, time: mockTimes[d.idx] }));

  const nextPrayer = prayers.find(p => p.isPrayer && p.time > now);
  const prevPrayer = [...prayers].reverse().find(p => p.isPrayer && p.time <= now);

  // Countdown
  const countdown = nextPrayer ? Math.max(0, nextPrayer.time.getTime() - now.getTime()) : 0;
  const cdH = Math.floor(countdown / 3600000);
  const cdM = Math.floor((countdown % 3600000) / 60000);
  const cdS = Math.floor((countdown % 60000) / 1000);

  // Progress between previous and next
  let progress = 0;
  if (nextPrayer && prevPrayer) {
    const total = nextPrayer.time.getTime() - prevPrayer.time.getTime();
    if (total > 0) progress = Math.min(100, ((now.getTime() - prevPrayer.time.getTime()) / total) * 100);
  }

  // Dates
  let hijriDate = '';
  try {
    hijriDate = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(now);
  } catch {}
  const gregorianDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  const isFriday = now.getDay() === 5;
  const daysToFriday = isFriday ? 0 : ((5 - now.getDay() + 7) % 7);

  const filteredCities = citySearch.trim()
    ? WORLD_CITIES.filter(c =>
        c.name.toLowerCase().includes(citySearch.toLowerCase()) ||
        c.country.toLowerCase().includes(citySearch.toLowerCase()))
    : WORLD_CITIES;

  const allPassed = !nextPrayer;
  const prayerCount = prayers.filter(p => p.isPrayer).length;
  const passedCount = prayers.filter(p => p.isPrayer && p.time <= now).length;

  return (
    <div className="salah-page" style={{ fontSize: `${scale}rem` }}>

      {/* ── Location Header ── */}
      <div className="salah-location">
        <div className="salah-location-main">
          <span className="salah-location-pin"><IconMapPin /></span>
          <div className="salah-location-text">
            <h3 className="salah-city">{location.name}, {location.country}</h3>
            <p className="salah-tz">{location.tz.replace(/_/g, ' ')}</p>
          </div>
          <button className="salah-location-btn" onClick={() => setShowLocationModal(true)}>Change</button>
        </div>
        <div className="salah-date-row">
          {hijriDate && <span className="salah-hijri">{hijriDate}</span>}
          {hijriDate && gregorianDate && <span className="salah-date-sep">&middot;</span>}
          <span className="salah-gregorian">{gregorianDate}</span>
        </div>
      </div>

      {/* ── Next Prayer Card ── */}
      <div className={`salah-next-card ${allPassed ? 'completed' : ''}`}>
        {allPassed ? (
          <>
            <div className="salah-next-label">Today&rsquo;s Prayers</div>
            <div className="salah-next-name">Completed</div>
            <p className="salah-next-subtitle">All {prayerCount} prayers for today have passed</p>
          </>
        ) : (
          <>
            <div className="salah-next-label">Up Next</div>
            <div className="salah-next-name">{nextPrayer.name}</div>
            <div className="salah-next-arabic">{nextPrayer.arabic}</div>
            <div className="salah-next-time">{formatPrayerTime(nextPrayer.time)}</div>
            <div className="salah-next-progress">
              <div className="salah-next-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="salah-next-countdown">
              {cdH > 0 && <span className="salah-cd-seg">{cdH}<small>h</small></span>}
              <span className="salah-cd-seg">{String(cdM).padStart(2, '0')}<small>m</small></span>
              <span className="salah-cd-seg">{String(cdS).padStart(2, '0')}<small>s</small></span>
            </div>
          </>
        )}
      </div>

      {/* ── Today's Summary ── */}
      <div className="salah-summary">
        <span>{prayerCount} daily prayers</span>
        <span className="salah-summary-dot">&middot;</span>
        <span>{passedCount} completed</span>
        {!allPassed && nextPrayer && (
          <>
            <span className="salah-summary-dot">&middot;</span>
            <span>Next: {nextPrayer.name}</span>
          </>
        )}
      </div>

      {/* ── Prayer Schedule ── */}
      <div className="salah-schedule">
        <div className="salah-schedule-label">Today&rsquo;s Schedule</div>
        <div className="salah-schedule-list">
          {prayers.map(p => {
            const isPassed = p.time <= now;
            const isNext = nextPrayer && p.key === nextPrayer.key;
            return (
              <div key={p.key} className={`salah-row ${isPassed ? 'passed' : ''} ${isNext ? 'next' : ''} ${!p.isPrayer ? 'non-prayer' : ''}`}>
                <div className="salah-row-left">
                  {isNext && <span className="salah-row-dot" />}
                  <span className="salah-row-name">{p.name}</span>
                  <span className="salah-row-arabic">{p.arabic}</span>
                </div>
                <div className="salah-row-right">
                  <span className="salah-row-time">{formatPrayerTime(p.time)}</span>
                  {isPassed && p.isPrayer && <span className="salah-row-badge passed">Passed</span>}
                  {isNext && <span className="salah-row-badge next">Next</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Info Footer ── */}
      <div className="salah-footer-grid">
        <div className="salah-footer-card">
          <span className="salah-footer-icon"><IconCompass /></span>
          <span className="salah-footer-label">Qibla Direction</span>
          <span className="salah-footer-value">Coming soon</span>
        </div>
        <div className="salah-footer-card">
          <span className="salah-footer-icon"><IconMasjid /></span>
          <span className="salah-footer-label">{isFriday ? "Jumu\u2019ah Today" : "Jumu\u2019ah"}</span>
          <span className="salah-footer-value">{isFriday ? 'At Dhuhr time' : `In ${daysToFriday} day${daysToFriday > 1 ? 's' : ''}`}</span>
        </div>
      </div>

      {/* ── Calculation Method ── */}
      <div className="salah-method-row">
        <div className="salah-method-info">
          <span className="salah-method-label">Calculation</span>
          <select className="salah-method-select settings-select" value={calcMethod} onChange={e => setCalcMethod(e.target.value)}>
            {CALC_METHODS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <p className="salah-method-note">Scaffold data &middot; Connect API for live times</p>
      </div>

      {/* ── Location Modal ── */}
      {showLocationModal && (
        <div className="settings-overlay" onClick={() => { setShowLocationModal(false); setCitySearch(''); }}>
          <div className="salah-modal" onClick={e => e.stopPropagation()}>
            <div className="settings-header">
              <h3>Select Location</h3>
              <button className="settings-close" onClick={() => { setShowLocationModal(false); setCitySearch(''); }}>&times;</button>
            </div>
            <div className="salah-modal-search">
              <span className="salah-modal-search-icon"><IconSearchSmall /></span>
              <input
                type="text"
                className="salah-modal-input"
                placeholder="Search city or country\u2026"
                value={citySearch}
                onChange={e => setCitySearch(e.target.value)}
                autoFocus
              />
            </div>
            <div className="salah-modal-list">
              {filteredCities.map(c => (
                <button
                  key={c.id}
                  className={`salah-modal-city ${location.id === c.id ? 'active' : ''}`}
                  onClick={() => { setLocation(c); setShowLocationModal(false); setCitySearch(''); }}
                >
                  <span className="salah-modal-city-name">{c.name}</span>
                  <span className="salah-modal-city-country">{c.country}</span>
                </button>
              ))}
              {filteredCities.length === 0 && (
                <p className="salah-modal-empty">No cities found for &ldquo;{citySearch}&rdquo;</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="salah-spacer" />
    </div>
  );
}

// ─── Stub Pages ────────────────────────────────────────────

function Explore() {
  const { settings } = useSettings();
  const scale = settings.globalTextScale || 1;
  return (
    <div className="screen" style={{ fontSize: `${scale}rem` }}>
      <h1>Explore</h1>
      <p>Discover Islamic knowledge, articles, and community features.</p>
    </div>
  );
}

// ─── App Shell ─────────────────────────────────────────────

function AppShell({ tab, setTab }) {
  const { settings, showSettings, setShowSettings } = useSettings();

  // Apply custom accent via CSS custom properties
  const appStyle = {};
  if (settings.customAccent) {
    appStyle['--custom-accent-color'] = settings.customAccent;
    // Compute a lighter hover variant
    appStyle['--custom-accent-hover'] = settings.customAccent + 'cc';
  }

  return (
    <div
      className={`app theme-${settings.theme}`}
      data-custom-accent={settings.customAccent ? 'true' : 'false'}
      style={appStyle}
    >
      {/* Global settings button — top-right, always visible */}
      <button className="global-settings-btn" onClick={() => setShowSettings(true)} title="Settings">
        <IconGear />
      </button>

      {showSettings && <SettingsPanel />}

      <div className="content">
        {tab === "home" && <Home onNavigate={setTab} />}
        {tab === "quran" && <Quran />}
        {tab === "salah" && <Salah />}
        {tab === "explore" && <Explore />}
      </div>

      <nav className="nav">
        <button className={tab === "home" ? "active" : ""} onClick={() => setTab("home")}>
          <IconHome /><span>Home</span>
        </button>
        <button className={tab === "quran" ? "active" : ""} onClick={() => setTab("quran")}>
          <IconQuran /><span>Quran</span>
        </button>
        <button className={tab === "salah" ? "active" : ""} onClick={() => setTab("salah")}>
          <IconPrayer /><span>Salah</span>
        </button>
        <button className={tab === "explore" ? "active" : ""} onClick={() => setTab("explore")}>
          <IconExplore /><span>Explore</span>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(() => localStorage.getItem('activeTab') || 'home');

  useEffect(() => {
    localStorage.setItem('activeTab', tab);
  }, [tab]);

  return (
    <SettingsProvider>
      <AppShell tab={tab} setTab={setTab} />
    </SettingsProvider>
  );
}
