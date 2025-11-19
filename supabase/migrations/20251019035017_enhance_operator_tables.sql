/*
  # Enhance Operator Tables

  1. Updates to Existing Tables
    - Add new columns to `operators` table for enhanced functionality
    - Create new tables for earnings and availability

  2. New Tables
    - `operator_earnings` - Track all financial transactions
    - `operator_availability` - Manage operator schedule and availability

  3. Security
    - Enable RLS on all new tables
    - Add policies for operators to manage their own data
*/

-- Add new columns to operators table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'auth_user_id') THEN
    ALTER TABLE operators ADD COLUMN auth_user_id uuid REFERENCES auth.users;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'business_name') THEN
    ALTER TABLE operators ADD COLUMN business_name text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'business_type') THEN
    ALTER TABLE operators ADD COLUMN business_type text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'contact_name') THEN
    ALTER TABLE operators ADD COLUMN contact_name text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'email') THEN
    ALTER TABLE operators ADD COLUMN email text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'phone') THEN
    ALTER TABLE operators ADD COLUMN phone text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'parish') THEN
    ALTER TABLE operators ADD COLUMN parish text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'description') THEN
    ALTER TABLE operators ADD COLUMN description text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'years_in_operation') THEN
    ALTER TABLE operators ADD COLUMN years_in_operation integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'tier') THEN
    ALTER TABLE operators ADD COLUMN tier text DEFAULT 'starter';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'status') THEN
    ALTER TABLE operators ADD COLUMN status text DEFAULT 'pending';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'cover_photo_url') THEN
    ALTER TABLE operators ADD COLUMN cover_photo_url text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'verification_documents') THEN
    ALTER TABLE operators ADD COLUMN verification_documents jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'payment_info') THEN
    ALTER TABLE operators ADD COLUMN payment_info jsonb DEFAULT '{}';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'trn') THEN
    ALTER TABLE operators ADD COLUMN trn text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'rating') THEN
    ALTER TABLE operators ADD COLUMN rating decimal(3,2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'total_bookings') THEN
    ALTER TABLE operators ADD COLUMN total_bookings integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'operators' AND column_name = 'approved_at') THEN
    ALTER TABLE operators ADD COLUMN approved_at timestamptz;
  END IF;
END $$;

-- Create operator_earnings table
CREATE TABLE IF NOT EXISTS operator_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id uuid REFERENCES operators NOT NULL,
  booking_id uuid REFERENCES bookings,
  amount decimal(10,2) NOT NULL,
  type text NOT NULL CHECK (type IN ('booking', 'payout', 'refund')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  payment_method text,
  payout_date timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE operator_earnings ENABLE ROW LEVEL SECURITY;

-- Policies for operator_earnings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'operator_earnings' AND policyname = 'Operators can view own earnings'
  ) THEN
    CREATE POLICY "Operators can view own earnings"
      ON operator_earnings FOR SELECT
      TO authenticated
      USING (
        operator_id IN (
          SELECT id FROM operators WHERE auth_user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'operator_earnings' AND policyname = 'System can insert earnings'
  ) THEN
    CREATE POLICY "System can insert earnings"
      ON operator_earnings FOR INSERT
      TO authenticated
      WITH CHECK (
        operator_id IN (
          SELECT id FROM operators WHERE auth_user_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Create operator_availability table
CREATE TABLE IF NOT EXISTS operator_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_id uuid REFERENCES experiences NOT NULL,
  day_of_week integer CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  max_bookings integer DEFAULT 10,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE operator_availability ENABLE ROW LEVEL SECURITY;

-- Policies for operator_availability
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'operator_availability' AND policyname = 'Operators can manage own availability'
  ) THEN
    CREATE POLICY "Operators can manage own availability"
      ON operator_availability FOR ALL
      TO authenticated
      USING (
        experience_id IN (
          SELECT e.id FROM experiences e
          JOIN operators o ON e.operator_id = o.id
          WHERE o.auth_user_id = auth.uid()
        )
      )
      WITH CHECK (
        experience_id IN (
          SELECT e.id FROM experiences e
          JOIN operators o ON e.operator_id = o.id
          WHERE o.auth_user_id = auth.uid()
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'operator_availability' AND policyname = 'Anyone can view availability'
  ) THEN
    CREATE POLICY "Anyone can view availability"
      ON operator_availability FOR SELECT
      USING (
        is_active = true
        AND experience_id IN (
          SELECT id FROM experiences WHERE is_active = true
        )
      );
  END IF;
END $$;

-- Update operator policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'operators' AND policyname = 'Operators can view own profile'
  ) THEN
    CREATE POLICY "Operators can view own profile"
      ON operators FOR SELECT
      TO authenticated
      USING (auth_user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'operators' AND policyname = 'Operators can update own profile'
  ) THEN
    CREATE POLICY "Operators can update own profile"
      ON operators FOR UPDATE
      TO authenticated
      USING (auth_user_id = auth.uid())
      WITH CHECK (auth_user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'operators' AND policyname = 'Users can create operator profile'
  ) THEN
    CREATE POLICY "Users can create operator profile"
      ON operators FOR INSERT
      TO authenticated
      WITH CHECK (auth_user_id = auth.uid());
  END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_operators_auth_user_id ON operators(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_operators_status ON operators(status);
CREATE INDEX IF NOT EXISTS idx_operator_earnings_operator_id ON operator_earnings(operator_id);
CREATE INDEX IF NOT EXISTS idx_operator_earnings_booking_id ON operator_earnings(booking_id);
CREATE INDEX IF NOT EXISTS idx_operator_availability_experience_id ON operator_availability(experience_id);
