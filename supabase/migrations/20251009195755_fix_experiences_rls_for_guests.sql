/*
  # Fix Experiences RLS for Guest Access

  1. Changes
    - Drop existing restrictive policy that only allows authenticated users
    - Add new policy that allows both authenticated and anonymous users to view active experiences
    - This enables guest mode users to browse experiences without signing in

  2. Security
    - Still restrictive: only SELECT is allowed
    - Only active experiences are visible (is_active = true)
    - No write access for anonymous users
*/

-- Drop the old policy that only allowed authenticated users
DROP POLICY IF EXISTS "Anyone can view active experiences" ON experiences;

-- Create new policy allowing both authenticated and anonymous users to view
CREATE POLICY "Public can view active experiences"
  ON experiences
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
