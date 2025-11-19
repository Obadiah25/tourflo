# VS Code Find & Replace Patterns

Copy these patterns directly into VS Code's Find & Replace tool (Ctrl+H / Cmd+H).

---

## 🚀 Quick Start

1. Open VS Code
2. Press `Ctrl+H` (Windows/Linux) or `Cmd+H` (Mac)
3. Click the `.*` button to enable **Regex mode**
4. Click the `Aa` button to enable **Match Case** (for case-sensitive patterns)
5. Copy patterns below and paste into Find/Replace fields
6. Use **Replace All** or review each replacement

---

## 📋 Pattern Groups

### Group 1: Brand Name Replacements (Case-Sensitive)

**Pattern 1.1 - LOOKYAH → TOURFLO**
```
Find:    LOOKYAH
Replace: TOURFLO
Regex:   OFF
Match Case: ON
```

**Pattern 1.2 - LookYah → TourFlo**
```
Find:    LookYah
Replace: TourFlo
Regex:   OFF
Match Case: ON
```

**Pattern 1.3 - Lookyah → TourFlo**
```
Find:    Lookyah
Replace: TourFlo
Regex:   OFF
Match Case: ON
```

**Pattern 1.4 - lookyah → tourflo**
```
Find:    lookyah
Replace: tourflo
Regex:   OFF
Match Case: ON
```

**Pattern 1.5 - JAHBOI → FLORBOT**
```
Find:    JAHBOI
Replace: FLORBOT
Regex:   OFF
Match Case: ON
```

**Pattern 1.6 - Jahboi → FlorBot**
```
Find:    Jahboi
Replace: FlorBot
Regex:   OFF
Match Case: ON
```

**Pattern 1.7 - jahboi → florbot**
```
Find:    jahboi
Replace: florbot
Regex:   OFF
Match Case: ON
```

---

### Group 2: Geographic Replacements

**Pattern 2.1 - Jamaica-based → Florida-based**
```
Find:    Jamaica-based
Replace: Florida-based
Regex:   OFF
Match Case: OFF
```

**Pattern 2.2 - Jamaican → Florida**
```
Find:    Jamaican
Replace: Florida
Regex:   OFF
Match Case: OFF
```

**Pattern 2.3 - Jamaica → Florida**
```
Find:    Jamaica
Replace: Florida
Regex:   OFF
Match Case: OFF
```

---

### Group 3: Location Replacements (Specific Places)

**Pattern 3.1 - Dunn's River Falls → Everglades National Park**
```
Find:    Dunn's River Falls
Replace: Everglades National Park
Regex:   OFF
Match Case: OFF
```

**Pattern 3.2 - Rick's Cafe → Sunset Cruises**
```
Find:    Rick's Cafe
Replace: Sunset Cruises
Regex:   OFF
Match Case: OFF
```

**Pattern 3.3 - Blue Mountains → Everglades**
```
Find:    Blue Mountains
Replace: Everglades
Regex:   OFF
Match Case: OFF
```

**Pattern 3.4 - Montego Bay → Fort Lauderdale**
```
Find:    Montego Bay
Replace: Fort Lauderdale
Regex:   OFF
Match Case: OFF
```

**Pattern 3.5 - Ocho Rios → Orlando**
```
Find:    Ocho Rios
Replace: Orlando
Regex:   OFF
Match Case: OFF
```

**Pattern 3.6 - Negril → Key West**
```
Find:    Negril
Replace: Key West
Regex:   OFF
Match Case: OFF
```

**Pattern 3.7 - Kingston → Miami**
```
Find:    Kingston
Replace: Miami
Regex:   OFF
Match Case: OFF
```

**Pattern 3.8 - Falmouth → Tampa**
```
Find:    Falmouth
Replace: Tampa
Regex:   OFF
Match Case: OFF
```

---

### Group 4: Administrative Divisions (Case-Sensitive)

**Pattern 4.1 - parishes → counties**
```
Find:    parishes
Replace: counties
Regex:   OFF
Match Case: ON
```

**Pattern 4.2 - Parish → County**
```
Find:    Parish
Replace: County
Regex:   OFF
Match Case: ON
```

**Pattern 4.3 - parish → county**
```
Find:    parish
Replace: county
Regex:   OFF
Match Case: ON
```

---

### Group 5: Tax ID Fields

**Pattern 5.1 - Tax Registration Number → Employer Identification Number**
```
Find:    Tax Registration Number
Replace: Employer Identification Number
Regex:   OFF
Match Case: OFF
```

**Pattern 5.2 - TRN → EIN (Case-Sensitive)**
```
Find:    TRN
Replace: EIN
Regex:   OFF
Match Case: ON
```

---

### Group 6: LocalStorage Keys (Case-Sensitive)

**Pattern 6.1 - lookyah_visited → tourflo_visited**
```
Find:    lookyah_visited
Replace: tourflo_visited
Regex:   OFF
Match Case: ON
```

**Pattern 6.2 - lookyah_onboarded → tourflo_onboarded**
```
Find:    lookyah_onboarded
Replace: tourflo_onboarded
Regex:   OFF
Match Case: ON
```

**Pattern 6.3 - lookyah_guest_mode → tourflo_guest_mode**
```
Find:    lookyah_guest_mode
Replace: tourflo_guest_mode
Regex:   OFF
Match Case: ON
```

---

### Group 7: Location Values in Code

**Pattern 7.1 - 'In Jamaica' → 'In Florida'**
```
Find:    'In Jamaica'
Replace: 'In Florida'
Regex:   OFF
Match Case: OFF
```

**Pattern 7.2 - "In Jamaica" → "In Florida"**
```
Find:    "In Jamaica"
Replace: "In Florida"
Regex:   OFF
Match Case: OFF
```

**Pattern 7.3 - value: 'jamaica' → value: 'florida' (Case-Sensitive)**
```
Find:    value: 'jamaica'
Replace: value: 'florida'
Regex:   OFF
Match Case: ON
```

**Pattern 7.4 - value: "jamaica" → value: "florida" (Case-Sensitive)**
```
Find:    value: "jamaica"
Replace: value: "florida"
Regex:   OFF
Match Case: ON
```

---

### Group 8: PWA & Service Worker Cache Names

**Pattern 8.1 - lookyah-v2 → tourflo-v2**
```
Find:    lookyah-v2
Replace: tourflo-v2
Regex:   OFF
Match Case: ON
```

**Pattern 8.2 - lookyah-dynamic-v2 → tourflo-dynamic-v2**
```
Find:    lookyah-dynamic-v2
Replace: tourflo-dynamic-v2
Regex:   OFF
Match Case: ON
```

---

## 🔍 Advanced: Regex Patterns for Complex Replacements

### Currency Removal Patterns (Requires Manual Review)

**Pattern A1 - Remove JMD ternary operators**
```
Find:    currency_pref === ['"]JMD['"] \? .+? : (.+?);
Replace: $1;
Regex:   ON
Match Case: OFF
```
⚠️ **Warning:** This pattern requires careful review. Test on a few files first.

**Pattern A2 - Remove price_jmd field references**
```
Find:    \.price_jmd\b
Replace: .price_usd
Regex:   ON
Match Case: OFF
```

**Pattern A3 - Remove total_price_jmd references**
```
Find:    \.total_price_jmd\b
Replace: .total_price_usd
Regex:   ON
Match Case: OFF
```

---

## 📊 File Scope Settings

### Recommended File Scope

Include these file types in your search:
```
**/*.tsx
**/*.ts
**/*.jsx
**/*.js
**/*.json
**/*.html
**/*.md
```

### Exclude Patterns

Exclude these directories/files:
```
**/node_modules/**
**/dist/**
**/build/**
**/.git/**
**/.migration-backups/**
**/TOURFLO_MIGRATION_GUIDE.md
**/TOURFLO_FLORIDA_CATEGORIES.md
```

---

## 🎯 Execution Strategy

### Recommended Order

Execute patterns in this order for best results:

1. **Group 1** - Brand names (LOOKYAH, JAHBOI)
2. **Group 3** - Specific locations (Negril, Kingston, etc.)
3. **Group 2** - Generic geographic terms (Jamaica, Jamaican)
4. **Group 4** - Administrative divisions (parish → county)
5. **Group 5** - Tax ID fields (TRN → EIN)
6. **Group 6** - LocalStorage keys
7. **Group 7** - Location values in code
8. **Group 8** - PWA cache names

### Why This Order?

- Specific replacements before generic ones prevents unwanted matches
- Example: Replace "Negril" → "Key West" BEFORE "Jamaica" → "Florida"
- This prevents "Negril, Jamaica" becoming "Key West, Florida" incorrectly

---

## ⚠️ Safety Tips

### 1. Create a Git Commit First
```bash
git add .
git commit -m "Pre-migration checkpoint"
```

### 2. Use "Replace All in File" First
- Test on one file before using "Replace All in Folder"
- Review changes in that file
- If correct, proceed with full replacement

### 3. Preview Changes
- Click "Replace" (not "Replace All") to review each match
- Use arrow keys to navigate through matches
- Press Enter to confirm or Escape to skip

### 4. Files to Review Manually

These patterns may need manual review:
- Currency-related ternary operators
- JMD/USD price calculations
- Location-specific logic (coordinates, regions)
- Comments containing "Jamaica" (may want to keep for historical context)

---

## 📝 Usage Instructions

### Method 1: One Pattern at a Time (Recommended)

1. Open VS Code
2. Press `Ctrl+H` (or `Cmd+H` on Mac)
3. Copy **Find** text from pattern above
4. Paste into Find field
5. Copy **Replace** text from pattern above
6. Paste into Replace field
7. Set **Regex** and **Match Case** as specified
8. Click "Replace All" or review individually
9. Move to next pattern

### Method 2: Batch Processing

VS Code doesn't support batch find/replace natively. Use one of these alternatives:
- **JavaScript script**: `node scripts/find-replace.js --dry-run`
- **Bash script**: `bash scripts/find-replace.sh --dry-run`

---

## 🔄 Rollback Instructions

If you need to undo changes:

### Option 1: Git Revert
```bash
git reset --hard HEAD
```

### Option 2: Use Undo History
- `Ctrl+Z` (or `Cmd+Z`) to undo recent changes
- VS Code tracks undo history per file

### Option 3: Use Automated Script Rollback
```bash
node scripts/find-replace.js --rollback
# or
bash scripts/find-replace.sh --rollback
```

---

## 📊 Expected Results

After running all patterns, you should see approximately:

- **Brand Names**: 50-100 replacements
  - LOOKYAH → TOURFLO: ~25 occurrences
  - JAHBOI → FLORBOT: ~15 occurrences

- **Geographic**: 30-60 replacements
  - Jamaica → Florida: ~20 occurrences
  - Location names: ~10-15 occurrences

- **Administrative**: 10-20 replacements
  - parish → county: ~10 occurrences

- **Other**: 20-40 replacements
  - LocalStorage keys: ~5 occurrences
  - Tax fields: ~5 occurrences
  - PWA cache: ~2 occurrences

**Total Expected**: 110-220 replacements across 30-50 files

---

## 🎓 Pro Tips

### Tip 1: Use Search Editor for Preview
1. Press `Ctrl+Shift+F` (Search in Files)
2. Enter search term
3. Review all matches before replacing
4. Then use `Ctrl+H` to replace

### Tip 2: Use Multiple Cursors
1. Select a word
2. Press `Ctrl+D` repeatedly to select next occurrences
3. Edit all at once

### Tip 3: Regex Capture Groups
For complex patterns, use capture groups:
```
Find:    lookyah[-_](\w+)
Replace: tourflo-$1
```
This preserves the suffix (e.g., `lookyah-visited` → `tourflo-visited`)

### Tip 4: Check Impact Before Replacing
Use the **Search Results** panel to see:
- Number of files affected
- Total number of matches
- Context of each match

---

## 📞 Support

### Common Issues

**Issue: Too many false positives**
- Solution: Enable "Match Case" or use "Match Whole Word"

**Issue: Pattern not matching**
- Solution: Check if Regex mode is enabled when needed
- Solution: Check for hidden characters (tabs vs spaces)

**Issue: Replacements in wrong files**
- Solution: Use file inclusion/exclusion patterns
- Solution: Replace file-by-file instead of all at once

---

**Generated:** 2025-11-18
**Platform:** TourFlo Florida
**Version:** 1.0.0
