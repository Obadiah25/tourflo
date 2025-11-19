/*
  # Add operator logo field

  1. Changes
    - Add `logo_url` column to `operators` table
      - Stores the URL to the operator's logo image
      - Optional field (nullable)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'operators' AND column_name = 'logo_url'
  ) THEN
    ALTER TABLE operators ADD COLUMN logo_url text;
  END IF;
END $$;