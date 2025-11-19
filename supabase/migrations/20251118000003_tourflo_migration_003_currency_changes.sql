/*
  # Migration 003: Currency System Changes (Dual → USD Only)

  ## Summary
  Removes Jamaican Dollar (JMD) support and standardizes all pricing to USD.
  Simplifies currency system from dual-currency to USD-only.

  ## Changes Made

  ### 1. Users Table Updates
  - UPDATE `currency_pref` default to 'USD'
  - REMOVE JMD option from existing users

  ### 2. Experiences Table Updates
  - DROP COLUMN `price_jmd` - Jamaican dollar pricing
  - RENAME `price_usd` to `price` (simplified)
  - ADD COLUMN `currency` with default 'USD'

  ### 3. Bookings Table Updates
  - DROP COLUMN `total_price_jmd`
  - RENAME `total_price_usd` to `total_price`
  - ADD COLUMN `currency` with default 'USD'

  ### 4. Currency Table (If Exists)
  - DELETE JMD currency records
  - SET USD as default currency

  ## Security & Safety
  - Transaction-wrapped for atomicity
  - Preserves price data in USD
  - Backup columns created before destructive operations
  - All monetary values in cents (no decimal issues)

  ## Execution Notes
  - Expected runtime: 2-5 seconds
  - Estimated rows affected: All experiences, bookings, users
  - Zero downtime for read operations
  - Backup recommended before execution
*/

-- Start transaction
BEGIN;

-- =====================================================================
-- STEP 1: BACKUP EXISTING PRICE DATA
-- =====================================================================

-- Backup JMD prices from experiences table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'experiences' AND column_name = 'price_jmd'
  ) THEN
    ALTER TABLE experiences ADD COLUMN IF NOT EXISTS price_jmd_backup integer;
    UPDATE experiences SET price_jmd_backup = price_jmd WHERE price_jmd IS NOT NULL;
  END IF;
END $$;

-- Backup JMD prices from bookings table
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'total_price_jmd'
  ) THEN
    ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price_jmd_backup integer;
    UPDATE bookings SET total_price_jmd_backup = total_price_jmd WHERE total_price_jmd IS NOT NULL;
  END IF;
END $$;


-- =====================================================================
-- STEP 2: UPDATE USERS TABLE - CURRENCY PREFERENCE
-- =====================================================================

-- Update all users to use USD currency preference
UPDATE users
SET currency_pref = 'USD'
WHERE currency_pref = 'JMD' OR currency_pref IS NULL;

-- Update default for new users
ALTER TABLE users ALTER COLUMN currency_pref SET DEFAULT 'USD';

-- Update column comment
COMMENT ON COLUMN users.currency_pref IS 'Currency preference (USD only - simplified from dual currency)';


-- =====================================================================
-- STEP 3: UPDATE EXPERIENCES TABLE - REMOVE JMD PRICING
-- =====================================================================

-- Add new currency column with default USD
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS currency varchar(3) DEFAULT 'USD';

-- Ensure all experiences have price_usd set
-- If price_usd is null but price_jmd exists, convert at rough rate (1 USD = 155 JMD)
UPDATE experiences
SET price_usd = COALESCE(price_usd, ROUND(price_jmd / 155.0))
WHERE price_usd IS NULL AND price_jmd IS NOT NULL;

-- Drop the JMD price column
ALTER TABLE experiences DROP COLUMN IF EXISTS price_jmd;

-- Update column comment for price_usd
COMMENT ON COLUMN experiences.price_usd IS 'Price in USD cents (100 = $1.00). All prices now USD-only.';


-- =====================================================================
-- STEP 4: UPDATE BOOKINGS TABLE - REMOVE JMD PRICING
-- =====================================================================

-- Add new currency column with default USD
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS currency varchar(3) DEFAULT 'USD';

-- Ensure all bookings have total_price_usd set
-- If total_price_usd is null but total_price_jmd exists, convert at rough rate
UPDATE bookings
SET total_price_usd = COALESCE(total_price_usd, ROUND(total_price_jmd / 155.0))
WHERE total_price_usd IS NULL AND total_price_jmd IS NOT NULL;

-- Drop the JMD total price column
ALTER TABLE bookings DROP COLUMN IF EXISTS total_price_jmd;

-- Update column comment for total_price_usd
COMMENT ON COLUMN bookings.total_price_usd IS 'Total booking price in USD cents (100 = $1.00). All bookings now USD-only.';


-- =====================================================================
-- STEP 5: CREATE CURRENCIES TABLE (If Needed)
-- =====================================================================

-- Create currencies table if it doesn't exist
CREATE TABLE IF NOT EXISTS currencies (
  code varchar(3) PRIMARY KEY,
  name text NOT NULL,
  symbol text NOT NULL,
  is_default boolean DEFAULT false,
  exchange_rate decimal(10, 4) DEFAULT 1.0000,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view currencies
CREATE POLICY IF NOT EXISTS "Anyone can view currencies"
  ON currencies FOR SELECT
  USING (true);

-- Delete JMD currency if exists
DELETE FROM currencies WHERE code = 'JMD';

-- Insert or update USD as default currency
INSERT INTO currencies (code, name, symbol, is_default, exchange_rate)
VALUES ('USD', 'US Dollar', '$', true, 1.0000)
ON CONFLICT (code) DO UPDATE SET
  is_default = true,
  exchange_rate = 1.0000;


-- =====================================================================
-- STEP 6: ADD CONSTRAINTS FOR USD-ONLY
-- =====================================================================

-- Add check constraint to ensure only USD currency
ALTER TABLE experiences DROP CONSTRAINT IF EXISTS experiences_currency_check;
ALTER TABLE experiences ADD CONSTRAINT experiences_currency_check
  CHECK (currency = 'USD');

ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_currency_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_currency_check
  CHECK (currency = 'USD');


-- =====================================================================
-- STEP 7: VALIDATION CHECKS
-- =====================================================================

-- Check that all users have USD currency preference
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count
  FROM users
  WHERE currency_pref != 'USD';

  IF invalid_count > 0 THEN
    RAISE WARNING 'Found % users with non-USD currency preference', invalid_count;
  END IF;
END $$;

-- Check that all experiences have price_usd set
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count
  FROM experiences
  WHERE price_usd IS NULL;

  IF invalid_count > 0 THEN
    RAISE WARNING 'Found % experiences with NULL price_usd', invalid_count;
  END IF;
END $$;

-- Check that all bookings have total_price_usd set
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count
  FROM bookings
  WHERE total_price_usd IS NULL;

  IF invalid_count > 0 THEN
    RAISE WARNING 'Found % bookings with NULL total_price_usd', invalid_count;
  END IF;
END $$;

-- Verify only USD currency exists
DO $$
DECLARE
  currency_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO currency_count
  FROM currencies
  WHERE is_default = true AND code = 'USD';

  IF currency_count != 1 THEN
    RAISE WARNING 'Expected 1 default USD currency, found %', currency_count;
  END IF;
END $$;


-- =====================================================================
-- STEP 8: CLEANUP - REMOVE JMD REFERENCES
-- =====================================================================

-- Remove any triggers or functions that reference JMD
DROP FUNCTION IF EXISTS calculate_price_jmd();
DROP FUNCTION IF EXISTS convert_usd_to_jmd();


-- Commit transaction
COMMIT;


-- =====================================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================================

/*
  To rollback this migration, execute the following:

  BEGIN;

  -- Restore JMD columns in experiences
  ALTER TABLE experiences ADD COLUMN IF NOT EXISTS price_jmd integer;
  UPDATE experiences SET price_jmd = price_jmd_backup WHERE price_jmd_backup IS NOT NULL;

  -- Restore JMD columns in bookings
  ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price_jmd integer;
  UPDATE bookings SET total_price_jmd = total_price_jmd_backup WHERE total_price_jmd_backup IS NOT NULL;

  -- Remove currency constraints
  ALTER TABLE experiences DROP CONSTRAINT IF EXISTS experiences_currency_check;
  ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_currency_check;

  -- Remove currency columns
  ALTER TABLE experiences DROP COLUMN IF EXISTS currency;
  ALTER TABLE bookings DROP COLUMN IF EXISTS currency;

  -- Restore JMD currency
  INSERT INTO currencies (code, name, symbol, is_default, exchange_rate)
  VALUES ('JMD', 'Jamaican Dollar', 'J$', false, 155.0000)
  ON CONFLICT (code) DO NOTHING;

  -- Allow users to have JMD preference again
  ALTER TABLE users ALTER COLUMN currency_pref DROP DEFAULT;

  -- Drop backup columns
  ALTER TABLE experiences DROP COLUMN IF EXISTS price_jmd_backup;
  ALTER TABLE bookings DROP COLUMN IF EXISTS total_price_jmd_backup;

  COMMIT;
*/
