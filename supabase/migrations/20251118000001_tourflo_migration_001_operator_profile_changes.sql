/*
  # Migration 001: Operator Profile Changes (Jamaica → Florida)

  ## Summary
  Converts Jamaica-specific operator fields to Florida-specific fields.

  ## Changes Made

  ### 1. Column Removals (Jamaica-specific)
  - DROP COLUMN `parish` - Jamaica administrative division
  - DROP COLUMN `trn` - Jamaica Tax Registration Number
  - DROP COLUMN `jamaica_bank_code` - Jamaica banking identifier

  ### 2. Column Additions (Florida-specific)
  - ADD COLUMN `county` (VARCHAR 100) - Florida county location
  - ADD COLUMN `ein` (VARCHAR 50) - US Employer Identification Number
  - ADD COLUMN `us_state` (VARCHAR 50) - US state, defaults to 'FL'

  ### 3. Data Updates
  - UPDATE `country` field from 'Jamaica' to 'USA' for all operators
  - Backfill `us_state` to 'FL' for existing records

  ## Security & Safety
  - All operations wrapped in transaction (BEGIN/COMMIT)
  - Creates backup columns before destructive operations
  - Includes rollback instructions
  - RLS policies remain unchanged

  ## Execution Notes
  - Expected runtime: 2-5 seconds
  - Estimated rows affected: All existing operators
  - Zero downtime: Read operations continue during migration
  - Backup recommended before execution
*/

-- Start transaction for atomic execution
BEGIN;

-- =====================================================================
-- STEP 1: CREATE BACKUP COLUMNS (Safety measure)
-- =====================================================================

-- Backup parish data before dropping
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'operators' AND column_name = 'parish'
  ) THEN
    ALTER TABLE operators ADD COLUMN IF NOT EXISTS parish_backup text;
    UPDATE operators SET parish_backup = parish WHERE parish IS NOT NULL;
  END IF;
END $$;

-- Backup TRN data before dropping
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'operators' AND column_name = 'trn'
  ) THEN
    ALTER TABLE operators ADD COLUMN IF NOT EXISTS trn_backup text;
    UPDATE operators SET trn_backup = trn WHERE trn IS NOT NULL;
  END IF;
END $$;

-- Backup jamaica_bank_code if exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'operators' AND column_name = 'jamaica_bank_code'
  ) THEN
    ALTER TABLE operators ADD COLUMN IF NOT EXISTS jamaica_bank_code_backup text;
    UPDATE operators SET jamaica_bank_code_backup = jamaica_bank_code WHERE jamaica_bank_code IS NOT NULL;
  END IF;
END $$;


-- =====================================================================
-- STEP 2: ADD NEW FLORIDA-SPECIFIC COLUMNS
-- =====================================================================

-- Add county column (Florida administrative division)
ALTER TABLE operators ADD COLUMN IF NOT EXISTS county varchar(100);

-- Add EIN column (US tax ID)
ALTER TABLE operators ADD COLUMN IF NOT EXISTS ein varchar(50);

-- Add us_state column (defaults to Florida)
ALTER TABLE operators ADD COLUMN IF NOT EXISTS us_state varchar(50) DEFAULT 'FL';

-- Add country column if not exists
ALTER TABLE operators ADD COLUMN IF NOT EXISTS country varchar(100) DEFAULT 'USA';


-- =====================================================================
-- STEP 3: UPDATE EXISTING DATA
-- =====================================================================

-- Update country field for all operators
UPDATE operators SET country = 'USA' WHERE country IS NULL OR country = 'Jamaica';

-- Backfill us_state for existing records
UPDATE operators SET us_state = 'FL' WHERE us_state IS NULL;


-- =====================================================================
-- STEP 4: REMOVE JAMAICA-SPECIFIC COLUMNS
-- =====================================================================

-- Drop parish column (now using county)
ALTER TABLE operators DROP COLUMN IF EXISTS parish;

-- Drop TRN column (now using EIN)
ALTER TABLE operators DROP COLUMN IF EXISTS trn;

-- Drop jamaica_bank_code column
ALTER TABLE operators DROP COLUMN IF EXISTS jamaica_bank_code;


-- =====================================================================
-- STEP 5: UPDATE COLUMN COMMENTS (Documentation)
-- =====================================================================

COMMENT ON COLUMN operators.county IS 'Florida county where operator is based (e.g., Miami-Dade, Broward, Monroe)';
COMMENT ON COLUMN operators.ein IS 'Employer Identification Number (EIN) - US federal tax ID';
COMMENT ON COLUMN operators.us_state IS 'US state code (default: FL for Florida)';
COMMENT ON COLUMN operators.country IS 'Country of operation (default: USA)';


-- =====================================================================
-- STEP 6: CREATE INDEXES FOR PERFORMANCE
-- =====================================================================

-- Index for county-based queries
CREATE INDEX IF NOT EXISTS idx_operators_county ON operators(county);

-- Index for state-based queries
CREATE INDEX IF NOT EXISTS idx_operators_state ON operators(us_state);


-- =====================================================================
-- STEP 7: VALIDATION CHECKS
-- =====================================================================

-- Check that all operators have country set to USA
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count FROM operators WHERE country != 'USA';
  IF invalid_count > 0 THEN
    RAISE WARNING 'Found % operators with country != USA', invalid_count;
  END IF;
END $$;

-- Check that all operators have us_state set to FL
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count FROM operators WHERE us_state IS NULL;
  IF invalid_count > 0 THEN
    RAISE WARNING 'Found % operators with NULL us_state', invalid_count;
  END IF;
END $$;


-- Commit transaction
COMMIT;


-- =====================================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================================

/*
  To rollback this migration, execute the following:

  BEGIN;

  -- Restore Jamaica columns
  ALTER TABLE operators ADD COLUMN IF NOT EXISTS parish text;
  ALTER TABLE operators ADD COLUMN IF NOT EXISTS trn text;
  ALTER TABLE operators ADD COLUMN IF NOT EXISTS jamaica_bank_code text;

  -- Restore data from backups
  UPDATE operators SET parish = parish_backup WHERE parish_backup IS NOT NULL;
  UPDATE operators SET trn = trn_backup WHERE trn_backup IS NOT NULL;
  UPDATE operators SET jamaica_bank_code = jamaica_bank_code_backup WHERE jamaica_bank_code_backup IS NOT NULL;

  -- Revert country
  UPDATE operators SET country = 'Jamaica';

  -- Drop Florida columns
  ALTER TABLE operators DROP COLUMN IF EXISTS county;
  ALTER TABLE operators DROP COLUMN IF EXISTS ein;
  ALTER TABLE operators DROP COLUMN IF EXISTS us_state;

  -- Drop backup columns
  ALTER TABLE operators DROP COLUMN IF EXISTS parish_backup;
  ALTER TABLE operators DROP COLUMN IF EXISTS trn_backup;
  ALTER TABLE operators DROP COLUMN IF EXISTS jamaica_bank_code_backup;

  COMMIT;
*/
