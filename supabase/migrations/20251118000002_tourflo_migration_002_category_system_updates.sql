/*
  # Migration 002: Category System Updates (Jamaica → Florida)

  ## Summary
  Replaces Jamaica tourism categories with Florida-specific categories.
  Creates new category taxonomy with 9 primary categories.

  ## Changes Made

  ### 1. New Tables
  - CREATE `categories` table - Master list of experience categories
  - CREATE `experience_categories` mapping table - Many-to-many relationship

  ### 2. Category Data
  - INSERT 9 Florida-specific categories:
    * Fishing Charters (🎣, #0077BE)
    * Boat Tours & Cruises (⛵, #00A8E8)
    * Water Sports (🏄, #00C9FF)
    * Airboat Tours (🚤, #2E8B57)
    * Eco-Tours & Nature (🌿, #4CAF50)
    * Food & Culinary Tours (🍽️, #FF6B35)
    * Cultural & Historical Tours (🏛️, #B8860B)
    * Adventure Tours (🧗, #DC143C)
    * Bus & Coach Tours (🚌, #696969)

  ### 3. Data Migration
  - DELETE old Jamaica-specific categories
  - UPDATE existing experiences with new category mappings
  - Fallback to 'boat_tour' for unmapped categories

  ## Security & Safety
  - Transaction-wrapped for atomicity
  - Preserves existing experience data
  - Safe fallback for unmapped categories
  - RLS policies applied to new tables

  ## Execution Notes
  - Expected runtime: 3-8 seconds
  - Estimated rows affected: All experiences + new category records
  - Zero downtime for read operations
  - Backup recommended before execution
*/

-- Start transaction
BEGIN;

-- =====================================================================
-- STEP 1: CREATE CATEGORIES TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text NOT NULL,
  color text NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create index for slug-based lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);


-- =====================================================================
-- STEP 2: CREATE EXPERIENCE_CATEGORIES MAPPING TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS experience_categories (
  experience_id uuid REFERENCES experiences(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (experience_id, category_id)
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_exp_cat_experience ON experience_categories(experience_id);
CREATE INDEX IF NOT EXISTS idx_exp_cat_category ON experience_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_exp_cat_primary ON experience_categories(is_primary);


-- =====================================================================
-- STEP 3: ENABLE RLS ON NEW TABLES
-- =====================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view active categories
CREATE POLICY "Anyone can view active categories"
  ON categories FOR SELECT
  USING (is_active = true);

-- RLS Policy: Anyone can view experience category mappings
CREATE POLICY "Anyone can view experience categories"
  ON experience_categories FOR SELECT
  USING (true);


-- =====================================================================
-- STEP 4: INSERT FLORIDA CATEGORIES
-- =====================================================================

-- Clear existing categories if any
DELETE FROM categories;

-- Insert 9 Florida tourism categories
INSERT INTO categories (name, slug, icon, color, description, display_order, is_active) VALUES
  (
    'Fishing Charters',
    'fishing_charter',
    '🎣',
    '#0077BE',
    'Deep sea, inshore, and backcountry fishing experiences with expert captains',
    1,
    true
  ),
  (
    'Boat Tours & Cruises',
    'boat_tour',
    '⛵',
    '#00A8E8',
    'Sunset cruises, party boats, sightseeing tours, and island hopping adventures',
    2,
    true
  ),
  (
    'Water Sports',
    'water_sports',
    '🏄',
    '#00C9FF',
    'Jet skiing, parasailing, kayaking, paddleboarding, and more aquatic activities',
    3,
    true
  ),
  (
    'Airboat Tours',
    'airboat_tour',
    '🚤',
    '#2E8B57',
    'Thrilling rides through the Everglades with wildlife spotting and gator encounters',
    4,
    true
  ),
  (
    'Eco-Tours & Nature',
    'eco_tour',
    '🌿',
    '#4CAF50',
    'Manatee tours, kayak eco-tours, bird watching, and nature exploration',
    5,
    true
  ),
  (
    'Food & Culinary Tours',
    'food_tour',
    '🍽️',
    '#FF6B35',
    'Cuban food tours, seafood experiences, brewery tours, and cooking classes',
    6,
    true
  ),
  (
    'Cultural & Historical Tours',
    'cultural_tour',
    '🏛️',
    '#B8860B',
    'Walking history tours, Art Deco architecture, ghost tours, and heritage experiences',
    7,
    true
  ),
  (
    'Adventure Tours',
    'adventure_tour',
    '🧗',
    '#DC143C',
    'Zip-lining, ropes courses, ATV tours, skydiving, and adrenaline activities',
    8,
    true
  ),
  (
    'Bus & Coach Tours',
    'bus_tour',
    '🚌',
    '#696969',
    'City tours, theme park shuttles, multi-day tours, and group transportation',
    9,
    true
  )
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order,
  is_active = EXCLUDED.is_active;


-- =====================================================================
-- STEP 5: MIGRATE EXISTING EXPERIENCE CATEGORIES
-- =====================================================================

-- Create temporary mapping of old categories to new categories
-- Old Jamaica categories: chill, adventure, party, foodie
-- Map to new Florida categories with safe fallbacks

-- Backup existing category field
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS category_backup text;
UPDATE experiences SET category_backup = category WHERE category IS NOT NULL;

-- Create helper function to map old categories to new slugs
CREATE OR REPLACE FUNCTION map_old_category_to_new(old_cat text)
RETURNS text AS $$
BEGIN
  RETURN CASE
    -- Map old vibe categories to new Florida categories
    WHEN old_cat = 'chill' THEN 'boat_tour'
    WHEN old_cat = 'adventure' THEN 'adventure_tour'
    WHEN old_cat = 'party' THEN 'boat_tour'
    WHEN old_cat = 'foodie' THEN 'food_tour'
    WHEN old_cat = 'nature' THEN 'eco_tour'
    WHEN old_cat = 'water' THEN 'water_sports'
    WHEN old_cat = 'fishing' THEN 'fishing_charter'
    WHEN old_cat = 'cultural' THEN 'cultural_tour'
    WHEN old_cat = 'tour' THEN 'bus_tour'
    -- Default fallback
    ELSE 'boat_tour'
  END;
END;
$$ LANGUAGE plpgsql;

-- Populate experience_categories mapping table for existing experiences
INSERT INTO experience_categories (experience_id, category_id, is_primary)
SELECT
  e.id AS experience_id,
  c.id AS category_id,
  true AS is_primary
FROM experiences e
JOIN categories c ON c.slug = map_old_category_to_new(e.category)
WHERE e.id IS NOT NULL
ON CONFLICT (experience_id, category_id) DO NOTHING;

-- Update experiences.category to new slug format
UPDATE experiences
SET category = map_old_category_to_new(category)
WHERE category IS NOT NULL;

-- Drop helper function
DROP FUNCTION IF EXISTS map_old_category_to_new(text);


-- =====================================================================
-- STEP 6: ADD CONSTRAINTS TO EXPERIENCES TABLE
-- =====================================================================

-- Add check constraint for valid categories
ALTER TABLE experiences DROP CONSTRAINT IF EXISTS category_check;
ALTER TABLE experiences ADD CONSTRAINT category_check
  CHECK (category IN (
    'fishing_charter',
    'boat_tour',
    'water_sports',
    'airboat_tour',
    'eco_tour',
    'food_tour',
    'cultural_tour',
    'adventure_tour',
    'bus_tour'
  ));


-- =====================================================================
-- STEP 7: ADD NEW FIELDS TO EXPERIENCES
-- =====================================================================

-- Add subcategory field for more granular classification
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS subcategory text;

-- Add vibe_tags array for experience vibes
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS vibe_tags text[] DEFAULT ARRAY[]::text[];

-- Add region field for Florida geographic regions
ALTER TABLE experiences ADD COLUMN IF NOT EXISTS region text;

-- Add check constraint for regions
ALTER TABLE experiences ADD CONSTRAINT IF NOT EXISTS region_check
  CHECK (region IS NULL OR region IN (
    'South Florida',
    'Central Florida',
    'West Coast',
    'Northeast Florida',
    'Panhandle'
  ));

-- Update column comments
COMMENT ON COLUMN experiences.category IS 'Primary category: fishing_charter, boat_tour, water_sports, airboat_tour, eco_tour, food_tour, cultural_tour, adventure_tour, bus_tour';
COMMENT ON COLUMN experiences.subcategory IS 'More specific category type (e.g., "Deep Sea Fishing", "Sunset Cruise")';
COMMENT ON COLUMN experiences.vibe_tags IS 'Array of vibe tags: adventure, chill, romantic, family_friendly, educational, etc.';
COMMENT ON COLUMN experiences.region IS 'Florida region: South Florida, Central Florida, West Coast, Northeast Florida, Panhandle';


-- =====================================================================
-- STEP 8: VALIDATION CHECKS
-- =====================================================================

-- Check that all experiences have valid categories
DO $$
DECLARE
  invalid_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO invalid_count
  FROM experiences
  WHERE category NOT IN (
    'fishing_charter', 'boat_tour', 'water_sports', 'airboat_tour',
    'eco_tour', 'food_tour', 'cultural_tour', 'adventure_tour', 'bus_tour'
  );

  IF invalid_count > 0 THEN
    RAISE WARNING 'Found % experiences with invalid categories', invalid_count;
  END IF;
END $$;

-- Check that all categories were created
DO $$
DECLARE
  category_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO category_count FROM categories WHERE is_active = true;

  IF category_count != 9 THEN
    RAISE WARNING 'Expected 9 categories, found %', category_count;
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

  -- Restore old category values
  UPDATE experiences SET category = category_backup WHERE category_backup IS NOT NULL;

  -- Remove new constraints
  ALTER TABLE experiences DROP CONSTRAINT IF EXISTS category_check;
  ALTER TABLE experiences DROP CONSTRAINT IF EXISTS region_check;

  -- Remove new columns
  ALTER TABLE experiences DROP COLUMN IF EXISTS category_backup;
  ALTER TABLE experiences DROP COLUMN IF EXISTS subcategory;
  ALTER TABLE experiences DROP COLUMN IF EXISTS vibe_tags;
  ALTER TABLE experiences DROP COLUMN IF EXISTS region;

  -- Drop new tables
  DROP TABLE IF EXISTS experience_categories;
  DROP TABLE IF EXISTS categories;

  COMMIT;
*/
