import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

// ============================================================
// CREDENTIALS - STORED IN SERVER/.ENV ONLY (NEVER FRONTEND)
// ============================================================
const QF_CLIENT_ID = process.env.QF_CLIENT_ID;
const QF_CLIENT_SECRET = process.env.QF_CLIENT_SECRET;
const QF_AUTH_URL = process.env.QF_AUTH_URL || 'https://auth.quran.foundation';
const QF_API_BASE = process.env.QF_API_BASE || 'https://apis.quran.foundation';
const PORT = process.env.PORT || 3001;

// OAuth2 token cache
let tokenCache = {
  access_token: null,
  expires_at: null,
};

// ============================================================
// QURAN FOUNDATION OAUTH2 TOKEN MANAGEMENT
// ============================================================
const getAccessToken = async () => {
  try {
    // Check if we have a cached token that's still valid
    if (tokenCache.access_token && tokenCache.expires_at > Date.now()) {
      console.log('✓ Using cached access token');
      return tokenCache.access_token;
    }

    console.log('→ Requesting new access token from Quran Foundation...');

    // Create Basic Auth header (client_id:client_secret in Base64)
    const credentials = Buffer.from(`${QF_CLIENT_ID}:${QF_CLIENT_SECRET}`).toString('base64');

    // Request new token using OAuth2 client credentials flow with Basic Auth
    const response = await fetch(`${QF_AUTH_URL}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        scope: 'content',
      }).toString(),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(
        `OAuth2 token request failed (${response.status}): ${errorData}`
      );
    }

    const data = await response.json();

    // Cache the token with expiry (subtract 60 seconds buffer for safety)
    tokenCache.access_token = data.access_token;
    tokenCache.expires_at = Date.now() + (data.expires_in * 1000) - 60000;

    console.log(`✓ Access token obtained (expires in ${data.expires_in}s)`);
    return data.access_token;
  } catch (err) {
    throw new Error(`Failed to get access token: ${err.message}`);
  }
};

// ============================================================
// QURAN FOUNDATION CONTENT API HELPER WITH PAGINATION
// ============================================================
const quranApiRequest = async (endpoint) => {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${QF_API_BASE}/content/api/v4${endpoint}`, {
      headers: {
        'x-auth-token': accessToken,
        'x-client-id': QF_CLIENT_ID,
      },
    });

    if (!response.ok) {
      // If 401, token might be invalid - clear cache and retry once
      if (response.status === 401) {
        console.log('⚠ Access token rejected, clearing cache...');
        tokenCache = { access_token: null, expires_at: null };
        
        // Retry with fresh token
        const freshToken = await getAccessToken();
        const retryResponse = await fetch(`${QF_API_BASE}/content/api/v4${endpoint}`, {
          headers: {
            'x-auth-token': freshToken,
            'x-client-id': QF_CLIENT_ID,
          },
        });

        if (!retryResponse.ok) {
          throw new Error(
            `Quran Foundation API returned ${retryResponse.status}: ${retryResponse.statusText}`
          );
        }

        return await retryResponse.json();
      }

      throw new Error(
        `Quran Foundation API returned ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (err) {
    throw new Error(`Failed to fetch from Quran Foundation API: ${err.message}`);
  }
};

// ============================================================
// FETCH ALL VERSES - Paginates through QF API (Arabic text only)
// ============================================================
const fetchVerses = async (chapterId) => {
  const allVerses = [];
  let page = 1;
  const perPage = 50;

  console.log(`  Fetching verses for chapter ${chapterId}...`);

  while (true) {
    const endpoint = `/verses/by_chapter/${chapterId}?language=en&fields=text_uthmani&per_page=${perPage}&page=${page}`;
    const data = await quranApiRequest(endpoint);

    if (!data.verses) {
      if (page === 1) {
        console.log(`  ⚠ QF API: chapter ${chapterId} not available in this tier`);
      }
      break;
    }

    allVerses.push(...data.verses);
    console.log(`  Verses page ${page}: ${data.verses.length} (total: ${allVerses.length})`);

    if (!data.pagination?.next_page || data.verses.length < perPage) break;
    page++;
  }

  console.log(`  ✓ ${allVerses.length} verses for chapter ${chapterId}`);
  return allVerses;
};

// ============================================================
// FETCH ALL TRANSLATIONS - Paginates through QF translation API
// ============================================================
const fetchTranslations = async (chapterId, resourceId) => {
  const allTranslations = [];
  let page = 1;
  const perPage = 50;

  console.log(`  Fetching translations for chapter ${chapterId} (resource: ${resourceId})...`);

  while (true) {
    const endpoint = `/translations/${resourceId}/by_chapter/${chapterId}?fields=verse_number&per_page=${perPage}&page=${page}`;
    const data = await quranApiRequest(endpoint);

    if (!data.translations || data.translations.length === 0) break;

    allTranslations.push(...data.translations);
    console.log(`  Translations page ${page}: ${data.translations.length} (total: ${allTranslations.length})`);

    if (!data.pagination?.next_page || data.translations.length < perPage) break;
    page++;
  }

  console.log(`  ✓ ${allTranslations.length} translations for chapter ${chapterId}`);
  return allTranslations;
};

// ============================================================
// MERGE - Combine verses + translations by verse_number
// ============================================================
const mergeVersesAndTranslations = (verses, translations, chapterId) => {
  // Build a map: verse_number -> translation text
  const transMap = {};
  for (const t of translations) {
    if (t.verse_number !== undefined && t.text) {
      transMap[t.verse_number] = t.text;
    }
  }

  return verses.map(verse => ({
    id: verse.id,
    verse_number: verse.verse_number,
    verse_number_in_surah: verse.verse_number,
    verse_key: verse.verse_key || `${chapterId}:${verse.verse_number}`,
    text_uthmani: verse.text_uthmani || '',
    text_imlaei: verse.text_imlaei || '',
    translation_text: transMap[verse.verse_number] || 'Translation not available',
  }));
};

// ============================================================
// CREDENTIALS CHECK MIDDLEWARE
// ============================================================
const checkCredentials = (req, res, next) => {
  if (!QF_CLIENT_ID || !QF_CLIENT_SECRET) {
    return res.status(500).json({
      error: 'Server configuration error',
      message: 'Quran Foundation credentials are not configured in server/.env',
      details: 'Please add QF_CLIENT_ID and QF_CLIENT_SECRET to server/.env file',
      status: 'MISSING_CREDENTIALS'
    });
  }
  next();
};

// ============================================================
// ROUTES
// ============================================================

// Health check - shows credential status
app.get('/api/health', (req, res) => {
  const hasCredentials = !!(QF_CLIENT_ID && QF_CLIENT_SECRET);
  const tokenValid = !!(tokenCache.access_token && tokenCache.expires_at > Date.now());
  
  res.json({
    status: 'ok',
    credentials_configured: hasCredentials,
    access_token_cached: tokenValid,
    message: hasCredentials 
      ? 'Backend is ready and configured'
      : 'Credentials not configured - add QF_CLIENT_ID and QF_CLIENT_SECRET to server/.env'
  });
});

// ============================================================
// ALL 114 QURANIC CHAPTERS - Reference Data for Fallback
// ============================================================
const QURAN_CHAPTERS = [
  { id: 1, verse_count: 7, english_name: "Al-Fatihah", arabic_name: "الفاتحة" },
  { id: 2, verse_count: 286, english_name: "Al-Baqarah", arabic_name: "البقرة" },
  { id: 3, verse_count: 200, english_name: "Al-Imran", arabic_name: "آل عمران" },
  { id: 4, verse_count: 176, english_name: "An-Nisa", arabic_name: "النساء" },
  { id: 5, verse_count: 120, english_name: "Al-Maidah", arabic_name: "المائدة" },
  { id: 6, verse_count: 165, english_name: "Al-Anam", arabic_name: "الأنعام" },
  { id: 7, verse_count: 206, english_name: "Al-Araf", arabic_name: "الأعراف" },
  { id: 8, verse_count: 75, english_name: "Al-Anfal", arabic_name: "الأنفال" },
  { id: 9, verse_count: 129, english_name: "At-Taubah", arabic_name: "التوبة" },
  { id: 10, verse_count: 109, english_name: "Yunus", arabic_name: "يونس" },
  { id: 11, verse_count: 123, english_name: "Hud", arabic_name: "هود" },
  { id: 12, verse_count: 111, english_name: "Yusuf", arabic_name: "يوسف" },
  { id: 13, verse_count: 43, english_name: "Ar-Rad", arabic_name: "الرعد" },
  { id: 14, verse_count: 52, english_name: "Ibrahim", arabic_name: "إبراهيم" },
  { id: 15, verse_count: 99, english_name: "Al-Hijr", arabic_name: "الحجر" },
  { id: 16, verse_count: 128, english_name: "An-Nahl", arabic_name: "النحل" },
  { id: 17, verse_count: 111, english_name: "Al-Isra", arabic_name: "الإسراء" },
  { id: 18, verse_count: 110, english_name: "Al-Kahf", arabic_name: "الكهف" },
  { id: 19, verse_count: 98, english_name: "Maryam", arabic_name: "مريم" },
  { id: 20, verse_count: 135, english_name: "Taha", arabic_name: "طه" },
  { id: 21, verse_count: 112, english_name: "Al-Anbya", arabic_name: "الأنبياء" },
  { id: 22, verse_count: 78, english_name: "Al-Hajj", arabic_name: "الحج" },
  { id: 23, verse_count: 118, english_name: "Al-Muminun", arabic_name: "المؤمنون" },
  { id: 24, verse_count: 64, english_name: "An-Nur", arabic_name: "النور" },
  { id: 25, verse_count: 77, english_name: "Al-Furqan", arabic_name: "الفرقان" },
  { id: 26, verse_count: 227, english_name: "Ash-Shuara", arabic_name: "الشعراء" },
  { id: 27, verse_count: 93, english_name: "An-Naml", arabic_name: "النمل" },
  { id: 28, verse_count: 88, english_name: "Al-Qasas", arabic_name: "القصص" },
  { id: 29, verse_count: 69, english_name: "Al-Ankabut", arabic_name: "العنكبوت" },
  { id: 30, verse_count: 60, english_name: "Ar-Rum", arabic_name: "الروم" },
  { id: 31, verse_count: 34, english_name: "Luqman", arabic_name: "لقمان" },
  { id: 32, verse_count: 30, english_name: "As-Sajdah", arabic_name: "السجدة" },
  { id: 33, verse_count: 73, english_name: "Al-Ahzab", arabic_name: "الأحزاب" },
  { id: 34, verse_count: 54, english_name: "Saba", arabic_name: "سبأ" },
  { id: 35, verse_count: 45, english_name: "Fatir", arabic_name: "فاطر" },
  { id: 36, verse_count: 83, english_name: "Yasin", arabic_name: "يس" },
  { id: 37, verse_count: 182, english_name: "As-Saffat", arabic_name: "الصافات" },
  { id: 38, verse_count: 88, english_name: "Sad", arabic_name: "ص" },
  { id: 39, verse_count: 75, english_name: "Az-Zumar", arabic_name: "الزمر" },
  { id: 40, verse_count: 85, english_name: "Ghafir", arabic_name: "غافر" },
  { id: 41, verse_count: 54, english_name: "Fussilat", arabic_name: "فصلت" },
  { id: 42, verse_count: 53, english_name: "Ash-Shura", arabic_name: "الشورى" },
  { id: 43, verse_count: 89, english_name: "Az-Zukhruf", arabic_name: "الزخرف" },
  { id: 44, verse_count: 59, english_name: "Ad-Dukhan", arabic_name: "الدخان" },
  { id: 45, verse_count: 37, english_name: "Al-Jathiyah", arabic_name: "الجاثية" },
  { id: 46, verse_count: 35, english_name: "Al-Ahqaf", arabic_name: "الأحقاف" },
  { id: 47, verse_count: 38, english_name: "Muhammad", arabic_name: "محمد" },
  { id: 48, verse_count: 29, english_name: "Al-Fath", arabic_name: "الفتح" },
  { id: 49, verse_count: 18, english_name: "Al-Hujurat", arabic_name: "الحجرات" },
  { id: 50, verse_count: 45, english_name: "Qaf", arabic_name: "ق" },
  { id: 51, verse_count: 60, english_name: "Adh-Dhariyat", arabic_name: "الذاريات" },
  { id: 52, verse_count: 49, english_name: "At-Tur", arabic_name: "الطور" },
  { id: 53, verse_count: 62, english_name: "An-Najm", arabic_name: "النجم" },
  { id: 54, verse_count: 55, english_name: "Al-Qamar", arabic_name: "القمر" },
  { id: 55, verse_count: 78, english_name: "Ar-Rahman", arabic_name: "الرحمن" },
  { id: 56, verse_count: 96, english_name: "Al-Waqiah", arabic_name: "الواقعة" },
  { id: 57, verse_count: 29, english_name: "Al-Hadid", arabic_name: "الحديد" },
  { id: 58, verse_count: 22, english_name: "Al-Mujadilah", arabic_name: "المجادلة" },
  { id: 59, verse_count: 24, english_name: "Al-Hashr", arabic_name: "الحشر" },
  { id: 60, verse_count: 13, english_name: "Al-Mumtahinah", arabic_name: "الممتحنة" },
  { id: 61, verse_count: 14, english_name: "As-Saff", arabic_name: "الصف" },
  { id: 62, verse_count: 11, english_name: "Al-Jumu'ah", arabic_name: "الجمعة" },
  { id: 63, verse_count: 11, english_name: "Al-Munafiqun", arabic_name: "المنافقون" },
  { id: 64, verse_count: 18, english_name: "At-Taghabun", arabic_name: "التغابن" },
  { id: 65, verse_count: 12, english_name: "At-Talaq", arabic_name: "الطلاق" },
  { id: 66, verse_count: 12, english_name: "At-Tahrim", arabic_name: "التحريم" },
  { id: 67, verse_count: 30, english_name: "Al-Mulk", arabic_name: "الملك" },
  { id: 68, verse_count: 52, english_name: "Al-Qalam", arabic_name: "القلم" },
  { id: 69, verse_count: 52, english_name: "Al-Haqqah", arabic_name: "الحاقة" },
  { id: 70, verse_count: 44, english_name: "Al-Maarij", arabic_name: "المعارج" },
  { id: 71, verse_count: 28, english_name: "Nuh", arabic_name: "نوح" },
  { id: 72, verse_count: 28, english_name: "Al-Jinn", arabic_name: "الجن" },
  { id: 73, verse_count: 20, english_name: "Al-Muzzammil", arabic_name: "المزمل" },
  { id: 74, verse_count: 56, english_name: "Al-Muddaththir", arabic_name: "المدثر" },
  { id: 75, verse_count: 40, english_name: "Al-Qiyamah", arabic_name: "القيامة" },
  { id: 76, verse_count: 31, english_name: "Al-Insan", arabic_name: "الإنسان" },
  { id: 77, verse_count: 50, english_name: "Al-Mursalat", arabic_name: "المرسلات" },
  { id: 78, verse_count: 40, english_name: "An-Naba", arabic_name: "النبأ" },
  { id: 79, verse_count: 46, english_name: "An-Naziat", arabic_name: "الناعيات" },
  { id: 80, verse_count: 42, english_name: "Abasa", arabic_name: "عبس" },
  { id: 81, verse_count: 29, english_name: "At-Takwir", arabic_name: "التكوير" },
  { id: 82, verse_count: 19, english_name: "Al-Infitar", arabic_name: "الانفطار" },
  { id: 83, verse_count: 36, english_name: "Al-Mutaffifin", arabic_name: "المطففين" },
  { id: 84, verse_count: 25, english_name: "Al-Inshiqaq", arabic_name: "الانشقاق" },
  { id: 85, verse_count: 22, english_name: "Al-Buruj", arabic_name: "البروج" },
  { id: 86, verse_count: 17, english_name: "At-Tariq", arabic_name: "الطارق" },
  { id: 87, verse_count: 19, english_name: "Al-Ala", arabic_name: "الأعلى" },
  { id: 88, verse_count: 26, english_name: "Al-Ghashiyah", arabic_name: "الغاشية" },
  { id: 89, verse_count: 30, english_name: "Al-Fajr", arabic_name: "الفجر" },
  { id: 90, verse_count: 20, english_name: "Al-Balad", arabic_name: "البلد" },
  { id: 91, verse_count: 15, english_name: "Ash-Shams", arabic_name: "الشمس" },
  { id: 92, verse_count: 21, english_name: "Al-Lail", arabic_name: "الليل" },
  { id: 93, verse_count: 11, english_name: "Ad-Dhuha", arabic_name: "الضحى" },
  { id: 94, verse_count: 8, english_name: "Ash-Sharh", arabic_name: "الشرح" },
  { id: 95, verse_count: 8, english_name: "At-Tin", arabic_name: "التين" },
  { id: 96, verse_count: 19, english_name: "Al-Alaq", arabic_name: "العلق" },
  { id: 97, verse_count: 5, english_name: "Al-Qadr", arabic_name: "القدر" },
  { id: 98, verse_count: 8, english_name: "Al-Bayyinah", arabic_name: "البينة" },
  { id: 99, verse_count: 8, english_name: "Az-Zalzalah", arabic_name: "الزلزلة" },
  { id: 100, verse_count: 11, english_name: "Al-Adiyat", arabic_name: "العاديات" },
  { id: 101, verse_count: 11, english_name: "Al-Qariah", arabic_name: "القارعة" },
  { id: 102, verse_count: 8, english_name: "At-Takathur", arabic_name: "التكاثر" },
  { id: 103, verse_count: 3, english_name: "Al-Asr", arabic_name: "العصر" },
  { id: 104, verse_count: 9, english_name: "Al-Humaza", arabic_name: "الهمزة" },
  { id: 105, verse_count: 5, english_name: "Al-Fil", arabic_name: "الفيل" },
  { id: 106, verse_count: 4, english_name: "Quraish", arabic_name: "قريش" },
  { id: 107, verse_count: 7, english_name: "Al-Maun", arabic_name: "الماعون" },
  { id: 108, verse_count: 3, english_name: "Al-Kawthar", arabic_name: "الكوثر" },
  { id: 109, verse_count: 6, english_name: "Al-Kafirun", arabic_name: "الكافرون" },
  { id: 110, verse_count: 3, english_name: "An-Nasr", arabic_name: "النصر" },
  { id: 111, verse_count: 5, english_name: "Al-Masad", arabic_name: "المسد" },
  { id: 112, verse_count: 4, english_name: "Al-Ikhlas", arabic_name: "الإخلاص" },
  { id: 113, verse_count: 5, english_name: "Al-Falaq", arabic_name: "الفلق" },
  { id: 114, verse_count: 6, english_name: "An-Nas", arabic_name: "الناس" }
];

// Get all chapters (Surahs) - with pagination handling
app.get('/api/chapters', checkCredentials, async (req, res) => {
  try {
    console.log('Fetching all chapters...');
    
    // Try to fetch from API first
    let chapters = null;
    let apiSuccess = false;
    
    try {
      console.log('Attempting to fetch from Quran Foundation API...');
      const data = await quranApiRequest('/chapters?language=en');
      
      if (data.chapters && Array.isArray(data.chapters) && data.chapters.length > 0) {
        chapters = data.chapters;
        console.log(`✓ API returned ${chapters.length} chapters`);
        apiSuccess = true;
        
        // If API gave us all chapters, great! Use them
        if (chapters.length >= 114) {
          console.log(`✓ API provided all 114 chapters`);
          return res.json({ chapters });
        }
      }
    } catch (err) {
      console.log(`⚠ API request failed: ${err.message}`);
    }
    
    // If API didn't work or returned incomplete data, use fallback list
    if (!apiSuccess || !chapters || chapters.length < 114) {
      console.log(`Using hardcoded chapter list (${QURAN_CHAPTERS.length} chapters)`);
      chapters = QURAN_CHAPTERS;
    }

    if (!chapters || chapters.length === 0) {
      return res.status(500).json({
        error: 'No chapters available',
        message: 'Could not retrieve chapters from API or fallback',
        status: 'NO_DATA'
      });
    }

    console.log(`✓ Returning ${chapters.length} chapters to frontend`);
    res.json({ chapters });
  } catch (err) {
    console.error('Error in /api/chapters:', err.message);
    res.status(500).json({
      error: 'Server error',
      message: err.message,
      status: 'ERROR'
    });
  }
});

// Get verses with custom translation (MORE SPECIFIC - must come first!)
app.get('/api/chapters/:chapterNumber/verses/:translationId', checkCredentials, async (req, res) => {
  try {
    const { chapterNumber, translationId } = req.params;
    const chapter = parseInt(chapterNumber);
    const transId = parseInt(translationId);

    console.log(`\n=== Fetching Chapter ${chapter} with Translation ${transId} ===`);

    // Validate inputs
    if (isNaN(chapter) || chapter < 1 || chapter > 114) {
      return res.status(400).json({
        error: 'Invalid chapter number',
        message: 'Chapter number must be between 1 and 114',
        status: 'INVALID_INPUT'
      });
    }

    if (isNaN(transId)) {
      return res.status(400).json({
        error: 'Invalid translation ID',
        message: 'Translation ID must be a valid number',
        status: 'INVALID_INPUT'
      });
    }

    // Fetch verses (Arabic) and translations in parallel
    console.log(`Fetching chapter ${chapter} + translation ${transId} in parallel...`);
    const [rawVerses, rawTranslations] = await Promise.all([
      fetchVerses(chapter),
      fetchTranslations(chapter, transId),
    ]);

    if (rawVerses.length === 0) {
      return res.status(404).json({
        error: 'Chapter not available',
        message: `Chapter ${chapter} is not yet available in the current Quran Foundation API tier`,
        status: 'NOT_AVAILABLE'
      });
    }

    const verses = mergeVersesAndTranslations(rawVerses, rawTranslations, chapter);
    console.log(`✓ Returning ${verses.length} verses for chapter ${chapter} (${rawTranslations.length} translations merged)`);
    res.json({ verses });
  } catch (err) {
    console.error('Error fetching verses with translation:', err.message);
    res.status(500).json({
      error: 'Failed to fetch verses',
      message: err.message,
      status: 'API_ERROR'
    });
  }
});

// Get verses for a specific chapter with default translation
app.get('/api/chapters/:chapterNumber/verses', checkCredentials, async (req, res) => {
  try {
    const { chapterNumber } = req.params;
    const chapter = parseInt(chapterNumber);
    const transId = 85; // Default: M.A.S. Abdel Haleem (confirmed working in this API tier)

    console.log(`\n=== Fetching Chapter ${chapter} (default translation) ===`);

    if (isNaN(chapter) || chapter < 1 || chapter > 114) {
      return res.status(400).json({
        error: 'Invalid chapter number',
        message: 'Chapter number must be between 1 and 114',
        status: 'INVALID_INPUT'
      });
    }

    // Fetch verses (Arabic) and translations in parallel
    const [rawVerses, rawTranslations] = await Promise.all([
      fetchVerses(chapter),
      fetchTranslations(chapter, transId),
    ]);

    if (rawVerses.length === 0) {
      return res.status(404).json({
        error: 'Chapter not available',
        message: `Chapter ${chapter} is not yet available in the current Quran Foundation API tier`,
        status: 'NOT_AVAILABLE'
      });
    }

    const verses = mergeVersesAndTranslations(rawVerses, rawTranslations, chapter);
    console.log(`✓ Returning ${verses.length} verses for chapter ${chapter} (${rawTranslations.length} translations merged)`);
    res.json({ verses });
  } catch (err) {
    console.error('Error fetching verses:', err.message);
    res.status(500).json({
      error: 'Failed to fetch verses',
      message: err.message,
      status: 'API_ERROR'
    });
  }
});

// ============================================================
// AVAILABLE TRANSLATIONS - Only IDs confirmed working in this API tier
// ============================================================
const AVAILABLE_TRANSLATIONS = [
  { id: 85,  name: 'M.A.S. Abdel Haleem', language: 'English', description: 'Modern English translation' },
  { id: 57,  name: 'Transliteration',      language: 'English', description: 'Latin-script transliteration' },
  { id: 234, name: 'Fatah Muhammad Jalandhari', language: 'Urdu', description: 'Urdu translation' },
  { id: 161, name: 'Taisirul Quran',        language: 'Bengali', description: 'Bengali translation' },
  { id: 80,  name: 'Muhammad Karakunnu',    language: 'Malayalam', description: 'Malayalam translation' },
  { id: 39,  name: 'Abdullah Muhammad Basmeih', language: 'Malay', description: 'Malay translation' },
  { id: 33,  name: 'Indonesian Min. of Islamic Affairs', language: 'Indonesian', description: 'Indonesian translation' },
  { id: 78,  name: 'Ministry of Awqaf, Egypt', language: 'Russian', description: 'Russian translation' },
  { id: 208, name: 'Abu Reda Muhammad ibn Ahmad', language: 'German', description: 'German translation' },
  { id: 136, name: 'Montada Islamic Foundation', language: 'French', description: 'French translation' },
  { id: 140, name: 'Montada Islamic Foundation', language: 'Spanish', description: 'Spanish translation' },
];

// Get list of available translations
app.get('/api/translations', (req, res) => {
  res.json({
    translations: AVAILABLE_TRANSLATIONS,
    default: 85
  });
});

// ============================================================
// START SERVER
// ============================================================
app.listen(PORT, () => {
  if (QF_CLIENT_ID && QF_CLIENT_SECRET) {
    console.log(`✅ Backend server running at http://localhost:${PORT}`);
    console.log(`✅ Quran Foundation OAuth2 credentials configured`);
    console.log(`   Using OAuth2 client credentials flow for token management`);
  } else {
    console.log(`⚠️  Backend server running at http://localhost:${PORT}`);
    console.log(`❌ Quran Foundation credentials NOT found in server/.env`);
    console.log(`   Required: QF_CLIENT_ID and QF_CLIENT_SECRET`);
    console.log(`   Get credentials from: https://api-docs.quran.foundation/request-access`);
  }
});
