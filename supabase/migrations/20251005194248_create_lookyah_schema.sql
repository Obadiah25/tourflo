/*
  # LOOKYAH Platform Database Schema

  ## Overview
  Complete database schema for LOOKYAH tourism booking platform with AI guide JAHBOI.
  
  ## New Tables
  
  ### 1. `users`
  Stores user preferences and profile data (private, no social features)
  - `id` (uuid, primary key, references auth.users)
  - `location` (text) - User's home location (USA, UK, Canada, Jamaica)
  - `currency_pref` (text) - Preferred currency (JMD or USD)
  - `timeline` (text) - When visiting (already_here, this_week, next_month, browsing)
  - `vibe_pref` (text) - Experience preference (chill, adventure, party, foodie)
  - `referral_code` (text, unique) - User's unique referral code
  - `referral_credits` (integer) - Available credit in cents (USD)
  - `referred_by` (uuid) - User who referred them
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. `operators`
  Tourism operators offering experiences
  - `id` (uuid, primary key)
  - `name` (text) - Business name
  - `whatsapp` (text) - Contact number
  - `verified` (boolean) - Verification status
  - `created_at` (timestamptz)
  
  ### 3. `experiences`
  Tourism activities and experiences
  - `id` (uuid, primary key)
  - `operator_id` (uuid, foreign key)
  - `title` (text) - Experience name
  - `description` (text) - Full description
  - `video_url` (text) - Video preview URL
  - `image_url` (text) - Fallback image
  - `price_jmd` (integer) - Price in Jamaican dollars (cents)
  - `price_usd` (integer) - Price in USD (cents)
  - `location_lat` (decimal) - Latitude
  - `location_lng` (decimal) - Longitude
  - `location_name` (text) - Human-readable location
  - `category` (text) - chill, adventure, party, foodie
  - `duration_minutes` (integer) - Experience length
  - `max_capacity` (integer) - Max guests per slot
  - `available_times` (jsonb) - Array of available time slots
  - `requirements` (text) - Special requirements/notes
  - `is_active` (boolean) - Currently bookable
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. `bookings`
  User bookings and reservations
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `experience_id` (uuid, foreign key)
  - `booking_date` (date) - Date of experience
  - `booking_time` (time) - Time of experience
  - `group_size` (integer) - Number of people
  - `total_price_jmd` (integer) - Total in JMD (cents)
  - `total_price_usd` (integer) - Total in USD (cents)
  - `payment_method` (text) - apple_pay, credit_card, pay_at_location
  - `payment_status` (text) - pending, paid, refunded
  - `status` (text) - confirmed, cancelled, completed
  - `qr_code` (text) - QR code data for check-in
  - `notes` (text) - Special requests
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 5. `saved_experiences`
  User's wishlist/saved experiences
  - `user_id` (uuid, foreign key)
  - `experience_id` (uuid, foreign key)
  - `created_at` (timestamptz)
  - Primary key: (user_id, experience_id)
  
  ### 6. `jahboi_chats`
  Chat history with JAHBOI AI
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key)
  - `messages` (jsonb) - Array of message objects
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ## Security
  - Enable RLS on all tables
  - Users can only access their own data
  - Experiences and operators are publicly readable
  - Strict policies for bookings and saved items
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  location text DEFAULT 'browsing',
  currency_pref text DEFAULT 'USD',
  timeline text DEFAULT 'browsing',
  vibe_pref text DEFAULT 'chill',
  referral_code text UNIQUE NOT NULL,
  referral_credits integer DEFAULT 0,
  referred_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create operators table
CREATE TABLE IF NOT EXISTS operators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  whatsapp text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id uuid REFERENCES operators(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  video_url text,
  image_url text,
  price_jmd integer NOT NULL,
  price_usd integer NOT NULL,
  location_lat decimal(10, 8),
  location_lng decimal(11, 8),
  location_name text NOT NULL,
  category text NOT NULL,
  duration_minutes integer DEFAULT 120,
  max_capacity integer DEFAULT 20,
  available_times jsonb DEFAULT '[]'::jsonb,
  requirements text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  experience_id uuid REFERENCES experiences(id) ON DELETE CASCADE NOT NULL,
  booking_date date NOT NULL,
  booking_time time NOT NULL,
  group_size integer NOT NULL DEFAULT 1,
  total_price_jmd integer NOT NULL,
  total_price_usd integer NOT NULL,
  payment_method text DEFAULT 'pay_at_location',
  payment_status text DEFAULT 'pending',
  status text DEFAULT 'confirmed',
  qr_code text,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create saved_experiences table
CREATE TABLE IF NOT EXISTS saved_experiences (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  experience_id uuid REFERENCES experiences(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, experience_id)
);

-- Create jahboi_chats table
CREATE TABLE IF NOT EXISTS jahboi_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  messages jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_experiences_category ON experiences(category);
CREATE INDEX IF NOT EXISTS idx_experiences_location ON experiences(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_experiences_active ON experiences(is_active);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_saved_user ON saved_experiences(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_user ON jahboi_chats(user_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE jahboi_chats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- RLS Policies for operators (public read)
CREATE POLICY "Anyone can view operators"
  ON operators FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for experiences (public read)
CREATE POLICY "Anyone can view active experiences"
  ON experiences FOR SELECT
  TO authenticated
  USING (is_active = true);

-- RLS Policies for bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for saved_experiences
CREATE POLICY "Users can view own saved experiences"
  ON saved_experiences FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save experiences"
  ON saved_experiences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave experiences"
  ON saved_experiences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for jahboi_chats
CREATE POLICY "Users can view own chats"
  ON jahboi_chats FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own chats"
  ON jahboi_chats FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chats"
  ON jahboi_chats FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Function to generate unique referral codes
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate referral codes
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_referral_code
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_referral_code();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER jahboi_chats_updated_at
  BEFORE UPDATE ON jahboi_chats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();