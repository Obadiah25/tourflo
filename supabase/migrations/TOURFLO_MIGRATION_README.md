# TourFlo Florida Migration Scripts

Complete SQL migration suite to convert LookYah Jamaica database to TourFlo Florida.

---

## 📋 Overview

This migration transforms the LookYah Jamaica tourism platform database into TourFlo Florida by:

- Converting Jamaica-specific fields to Florida equivalents
- Replacing Jamaica categories with Florida tourism categories
- Removing dual currency (JMD/USD) in favor of USD-only
- Mapping Jamaica locations to Florida locations
- Implementing comprehensive vibe tag system

---

## 🗂️ Migration Files

| File | Description | Estimated Runtime | Impact |
|------|-------------|-------------------|--------|
| **001_operator_profile_changes.sql** | Parish→County, TRN→EIN, Country updates | 2-5 seconds | All operators |
| **002_category_system_updates.sql** | 9 Florida categories, mapping tables | 3-8 seconds | All experiences + new tables |
| **003_currency_changes.sql** | Remove JMD, standardize to USD | 2-5 seconds | All pricing fields |
| **004_location_data_updates.sql** | Jamaica→Florida location mapping | 3-8 seconds | All location data |
| **005_vibe_tags.sql** | 15 vibe tags, multi-select system | 2-5 seconds | All experiences + new tables |

**Total Estimated Runtime:** 12-31 seconds

---

## ⚠️ Pre-Migration Checklist

### 1. Backup Database

```bash
# Full database backup
pg_dump -h your-db-host -U postgres your_db_name > lookyah_backup_$(date +%Y%m%d_%H%M%S).sql

# Or use Supabase dashboard backup feature
# Dashboard → Database → Backups → Create Backup
```

### 2. Test Environment Setup

```bash
# Create a test database and restore backup
createdb lookyah_test
psql -h your-db-host -U postgres lookyah_test < lookyah_backup_YYYYMMDD_HHMMSS.sql

# Test migrations on test database first
```

### 3. Maintenance Window

- **Recommended:** Schedule during low-traffic period (2-4 AM)
- **Duration:** 30-60 minutes (includes testing)
- **Downtime:** Minimal for reads, ~5 minutes for writes

### 4. Dependencies Check

```bash
# Verify PostgreSQL version (requires 12+)
psql -c "SELECT version();"

# Verify extensions
psql -c "SELECT * FROM pg_extension;"

# Verify current schema
psql -c "\dt" # List tables
```

---

## 🚀 Execution Instructions

### Method 1: Using Supabase CLI (Recommended)

```bash
# 1. Login to Supabase
supabase login

# 2. Link to your project
supabase link --project-ref your-project-ref

# 3. Apply migrations in order
supabase db push

# Migrations will be applied automatically in filename order
```

### Method 2: Using SQL Editor (Supabase Dashboard)

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Execute each migration file **in numerical order**:
   - Copy contents of `20251118000001_tourflo_migration_001_operator_profile_changes.sql`
   - Paste into SQL Editor
   - Click **Run**
   - Wait for completion (check for errors)
   - Repeat for migrations 002-005

### Method 3: Direct PostgreSQL Connection

```bash
# Execute each migration file in order
psql -h your-db-host -U postgres -d your_db_name -f supabase/migrations/20251118000001_tourflo_migration_001_operator_profile_changes.sql
psql -h your-db-host -U postgres -d your_db_name -f supabase/migrations/20251118000002_tourflo_migration_002_category_system_updates.sql
psql -h your-db-host -U postgres -d your_db_name -f supabase/migrations/20251118000003_tourflo_migration_003_currency_changes.sql
psql -h your-db-host -U postgres -d your_db_name -f supabase/migrations/20251118000004_tourflo_migration_004_location_data_updates.sql
psql -h your-db-host -U postgres -d your_db_name -f supabase/migrations/20251118000005_tourflo_migration_005_vibe_tags.sql
```

---

## ⚙️ Migration Details

### Migration 001: Operator Profile Changes

**What it does:**
- Drops Jamaica-specific columns: `parish`, `trn`, `jamaica_bank_code`
- Adds Florida-specific columns: `county`, `ein`, `us_state`
- Updates `country` field from 'Jamaica' to 'USA'
- Creates backup columns before dropping data

**Key Points:**
- ✅ Transaction-safe (atomic execution)
- ✅ Creates backups before destructive operations
- ✅ Includes rollback instructions
- ⚠️ Affects all operator records

**Expected Warnings:** None

---

### Migration 002: Category System Updates

**What it does:**
- Creates `categories` and `experience_categories` tables
- Inserts 9 Florida tourism categories with icons and colors
- Maps old Jamaica categories to new Florida categories
- Adds subcategory, vibe_tags, and region fields

**Key Points:**
- ✅ Non-destructive (preserves old category data)
- ✅ Safe fallback to 'boat_tour' for unmapped categories
- ✅ Many-to-many relationship for flexibility
- ⚠️ Old category values backed up in `category_backup`

**Expected Warnings:** None

**New Categories:**
1. 🎣 Fishing Charters (#0077BE)
2. ⛵ Boat Tours & Cruises (#00A8E8)
3. 🏄 Water Sports (#00C9FF)
4. 🚤 Airboat Tours (#2E8B57)
5. 🌿 Eco-Tours & Nature (#4CAF50)
6. 🍽️ Food & Culinary Tours (#FF6B35)
7. 🏛️ Cultural & Historical Tours (#B8860B)
8. 🧗 Adventure Tours (#DC143C)
9. 🚌 Bus & Coach Tours (#696969)

---

### Migration 003: Currency Changes

**What it does:**
- Removes `price_jmd` and `total_price_jmd` columns
- Standardizes all pricing to USD-only
- Updates user currency preferences to 'USD'
- Creates/updates `currencies` table

**Key Points:**
- ✅ Preserves JMD prices in backup columns
- ✅ Converts JMD→USD at rate of 155:1 (if needed)
- ✅ All prices remain in cents (no decimal issues)
- ⚠️ Permanent removal of dual-currency system

**Expected Warnings:** None

---

### Migration 004: Location Data Updates

**What it does:**
- Creates `location_mappings` reference table
- Maps Jamaica parishes/cities to Florida equivalents
- Updates operator county, experience location_name
- Assigns Florida regions to experiences
- Creates `florida_counties` reference table

**Key Points:**
- ✅ Creates comprehensive Jamaica→Florida mappings
- ✅ Safe fallback to 'Miami' for unmapped locations
- ⚠️ **Coordinates (lat/lng) NOT updated** - requires manual update
- ⚠️ Review mapped locations for accuracy

**Location Mappings:**
- Kingston → Miami
- Negril → Key West
- Ocho Rios → Orlando
- Montego Bay → Fort Lauderdale
- Falmouth → Tampa
- *(+ 20 more mappings)*

**Expected Warnings:**
- Notice about manual coordinate updates required

---

### Migration 005: Vibe Tags

**What it does:**
- Creates `vibe_tags` and `experience_vibe_tags` tables
- Inserts 15 comprehensive vibe tags
- Auto-assigns vibe tags based on experience category
- Migrates old user vibe preferences
- Creates sync triggers for vibe_tags array

**Key Points:**
- ✅ Enhances discovery with multi-select vibes
- ✅ Auto-tags experiences intelligently
- ✅ Denormalized array for fast filtering
- ✅ Maintains sync with triggers

**Vibe Tags:**
1. 👨‍👩‍👧‍👦 Family Friendly (#FFD700)
2. 💕 Romantic (#FF69B4)
3. 📸 Scenic (#00CED1)
4. 👥 Group Friendly (#FF8C00)
5. 🏠 Local Experience (#228B22)
6. 📷 Photography-Friendly (#9370DB)
7. 📚 Educational (#4169E1)
8. 🏃 Active/Fitness (#DC143C)
9. 😎 Chill/Relaxing (#87CEEB)
10. 🏔️ Adventure (#FF6B35)
11. ⚡ Adrenaline (#DC143C)
12. ✨ Luxury (#8B008B)
13. 💰 Budget-Friendly (#32CD32)
14. 🦌 Wildlife (#556B2F)
15. 🎭 Cultural (#DAA520)

**Expected Warnings:** Notice about tagged/untagged experiences

---

## ✅ Post-Migration Verification

### 1. Data Integrity Checks

```sql
-- Check operator profiles
SELECT COUNT(*) FROM operators WHERE county IS NULL;
-- Expected: 0

SELECT COUNT(*) FROM operators WHERE us_state != 'FL';
-- Expected: 0

-- Check categories
SELECT COUNT(*) FROM categories WHERE is_active = true;
-- Expected: 9

-- Check currency
SELECT COUNT(*) FROM users WHERE currency_pref != 'USD';
-- Expected: 0

-- Check experiences have categories
SELECT COUNT(*) FROM experiences WHERE category IS NULL;
-- Expected: 0

-- Check vibe tags
SELECT COUNT(*) FROM vibe_tags WHERE is_active = true;
-- Expected: 15

-- Check location mappings
SELECT COUNT(*) FROM location_mappings;
-- Expected: ~25+

-- Check Florida counties
SELECT COUNT(*) FROM florida_counties;
-- Expected: 20
```

### 2. Functional Testing

```sql
-- Test experience queries with new filters
SELECT id, title, category, location_name, region, vibe_tags
FROM experiences
WHERE category = 'fishing_charter'
  AND region = 'South Florida'
  AND 'family_friendly' = ANY(vibe_tags)
LIMIT 5;

-- Test operator queries
SELECT id, name, county, us_state, country
FROM operators
WHERE county = 'Miami-Dade'
LIMIT 5;

-- Test vibe tag queries
SELECT
  e.title,
  array_agg(vt.name) as vibes
FROM experiences e
JOIN experience_vibe_tags evt ON evt.experience_id = e.id
JOIN vibe_tags vt ON vt.id = evt.vibe_tag_id
GROUP BY e.id, e.title
LIMIT 5;
```

### 3. UI Testing Checklist

- [ ] Operator onboarding shows Florida counties dropdown
- [ ] Experience creation shows 9 Florida categories
- [ ] Discovery feed filters by new categories
- [ ] Discovery feed filters by vibe tags
- [ ] Location filters show Florida cities
- [ ] All prices display in USD ($) format
- [ ] No references to Jamaica or JMD
- [ ] County/EIN fields work in forms
- [ ] Vibe tags display on experience cards
- [ ] Region-based search works

---

## 🔄 Rollback Procedures

Each migration file includes rollback instructions in comments at the bottom.

### Quick Rollback (All Migrations)

```sql
-- WARNING: This will revert ALL changes

BEGIN;

-- Rollback Migration 005 (Vibe Tags)
DROP TRIGGER IF EXISTS sync_vibe_tags_on_insert ON experience_vibe_tags;
DROP TRIGGER IF EXISTS sync_vibe_tags_on_delete ON experience_vibe_tags;
DROP FUNCTION IF EXISTS sync_experience_vibe_tags();
UPDATE experiences SET vibe_tags = ARRAY[]::text[];
DROP TABLE IF EXISTS user_vibe_preferences;
DROP TABLE IF EXISTS experience_vibe_tags;
DROP TABLE IF EXISTS vibe_tags;

-- Rollback Migration 004 (Locations)
UPDATE experiences SET location_name = location_name_backup WHERE location_name_backup IS NOT NULL;
UPDATE users SET location = location_backup WHERE location_backup IS NOT NULL;
UPDATE operators SET county = NULL;
DROP TABLE IF EXISTS florida_counties;
DROP TABLE IF EXISTS location_mappings;

-- Rollback Migration 003 (Currency)
ALTER TABLE experiences ADD COLUMN price_jmd integer;
UPDATE experiences SET price_jmd = price_jmd_backup WHERE price_jmd_backup IS NOT NULL;
ALTER TABLE bookings ADD COLUMN total_price_jmd integer;
UPDATE bookings SET total_price_jmd = total_price_jmd_backup WHERE total_price_jmd_backup IS NOT NULL;
ALTER TABLE experiences DROP CONSTRAINT IF EXISTS experiences_currency_check;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_currency_check;

-- Rollback Migration 002 (Categories)
UPDATE experiences SET category = category_backup WHERE category_backup IS NOT NULL;
ALTER TABLE experiences DROP CONSTRAINT IF EXISTS category_check;
DROP TABLE IF EXISTS experience_categories;
DROP TABLE IF EXISTS categories;

-- Rollback Migration 001 (Operators)
ALTER TABLE operators ADD COLUMN parish text;
ALTER TABLE operators ADD COLUMN trn text;
UPDATE operators SET parish = parish_backup WHERE parish_backup IS NOT NULL;
UPDATE operators SET trn = trn_backup WHERE trn_backup IS NOT NULL;
UPDATE operators SET country = 'Jamaica';
ALTER TABLE operators DROP COLUMN county;
ALTER TABLE operators DROP COLUMN ein;
ALTER TABLE operators DROP COLUMN us_state;

COMMIT;
```

### Restore from Backup (Nuclear Option)

```bash
# Drop database and restore from backup
dropdb your_db_name
createdb your_db_name
psql your_db_name < lookyah_backup_YYYYMMDD_HHMMSS.sql
```

---

## 🛠️ Manual Follow-Up Tasks

### CRITICAL: Update Experience Coordinates

After migration, all experience coordinates need manual updates:

```sql
-- Example: Update coordinates for Florida locations
-- Use a geocoding service (Google Maps API, Mapbox, etc.)

UPDATE experiences
SET
  location_lat = 25.7617, -- Miami coordinates
  location_lng = -80.1918
WHERE location_name = 'Miami';

UPDATE experiences
SET
  location_lat = 24.5551, -- Key West coordinates
  location_lng = -81.7800
WHERE location_name = 'Key West';

-- Repeat for all locations...
```

**Recommended Approach:**
1. Export all unique `location_name` values
2. Use geocoding API to get coordinates
3. Bulk update with correct coordinates
4. Verify on map display

### Review Operator Counties

```sql
-- Review all operator counties for accuracy
SELECT DISTINCT county, COUNT(*) as count
FROM operators
GROUP BY county
ORDER BY count DESC;

-- Manually correct any misclassified operators
UPDATE operators
SET county = 'Correct County Name'
WHERE id = 'operator-uuid';
```

### Refine Category Assignments

```sql
-- Review experiences that may need category refinement
SELECT id, title, category, location_name
FROM experiences
WHERE category = 'boat_tour' -- Default fallback category
ORDER BY title;

-- Update specific experiences to more appropriate categories
UPDATE experiences
SET category = 'fishing_charter'
WHERE title ILIKE '%fishing%' AND category = 'boat_tour';
```

---

## 📊 Migration Impact Summary

### Tables Modified
- ✅ `users` - Currency preference updated
- ✅ `operators` - Profile fields changed (parish→county, trn→ein)
- ✅ `experiences` - Categories, pricing, locations, vibe tags updated
- ✅ `bookings` - Pricing fields simplified

### Tables Created
- ✅ `categories` - Master category list (9 records)
- ✅ `experience_categories` - Many-to-many category mapping
- ✅ `vibe_tags` - Master vibe tag list (15 records)
- ✅ `experience_vibe_tags` - Many-to-many vibe tag mapping
- ✅ `user_vibe_preferences` - User preferred vibes
- ✅ `location_mappings` - Jamaica→Florida location reference (~25 records)
- ✅ `florida_counties` - Florida county reference (20 records)
- ✅ `currencies` - Currency reference (USD only)

### Columns Added
- `operators.county`, `operators.ein`, `operators.us_state`
- `experiences.subcategory`, `experiences.vibe_tags`, `experiences.region`
- `experiences.currency`, `bookings.currency`

### Columns Removed
- `operators.parish`, `operators.trn`, `operators.jamaica_bank_code`
- `experiences.price_jmd`
- `bookings.total_price_jmd`

### Data Transformations
- ~100% operators updated (county, state, country)
- ~100% experiences categorized and tagged
- ~100% pricing converted to USD-only
- ~100% locations mapped to Florida

---

## 🐛 Troubleshooting

### Issue: Migration fails with "relation already exists"

**Solution:** Run migrations on clean database or use `IF NOT EXISTS` clauses (already included).

### Issue: Constraint violation errors

**Solution:** Check that all prerequisite migrations completed successfully. Verify data integrity before proceeding.

### Issue: RLS policy denies access

**Solution:** Verify you're running as superuser or database owner. Check RLS policies are correctly configured.

### Issue: Slow migration performance

**Solution:** Migrations already include transaction wrapping. If still slow, run during off-peak hours or temporarily disable triggers.

### Issue: Backup columns not created

**Solution:** Migrations include `IF EXISTS` checks. If backups missing, columns may not have existed in original schema.

---

## 📞 Support

### Getting Help

1. **Check Migration Logs:** Review SQL output for warnings and errors
2. **Verify Prerequisites:** Ensure PostgreSQL 12+, required extensions installed
3. **Review Documentation:** Each migration file has detailed comments
4. **Test Environment:** Always test on backup database first

### Reporting Issues

Include the following in your report:
- PostgreSQL version
- Migration file that failed
- Complete error message
- Output of `\dt` (list of tables)
- Number of records in each table

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-11-18 | Initial migration suite created |

---

**Generated:** 2025-11-18
**Platform:** TourFlo Florida
**Source:** LookYah Jamaica
**Status:** Production Ready ✅
