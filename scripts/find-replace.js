#!/usr/bin/env node

/**
 * TourFlo Migration: Automated Find & Replace Script
 *
 * Automates global find/replace operations from TOURFLO_MIGRATION_GUIDE.md
 *
 * Usage:
 *   node scripts/find-replace.js --dry-run    # Preview changes
 *   node scripts/find-replace.js              # Execute changes
 *   node scripts/find-replace.js --rollback   # Restore from backups
 *
 * Features:
 *   - Case-sensitive replacements
 *   - Automatic backups
 *   - Detailed reporting
 *   - Dry-run mode
 *   - Rollback support
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DRY_RUN = process.argv.includes('--dry-run');
const ROLLBACK = process.argv.includes('--rollback');
const BACKUP_DIR = '.migration-backups';
const BACKUP_TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// File patterns to search
const FILE_PATTERNS = [
  'src/**/*.tsx',
  'src/**/*.ts',
  'src/**/*.jsx',
  'src/**/*.js',
  'public/*.js',
  'public/*.json',
  'index.html',
  '*.md',
];

// Patterns to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  'dist',
  'build',
  '.git',
  '.migration-backups',
  'TOURFLO_MIGRATION_GUIDE.md',
  'TOURFLO_FLORIDA_CATEGORIES.md',
  'find-replace.js',
  'find-replace.sh',
];

// Replacement patterns (order matters!)
const REPLACEMENTS = [
  // 1. Brand Name Replacements (case-sensitive)
  { find: 'LOOKYAH', replace: 'TOURFLO', caseSensitive: true, category: 'Brand' },
  { find: 'LookYah', replace: 'TourFlo', caseSensitive: true, category: 'Brand' },
  { find: 'Lookyah', replace: 'TourFlo', caseSensitive: true, category: 'Brand' },
  { find: 'lookyah', replace: 'tourflo', caseSensitive: true, category: 'Brand' },

  { find: 'JAHBOI', replace: 'FLORBOT', caseSensitive: true, category: 'Brand' },
  { find: 'Jahboi', replace: 'FlorBot', caseSensitive: true, category: 'Brand' },
  { find: 'jahboi', replace: 'florbot', caseSensitive: true, category: 'Brand' },

  // 2. Geographic Replacements
  { find: 'Jamaica-based', replace: 'Florida-based', caseSensitive: false, category: 'Geographic' },
  { find: 'Jamaican', replace: 'Florida', caseSensitive: false, category: 'Geographic' },
  { find: 'Jamaica', replace: 'Florida', caseSensitive: false, category: 'Geographic' },

  // Specific Jamaica locations → Florida locations
  { find: "Dunn's River Falls", replace: 'Everglades National Park', caseSensitive: false, category: 'Location' },
  { find: "Rick's Cafe", replace: 'Sunset Cruises', caseSensitive: false, category: 'Location' },
  { find: 'Blue Mountains', replace: 'Everglades', caseSensitive: false, category: 'Location' },
  { find: 'Montego Bay', replace: 'Fort Lauderdale', caseSensitive: false, category: 'Location' },
  { find: 'Ocho Rios', replace: 'Orlando', caseSensitive: false, category: 'Location' },
  { find: 'Negril', replace: 'Key West', caseSensitive: false, category: 'Location' },
  { find: 'Kingston', replace: 'Miami', caseSensitive: false, category: 'Location' },
  { find: 'Falmouth', replace: 'Tampa', caseSensitive: false, category: 'Location' },

  // 3. Administrative Divisions
  { find: 'parishes', replace: 'counties', caseSensitive: true, category: 'Administrative' },
  { find: 'Parish', replace: 'County', caseSensitive: true, category: 'Administrative' },
  { find: 'parish', replace: 'county', caseSensitive: true, category: 'Administrative' },

  // 4. Tax ID Fields
  { find: 'Tax Registration Number', replace: 'Employer Identification Number', caseSensitive: false, category: 'Field Labels' },
  { find: 'TRN', replace: 'EIN', caseSensitive: true, category: 'Field Labels' },

  // 5. LocalStorage Keys
  { find: 'lookyah_visited', replace: 'tourflo_visited', caseSensitive: true, category: 'Storage Keys' },
  { find: 'lookyah_onboarded', replace: 'tourflo_onboarded', caseSensitive: true, category: 'Storage Keys' },
  { find: 'lookyah_guest_mode', replace: 'tourflo_guest_mode', caseSensitive: true, category: 'Storage Keys' },

  // 6. Location values in code
  { find: "'In Jamaica'", replace: "'In Florida'", caseSensitive: false, category: 'UI Text' },
  { find: '"In Jamaica"', replace: '"In Florida"', caseSensitive: false, category: 'UI Text' },
  { find: "value: 'jamaica'", replace: "value: 'florida'", caseSensitive: true, category: 'Values' },
  { find: 'value: "jamaica"', replace: 'value: "florida"', caseSensitive: true, category: 'Values' },

  // 7. PWA & Service Worker cache names
  { find: 'lookyah-v2', replace: 'tourflo-v2', caseSensitive: true, category: 'Cache Names' },
  { find: 'lookyah-dynamic-v2', replace: 'tourflo-dynamic-v2', caseSensitive: true, category: 'Cache Names' },
];

// Statistics
const stats = {
  filesScanned: 0,
  filesModified: 0,
  totalReplacements: 0,
  replacementsByCategory: {},
  replacementsByPattern: {},
  filesWithChanges: [],
};

/**
 * Log with color
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Find all files matching patterns
 */
function findFiles() {
  const files = [];

  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip excluded patterns
      if (EXCLUDE_PATTERNS.some(pattern => fullPath.includes(pattern))) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        // Check if file matches our patterns
        const ext = path.extname(entry.name);
        if (['.tsx', '.ts', '.jsx', '.js', '.json', '.html', '.md'].includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }

  walk('.');
  return files;
}

/**
 * Create backup of a file
 */
function createBackup(filePath) {
  if (DRY_RUN || ROLLBACK) return;

  const backupPath = path.join(BACKUP_DIR, BACKUP_TIMESTAMP, filePath);
  const backupDirPath = path.dirname(backupPath);

  if (!fs.existsSync(backupDirPath)) {
    fs.mkdirSync(backupDirPath, { recursive: true });
  }

  fs.copyFileSync(filePath, backupPath);
}

/**
 * Restore file from backup
 */
function restoreFromBackup(filePath, backupTimestamp) {
  const backupPath = path.join(BACKUP_DIR, backupTimestamp, filePath);

  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, filePath);
    return true;
  }

  return false;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  stats.filesScanned++;

  let content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  let fileModified = false;
  let fileReplacements = 0;

  // Apply all replacement patterns
  for (const pattern of REPLACEMENTS) {
    const { find, replace, caseSensitive, category } = pattern;

    // Create regex for replacement
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), flags);

    // Count matches before replacement
    const matches = (content.match(regex) || []).length;

    if (matches > 0) {
      content = content.replace(regex, replace);
      fileReplacements += matches;

      // Update stats
      if (!stats.replacementsByCategory[category]) {
        stats.replacementsByCategory[category] = 0;
      }
      stats.replacementsByCategory[category] += matches;

      const patternKey = `${find} → ${replace}`;
      if (!stats.replacementsByPattern[patternKey]) {
        stats.replacementsByPattern[patternKey] = 0;
      }
      stats.replacementsByPattern[patternKey] += matches;

      stats.totalReplacements += matches;
      fileModified = true;
    }
  }

  // Write changes if content changed
  if (fileModified && content !== originalContent) {
    stats.filesModified++;
    stats.filesWithChanges.push({
      file: filePath,
      replacements: fileReplacements,
    });

    if (!DRY_RUN) {
      createBackup(filePath);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}

/**
 * Perform rollback
 */
function performRollback() {
  log('\n🔄 ROLLBACK MODE', 'yellow');
  log('========================================\n', 'yellow');

  if (!fs.existsSync(BACKUP_DIR)) {
    log('❌ No backups found!', 'red');
    return;
  }

  // List available backups
  const backups = fs.readdirSync(BACKUP_DIR);

  if (backups.length === 0) {
    log('❌ No backups found!', 'red');
    return;
  }

  log('Available backups:', 'cyan');
  backups.forEach((backup, index) => {
    log(`  ${index + 1}. ${backup}`, 'cyan');
  });

  // Use most recent backup
  const latestBackup = backups[backups.length - 1];
  log(`\n📦 Restoring from: ${latestBackup}`, 'green');

  let restoredCount = 0;

  function restoreDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const backupPath = path.join(dir, entry.name);
      const relativePath = path.relative(path.join(BACKUP_DIR, latestBackup), backupPath);

      if (entry.isDirectory()) {
        restoreDir(backupPath);
      } else if (entry.isFile()) {
        fs.copyFileSync(backupPath, relativePath);
        restoredCount++;
      }
    }
  }

  restoreDir(path.join(BACKUP_DIR, latestBackup));

  log(`\n✅ Restored ${restoredCount} files from backup`, 'green');
}

/**
 * Print final report
 */
function printReport() {
  log('\n========================================', 'cyan');
  log('📊 MIGRATION REPORT', 'cyan');
  log('========================================\n', 'cyan');

  if (DRY_RUN) {
    log('⚠️  DRY RUN MODE - No files were modified\n', 'yellow');
  }

  log(`Files Scanned:    ${stats.filesScanned}`, 'blue');
  log(`Files Modified:   ${stats.filesModified}`, 'green');
  log(`Total Replacements: ${stats.totalReplacements}`, 'green');

  // Replacements by category
  log('\n📁 Replacements by Category:', 'cyan');
  Object.entries(stats.replacementsByCategory)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      log(`  ${category.padEnd(20)} ${count} replacements`, 'blue');
    });

  // Top 10 replacement patterns
  log('\n🔄 Top Replacement Patterns:', 'cyan');
  Object.entries(stats.replacementsByPattern)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([pattern, count]) => {
      log(`  ${count}x  ${pattern}`, 'blue');
    });

  // Files with most changes
  if (stats.filesWithChanges.length > 0) {
    log('\n📝 Files with Most Changes:', 'cyan');
    stats.filesWithChanges
      .sort((a, b) => b.replacements - a.replacements)
      .slice(0, 10)
      .forEach(({ file, replacements }) => {
        log(`  ${replacements.toString().padStart(3)} changes  ${file}`, 'blue');
      });
  }

  // Next steps
  if (!DRY_RUN && !ROLLBACK && stats.filesModified > 0) {
    log('\n✅ SUCCESS! Files have been updated.', 'green');
    log(`\n📦 Backups saved to: ${path.join(BACKUP_DIR, BACKUP_TIMESTAMP)}`, 'yellow');
    log('\n🔄 To rollback, run: node scripts/find-replace.js --rollback', 'yellow');
  }

  if (DRY_RUN && stats.filesModified > 0) {
    log('\n▶️  To execute changes, run: node scripts/find-replace.js', 'green');
  }

  if (stats.filesModified === 0 && !ROLLBACK) {
    log('\n✨ No changes needed - all files are up to date!', 'green');
  }

  log('\n========================================\n', 'cyan');
}

/**
 * Main execution
 */
function main() {
  log('\n🚀 TourFlo Migration: Find & Replace\n', 'bright');

  if (ROLLBACK) {
    performRollback();
    return;
  }

  if (DRY_RUN) {
    log('⚠️  Running in DRY RUN mode - no files will be modified\n', 'yellow');
  } else {
    log('▶️  Running in EXECUTE mode - files will be modified\n', 'green');
  }

  log('🔍 Finding files...', 'blue');
  const files = findFiles();
  log(`   Found ${files.length} files to scan\n`, 'blue');

  log('🔄 Processing files...', 'blue');
  files.forEach((file, index) => {
    if (index % 10 === 0) {
      process.stdout.write(`\r   Progress: ${index}/${files.length}`);
    }
    processFile(file);
  });
  process.stdout.write(`\r   Progress: ${files.length}/${files.length}\n\n`);

  printReport();
}

// Run the script
main();
