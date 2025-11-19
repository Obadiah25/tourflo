#!/bin/bash

################################################################################
# TourFlo Migration: Automated Find & Replace Script (Bash)
#
# Automates global find/replace operations from TOURFLO_MIGRATION_GUIDE.md
#
# Usage:
#   bash scripts/find-replace.sh --dry-run    # Preview changes
#   bash scripts/find-replace.sh              # Execute changes
#   bash scripts/find-replace.sh --rollback   # Restore from backups
#
# Features:
#   - Case-sensitive replacements using sed
#   - Automatic backups
#   - Cross-platform (Linux/Mac/Windows Git Bash)
#   - Progress indicators
#   - Detailed reporting
################################################################################

set -e  # Exit on error

# Configuration
DRY_RUN=false
ROLLBACK=false
BACKUP_DIR=".migration-backups"
BACKUP_TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
TEMP_FILE="/tmp/tourflo_migration_$$"

# Parse arguments
for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      ;;
    --rollback)
      ROLLBACK=true
      ;;
  esac
done

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

# Statistics
FILES_SCANNED=0
FILES_MODIFIED=0
TOTAL_REPLACEMENTS=0

# File patterns to search
FILE_EXTENSIONS=("tsx" "ts" "jsx" "js" "json" "html" "md")

# Files/directories to exclude
EXCLUDE_PATTERNS=(
  "node_modules"
  "dist"
  "build"
  ".git"
  ".migration-backups"
  "TOURFLO_MIGRATION_GUIDE.md"
  "TOURFLO_FLORIDA_CATEGORIES.md"
  "find-replace.js"
  "find-replace.sh"
)

################################################################################
# Functions
################################################################################

# Print colored output
log() {
  local color=$1
  shift
  echo -e "${color}$@${RESET}"
}

# Check if file should be excluded
should_exclude() {
  local file=$1
  for pattern in "${EXCLUDE_PATTERNS[@]}"; do
    if [[ "$file" == *"$pattern"* ]]; then
      return 0  # true (exclude)
    fi
  done
  return 1  # false (include)
}

# Find all files to process
find_files() {
  local files=()
  for ext in "${FILE_EXTENSIONS[@]}"; do
    while IFS= read -r file; do
      if ! should_exclude "$file"; then
        files+=("$file")
      fi
    done < <(find . -type f -name "*.${ext}" 2>/dev/null)
  done
  echo "${files[@]}"
}

# Create backup of a file
create_backup() {
  local file=$1
  local backup_path="${BACKUP_DIR}/${BACKUP_TIMESTAMP}/${file}"
  local backup_dir=$(dirname "$backup_path")

  if [ "$DRY_RUN" = false ] && [ "$ROLLBACK" = false ]; then
    mkdir -p "$backup_dir"
    cp "$file" "$backup_path"
  fi
}

# Apply single replacement to file
apply_replacement() {
  local file=$1
  local find=$2
  local replace=$3
  local case_sensitive=$4

  local sed_flags="g"
  if [ "$case_sensitive" = "false" ]; then
    sed_flags="gi"
  fi

  # Use different sed syntax for Mac vs Linux
  if [[ "$OSTYPE" == "darwin"* ]]; then
    # Mac
    sed -i '' "s/${find}/${replace}/${sed_flags}" "$file" 2>/dev/null || true
  else
    # Linux/Git Bash
    sed -i "s/${find}/${replace}/${sed_flags}" "$file" 2>/dev/null || true
  fi
}

# Count occurrences in file
count_occurrences() {
  local file=$1
  local pattern=$2
  local case_flag=""

  if [ "$3" = "false" ]; then
    case_flag="-i"
  fi

  grep -o $case_flag "$pattern" "$file" 2>/dev/null | wc -l | tr -d ' '
}

# Process a single file
process_file() {
  local file=$1
  local file_modified=false
  local file_replacements=0

  FILES_SCANNED=$((FILES_SCANNED + 1))

  # Create temporary working copy
  cp "$file" "$TEMP_FILE"

  # Apply all replacements
  # 1. Brand Name Replacements (case-sensitive)
  apply_replacement "$TEMP_FILE" "LOOKYAH" "TOURFLO" true
  apply_replacement "$TEMP_FILE" "LookYah" "TourFlo" true
  apply_replacement "$TEMP_FILE" "Lookyah" "TourFlo" true
  apply_replacement "$TEMP_FILE" "lookyah" "tourflo" true

  apply_replacement "$TEMP_FILE" "JAHBOI" "FLORBOT" true
  apply_replacement "$TEMP_FILE" "Jahboi" "FlorBot" true
  apply_replacement "$TEMP_FILE" "jahboi" "florbot" true

  # 2. Geographic Replacements
  apply_replacement "$TEMP_FILE" "Jamaica-based" "Florida-based" false
  apply_replacement "$TEMP_FILE" "Jamaican" "Florida" false
  apply_replacement "$TEMP_FILE" "Jamaica" "Florida" false

  # Specific locations
  apply_replacement "$TEMP_FILE" "Dunn's River Falls" "Everglades National Park" false
  apply_replacement "$TEMP_FILE" "Rick's Cafe" "Sunset Cruises" false
  apply_replacement "$TEMP_FILE" "Blue Mountains" "Everglades" false
  apply_replacement "$TEMP_FILE" "Montego Bay" "Fort Lauderdale" false
  apply_replacement "$TEMP_FILE" "Ocho Rios" "Orlando" false
  apply_replacement "$TEMP_FILE" "Negril" "Key West" false
  apply_replacement "$TEMP_FILE" "Kingston" "Miami" false
  apply_replacement "$TEMP_FILE" "Falmouth" "Tampa" false

  # 3. Administrative Divisions
  apply_replacement "$TEMP_FILE" "parishes" "counties" true
  apply_replacement "$TEMP_FILE" "Parish" "County" true
  apply_replacement "$TEMP_FILE" "parish" "county" true

  # 4. Tax ID Fields
  apply_replacement "$TEMP_FILE" "Tax Registration Number" "Employer Identification Number" false
  apply_replacement "$TEMP_FILE" "TRN" "EIN" true

  # 5. LocalStorage Keys
  apply_replacement "$TEMP_FILE" "lookyah_visited" "tourflo_visited" true
  apply_replacement "$TEMP_FILE" "lookyah_onboarded" "tourflo_onboarded" true
  apply_replacement "$TEMP_FILE" "lookyah_guest_mode" "tourflo_guest_mode" true

  # 6. Location values
  apply_replacement "$TEMP_FILE" "'In Jamaica'" "'In Florida'" false
  apply_replacement "$TEMP_FILE" '"In Jamaica"' '"In Florida"' false
  apply_replacement "$TEMP_FILE" "value: 'jamaica'" "value: 'florida'" true
  apply_replacement "$TEMP_FILE" 'value: "jamaica"' 'value: "florida"' true

  # 7. PWA & Service Worker
  apply_replacement "$TEMP_FILE" "lookyah-v2" "tourflo-v2" true
  apply_replacement "$TEMP_FILE" "lookyah-dynamic-v2" "tourflo-dynamic-v2" true

  # Check if file was modified
  if ! cmp -s "$file" "$TEMP_FILE"; then
    FILES_MODIFIED=$((FILES_MODIFIED + 1))

    if [ "$DRY_RUN" = false ]; then
      create_backup "$file"
      mv "$TEMP_FILE" "$file"
    fi

    file_modified=true
  fi

  # Clean up temp file
  rm -f "$TEMP_FILE"
}

# Perform rollback
perform_rollback() {
  log "$CYAN" "\n🔄 ROLLBACK MODE"
  log "$CYAN" "========================================"

  if [ ! -d "$BACKUP_DIR" ]; then
    log "$RED" "❌ No backups found!"
    exit 1
  fi

  # List available backups
  local backups=($(ls -1 "$BACKUP_DIR" | sort))

  if [ ${#backups[@]} -eq 0 ]; then
    log "$RED" "❌ No backups found!"
    exit 1
  fi

  log "$CYAN" "\nAvailable backups:"
  for i in "${!backups[@]}"; do
    log "$CYAN" "  $((i+1)). ${backups[$i]}"
  done

  # Use most recent backup
  local latest_backup="${backups[-1]}"
  log "$GREEN" "\n📦 Restoring from: $latest_backup"

  local restored_count=0

  # Restore files
  while IFS= read -r backup_file; do
    local relative_path="${backup_file#${BACKUP_DIR}/${latest_backup}/}"
    if [ -f "$backup_file" ]; then
      cp "$backup_file" "$relative_path"
      restored_count=$((restored_count + 1))
    fi
  done < <(find "${BACKUP_DIR}/${latest_backup}" -type f)

  log "$GREEN" "\n✅ Restored $restored_count files from backup"
}

# Print final report
print_report() {
  log "$CYAN" "\n========================================"
  log "$CYAN" "📊 MIGRATION REPORT"
  log "$CYAN" "========================================\n"

  if [ "$DRY_RUN" = true ]; then
    log "$YELLOW" "⚠️  DRY RUN MODE - No files were modified\n"
  fi

  log "$BLUE" "Files Scanned:      $FILES_SCANNED"
  log "$GREEN" "Files Modified:     $FILES_MODIFIED"

  if [ "$DRY_RUN" = false ] && [ "$ROLLBACK" = false ] && [ $FILES_MODIFIED -gt 0 ]; then
    log "$GREEN" "\n✅ SUCCESS! Files have been updated."
    log "$YELLOW" "\n📦 Backups saved to: ${BACKUP_DIR}/${BACKUP_TIMESTAMP}"
    log "$YELLOW" "\n🔄 To rollback, run: bash scripts/find-replace.sh --rollback"
  fi

  if [ "$DRY_RUN" = true ] && [ $FILES_MODIFIED -gt 0 ]; then
    log "$GREEN" "\n▶️  To execute changes, run: bash scripts/find-replace.sh"
  fi

  if [ $FILES_MODIFIED -eq 0 ] && [ "$ROLLBACK" = false ]; then
    log "$GREEN" "\n✨ No changes needed - all files are up to date!"
  fi

  log "$CYAN" "\n========================================\n"
}

################################################################################
# Main Execution
################################################################################

main() {
  log "$BOLD" "\n🚀 TourFlo Migration: Find & Replace\n"

  if [ "$ROLLBACK" = true ]; then
    perform_rollback
    return
  fi

  if [ "$DRY_RUN" = true ]; then
    log "$YELLOW" "⚠️  Running in DRY RUN mode - no files will be modified\n"
  else
    log "$GREEN" "▶️  Running in EXECUTE mode - files will be modified\n"
  fi

  log "$BLUE" "🔍 Finding files..."
  FILES=($(find_files))
  log "$BLUE" "   Found ${#FILES[@]} files to scan\n"

  log "$BLUE" "🔄 Processing files..."

  local count=0
  for file in "${FILES[@]}"; do
    count=$((count + 1))
    if [ $((count % 10)) -eq 0 ]; then
      echo -ne "\r   Progress: $count/${#FILES[@]}"
    fi
    process_file "$file"
  done
  echo -e "\r   Progress: ${#FILES[@]}/${#FILES[@]}\n"

  print_report
}

# Run the script
main
