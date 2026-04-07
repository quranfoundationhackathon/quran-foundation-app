# Quran Tab Text Rendering Bug - Analysis and Fixes

## 🔴 Problem Discovered

Text (surah names, Arabic text, translations) was not displaying on screen in the Quran tab, even though chapters and verses were loading from the backend.

---

## 🔍 Root Cause Analysis

### Bug 1: Chapter Field Mapping Mismatch
**Location**: [src/App.jsx](src/App.jsx) - Chapter fetching logic  
**Issue**: Frontend expected wrong field names from backend

```javascript
// BEFORE (BROKEN):
const mappedChapters = data.chapters.map((chapter) => ({
  id: chapter.number,  // ← WRONG! Backend has 'id' not 'number'
  chapter_number: chapter.number,  // ← WRONG! Should be chapter.id
  name: chapter.name,  // ← WRONG! Backend doesn't have this field
  name_simple: chapter.englishName || chapter.englishNameTranslation,  // ← WRONG! Should be chapter.english_name
}));
```

**Backend Actually Returns** (from QURAN_CHAPTERS array):
```javascript
{ id: 1, verse_count: 7, english_name: "Al-Fatihah", arabic_name: "الفاتحة" }
```

**Consequence**: 
- `s.chapter_number` = undefined (displays nothing)
- `s.name_simple` = undefined (displays nothing)
- `s.name` = undefined (displays nothing)
- All chapter list text invisible

---

### Bug 2: Missing Arabic Chapter Names
**Location**: [src/App.jsx](src/App.jsx) - Chapter rendering  
**Issue**: No Arabic chapter names available from backend fallback data

```javascript
// BROKEN CODE:
<div className="surah-item-arabic">{s.name}</div>  // Value is undefined
```

**Consequence**: Arabic chapter names not displaying in menu

---

### Bug 3: Verse Field Mapping Mismatch
**Location**: [src/App.jsx](src/App.jsx) - Verse fetching logic  
**Issue**: Frontend expected wrong field names from Quran Foundation API

```javascript
// BEFORE (BROKEN):
ayahs: data.verses.map((verse) => ({
  number: verse.number,  // ← WRONG! Should be verse.verse_number
  numberInSurah: verse.numberInSurah,  // ← WRONG! Should be verse_number_in_surah
  text: verse.text,  // ← WRONG! Should use verse.text_uthmani (or other style)
  words: verse.words || [],  // May not exist
  translations: verse.translations || [],
})),
```

**Backend Returns From Quran Foundation API**:
```javascript
{
  verse_number: 1,
  verse_number_in_surah: 1,
  verse_key: "1:1",
  text_uthmani: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
  text_indopak: "بسْم الله الرَّحمٰن الرَّحيمِ",
  text_simple: "بسم الله الرحمن الرحيم",
  translations: [{...}],  // Has translation data
  // ... other fields
}
```

**Consequence**:
- `ayah.number` = undefined (displays nothing for ayah number badge)
- `ayah.text` = undefined (Arabic text doesn't display)
- All ayah content invisible

---

### Bug 4: No Script Style Support
**Location**: [src/App.jsx](src/App.jsx) - Verse mapping  
**Issue**: Always trying to get `verse.text` instead of respecting user's script style setting

**Consequence**: 
- Even if field names were correct, wrong Arabic text variant used
- User's Uthmani/Indopak/Simple style setting ignored

---

## ✅ Fixes Applied

### Fix 1: Correct Chapter Field Mapping
**File**: [src/App.jsx](src/App.jsx)  
**Changed**:
```javascript
// AFTER (FIXED):
const mappedChapters = data.chapters.map((chapter) => ({
  id: chapter.id,  // ✓ Correct field
  chapter_number: chapter.id,  // ✓ Correct field
  name: getArabicChapterName(chapter.id),  // ✓ Get from helper
  name_simple: chapter.english_name || 'Chapter',  // ✓ Correct field
}));
```

**Result**: Chapter names now render properly in menu

---

### Fix 2: Add Arabic Chapter Name Helper Function
**File**: [src/App.jsx](src/App.jsx)  
**Added**: `getArabicChapterName()` function with all 114 chapter names:
```javascript
const getArabicChapterName = (chapterId) => {
  const arabicNames = {
    1: 'الفاتحة',
    2: 'البقرة',
    3: 'آل عمران',
    // ... all 114 chapters
    114: 'الناس',
  };
  return arabicNames[chapterId] || 'سورة';
};
```

**Result**: Arabic chapter names display correctly in menu and header

---

### Fix 3: Correct Verse Field Mapping with Script Style
**File**: [src/App.jsx](src/App.jsx)  
**Added**: Script style helper function:
```javascript
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
```

**Changed verse mapping**:
```javascript
ayahs: data.verses.map((verse) => ({
  number: verse.verse_number,  // ✓ Correct field
  numberInSurah: verse.verse_number_in_surah || verse.verse_number,  // ✓ Correct field
  text: getArabicText(verse),  // ✓ Respects user setting
  words: verse.words || [],
  translations: verse.translations || [],
})),
```

**Result**: 
- Arabic text displays correctly
- Respects user's script style (Uthmani/Indopak/Simple) setting
- Fallback logic ensures text displays even if exact variant unavailable

---

### Fix 4: Update Backend Chapter Data
**File**: [server/index.js](server/index.js)  
**Added**: `arabic_name` field to all 114 chapters in QURAN_CHAPTERS:
```javascript
const QURAN_CHAPTERS = [
  { id: 1, verse_count: 7, english_name: "Al-Fatihah", arabic_name: "الفاتحة" },
  { id: 2, verse_count: 286, english_name: "Al-Baqarah", arabic_name: "البقرة" },
  // ... all 114 chapters with both english_name and arabic_name
];
```

**Result**: Backend provides complete chapter metadata

---

### Fix 5: Add Debugging Console Logs
**File**: [src/App.jsx](src/App.jsx)  
**Added**:
```javascript
console.log('Raw chapters from backend:', data.chapters[0]);
console.log('Mapped chapters:', mappedChapters[0]);
console.log('Raw verses from backend:', data.verses[0]);
console.log('Mapped surah:', { number: surahData.number, englishName: surahData.englishName, ayahCount: surahData.ayahs.length, firstAyah: surahData.ayahs[0] });
```

**Result**: Developers can verify exact field names in browser console

---

## 📊 Summary of Changes

| Issue | Root Cause | Fix | File |
|-------|-----------|-----|------|
| Surah names invisible | Wrong field names (chapter.number vs id) | Use `chapter.id` | App.jsx |
| Arabic chapter names missing | No mapping function | Added `getArabicChapterName()` | App.jsx |
| Ayah text invisible | Wrong field names (verse.text vs text_uthmani) | Use `verse.verse_number` and `getArabicText()` | App.jsx |
| Ayah numbers invisible | Wrong field name (verse.number vs verse_number) | Use correct field name | App.jsx |
| Script style ignored | Always using `verse.text` | Added `getArabicText()` with switch logic | App.jsx |
| Missing data in backend | No Arabic names provided | Added `arabic_name` to all chapters | server/index.js |
| Hard to debug | No logging | Added console.log statements | App.jsx |

---

## 🧪 Testing & Verification

### Browser Console (F12 / Developer Tools)
Open browser console to see debug logs:

```javascript
// Should show the first chapter from backend:
Raw chapters from backend: {id: 1, verse_count: 7, english_name: "Al-Fatihah", arabic_name: "الفاتحة"}

// Should show the mapped chapter data:
Mapped chapters: {id: 1, chapter_number: 1, name: "الفاتحة", name_simple: "Al-Fatihah"}

// Should show verses with correct fields:
Raw verses from backend: {verse_number: 1, verse_key: "1:1", text_uthmani: "بِسْمِ..."}

// Should show mapped ayah data:
Mapped surah: {
  number: 1, 
  englishName: "Al-Fatihah", 
  ayahCount: 7, 
  firstAyah: {number: 1, numberInSurah: 1, text: "بِسْمِ..."}
}
```

### Visual Verification
✅ Surah names appear in menu  
✅ Arabic chapter names appear in menu  
✅ Chapter header shows English name  
✅ Chapter header shows Arabic name  
✅ Ayah numbers display (badges)  
✅ Arabic text displays  
✅ Translations display (when enabled)  
✅ Script style setting affects display  

---

## 🔧 Technical Details

### Field Name Mapping Reference

**Chapters (Backend)**:
```
id – Chapter number (1-114)
verse_count – Total verses in chapter
english_name – English name (e.g., "Al-Fatihah")
arabic_name – Arabic name (e.g., "الفاتحة")
```

**Verses (Quran Foundation API)**:
```
verse_number – Absolute verse number in Quran
verse_number_in_surah – Verse number within chapter
verse_key – Format "chapter:verse" (e.g., "1:1")
text_uthmani – Uthmani script variant
text_indopak – Indo-Pakistani script variant
text_simple – Simplified script variant
transliteration – Romanized transliteration
translations – Array of translation objects
  - text: Translation text
  - language_name: Language of translation
```

---

## 🚀 After-Fix Behavior

1. **Chapter List**: Shows English and Arabic names for all 114 surahs
2. **Reader Header**: Displays chapter number, English name, and Arabic name
3. **Verses**: Display with Arabic text, translation, and verse numbers
4. **Script Style**: Switching between Uthmani/Indopak/Simple affects the Arabic text displayed
5. **Console**: Shows debug info for developers to verify data flow

---

## Notes

- All existing UI/settings/features preserved
- No breaking changes to layout or styling
- Field mappings now match actual API responses
- Debug logs help diagnose similar issues in future
- Code remains beginner-friendly with clear variable names
