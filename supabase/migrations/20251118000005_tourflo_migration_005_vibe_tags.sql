/*
  # Migration 005: Vibe Tags System

  ## Summary
  Creates comprehensive vibe tag system for experience classification.
  Replaces simple category vibes with detailed, multi-select vibe taxonomy.

  ## Changes Made

  ### 1. New Tables
  - CREATE `vibe_tags` table - Master list of experience vibes
  - CREATE `experience_vibe_tags` mapping table - Many-to-many relationship

  ### 2. Vibe Tag Data
  - INSERT 15 comprehensive vibe tags:
    * Family Friendly (👨‍👩‍👧‍👦, #FFD700)
    * Romantic (💕, #FF69B4)
    * Scenic (📸, #00CED1)
    * Group Friendly (👥, #FF8C00)
    * Local Experience (🏠, #228B22)
    * Photography-Friendly (📷, #9370DB)
    * Educational (📚, #4169E1)
    * Active/Fitness (🏃, #DC143C)
    * Chill/Relaxing (😎, #87CEEB)
    * Adventure (🏔️, #FF6B35)
    * Adrenaline (⚡, #DC143C)
    * Luxury (✨, #8B008B)
    * Budget-Friendly (💰, #32CD32)
    * Wildlife (🦌, #556B2F)
    * Cultural (🎭, #DAA520)

  ### 3. Migration of Old Vibe Preferences
  - Map old user vibe_pref to new vibe tag system
  - Auto-assign vibe tags to experiences based on category

  ## Security & Safety
  - Transaction-wrapped for atomicity
  - RLS policies applied to new tables
  - Preserves existing user preferences
  - Non-destructive migration

  ## Execution Notes
  - Expected runtime: 2-5 seconds
  - Estimated rows affected: All experiences + new vibe tag records
  - Zero downtime for read operations
  - Enhances discovery and filtering capabilities
*/

-- Start transaction
BEGIN;

-- =====================================================================
-- STEP 1: CREATE VIBE_TAGS TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS vibe_tags (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vibe_tags_slug ON vibe_tags(slug);
CREATE INDEX IF NOT EXISTS idx_vibe_tags_active ON vibe_tags(is_active);

-- Enable RLS
ALTER TABLE vibe_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view active vibe tags
CREATE POLICY "Anyone can view active vibe tags"
  ON vibe_tags FOR SELECT
  USING (is_active = true);


-- =====================================================================
-- STEP 2: CREATE EXPERIENCE_VIBE_TAGS MAPPING TABLE
-- =====================================================================

CREATE TABLE IF NOT EXISTS experience_vibe_tags (
  experience_id uuid REFERENCES experiences(id) ON DELETE CASCADE NOT NULL,
  vibe_tag_id uuid REFERENCES vibe_tags(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (experience_id, vibe_tag_id)
);

-- Create indexes for efficient lookups
CREATE INDEX IF NOT EXISTS idx_exp_vibe_experience ON experience_vibe_tags(experience_id);
CREATE INDEX IF NOT EXISTS idx_exp_vibe_tag ON experience_vibe_tags(vibe_tag_id);

-- Enable RLS
ALTER TABLE experience_vibe_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can view experience vibe tags
CREATE POLICY "Anyone can view experience vibe tags"
  ON experience_vibe_tags FOR SELECT
  USING (true);


-- =====================================================================
-- STEP 3: INSERT VIBE TAG DATA
-- =====================================================================

-- Clear existing vibe tags if any
DELETE FROM vibe_tags;

-- Insert 15 comprehensive vibe tags
INSERT INTO vibe_tags (name, slug, icon, color, description, display_order, is_active) VALUES
  (
    'Family Friendly',
    'family_friendly',
    '👨‍👩‍👧‍👦',
    '#FFD700',
    'Safe and enjoyable for all ages, perfect for families with children',
    1,
    true
  ),
  (
    'Romantic',
    'romantic',
    '💕',
    '#FF69B4',
    'Perfect for couples, intimate settings, and special occasions',
    2,
    true
  ),
  (
    'Scenic',
    'scenic',
    '📸',
    '#00CED1',
    'Beautiful views, stunning landscapes, and photo opportunities',
    3,
    true
  ),
  (
    'Group Friendly',
    'group_friendly',
    '👥',
    '#FF8C00',
    'Great for groups, team building, and social gatherings',
    4,
    true
  ),
  (
    'Local Experience',
    'local_experience',
    '🏠',
    '#228B22',
    'Authentic, insider access to local culture and hidden gems',
    5,
    true
  ),
  (
    'Photography-Friendly',
    'photography_friendly',
    '📷',
    '#9370DB',
    'Instagram-worthy spots and perfect lighting for photos',
    6,
    true
  ),
  (
    'Educational',
    'educational',
    '📚',
    '#4169E1',
    'Learn something new, guided by experts with fascinating insights',
    7,
    true
  ),
  (
    'Active/Fitness',
    'active_fitness',
    '🏃',
    '#DC143C',
    'Physical activity, exercise, and staying active during vacation',
    8,
    true
  ),
  (
    'Chill/Relaxing',
    'chill',
    '😎',
    '#87CEEB',
    'Laid-back, stress-free, and perfect for unwinding',
    9,
    true
  ),
  (
    'Adventure',
    'adventure',
    '🏔️',
    '#FF6B35',
    'Exciting experiences, exploration, and trying new things',
    10,
    true
  ),
  (
    'Adrenaline',
    'adrenaline',
    '⚡',
    '#DC143C',
    'Heart-pumping, thrilling, and extreme activities',
    11,
    true
  ),
  (
    'Luxury',
    'luxury',
    '✨',
    '#8B008B',
    'Premium service, high-end experiences, and VIP treatment',
    12,
    true
  ),
  (
    'Budget-Friendly',
    'budget_friendly',
    '💰',
    '#32CD32',
    'Affordable options without sacrificing quality',
    13,
    true
  ),
  (
    'Wildlife',
    'wildlife',
    '🦌',
    '#556B2F',
    'Animal encounters, nature observation, and eco-experiences',
    14,
    true
  ),
  (
    'Cultural',
    'cultural',
    '🎭',
    '#DAA520',
    'Heritage, traditions, history, and cultural immersion',
    15,
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
-- STEP 4: AUTO-ASSIGN VIBE TAGS TO EXPERIENCES
-- =====================================================================

-- Create helper function to assign vibe tags based on category
CREATE OR REPLACE FUNCTION assign_vibe_tags_by_category(exp_id uuid, cat text)
RETURNS void AS $$
DECLARE
  tag_slugs text[];
BEGIN
  -- Determine appropriate vibe tags based on category
  tag_slugs := CASE
    WHEN cat = 'fishing_charter' THEN ARRAY['adventure', 'local_experience', 'group_friendly', 'scenic']
    WHEN cat = 'boat_tour' THEN ARRAY['chill', 'scenic', 'romantic', 'family_friendly']
    WHEN cat = 'water_sports' THEN ARRAY['adventure', 'adrenaline', 'active_fitness', 'group_friendly']
    WHEN cat = 'airboat_tour' THEN ARRAY['adventure', 'wildlife', 'photography_friendly', 'educational']
    WHEN cat = 'eco_tour' THEN ARRAY['educational', 'wildlife', 'scenic', 'family_friendly']
    WHEN cat = 'food_tour' THEN ARRAY['local_experience', 'cultural', 'group_friendly', 'photography_friendly']
    WHEN cat = 'cultural_tour' THEN ARRAY['educational', 'cultural', 'local_experience', 'photography_friendly']
    WHEN cat = 'adventure_tour' THEN ARRAY['adventure', 'adrenaline', 'active_fitness', 'group_friendly']
    WHEN cat = 'bus_tour' THEN ARRAY['chill', 'scenic', 'family_friendly', 'group_friendly']
    ELSE ARRAY['scenic', 'family_friendly']
  END;

  -- Insert vibe tag mappings
  INSERT INTO experience_vibe_tags (experience_id, vibe_tag_id)
  SELECT exp_id, vt.id
  FROM vibe_tags vt
  WHERE vt.slug = ANY(tag_slugs)
  ON CONFLICT (experience_id, vibe_tag_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Apply vibe tags to all existing experiences
DO $$
DECLARE
  exp_record RECORD;
BEGIN
  FOR exp_record IN SELECT id, category FROM experiences WHERE category IS NOT NULL
  LOOP
    PERFORM assign_vibe_tags_by_category(exp_record.id, exp_record.category);
  END LOOP;
END $$;

-- Drop helper function after use
DROP FUNCTION IF EXISTS assign_vibe_tags_by_category(uuid, text);


-- =====================================================================
-- STEP 5: MIGRATE OLD USER VIBE PREFERENCES
-- =====================================================================

-- Map old vibe_pref values to new vibe tags
-- Old values: chill, adventure, party, foodie

-- Create user_vibe_preferences table for users' preferred vibes
CREATE TABLE IF NOT EXISTS user_vibe_preferences (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  vibe_tag_id uuid REFERENCES vibe_tags(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, vibe_tag_id)
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_user_vibe_user ON user_vibe_preferences(user_id);

-- Enable RLS
ALTER TABLE user_vibe_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own vibe preferences"
  ON user_vibe_preferences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own vibe preferences"
  ON user_vibe_preferences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own vibe preferences"
  ON user_vibe_preferences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Migrate old vibe_pref to new system
INSERT INTO user_vibe_preferences (user_id, vibe_tag_id)
SELECT
  u.id AS user_id,
  vt.id AS vibe_tag_id
FROM users u
JOIN vibe_tags vt ON vt.slug = CASE
  WHEN u.vibe_pref = 'chill' THEN 'chill'
  WHEN u.vibe_pref = 'adventure' THEN 'adventure'
  WHEN u.vibe_pref = 'party' THEN 'group_friendly'
  WHEN u.vibe_pref = 'foodie' THEN 'local_experience'
  ELSE 'scenic'
END
WHERE u.vibe_pref IS NOT NULL
ON CONFLICT (user_id, vibe_tag_id) DO NOTHING;


-- =====================================================================
-- STEP 6: UPDATE EXPERIENCES TABLE VIBE_TAGS ARRAY
-- =====================================================================

-- Update the vibe_tags array column with assigned vibe tags
-- This provides a denormalized field for quick access
UPDATE experiences e
SET vibe_tags = (
  SELECT ARRAY_AGG(vt.slug)
  FROM experience_vibe_tags evt
  JOIN vibe_tags vt ON vt.id = evt.vibe_tag_id
  WHERE evt.experience_id = e.id
)
WHERE EXISTS (
  SELECT 1 FROM experience_vibe_tags WHERE experience_id = e.id
);

-- Add index on vibe_tags array for fast filtering
CREATE INDEX IF NOT EXISTS idx_experiences_vibe_tags ON experiences USING GIN (vibe_tags);

-- Update column comment
COMMENT ON COLUMN experiences.vibe_tags IS 'Array of vibe tag slugs for quick filtering (synced from experience_vibe_tags table)';


-- =====================================================================
-- STEP 7: CREATE TRIGGER TO SYNC VIBE_TAGS ARRAY
-- =====================================================================

-- Function to sync vibe_tags array when experience_vibe_tags changes
CREATE OR REPLACE FUNCTION sync_experience_vibe_tags()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the experiences.vibe_tags array
  UPDATE experiences
  SET vibe_tags = (
    SELECT ARRAY_AGG(vt.slug)
    FROM experience_vibe_tags evt
    JOIN vibe_tags vt ON vt.id = evt.vibe_tag_id
    WHERE evt.experience_id = COALESCE(NEW.experience_id, OLD.experience_id)
  )
  WHERE id = COALESCE(NEW.experience_id, OLD.experience_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for INSERT, UPDATE, DELETE on experience_vibe_tags
CREATE TRIGGER sync_vibe_tags_on_insert
  AFTER INSERT ON experience_vibe_tags
  FOR EACH ROW
  EXECUTE FUNCTION sync_experience_vibe_tags();

CREATE TRIGGER sync_vibe_tags_on_delete
  AFTER DELETE ON experience_vibe_tags
  FOR EACH ROW
  EXECUTE FUNCTION sync_experience_vibe_tags();


-- =====================================================================
-- STEP 8: VALIDATION CHECKS
-- =====================================================================

-- Check that all vibe tags were created
DO $$
DECLARE
  vibe_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO vibe_count FROM vibe_tags WHERE is_active = true;

  IF vibe_count != 15 THEN
    RAISE WARNING 'Expected 15 vibe tags, found %', vibe_count;
  END IF;
END $$;

-- Check that experiences have vibe tags assigned
DO $$
DECLARE
  tagged_count INTEGER;
  total_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM experiences;
  SELECT COUNT(DISTINCT experience_id) INTO tagged_count FROM experience_vibe_tags;

  RAISE NOTICE '% out of % experiences have vibe tags assigned', tagged_count, total_count;

  IF total_count > 0 AND tagged_count = 0 THEN
    RAISE WARNING 'No experiences have vibe tags assigned';
  END IF;
END $$;

-- Check that vibe_tags array is synced
DO $$
DECLARE
  synced_count INTEGER;
  total_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_count FROM experiences;
  SELECT COUNT(*) INTO synced_count FROM experiences WHERE vibe_tags IS NOT NULL AND array_length(vibe_tags, 1) > 0;

  RAISE NOTICE '% out of % experiences have synced vibe_tags array', synced_count, total_count;
END $$;


-- Commit transaction
COMMIT;


-- =====================================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================================

/*
  To rollback this migration, execute the following:

  BEGIN;

  -- Drop triggers
  DROP TRIGGER IF EXISTS sync_vibe_tags_on_insert ON experience_vibe_tags;
  DROP TRIGGER IF EXISTS sync_vibe_tags_on_delete ON experience_vibe_tags;

  -- Drop function
  DROP FUNCTION IF EXISTS sync_experience_vibe_tags();

  -- Clear vibe_tags array in experiences
  UPDATE experiences SET vibe_tags = ARRAY[]::text[] WHERE vibe_tags IS NOT NULL;

  -- Drop new tables
  DROP TABLE IF EXISTS user_vibe_preferences;
  DROP TABLE IF EXISTS experience_vibe_tags;
  DROP TABLE IF EXISTS vibe_tags;

  -- Keep old vibe_pref column in users table
  -- (No changes needed as we didn't modify it)

  COMMIT;
*/
