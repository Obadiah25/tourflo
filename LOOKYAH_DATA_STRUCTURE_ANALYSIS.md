# LOOKYAH JAMAICA → TOURFLO FLORIDA DATA STRUCTURE ANALYSIS

Complete data model, category system, and mock data documentation for platform migration.

---

## 1. DATA MODELS

### 1.1 USER/ACCOUNT STRUCTURE

**Table: `users`** (Tourist/Customer accounts)
- `id` (uuid, PK, references auth.users)
- `location` (text) - User's home location: USA, UK, Canada, Jamaica
- `currency_pref` (text) - Preferred currency: 'JMD' | 'USD'
- `timeline` (text) - When visiting: already_here, this_week, next_month, browsing
- `vibe_pref` (text) - Experience preference: chill, adventure, party, foodie
- `referral_code` (text, unique) - User's unique referral code (auto-generated)
- `referral_credits` (integer) - Available credit in cents (USD)
- `referred_by` (uuid) - User who referred them
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Storage Keys:**
- `lookyah_visited` - Whether user has visited before
- `lookyah_onboarded` - Whether user completed onboarding
- `lookyah_guest_mode` - Whether user is in guest mode
- `has_swiped` - Whether user has swiped cards before

---

### 1.2 OPERATOR/BUSINESS MODEL

**Table: `operators`** (Tourism operators)
- `id` (uuid, PK)
- `name` (text) - Business name
- `whatsapp` (text) - Contact number
- `verified` (boolean) - Verification status
- `logo_url` (text) - Business logo
- `created_at` (timestamptz)

**Enhanced Operator Fields** (from migration):
- `auth_user_id` (uuid) - References auth.users for operator login
- `business_name` (text)
- `business_type` (text)
- `contact_name` (text)
- `email` (text)
- `phone` (text)
- `parish` (text) - **JAMAICA-SPECIFIC**: Location by parish
- `description` (text)
- `years_in_operation` (integer)
- `tier` (text) - Subscription tier: 'starter', 'pro', 'enterprise'
- `status` (text) - 'pending', 'active', 'suspended'
- `cover_photo_url` (text)
- `verification_documents` (jsonb)
- `payment_info` (jsonb)
- `trn` (text) - **JAMAICA-SPECIFIC**: Tax Registration Number
- `rating` (decimal 3,2)
- `total_bookings` (integer)
- `approved_at` (timestamptz)

**Jamaica Parishes List:**
```typescript
const parishes = [
  'Kingston', 'St. Andrew', 'St. Catherine', 'Clarendon',
  'Manchester', 'St. Elizabeth', 'Westmoreland', 'Hanover',
  'St. James', 'Trelawny', 'St. Ann', 'St. Mary',
  'Portland', 'St. Thomas'
];
```

---

### 1.3 EXPERIENCE/TOUR MODEL

**Table: `experiences`** (Activities/Tours)
- `id` (uuid, PK)
- `operator_id` (uuid, FK → operators)
- `title` (text) - Experience name
- `description` (text) - Full description
- `video_url` (text) - Video preview URL
- `image_url` (text) - Fallback image
- `price_jmd` (integer) - **JAMAICA**: Price in Jamaican dollars (cents)
- `price_usd` (integer) - Price in USD (cents)
- `location_lat` (decimal 10,8) - Latitude
- `location_lng` (decimal 11,8) - Longitude
- `location_name` (text) - Human-readable location
- `category` (text) - **CORE CATEGORY**: chill, adventure, party, foodie
- `duration_minutes` (integer) - Experience length (default: 120)
- `max_capacity` (integer) - Max guests per slot (default: 20)
- `available_times` (jsonb) - Array of available time slots
- `requirements` (text) - Special requirements/notes
- `is_active` (boolean) - Currently bookable (default: true)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Experience Creation Categories** (from operator UI):
```typescript
const categories = [
  'Tour', 'Adventure', 'Food & Drink', 'Culture',
  'Nature', 'Water Sports', 'Nightlife', 'Shopping'
];

const vibes = [
  'Family Friendly', 'Romantic', 'Adventure', 'Relaxing',
  'Educational', 'Party', 'Luxury', 'Budget'
];
```

---

### 1.4 BOOKING/RESERVATION MODEL

**Table: `bookings`**
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users) - Can be NULL for guest checkout
- `experience_id` (uuid, FK → experiences)
- `booking_date` (date) - Date of experience
- `booking_time` (time) - Time of experience
- `group_size` (integer) - Number of people (default: 1)
- `total_price_jmd` (integer) - **JAMAICA**: Total in JMD (cents)
- `total_price_usd` (integer) - Total in USD (cents)
- `payment_method` (text) - apple_pay, credit_card, pay_at_location
- `payment_status` (text) - pending, paid, refunded
- `status` (text) - confirmed, cancelled, completed
- `qr_code` (text) - QR code data for check-in
- `notes` (text) - Special requests
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Guest Booking Fields** (from migration):
- `guest_name` (text)
- `guest_email` (text)
- `guest_phone` (text)
- `guest_country` (text)

**QR Code Format:**
```typescript
const qrData = `LOOKYAH-${Date.now()}-${experience.id}`;
```

**Booking Reference Format:**
```typescript
const prefix = 'LYH';
const timestamp = Date.now().toString(36).toUpperCase();
const random = Math.random().toString(36).substring(2, 6).toUpperCase();
return `${prefix}-${timestamp}-${random}`;
// Example: LYH-M2N9K7-A4B8
```

---

### 1.5 SAVED EXPERIENCES (WISHLIST)

**Table: `saved_experiences`**
- `user_id` (uuid, FK → auth.users)
- `experience_id` (uuid, FK → experiences)
- `created_at` (timestamptz)
- **Primary Key**: (user_id, experience_id)

---

### 1.6 CHAT/AI ASSISTANT MODEL

**Table: `jahboi_chats`** - **JAMAICA-SPECIFIC**: Named after JAHBOI AI
- `id` (uuid, PK)
- `user_id` (uuid, FK → auth.users)
- `messages` (jsonb) - Array of message objects
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

**Message Format:**
```typescript
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'tourguide'; // Note: 'tourguide' not 'jahboi'
  timestamp: Date;
}
```

---

### 1.7 OPERATOR EARNINGS MODEL

**Table: `operator_earnings`**
- `id` (uuid, PK)
- `operator_id` (uuid, FK → operators)
- `booking_id` (uuid, FK → bookings)
- `amount` (decimal 10,2)
- `type` (text) - 'booking', 'payout', 'refund'
- `status` (text) - 'pending', 'completed', 'cancelled'
- `payment_method` (text)
- `payout_date` (timestamptz)
- `created_at` (timestamptz)

---

### 1.8 OPERATOR AVAILABILITY MODEL

**Table: `operator_availability`**
- `id` (uuid, PK)
- `experience_id` (uuid, FK → experiences)
- `day_of_week` (integer) - 0-6 (Sunday-Saturday)
- `start_time` (time)
- `end_time` (time)
- `max_bookings` (integer, default: 10)
- `is_active` (boolean, default: true)
- `created_at` (timestamptz)

---

## 2. CATEGORY SYSTEM

### 2.1 PRIMARY CATEGORIES (4 Core)

**Database Field:** `experiences.category`

**Values:**
1. **chill** 😎
2. **adventure** 🏄
3. **party** 🎉
4. **foodie** 🍽️

**Where Used:**
- Database: `experiences` table, indexed
- Onboarding: User preference selection (`vibe_pref`)
- Filtering: Discovery feed vibe filter
- Display: Experience cards, detail pages

**Category Emoji Mapping:**
```typescript
const categoryEmoji = {
  chill: '😎',
  adventure: '🏄',
  party: '🎉',
  foodie: '🍽️',
}[experience.category] || '😎';
```

---

### 2.2 ONBOARDING VIBES (Same as Categories)

**Component:** `OnboardingFlow.tsx`

```typescript
const VIBES = [
  { emoji: '😎', label: 'Chill', value: 'chill' },
  { emoji: '🔥', label: 'Adventure', value: 'adventure' },
  { emoji: '🎉', label: 'Party', value: 'party' },
  { emoji: '🍴', label: 'Foodie', value: 'foodie' },
];
```

---

### 2.3 OPERATOR EXPERIENCE CATEGORIES (8 Types)

**Component:** `ExperienceCreation.tsx`

```typescript
const categories = [
  'Tour',
  'Adventure',
  'Food & Drink',
  'Culture',
  'Nature',
  'Water Sports',
  'Nightlife',
  'Shopping'
];
```

**Note:** These are secondary/UI categories, NOT the database category field.

---

### 2.4 VIBE TAGS (8 Tags)

**Component:** `ExperienceCreation.tsx`

```typescript
const vibes = [
  'Family Friendly',
  'Romantic',
  'Adventure',
  'Relaxing',
  'Educational',
  'Party',
  'Luxury',
  'Budget'
];
```

---

## 3. MOCK DATA & SAMPLE RECORDS

### 3.1 Sample Experiences

**File:** `src/lib/sampleData.ts`

```typescript
export const sampleExperiences = [
  {
    id: '1',
    title: 'Rick\'s Cafe Sunset Experience',
    description: 'Watch cliff divers and enjoy the Caribbean\'s most famous sunset',
    image_url: 'https://images.pexels.com/photos/1118874/pexels-photo-1118874.jpeg',
    video_url: null,
    price_jmd: 12000, // J$120.00
    price_usd: 80,     // $80.00
    location_name: 'Negril',
    category: 'chill',
    duration_minutes: 180,
    operator_id: '1',
  },
  {
    id: '2',
    title: 'Dunn\'s River Falls Adventure',
    description: 'Climb the iconic waterfall with an experienced guide',
    image_url: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg',
    video_url: null,
    price_jmd: 15000, // J$150.00
    price_usd: 100,    // $100.00
    location_name: 'Ocho Rios',
    category: 'adventure',
    duration_minutes: 240,
    operator_id: '2',
  },
];
```

---

### 3.2 Location Filters (Jamaica-Specific)

**Component:** `DiscoveryFeed.tsx`

```typescript
['All', 'Negril', 'Ocho Rios', 'Kingston', 'Falmouth']
```

**Replace with Florida locations:**
- Miami
- Orlando
- Tampa
- Fort Lauderdale
- Key West
- Naples
- St. Petersburg
- Jacksonville

---

### 3.3 Currency Display Patterns

**Price Format (JMD):**
```typescript
const price = currency_pref === 'JMD'
  ? `J$${(experience.price_jmd / 100).toFixed(0)}`  // J$120
  : `$${(experience.price_usd / 100).toFixed(0)}`;   // $80
```

**Note:** Prices stored in CENTS, displayed in DOLLARS

---

## 4. UI COMPONENTS USING CATEGORIES

### 4.1 Category Display Components

1. **DiscoveryFeed.tsx**
   - Vibe filter buttons: All, Chill, Adventure, Party, Foodie
   - Matches experiences: `selectedVibe === 'All' || exp.category.toLowerCase() === selectedVibe.toLowerCase()`
   - Line 261

2. **ExperienceDetailPage.tsx**
   - Category badge display
   - Category emoji mapping
   - Lines 219-224, 418

3. **ExperienceCard.tsx**
   - Category displayed on experience cards
   - Used in discovery feed carousel

4. **OnboardingFlow.tsx**
   - User vibe preference selection
   - Multi-select allowed
   - Lines 23-28, 50-66

5. **ExperienceCreation.tsx** (Operator)
   - Category selection for new experiences
   - Required field for publishing
   - Lines 116-156

---

### 4.2 Filter Components

**Discovery Feed Filters:**
- **Vibe Filter**: All, Chill, Adventure, Party, Foodie
- **Price Filter**: All, Under $50, $50-100, $100+
- **Location Filter**: All, Negril, Ocho Rios, Kingston, Falmouth

---

## 5. LOCALIZATION & BRANDING

### 5.1 Brand Names

**Primary Brand:** LOOKYAH
**AI Assistant:** JAHBOI

**Occurrences:**
```
LOOKYAH:
- App title: "LOOKYAH JAMAICA 😎"
- Console logs: Multiple references
- PWA manifest: "LOOKYAH Jamaica" / "LOOKYAH"
- Branding file: LOOKYAH_LOGOS constant
- LocalStorage keys: lookyah_*
- Service Worker: 'lookyah-v2', 'lookyah-dynamic-v2'
- QR codes: "LOOKYAH-{timestamp}-{id}"
- Page title: "LOOKYAH Jamaica - Book Authentic Experiences"
- Meta tags: "It's here. Just look - Book authentic Jamaica experiences with JAHBOI AI guide"

JAHBOI:
- Database table: jahboi_chats
- Logo references: /logos/jahboismall.png
- Chat component: "JAHBOI told them you're coming!"
- Lib file: src/lib/jahboi.ts (exports getTourGuideResponse as getJahboiResponse)
- Manifest: "Chat with JAHBOI"
```

**Brand Asset Mapping:**
```typescript
export const TOURFLO_LOGOS = {
  tourguide: '/logos/tourguide.png',
  tourguideSmall: '/logos/tourguidesmall.png',
  tourguideWhite: '/logos/tourguidewhite.png',
  tourfloBlack: '/logos/tourflo-black.png',
  tourfloWhite: '/logos/tourflo-white.png',
  splash: '/logos/tourguide.png',
  navHeader: '/logos/tourflo-black.png',
  chatAvatarWhite: '/logos/tourguidewhite.png',
  chatAvatar: '/logos/tourguidesmall.png',
};

export const LOOKYAH_LOGOS = TOURFLO_LOGOS; // Alias
```

---

### 5.2 Currency References

**Currencies:**
- **JMD** (Jamaican Dollar) - Symbol: J$
- **USD** (US Dollar) - Symbol: $

**Usage Pattern:**
```typescript
currency_pref: 'USD' | 'JMD'

// Display
currency_pref === 'JMD' ? `J$${amount}` : `$${amount}`

// Database fields
price_jmd: integer (cents)
price_usd: integer (cents)
total_price_jmd: integer (cents)
total_price_usd: integer (cents)
```

**Florida Conversion:**
- Remove all JMD references
- Keep only USD
- Remove dual-currency logic throughout

---

### 5.3 Location References (Jamaica-Specific)

**Cities/Locations:**
- Negril
- Ocho Rios
- Kingston
- Falmouth
- Montego Bay (implied)
- Blue Mountains, Kingston
- Dunn's River Falls, Ocho Rios

**Parish System:**
14 parishes used in operator registration (see Section 1.2)

**Example Strings:**
- "Born in Negril • 8 years guiding"
- "I love showing visitors the real Jamaica!"
- "Best experience in Jamaica!"
- "Finding the best Jamaica has to offer"
- "Start exploring Jamaica's best experiences"
- "Quick access to Jamaica experiences"
- "My Jamaica Wishlist"
- "Perfect! Let me show you Jamaica..."
- "Fast & secure Jamaican payment"

---

### 5.4 Onboarding Location Options

**Current (Jamaica):**
```typescript
const LOCATIONS = [
  { flagUrl: 'https://flagcdn.com/w160/us.png', label: 'USA', value: 'usa' },
  { flagUrl: 'https://flagcdn.com/w160/gb.png', label: 'UK', value: 'uk' },
  { flagUrl: 'https://flagcdn.com/w160/ca.png', label: 'Canada', value: 'canada' },
  { flagUrl: 'https://flagcdn.com/w160/jm.png', label: 'In Jamaica', value: 'jamaica' },
];
```

**Replace with (Florida):**
```typescript
const LOCATIONS = [
  { flagUrl: 'https://flagcdn.com/w160/us.png', label: 'USA', value: 'usa' },
  { flagUrl: 'https://flagcdn.com/w160/gb.png', label: 'UK', value: 'uk' },
  { flagUrl: 'https://flagcdn.com/w160/ca.png', label: 'Canada', value: 'canada' },
  { flagUrl: 'https://flagcdn.com/w160/us.png', label: 'In Florida', value: 'florida' },
];
```

---

### 5.5 Chat Bot Responses (Location-Specific)

**Current (Jamaica):**
```typescript
// No Jamaica-specific responses found in ChatScreen.tsx
// Already uses generic Florida responses like:
"Florida has amazing beaches! Clearwater Beach..."
"Florida is the theme park capital..."
"Right now, sunset cruises and Everglades tours..."
```

**Note:** Chat component (ChatScreen.tsx) already references Florida, suggesting partial conversion or dual-location support.

---

## 6. DATA GENERATION PATTERNS

### 6.1 Auto-Generated Fields

**Referral Codes:**
```sql
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
```

**Booking Reference:**
```typescript
const prefix = 'LYH';  // LookYah
const timestamp = Date.now().toString(36).toUpperCase();
const random = Math.random().toString(36).substring(2, 6).toUpperCase();
return `${prefix}-${timestamp}-${random}`;
```

**QR Code:**
```typescript
const qrData = `LOOKYAH-${Date.now()}-${experience.id}`;
```

---

### 6.2 Triggers & Automation

**Updated_at Triggers:**
- users
- experiences
- bookings
- jahboi_chats

**Referral Code Trigger:**
- Auto-generates on user insert if empty

---

## 7. MIGRATION CHECKLIST

### 7.1 Database Schema Changes

- [ ] Rename `jahboi_chats` → `tourguide_chats` or `chat_history`
- [ ] Remove `price_jmd` and `total_price_jmd` fields
- [ ] Remove `parish` field from operators
- [ ] Update location references in seed data
- [ ] Change booking reference prefix from 'LYH' to 'TFL' (TourFlo)
- [ ] Update QR code prefix from 'LOOKYAH' to 'TOURFLO'
- [ ] Remove Jamaica parish constraints/validations

---

### 7.2 Brand String Replacements

**Global Find/Replace:**
- `LOOKYAH` → `TOURFLO`
- `LookYah` → `TourFlo`
- `lookyah` → `tourflo`
- `JAHBOI` → `TOURGUIDE` or `AI_GUIDE`
- `jahboi` → `tourguide`
- `Jamaica` → `Florida`
- `Jamaican` → `Florida`
- `J$` → `$` (remove JMD symbol)
- `JMD` → (remove entirely)
- `LYH-` → `TFL-` (booking reference prefix)

---

### 7.3 Location Data Updates

**Replace Locations:**
- Negril → Miami Beach / Key West
- Ocho Rios → Orlando
- Kingston → Miami
- Falmouth → Tampa
- Montego Bay → Fort Lauderdale

**Replace Parishes with Florida Regions:**
- Remove 14 Jamaica parishes
- Add Florida regions: South, Central, North, Panhandle, Keys

---

### 7.4 Asset Replacements

**Logo Files to Replace:**
- `/logos/lookyahjamaicablack.png`
- `/logos/jahboismall.png`
- `/logos/tourguide.png`
- `/logos/tourguidesmall.png`
- `/logos/tourguidewhite.png`
- Update `manifest.json` icons

---

### 7.5 Copy/Content Updates

**UI Strings:**
- "It's here. Just look" → TourFlo tagline
- "Book authentic Jamaica experiences" → "Book amazing Florida experiences"
- "Chat with JAHBOI" → "Chat with TourGuide AI"
- "Quick access to Jamaica experiences" → "Quick access to Florida experiences"
- All Jamaica-specific strings (see Section 5.3)

---

### 7.6 Color Scheme (Optional)

**Current (Jamaica):**
- Purple gradient: `from-[#390067] to-purple-700`
- Sky/sand gradient: `from-sky-200 via-amber-50 to-yellow-100`

**Consider (Florida):**
- Ocean blue: `from-blue-500 to-cyan-400`
- Sunset orange: `from-orange-400 to-pink-500`
- Beach pastels: `from-cyan-200 via-teal-50 to-orange-100`

---

## 8. CRITICAL DEPENDENCIES

### 8.1 Jamaica-Specific Business Logic

1. **Dual Currency System** - Requires complete removal
2. **Parish System** - Used in operator onboarding, no Florida equivalent
3. **TRN (Tax Registration Number)** - Jamaica-specific tax field
4. **JMD Price Calculations** - Throughout checkout flow

---

### 8.2 Database Indexes to Update

```sql
CREATE INDEX IF NOT EXISTS idx_experiences_category ON experiences(category);
CREATE INDEX IF NOT EXISTS idx_experiences_location ON experiences(location_lat, location_lng);
```

Keep these, they're location-agnostic.

---

## 9. SAMPLE FLORIDA DATA

### 9.1 Florida Experience Examples

```typescript
export const sampleExperiences = [
  {
    id: '1',
    title: 'Everglades Airboat Tour & Wildlife Adventure',
    description: 'Glide through sawgrass marshes and spot alligators in their natural habitat',
    image_url: 'https://images.pexels.com/photos/...', // Everglades
    video_url: null,
    price_usd: 7500,  // $75.00
    location_name: 'Miami',
    category: 'adventure',
    duration_minutes: 120,
    operator_id: '1',
  },
  {
    id: '2',
    title: 'Key West Sunset Cruise',
    description: 'Sail into the sunset with champagne and live music',
    image_url: 'https://images.pexels.com/photos/...', // Sunset sail
    video_url: null,
    price_usd: 8900,  // $89.00
    location_name: 'Key West',
    category: 'chill',
    duration_minutes: 180,
    operator_id: '2',
  },
  {
    id: '3',
    title: 'Miami Beach Food & Art Walk',
    description: 'Explore Art Deco architecture while tasting Cuban cuisine',
    image_url: 'https://images.pexels.com/photos/...', // Miami Beach
    video_url: null,
    price_usd: 6500,  // $65.00
    location_name: 'Miami Beach',
    category: 'foodie',
    duration_minutes: 210,
    operator_id: '3',
  },
];
```

---

## 10. SUMMARY

### Core Categories (DO NOT CHANGE):
- **chill** 😎
- **adventure** 🏄
- **party** 🎉
- **foodie** 🍽️

### Major Changes Required:
1. Remove dual currency (JMD/USD) → USD only
2. Replace all "Jamaica" → "Florida" strings
3. Replace "LOOKYAH" → "TOURFLO" brand
4. Replace "JAHBOI" → "TOURGUIDE AI"
5. Update location lists (parishes → Florida cities)
6. Remove TRN field
7. Update sample data with Florida experiences
8. Replace logo assets
9. Update manifest and PWA metadata

### Keep As-Is:
- Core 4-category system (chill/adventure/party/foodie)
- Database schema structure
- Booking flow logic
- RLS policies structure
- UI component architecture
- Swipe-based discovery feed

---

**End of Analysis**

Generated: 2025-11-18
Source: LOOKYAH Jamaica Platform
Target: TourFlo Florida Platform
