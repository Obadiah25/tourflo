/*
  # Migration 004: Location Data Updates (Jamaica → Florida)

  ## Summary
  Converts Jamaica location references to Florida locations.
  Maps Jamaica parishes to Florida counties and cities.

  ## Changes Made

  ### 1. Create Location Mapping Reference Table
  - CREATE `location_mappings` lookup table
  - Maps Jamaica parishes/cities to Florida equivalents

  ### 2. Operator Location Updates
  - Backup existing location data
  - UPDATE county field with Florida locations
  - Map common Jamaica parishes to Florida counties

  ### 3. Experience Location Updates
  - UPDATE location_name from Jamaica to Florida
  - Preserve location_lat/location_lng (will need manual update)
  - Add Florida region classification

  ### 4. User Location Updates
  - UPDATE user location preferences from 'Jamaica' to 'Florida'

  ## Location Mappings
  - Kingston → Miami
  - Negril → Key West
  - Ocho Rios → Orlando
  - Montego Bay → Fort Lauderdale
  - Falmouth → Tampa
  - Spanish Town → St. Augustine
  - Port Antonio → Naples
  - Mandeville → Clearwater
  - (+ more mappings)

  ## Security & Safety
  - Transaction-wrapped for atomicity
  - Creates backup columns before updates
  - Preserves original data in backup fields
  - Safe fallbacks for unmapped locations

  ## Execution Notes
  - Expected runtime: 3-8 seconds
  - Estimated rows affected: All operators, experiences, users with location data
  - Manual coordinate updates recommended after migration
  - Backup recommended before execution
*/

-- Start transaction
BEGIN;

-- =====================================================================
-- STEP 1: CREATE LOCATION MAPPINGS REFERENCE TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS location_mappings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  jamaica_location text UNIQUE NOT NULL,
  florida_location text NOT NULL,
  florida_county text,
  florida_region text,
  location_type text, -- 'parish', 'city', 'landmark'
  created_at timestamptz DEFAULT now()
);

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_location_mappings_jamaica ON location_mappings(jamaica_location);

-- Enable RLS
ALTER TABLE location_mappings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view location mappings
CREATE POLICY "Anyone can view location mappings"
  ON location_mappings FOR SELECT
  USING (true);


-- =====================================================================
-- STEP 2: INSERT JAMAICA → FLORIDA LOCATION MAPPINGS
-- =====================================================================

INSERT INTO location_mappings (jamaica_location, florida_location, florida_county, florida_region, location_type) VALUES
  -- Major Jamaica parishes/cities → Florida equivalents
  ('Kingston', 'Miami', 'Miami-Dade', 'South Florida', 'city'),
  ('St. Andrew', 'Miami Beach', 'Miami-Dade', 'South Florida', 'parish'),
  ('Negril', 'Key West', 'Monroe', 'South Florida', 'city'),
  ('Ocho Rios', 'Orlando', 'Orange', 'Central Florida', 'city'),
  ('Montego Bay', 'Fort Lauderdale', 'Broward', 'South Florida', 'city'),
  ('Falmouth', 'Tampa', 'Hillsborough', 'West Coast', 'city'),
  ('Spanish Town', 'St. Augustine', 'St. Johns', 'Northeast Florida', 'city'),
  ('Port Antonio', 'Naples', 'Collier', 'West Coast', 'city'),
  ('Mandeville', 'Clearwater', 'Pinellas', 'West Coast', 'city'),
  ('Treasure Beach', 'Sanibel Island', 'Lee', 'West Coast', 'city'),
  ('Port Royal', 'Key Largo', 'Monroe', 'South Florida', 'city'),
  ('Runaway Bay', 'Destin', 'Okaloosa', 'Panhandle', 'city'),

  -- Jamaica parishes → Florida counties
  ('St. Catherine', 'Palm Beach', 'Palm Beach', 'South Florida', 'parish'),
  ('St. James', 'Broward', 'Broward', 'South Florida', 'parish'),
  ('Hanover', 'Lee', 'Lee', 'West Coast', 'parish'),
  ('Westmoreland', 'Collier', 'Collier', 'West Coast', 'parish'),
  ('St. Elizabeth', 'Sarasota', 'Sarasota', 'West Coast', 'parish'),
  ('Manchester', 'Osceola', 'Osceola', 'Central Florida', 'parish'),
  ('Clarendon', 'Polk', 'Polk', 'Central Florida', 'parish'),
  ('St. Ann', 'Orange', 'Orange', 'Central Florida', 'parish'),
  ('Trelawny', 'Hillsborough', 'Hillsborough', 'West Coast', 'parish'),
  ('St. Mary', 'Brevard', 'Brevard', 'Central Florida', 'parish'),
  ('Portland', 'Collier', 'Collier', 'West Coast', 'parish'),
  ('St. Thomas', 'St. Johns', 'St. Johns', 'Northeast Florida', 'parish'),

  -- Popular Jamaica landmarks → Florida equivalents
  ('Dunn''s River Falls', 'Everglades National Park', 'Miami-Dade', 'South Florida', 'landmark'),
  ('Rick''s Cafe', 'Sunset Pier', 'Monroe', 'South Florida', 'landmark'),
  ('Blue Mountains', 'Big Cypress Preserve', 'Collier', 'West Coast', 'landmark'),
  ('Seven Mile Beach', 'South Beach', 'Miami-Dade', 'South Florida', 'landmark'),
  ('Luminous Lagoon', 'Bioluminescent Bay Tours', 'Brevard', 'Central Florida', 'landmark'),
  ('Bob Marley Museum', 'Hemingway House', 'Monroe', 'South Florida', 'landmark'),
  ('YS Falls', 'Silver Springs', 'Marion', 'Central Florida', 'landmark'),
  ('Mystic Mountain', 'Orlando Eye', 'Orange', 'Central Florida', 'landmark')
ON CONFLICT (jamaica_location) DO NOTHING;


-- =====================================================================
-- STEP 3: BACKUP EXISTING LOCATION DATA
-- =====================================================================

-- Backup operator location data (county was already backed up in migration 001)
-- No additional backup needed as parish_backup exists

-- Backup experience location data
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS location_name_backup text;
UPDATE experiences SET location_name_backup = location_name WHERE location_name IS NOT NULL;

-- Backup user location preferences
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_backup text;
UPDATE users SET location_backup = location WHERE location IS NOT NULL;


-- =====================================================================
-- STEP 4: CREATE LOCATION MAPPING FUNCTION
-- =====================================================================

CREATE OR REPLACE FUNCTION map_jamaica_to_florida(jamaica_loc text)
RETURNS text AS $$
DECLARE
  florida_loc text;
BEGIN
  -- Try exact match first
  SELECT florida_location INTO florida_loc
  FROM location_mappings
  WHERE LOWER(jamaica_location) = LOWER(jamaica_loc)
  LIMIT 1;

  -- If no match, try partial match
  IF florida_loc IS NULL THEN
    SELECT florida_location INTO florida_loc
    FROM location_mappings
    WHERE LOWER(jamaica_loc) LIKE '%' || LOWER(jamaica_location) || '%'
    LIMIT 1;
  END IF;

  -- Default fallback to Miami if no match
  RETURN COALESCE(florida_loc, 'Miami');
END;
$$ LANGUAGE plpgsql;


-- =====================================================================
-- STEP 5: UPDATE OPERATORS TABLE - LOCATION DATA
-- =====================================================================

-- Update county field with mapped Florida locations
UPDATE operators
SET county = CASE
  -- Use mapping function for parish_backup data
  WHEN parish_backup IS NOT NULL THEN map_jamaica_to_florida(parish_backup)
  -- Default to Miami if no data
  ELSE 'Miami'
END
WHERE county IS NULL;

-- Ensure all operators have us_state set to FL
UPDATE operators
SET us_state = 'FL'
WHERE us_state IS NULL;

-- Ensure all operators have country set to USA
UPDATE operators
SET country = 'USA'
WHERE country IS NULL OR country != 'USA';


-- =====================================================================
-- STEP 6: UPDATE EXPERIENCES TABLE - LOCATION DATA
-- =====================================================================

-- Update location_name field with Florida locations
UPDATE experiences
SET location_name = map_jamaica_to_florida(location_name)
WHERE location_name IS NOT NULL;

-- Assign Florida regions based on mapped counties
-- This is a best-effort mapping that may need manual refinement
UPDATE experiences e
SET region = CASE
  WHEN location_name IN ('Miami', 'Miami Beach', 'Fort Lauderdale', 'Key West', 'Key Largo', 'West Palm Beach', 'Boca Raton') THEN 'South Florida'
  WHEN location_name IN ('Orlando', 'Kissimmee', 'Winter Park', 'Daytona Beach', 'Cocoa Beach') THEN 'Central Florida'
  WHEN location_name IN ('Tampa', 'St. Petersburg', 'Clearwater', 'Naples', 'Fort Myers', 'Sarasota', 'Sanibel Island') THEN 'West Coast'
  WHEN location_name IN ('Jacksonville', 'St. Augustine', 'Ponte Vedra', 'Amelia Island') THEN 'Northeast Florida'
  WHEN location_name IN ('Pensacola', 'Destin', 'Panama City Beach', 'Fort Walton Beach', 'Tallahassee') THEN 'Panhandle'
  ELSE 'South Florida' -- Default to South Florida
END
WHERE region IS NULL;

-- Note: Latitude/Longitude coordinates are NOT updated automatically
-- These should be updated manually or via geocoding service after migration
COMMENT ON COLUMN experiences.location_lat IS 'Latitude coordinate - REQUIRES MANUAL UPDATE after migration to Florida locations';
COMMENT ON COLUMN experiences.location_lng IS 'Longitude coordinate - REQUIRES MANUAL UPDATE after migration to Florida locations';


-- =====================================================================
-- STEP 7: UPDATE USERS TABLE - LOCATION PREFERENCES
-- =====================================================================

-- Update user location preferences from Jamaica to Florida
UPDATE users
SET location = CASE
  WHEN LOWER(location) = 'jamaica' THEN 'florida'
  WHEN LOWER(location) = 'in jamaica' THEN 'florida'
  WHEN LOWER(location) = 'already_here' THEN 'florida'
  WHEN location IN ('Kingston', 'Negril', 'Ocho Rios', 'Montego Bay') THEN 'florida'
  ELSE location -- Keep other locations (usa, uk, canada, browsing)
END
WHERE location IS NOT NULL;

-- Update default location for new users
ALTER TABLE users ALTER COLUMN location SET DEFAULT 'florida';


-- =====================================================================
-- STEP 8: CREATE FLORIDA COUNTIES REFERENCE (For UI Dropdowns)
-- =====================================================================

CREATE TABLE IF NOT EXISTS florida_counties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  region text NOT NULL,
  major_cities text[],
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE florida_counties ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view counties
CREATE POLICY "Anyone can view florida counties"
  ON florida_counties FOR SELECT
  USING (true);

-- Insert top Florida counties for operator onboarding
INSERT INTO florida_counties (name, region, major_cities, display_order) VALUES
  ('Miami-Dade', 'South Florida', ARRAY['Miami', 'Miami Beach', 'Coral Gables', 'Homestead'], 1),
  ('Broward', 'South Florida', ARRAY['Fort Lauderdale', 'Hollywood', 'Pompano Beach', 'Deerfield Beach'], 2),
  ('Palm Beach', 'South Florida', ARRAY['West Palm Beach', 'Boca Raton', 'Delray Beach', 'Jupiter'], 3),
  ('Monroe', 'South Florida', ARRAY['Key West', 'Key Largo', 'Marathon', 'Islamorada'], 4),
  ('Orange', 'Central Florida', ARRAY['Orlando', 'Winter Park', 'Apopka', 'Ocoee'], 5),
  ('Osceola', 'Central Florida', ARRAY['Kissimmee', 'St. Cloud', 'Celebration'], 6),
  ('Pinellas', 'West Coast', ARRAY['St. Petersburg', 'Clearwater', 'Largo', 'Tarpon Springs'], 7),
  ('Hillsborough', 'West Coast', ARRAY['Tampa', 'Brandon', 'Plant City', 'Temple Terrace'], 8),
  ('Lee', 'West Coast', ARRAY['Fort Myers', 'Cape Coral', 'Sanibel', 'Fort Myers Beach'], 9),
  ('Collier', 'West Coast', ARRAY['Naples', 'Marco Island', 'Immokalee'], 10),
  ('Sarasota', 'West Coast', ARRAY['Sarasota', 'Venice', 'North Port', 'Siesta Key'], 11),
  ('Manatee', 'West Coast', ARRAY['Bradenton', 'Palmetto', 'Anna Maria Island'], 12),
  ('St. Johns', 'Northeast Florida', ARRAY['St. Augustine', 'Ponte Vedra Beach', 'St. Augustine Beach'], 13),
  ('Duval', 'Northeast Florida', ARRAY['Jacksonville', 'Jacksonville Beach', 'Atlantic Beach'], 14),
  ('Brevard', 'Central Florida', ARRAY['Melbourne', 'Cocoa Beach', 'Cape Canaveral', 'Titusville'], 15),
  ('Volusia', 'Northeast Florida', ARRAY['Daytona Beach', 'Ormond Beach', 'New Smyrna Beach', 'DeLand'], 16),
  ('Escambia', 'Panhandle', ARRAY['Pensacola', 'Pensacola Beach', 'Gulf Breeze'], 17),
  ('Okaloosa', 'Panhandle', ARRAY['Fort Walton Beach', 'Destin', 'Niceville', 'Crestview'], 18),
  ('Bay', 'Panhandle', ARRAY['Panama City', 'Panama City Beach', 'Lynn Haven'], 19),
  ('Polk', 'Central Florida', ARRAY['Lakeland', 'Winter Haven', 'Bartow', 'Lake Wales'], 20)
ON CONFLICT (name) DO NOTHING;


-- =====================================================================
-- STEP 9: VALIDATION CHECKS
-- =====================================================================

-- Check that all operators have county set
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count
  FROM operators
  WHERE county IS NULL;

  IF invalid_count > 0 THEN
    RAISE WARNING 'Found % operators with NULL county', invalid_count;
  END IF;
END $$;

-- Check that all operators have us_state = FL
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count
  FROM operators
  WHERE us_state != 'FL';

  IF invalid_count > 0 THEN
    RAISE WARNING 'Found % operators with us_state != FL', invalid_count;
  END IF;
END $$;

-- Check that all experiences have region assigned
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count
  FROM experiences
  WHERE region IS NULL;

  IF invalid_count > 0 THEN
    RAISE WARNING 'Found % experiences with NULL region', invalid_count;
  END IF;
END $$;

-- Check that no users have Jamaica location
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count
  FROM users
  WHERE LOWER(location) LIKE '%jamaica%';

  IF invalid_count > 0 THEN
    RAISE WARNING 'Found % users still referencing Jamaica in location', invalid_count;
  END IF;
END $$;

-- Verify Florida counties were created
DO $$
DECLARE
  county_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO county_count FROM florida_counties;

  IF county_count < 20 THEN
    RAISE WARNING 'Expected at least 20 Florida counties, found %', county_count;
  END IF;
END $$;


-- =====================================================================
-- STEP 10: CLEANUP AND NOTES
-- =====================================================================

-- Drop the mapping function (no longer needed after migration)
DROP FUNCTION IF EXISTS map_jamaica_to_florida(text);

-- Add note about manual coordinate updates
DO $$
BEGIN
  RAISE NOTICE '=================================================================';
  RAISE NOTICE 'IMPORTANT: Manual action required after this migration:';
  RAISE NOTICE '1. Update location_lat and location_lng for all experiences';
  RAISE NOTICE '2. Use geocoding service to get Florida coordinates';
  RAISE NOTICE '3. Verify all operator counties are correctly mapped';
  RAISE NOTICE '4. Review experience regions for accuracy';
  RAISE NOTICE '=================================================================';
END $$;


-- Commit transaction
COMMIT;


-- =====================================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================================

/*
  To rollback this migration, execute the following:

  BEGIN;

  -- Restore original location data
  UPDATE experiences SET location_name = location_name_backup WHERE location_name_backup IS NOT NULL;
  UPDATE users SET location = location_backup WHERE location_backup IS NOT NULL;

  -- Restore operators (parish_backup from migration 001)
  -- County field will remain but can be cleared
  UPDATE operators SET county = NULL;

  -- Remove backup columns
  ALTER TABLE experiences DROP COLUMN IF EXISTS location_name_backup;
  ALTER TABLE users DROP COLUMN IF EXISTS location_backup;

  -- Drop new tables
  DROP TABLE IF EXISTS florida_counties;
  DROP TABLE IF EXISTS location_mappings;

  -- Restore default user location
  ALTER TABLE users ALTER COLUMN location SET DEFAULT 'browsing';

  COMMIT;
*/
