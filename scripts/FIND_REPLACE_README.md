# TourFlo Find & Replace Automation

Three production-ready scripts to automate global find/replace operations for the LookYah → TourFlo migration.

---

## 📦 Available Scripts

| Script | Platform | Best For | Complexity |
|--------|----------|----------|------------|
| **find-replace.js** | Node.js | Detailed reporting, cross-platform | ⭐⭐⭐ |
| **find-replace.sh** | Bash | Linux/Mac, CI/CD pipelines | ⭐⭐ |
| **vscode-find-replace-patterns.md** | VS Code GUI | Visual review, manual control | ⭐ |

---

## 🚀 Quick Start

### Recommended Approach: Node.js Script

```bash
# 1. Preview changes (dry run)
node scripts/find-replace.js --dry-run

# 2. Review the report

# 3. Execute changes
node scripts/find-replace.js

# 4. If needed, rollback
node scripts/find-replace.js --rollback
```

---

## 📋 Detailed Instructions

### Option 1: Node.js Script (Recommended)

**Pros:**
- ✅ Cross-platform (Windows, Mac, Linux)
- ✅ Detailed reporting with statistics
- ✅ Automatic backups
- ✅ Dry-run mode for safe preview
- ✅ Rollback support
- ✅ Progress indicators

**Cons:**
- ⚠️ Requires Node.js installed

**Usage:**

```bash
# Preview changes without modifying files
node scripts/find-replace.js --dry-run

# Execute changes
node scripts/find-replace.js

# Rollback to previous state
node scripts/find-replace.js --rollback
```

**Output Example:**
```
🚀 TourFlo Migration: Find & Replace

▶️  Running in EXECUTE mode - files will be modified

🔍 Finding files...
   Found 67 files to scan

🔄 Processing files...
   Progress: 67/67

========================================
📊 MIGRATION REPORT
========================================

Files Scanned:    67
Files Modified:   23
Total Replacements: 147

📁 Replacements by Category:
  Brand                 89 replacements
  Geographic            32 replacements
  Location              15 replacements
  Administrative        8 replacements
  Storage Keys          3 replacements

🔄 Top Replacement Patterns:
  42x  LOOKYAH → TOURFLO
  28x  lookyah → tourflo
  19x  Jamaica → Florida
  15x  Negril → Key West
  12x  JAHBOI → FLORBOT

📝 Files with Most Changes:
   23 changes  src/components/OnboardingFlow.tsx
   18 changes  src/components/DiscoveryFeed.tsx
   14 changes  src/lib/store.ts

✅ SUCCESS! Files have been updated.

📦 Backups saved to: .migration-backups/2025-11-18_14-30-45

🔄 To rollback, run: node scripts/find-replace.js --rollback
```

---

### Option 2: Bash Script

**Pros:**
- ✅ Native on Linux/Mac
- ✅ Fast execution
- ✅ Works with Git Bash on Windows
- ✅ No dependencies
- ✅ Simple and reliable

**Cons:**
- ⚠️ Less detailed reporting than Node.js version
- ⚠️ May have platform-specific sed syntax issues

**Usage:**

```bash
# Make script executable (first time only)
chmod +x scripts/find-replace.sh

# Preview changes
bash scripts/find-replace.sh --dry-run

# Execute changes
bash scripts/find-replace.sh

# Rollback
bash scripts/find-replace.sh --rollback
```

**Platform Notes:**

**Linux:**
```bash
bash scripts/find-replace.sh
```

**Mac:**
```bash
bash scripts/find-replace.sh
```

**Windows (Git Bash):**
```bash
bash scripts/find-replace.sh
```

---

### Option 3: VS Code Manual Find & Replace

**Pros:**
- ✅ Visual interface
- ✅ Review each change before applying
- ✅ No installation required
- ✅ Full control
- ✅ Great for selective replacements

**Cons:**
- ⚠️ Manual process (time-consuming)
- ⚠️ No automatic backups
- ⚠️ Easy to miss patterns
- ⚠️ No rollback feature

**Usage:**

1. Open `scripts/vscode-find-replace-patterns.md`
2. Follow instructions in that file
3. Copy/paste patterns into VS Code Find & Replace
4. Review and apply changes

**Best for:**
- Learning what changes are being made
- Double-checking automated results
- Making selective replacements
- Educational purposes

---

## 🔍 What Gets Replaced?

### 1. Brand Names (Case-Sensitive)
- `LOOKYAH` → `TOURFLO`
- `LookYah` → `TourFlo`
- `Lookyah` → `TourFlo`
- `lookyah` → `tourflo`
- `JAHBOI` → `FLORBOT`
- `Jahboi` → `FlorBot`
- `jahboi` → `florbot`

### 2. Geographic References
- `Jamaica` → `Florida`
- `Jamaican` → `Florida`
- `Jamaica-based` → `Florida-based`

### 3. Location Names
- `Negril` → `Key West`
- `Ocho Rios` → `Orlando`
- `Kingston` → `Miami`
- `Montego Bay` → `Fort Lauderdale`
- `Falmouth` → `Tampa`
- `Dunn's River Falls` → `Everglades National Park`
- `Rick's Cafe` → `Sunset Cruises`
- `Blue Mountains` → `Everglades`

### 4. Administrative Divisions
- `parish` → `county`
- `Parish` → `County`
- `parishes` → `counties`

### 5. Tax ID Fields
- `TRN` → `EIN`
- `Tax Registration Number` → `Employer Identification Number`

### 6. LocalStorage Keys
- `lookyah_visited` → `tourflo_visited`
- `lookyah_onboarded` → `tourflo_onboarded`
- `lookyah_guest_mode` → `tourflo_guest_mode`

### 7. Location Values in Code
- `'In Jamaica'` → `'In Florida'`
- `value: 'jamaica'` → `value: 'florida'`

### 8. PWA Cache Names
- `lookyah-v2` → `tourflo-v2`
- `lookyah-dynamic-v2` → `tourflo-dynamic-v2`

---

## 📁 Files Affected

### Included File Types:
- `.tsx` - React TypeScript components
- `.ts` - TypeScript files
- `.jsx` - React JavaScript components
- `.js` - JavaScript files
- `.json` - Configuration files
- `.html` - HTML files
- `.md` - Markdown documentation

### Excluded Directories:
- `node_modules/`
- `dist/`
- `build/`
- `.git/`
- `.migration-backups/`

### Excluded Files:
- `TOURFLO_MIGRATION_GUIDE.md` (reference document)
- `TOURFLO_FLORIDA_CATEGORIES.md` (reference document)
- `find-replace.js` (this script)
- `find-replace.sh` (this script)

---

## 🛡️ Safety Features

### All Scripts Include:

1. **Automatic Backups**
   - Original files backed up before modification
   - Timestamped backup folders
   - Easy rollback capability

2. **Dry-Run Mode**
   - Preview all changes before applying
   - See exactly what will be modified
   - No files touched in dry-run mode

3. **Detailed Reporting**
   - Number of files scanned
   - Number of files modified
   - Total replacements made
   - Breakdown by category
   - Top replacement patterns

4. **Rollback Support**
   - Restore from latest backup
   - Complete undo capability
   - Preserves original files

---

## 📊 Expected Results

After running any of these scripts, you should see:

**Files Modified:** 20-30 files
**Total Replacements:** 100-200 replacements

**Breakdown:**
- Brand names: 60-100 replacements
- Geographic terms: 20-40 replacements
- Location names: 10-20 replacements
- Administrative: 5-15 replacements
- Other: 5-25 replacements

**Most Affected Files:**
- `src/components/OnboardingFlow.tsx` (~20 changes)
- `src/components/DiscoveryFeed.tsx` (~15 changes)
- `src/components/AuthScreen.tsx` (~10 changes)
- `src/lib/store.ts` (~12 changes)
- `public/manifest.json` (~3 changes)
- `public/sw.js` (~2 changes)

---

## ⚠️ Pre-Execution Checklist

Before running any script:

- [ ] **Backup your code** (Git commit or manual backup)
- [ ] **Close all files** in your editor
- [ ] **Review the patterns** in this README
- [ ] **Run in dry-run mode first**
- [ ] **Check for uncommitted changes** (`git status`)
- [ ] **Ensure no build process is running**

---

## 🔄 Rollback Procedures

### If Something Goes Wrong:

**Method 1: Use Script Rollback**
```bash
# Node.js
node scripts/find-replace.js --rollback

# Bash
bash scripts/find-replace.sh --rollback
```

**Method 2: Git Revert**
```bash
# Discard all changes
git reset --hard HEAD

# Or restore specific files
git checkout HEAD -- src/components/OnboardingFlow.tsx
```

**Method 3: Manual Restore from Backups**
```bash
# Backups are in .migration-backups/TIMESTAMP/
cp -r .migration-backups/2025-11-18_14-30-45/* .
```

---

## 🧪 Testing Strategy

### Step 1: Test on Single File

```bash
# Create test file
cp src/components/OnboardingFlow.tsx test.tsx

# Run replacements on test file only
node scripts/find-replace.js --dry-run

# Review test.tsx
# Delete test file when done
rm test.tsx
```

### Step 2: Dry Run on Entire Codebase

```bash
node scripts/find-replace.js --dry-run
```

Review the report carefully:
- Are the replacement counts reasonable?
- Are the affected files correct?
- Any unexpected patterns?

### Step 3: Execute with Backups

```bash
node scripts/find-replace.js
```

### Step 4: Verify Changes

```bash
# Check git diff
git diff

# Review specific files
code src/components/OnboardingFlow.tsx

# Run tests
npm test

# Build project
npm run build
```

### Step 5: Commit or Rollback

```bash
# If good, commit
git add .
git commit -m "feat: migrate branding from LookYah to TourFlo"

# If issues, rollback
node scripts/find-replace.js --rollback
```

---

## 🐛 Troubleshooting

### Issue: "Command not found: node"

**Solution:** Install Node.js from https://nodejs.org/

### Issue: "Permission denied" on bash script

**Solution:**
```bash
chmod +x scripts/find-replace.sh
```

### Issue: Sed syntax errors on Mac

**Solution:** Use the Node.js script instead:
```bash
node scripts/find-replace.js
```

### Issue: Changes not appearing

**Solution:**
1. Check if files are open in editor (close and reopen)
2. Verify file isn't in exclude list
3. Check if pattern is case-sensitive
4. Run in dry-run mode to see what's happening

### Issue: Too many replacements

**Solution:**
1. Review dry-run output
2. Check for false positives
3. Adjust patterns if needed
4. Use VS Code manual method for more control

### Issue: Can't rollback

**Solution:**
1. Check if backups exist: `ls .migration-backups/`
2. Manually restore from backups
3. Use Git reset if you committed before migration

---

## 📈 Performance

**Node.js Script:**
- Small project (< 50 files): ~1-2 seconds
- Medium project (50-200 files): ~2-5 seconds
- Large project (200+ files): ~5-10 seconds

**Bash Script:**
- Slightly faster than Node.js
- Performance depends on `sed` implementation

**VS Code Manual:**
- Depends on human speed
- 5-15 minutes for all patterns

---

## 🎯 Best Practices

### 1. Always Commit First
```bash
git add .
git commit -m "Pre-migration checkpoint"
```

### 2. Use Dry-Run Mode
```bash
node scripts/find-replace.js --dry-run
```

### 3. Review Before Committing
```bash
git diff > migration-changes.diff
code migration-changes.diff
```

### 4. Test the Build
```bash
npm run build
npm test
```

### 5. Keep Backups
Don't delete `.migration-backups/` folder for at least 24 hours after migration.

---

## 📝 Script Comparison

| Feature | Node.js | Bash | VS Code |
|---------|---------|------|---------|
| Cross-platform | ✅ Yes | ⚠️ Mostly | ✅ Yes |
| Dry-run mode | ✅ Yes | ✅ Yes | ✅ Manual |
| Automatic backups | ✅ Yes | ✅ Yes | ❌ No |
| Rollback support | ✅ Yes | ✅ Yes | ❌ No |
| Detailed reporting | ✅ Yes | ⚠️ Basic | ❌ No |
| Visual review | ❌ No | ❌ No | ✅ Yes |
| Speed | ⚡ Fast | ⚡⚡ Faster | 🐌 Slow |
| Learning curve | ⭐⭐ Medium | ⭐⭐ Medium | ⭐ Easy |
| Best for | Most users | Linux/Mac | Manual review |

---

## 🎓 Advanced Usage

### Custom Patterns

Add your own patterns to the scripts:

**Node.js (find-replace.js):**
```javascript
const REPLACEMENTS = [
  // ... existing patterns ...
  { find: 'MyPattern', replace: 'NewPattern', caseSensitive: true, category: 'Custom' },
];
```

**Bash (find-replace.sh):**
```bash
# Add to process_file() function
apply_replacement "$TEMP_FILE" "MyPattern" "NewPattern" true
```

### Selective Execution

To run only specific pattern categories, modify the scripts to filter `REPLACEMENTS` array.

### Integration with CI/CD

```yaml
# GitHub Actions example
- name: Run migration
  run: |
    node scripts/find-replace.js --dry-run
    node scripts/find-replace.js
    npm run build
```

---

## 📞 Support

### Getting Help

If you encounter issues:

1. Check the Troubleshooting section above
2. Review dry-run output for clues
3. Test on a single file first
4. Check Git diff to see what changed
5. Use VS Code method for manual control

### Reporting Issues

Include:
- Which script you're using
- Operating system
- Node.js version (for Node.js script)
- Error message or unexpected behavior
- Dry-run output

---

**Generated:** 2025-11-18
**Platform:** TourFlo Florida
**Version:** 1.0.0
