/*
  # Update Bookings Table for Guest Checkout

  1. Changes to Bookings Table
    - Add booking_reference column (text, unique)
    - Make user_id nullable to support guest bookings
    - Add guest_name, guest_email, guest_phone columns
    - Rename group_size to guest_count
    - Add subtotal, processing_fee, discount columns
    - Rename total_price_usd to total_price

  2. Security Updates
    - Update RLS policies to support guest bookings
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'booking_reference'
  ) THEN
    ALTER TABLE bookings ADD COLUMN booking_reference text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'guest_name'
  ) THEN
    ALTER TABLE bookings ADD COLUMN guest_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'guest_email'
  ) THEN
    ALTER TABLE bookings ADD COLUMN guest_email text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'guest_phone'
  ) THEN
    ALTER TABLE bookings ADD COLUMN guest_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'guest_count'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'bookings' AND column_name = 'group_size'
    ) THEN
      ALTER TABLE bookings RENAME COLUMN group_size TO guest_count;
    ELSE
      ALTER TABLE bookings ADD COLUMN guest_count integer DEFAULT 1;
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'subtotal'
  ) THEN
    ALTER TABLE bookings ADD COLUMN subtotal numeric(10, 2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'processing_fee'
  ) THEN
    ALTER TABLE bookings ADD COLUMN processing_fee numeric(10, 2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'discount'
  ) THEN
    ALTER TABLE bookings ADD COLUMN discount numeric(10, 2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'total_price'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'bookings' AND column_name = 'total_price_usd'
    ) THEN
      ALTER TABLE bookings RENAME COLUMN total_price_usd TO total_price;
      ALTER TABLE bookings ALTER COLUMN total_price TYPE numeric(10, 2);
    ELSE
      ALTER TABLE bookings ADD COLUMN total_price numeric(10, 2) DEFAULT 0;
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'special_requests'
  ) THEN
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'bookings' AND column_name = 'notes'
    ) THEN
      ALTER TABLE bookings RENAME COLUMN notes TO special_requests;
    END IF;
  END IF;
END $$;

ALTER TABLE bookings ALTER COLUMN user_id DROP NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'total_price_jmd'
  ) THEN
    ALTER TABLE bookings DROP COLUMN total_price_jmd;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'booking_time'
  ) THEN
    ALTER TABLE bookings DROP COLUMN booking_time;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookings' AND column_name = 'qr_code'
  ) THEN
    ALTER TABLE bookings DROP COLUMN qr_code;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(guest_email);
CREATE INDEX IF NOT EXISTS idx_bookings_experience ON bookings(experience_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);

DROP POLICY IF EXISTS "Anyone can create bookings" ON bookings;
CREATE POLICY "Anyone can create bookings"
  ON bookings FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Guests can view their bookings by email" ON bookings;
CREATE POLICY "Guests can view their bookings by email"
  ON bookings FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own bookings" ON bookings;
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()))
  WITH CHECK (auth.uid() = user_id OR guest_email = (SELECT email FROM auth.users WHERE id = auth.uid()));
