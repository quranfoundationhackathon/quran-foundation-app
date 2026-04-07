 import { useState, useEffect } from "react";
import "./App.css";

function Home() {
  return (
    <div className="screen">
      <h1>Home</h1>
      <p>Welcome to your Islamic app. Explore Quran, Salah times, and more.</p>
    </div>
  );
}

// Helper: Get Arabic name for chapter by ID
const getArabicChapterName = (chapterId) => {
  const arabicNames = {
    1: 'الفاتحة',
    2: 'البقرة',
    3: 'آل عمران',
    4: 'النساء',
    5: 'المائدة',
    6: 'الأنعام',
    7: 'الأعراف',
    8: 'الأنفال',
    9: 'التوبة',
    10: 'يونس',
    11: 'هود',
    12: 'يوسف',
    13: 'الرعد',
    14: 'إبراهيم',
    15: 'الحجر',
    16: 'النحل',
    17: 'الإسراء',
    18: 'الكهف',
    19: 'مريم',
    20: 'طه',
    21: 'الأنبياء',
    22: 'الحج',
    23: 'المؤمنون',
    24: 'النور',
    25: 'الفرقان',
    26: 'الشعراء',
    27: 'النمل',
    28: 'القصص',
    29: 'العنكبوت',
    30: 'الروم',
    31: 'لقمان',
    32: 'السجدة',
    33: 'الأحزاب',
    34: 'سبأ',
    35: 'فاطر',
    36: 'يس',
    37: 'الصافات',
    38: 'ص',
    39: 'الزمر',
    40: 'غافر',
    41: 'فصلت',
    42: 'الشورى',
    43: 'الزخرف',
    44: 'الدخان',
    45: 'الجاثية',
    46: 'الأحقاف',
    47: 'محمد',
    48: 'الفتح',
    49: 'الحجرات',
    50: 'ق',
    51: 'الذاريات',
    52: 'الطور',
    53: 'النجم',
    54: 'القمر',
    55: 'الرحمن',
    56: 'الواقعة',
    57: 'الحديد',
    58: 'المجادلة',
    59: 'الحشر',
    60: 'الممتحنة',
    61: 'الصف',
    62: 'الجمعة',
    63: 'المنافقون',
    64: 'التغابن',
    65: 'الطلاق',
    66: 'التحريم',
    67: 'الملك',
    68: 'القلم',
    69: 'الحاقة',
    70: 'المعارج',
    71: 'نوح',
    72: 'الجن',
    73: 'المزمل',
    74: 'المدثر',
    75: 'القيامة',
    76: 'الإنسان',
    77: 'المرسلات',
    78: 'النبأ',
    79: 'الناعيات',
    80: 'عبس',
    81: 'التكوير',
    82: 'الانفطار',
    83: 'المطففين',
    84: 'الانشقاق',
    85: 'البروج',
    86: 'الطارق',
    87: 'الأعلى',
    88: 'الغاشية',
    89: 'الفجر',
    90: 'البلد',
    91: 'الشمس',
    92: 'الليل',
    93: 'الضحى',
    94: 'الشرح',
    95: 'التين',
    96: 'العلق',
    97: 'القدر',
    98: 'البينة',
    99: 'الزلزلة',
    100: 'العاديات',
    101: 'القارعة',
    102: 'التكاثر',
    103: 'العصر',
    104: 'الهمزة',
    105: 'الفيل',
    106: 'قريش',
    107: 'الماعون',
    108: 'الكوثر',
    109: 'الكافرون',
    110: 'النصر',
    111: 'المسد',
    112: 'الإخلاص',
    113: 'الفلق',
    114: 'الناس',
  };
  return arabicNames[chapterId] || 'سورة';
};

function Quran() {
  const [surahs, setSurahs] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(1);
  const [surah, setSurah] = useState(null);
  const [translation, setTranslation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSurahs, setLoadingSurahs] = useState(true);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // Settings state with defaults
  const defaultSettings = {
    theme: 'dark-navy',
    arabicSize: 1.9,
    arabicLineHeight: 2.6,
    translationSize: 1,
    showTranslation: true,
    showAyahBadges: true,
    viewMode: 'card', // 'card' or 'flat'
    spacing: 'normal', // 'compact', 'normal', 'spacious'
    layoutMode: 'normal', // 'normal' or 'wide'
    scriptStyle: 'uthmani', // 'uthmani', 'indopak', 'simple', 'naskh'
    translationId: 131, // Default: Sahih International
  };

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('quranReaderSettings');
    // Merge saved settings with defaults to ensure new fields are always present
    return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
  });

  const [availableTranslations, setAvailableTranslations] = useState([]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('quranReaderSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  // Fetch all chapters from backend
  useEffect(() => {
    const fetchAllChapters = async () => {
      try {
        const response = await fetch(
          'http://localhost:3001/api/chapters'
        );

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.chapters) {
          console.log('Raw chapters from backend:', data.chapters[0]); // Debug
          // Map backend chapters to our format
          const mappedChapters = data.chapters.map((chapter) => ({
            id: chapter.id,
            chapter_number: chapter.id,
            name: getArabicChapterName(chapter.id), // Get Arabic name for chapter
            name_simple: chapter.english_name || 'Chapter',
          }));
          console.log('Mapped chapters:', mappedChapters[0]); // Debug
          setSurahs(mappedChapters);
        } else {
          throw new Error('Invalid response structure from API');
        }
      } catch (err) {
        console.error('Error fetching chapters:', err);
        setError(
          `Failed to load Quran chapters: ${err.message}`
        );
      } finally {
        setLoadingSurahs(false);
      }
    };

    fetchAllChapters();
  }, []);

  // Fetch selected surah verses from backend
  useEffect(() => {
    const fetchSurahVerses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch surah verses from backend with selected translation
        const response = await fetch(
          `http://localhost:3001/api/chapters/${selectedSurah}/verses/${settings.translationId}`
        );

        if (!response.ok) {
          throw new Error(
            `Backend returned ${response.status}: ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.verses) {
          console.log('Raw verses from backend:', data.verses[0]); // Debug
          // Find the chapter info from surahs state
          const chapterInfo = surahs.find(
            (s) => s.id === selectedSurah
          );

          // Determine which Arabic text field to use based on script style
          const getArabicText = (verse) => {
            switch (settings.scriptStyle) {
              case 'indopak':
                return verse.text_indopak || verse.text_uthmani;
              case 'simple':
                return verse.text_simple || verse.text_uthmani;
              case 'uthmani':
              default:
                return verse.text_uthmani;
            }
          };

          // Create surah object with verses
          const surahData = {
            number: selectedSurah,
            englishName: chapterInfo?.name_simple || 'Chapter',
            name: chapterInfo?.name || 'سورة',
            ayahs: data.verses.map((verse) => ({
              number: verse.verse_number, // Use correct field name
              numberInSurah: verse.verse_number_in_surah || verse.verse_number, // Try both possible names
              text: getArabicText(verse), // Use correct Arabic text field
              words: verse.words || [],
              translations: verse.translations || [],
            })),
          };
          console.log('Mapped surah:', { number: surahData.number, englishName: surahData.englishName, ayahCount: surahData.ayahs.length, firstAyah: surahData.ayahs[0] }); // Debug

          setSurah(surahData);

          // For translation, extract the correct translation by ID from the translations array
          const translationData = {
            ayahs: data.verses.map((verse) => {
              // Find the translation matching the selected translation ID
              const selectedTranslation = verse.translations?.find(t => t.id === settings.translationId);
              return {
                number: verse.verse_number,
                text: selectedTranslation?.text || verse.translations?.[0]?.text || 'Translation not available',
              };
            }),
          };

          setTranslation(translationData);
        } else {
          throw new Error('No verses found in response');
        }
      } catch (err) {
        console.error('Error fetching surah verses:', err);
        setError(`Failed to load verses: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (selectedSurah && surahs.length > 0) {
      fetchSurahVerses();
    }
  }, [selectedSurah, surahs, settings.translationId]);

  // Fetch available translations from backend
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/translations');
        if (response.ok) {
          const data = await response.json();
          setAvailableTranslations(data.translations);
        }
      } catch (err) {
        console.error('Error fetching translations:', err);
      }
    };

    fetchTranslations();
  }, []);

  // Determine spacing values
  const spacingValues = {
    compact: { gap: '8px', padding: '16px 16px 12px 48px' },
    normal: { gap: '16px', padding: '28px 28px 20px 60px' },
    spacious: { gap: '24px', padding: '32px 32px 24px 70px' },
  };

  const currentSpacing = spacingValues[settings.spacing];

  return (
    <div className={`quran-screen theme-${settings.theme} layout-${settings.layoutMode}`}>
      {/* Settings Modal Overlay */}
      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h3>Reader Settings</h3>
              <button className="settings-close" onClick={() => setShowSettings(false)}>✕</button>
            </div>

            <div className="settings-content">
              {/* Theme Section */}
              <div className="settings-section">
                <h4 className="settings-section-title">Theme</h4>
                <div className="settings-options">
                  {[
                    { value: 'dark-navy', label: 'Dark Navy' },
                    { value: 'light', label: 'Light' },
                    { value: 'sepia', label: 'Sepia' },
                    { value: 'mushaf-green', label: 'Mushaf Green' },
                    { value: 'deep-dark', label: 'Deep Dark' },
                  ].map(option => (
                    <button
                      key={option.value}
                      className={`theme-option ${settings.theme === option.value ? 'active' : ''} theme-${option.value}`}
                      onClick={() => updateSetting('theme', option.value)}
                      title={option.label}
                    />
                  ))}
                </div>
              </div>

              {/* Arabic Text Section */}
              <div className="settings-section">
                <h4 className="settings-section-title">Arabic Text</h4>
                
                <div className="settings-control">
                  <label>Font Size: {settings.arabicSize.toFixed(1)}</label>
                  <input
                    type="range"
                    min="1.5"
                    max="2.5"
                    step="0.1"
                    value={settings.arabicSize}
                    onChange={(e) => updateSetting('arabicSize', parseFloat(e.target.value))}
                    className="settings-slider"
                  />
                </div>

                <div className="settings-control">
                  <label>Line Height: {settings.arabicLineHeight.toFixed(1)}</label>
                  <input
                    type="range"
                    min="2.0"
                    max="3.2"
                    step="0.2"
                    value={settings.arabicLineHeight}
                    onChange={(e) => updateSetting('arabicLineHeight', parseFloat(e.target.value))}
                    className="settings-slider"
                  />
                </div>

                <div className="settings-control">
                  <label>Script Style</label>
                  <select
                    value={settings.scriptStyle}
                    onChange={(e) => updateSetting('scriptStyle', e.target.value)}
                    className="settings-select"
                  >
                    <option value="uthmani">Uthmani</option>
                    <option value="indopak">Indo-Pak</option>
                    <option value="simple">Simple</option>
                    <option value="naskh">Naskh</option>
                  </select>
                </div>
              </div>

              {/* Translation Section */}
              <div className="settings-section">
                <h4 className="settings-section-title">Translation</h4>

                <div className="settings-control toggle">
                  <label>Show Translation</label>
                  <button
                    className={`toggle-btn ${settings.showTranslation ? 'on' : 'off'}`}
                    onClick={() => updateSetting('showTranslation', !settings.showTranslation)}
                  >
                    {settings.showTranslation ? 'ON' : 'OFF'}
                  </button>
                </div>

                {settings.showTranslation && (
                  <>
                    <div className="settings-control">
                      <label>Translation Version</label>
                      <select
                        value={settings.translationId}
                        onChange={(e) => updateSetting('translationId', parseInt(e.target.value))}
                        className="settings-select"
                      >
                        {availableTranslations.map(trans => (
                          <option key={trans.id} value={trans.id}>
                            {trans.name} ({trans.language})
                          </option>
                        ))}
                      </select>
                      {availableTranslations.find(t => t.id === settings.translationId)?.description && (
                        <small style={{ color: '#94a3b8', marginTop: '4px', display: 'block', fontSize: '0.85em' }}>
                          {availableTranslations.find(t => t.id === settings.translationId).description}
                        </small>
                      )}
                    </div>

                    <div className="settings-control">
                      <label>Font Size: {settings.translationSize.toFixed(1)}</label>
                      <input
                        type="range"
                        min="0.8"
                        max="1.4"
                        step="0.1"
                        value={settings.translationSize}
                        onChange={(e) => updateSetting('translationSize', parseFloat(e.target.value))}
                        className="settings-slider"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Layout Section */}
              <div className="settings-section">
                <h4 className="settings-section-title">Layout</h4>

                <div className="settings-control">
                  <label>Reader Width</label>
                  <div className="button-group">
                    <button
                      className={`btn-option ${settings.layoutMode === 'normal' ? 'active' : ''}`}
                      onClick={() => updateSetting('layoutMode', 'normal')}
                    >
                      Normal
                    </button>
                    <button
                      className={`btn-option ${settings.layoutMode === 'wide' ? 'active' : ''}`}
                      onClick={() => updateSetting('layoutMode', 'wide')}
                    >
                      Wide
                    </button>
                  </div>
                </div>

                <div className="settings-control">
                  <label>Spacing</label>
                  <div className="button-group">
                    <button
                      className={`btn-option ${settings.spacing === 'compact' ? 'active' : ''}`}
                      onClick={() => updateSetting('spacing', 'compact')}
                    >
                      Compact
                    </button>
                    <button
                      className={`btn-option ${settings.spacing === 'normal' ? 'active' : ''}`}
                      onClick={() => updateSetting('spacing', 'normal')}
                    >
                      Normal
                    </button>
                    <button
                      className={`btn-option ${settings.spacing === 'spacious' ? 'active' : ''}`}
                      onClick={() => updateSetting('spacing', 'spacious')}
                    >
                      Spacious
                    </button>
                  </div>
                </div>
              </div>

              {/* Display Section */}
              <div className="settings-section">
                <h4 className="settings-section-title">Display</h4>

                <div className="settings-control toggle">
                  <label>Ayah Numbers</label>
                  <button
                    className={`toggle-btn ${settings.showAyahBadges ? 'on' : 'off'}`}
                    onClick={() => updateSetting('showAyahBadges', !settings.showAyahBadges)}
                  >
                    {settings.showAyahBadges ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div className="settings-control">
                  <label>View Mode</label>
                  <div className="button-group">
                    <button
                      className={`btn-option ${settings.viewMode === 'card' ? 'active' : ''}`}
                      onClick={() => updateSetting('viewMode', 'card')}
                    >
                      Card
                    </button>
                    <button
                      className={`btn-option ${settings.viewMode === 'flat' ? 'active' : ''}`}
                      onClick={() => updateSetting('viewMode', 'flat')}
                    >
                      Flat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="quran-container">
        {/* Surah Selector */}
        <div className="surah-selector-wrapper">
          <div className="surah-selector-title">Choose Surah</div>
          <div className="surah-list">
            {loadingSurahs ? (
              <p style={{ color: '#94a3b8', textAlign: 'center' }}>Loading surahs...</p>
            ) : (
              surahs.map((s) => (
                <button
                  key={s.id}
                  className={`surah-item ${selectedSurah === s.id ? 'active' : ''}`}
                  onClick={() => setSelectedSurah(s.id)}
                >
                  <span className="surah-item-number">{s.chapter_number}</span>
                  <div className="surah-item-text">
                    <div className="surah-item-name">{s.name_simple}</div>
                    <div className="surah-item-arabic">{s.name}</div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Reader */}
        <div className={`quran-reader view-${settings.viewMode}`}>
          {/* Settings Button */}
          <button className="reader-settings-btn" onClick={() => setShowSettings(true)} title="Reader Settings">
            ⚙️
          </button>

          {error && (
            <div className="screen" style={{ margin: '20px 0' }}>
              <p style={{ color: '#ef4444' }}>{error}</p>
            </div>
          )}

          {!error && surah && (
            <>
              <div className="reader-header">
                <h2>{surah.englishName}</h2>
                <p className="surah-arabic">{surah.name}</p>
                <p className="surah-info">Surah {surah.number} • {surah.ayahs.length} Ayahs</p>
              </div>

              {loading ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
                  Loading...
                </p>
              ) : (
                <div className="ayahs-container" style={{ gap: currentSpacing.gap }}>
                  {surah.ayahs.map((ayah, index) => (
                    <div
                      key={ayah.number}
                      className={`ayah-card ${settings.viewMode === 'flat' ? 'flat' : ''}`}
                      style={{ padding: currentSpacing.padding }}
                    >
                      {settings.showAyahBadges && <div className="ayah-number">{ayah.numberInSurah}</div>}
                      <p
                        className="arabic-text"
                        style={{
                          fontSize: `${settings.arabicSize}rem`,
                          lineHeight: settings.arabicLineHeight,
                        }}
                      >
                        {ayah.text}
                      </p>
                      {settings.showTranslation && (
                        <p
                          className="translation-text"
                          style={{
                            fontSize: `${settings.translationSize}rem`,
                          }}
                        >
                          {translation?.ayahs[index]?.text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Salah() {
  return (
    <div className="screen">
      <h1>Salah</h1>
      <p>Find prayer times, Qibla direction, and Salah reminders.</p>
    </div>
  );
}

function Explore() {
  return (
    <div className="screen">
      <h1>Explore</h1>
      <p>Discover Islamic knowledge, articles, and community features.</p>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(() => {
    const saved = localStorage.getItem('activeTab');
    return saved || "home";
  });

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('activeTab', tab);
  }, [tab]);

  return (
    <div className="app">
      <div className="content">
        {tab === "home" && <Home />}
        {tab === "quran" && <Quran />}
        {tab === "salah" && <Salah />}
        {tab === "explore" && <Explore />}
      </div>

      <nav className="nav">
        <button
          className={tab === "home" ? "active" : ""}
          onClick={() => setTab("home")}
        >
          Home
        </button>
        <button
          className={tab === "quran" ? "active" : ""}
          onClick={() => setTab("quran")}
        >
          Quran
        </button>
        <button
          className={tab === "salah" ? "active" : ""}
          onClick={() => setTab("salah")}
        >
          Salah
        </button>
        <button
          className={tab === "explore" ? "active" : ""}
          onClick={() => setTab("explore")}
        >
          Explore
        </button>
      </nav>
    </div>
  );
}
