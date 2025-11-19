# TOURFLO FLORIDA MIGRATION GUIDE

Complete step-by-step guide to convert LookYah Jamaica → TourFlo Florida

---

## PART 1: GLOBAL FIND/REPLACE PATTERNS

Execute these find/replace operations across entire codebase.

### 1.1 Brand Name Replacements

| Find | Replace | Case Sensitive | Files |
|------|---------|----------------|-------|
| `LOOKYAH` | `TOURFLO` | Yes | All |
| `LookYah` | `TourFlo` | Yes | All |
| `Lookyah` | `TourFlo` | Yes | All |
| `lookyah` | `tourflo` | Yes | All |
| `JAHBOI` | `FLORBOT` | Yes | All |
| `Jahboi` | `FlorBot` | Yes | All |
| `jahboi` | `florbot` | Yes | All |

**After Replace:** 23+ occurrences of LOOKYAH → TOURFLO

---

### 1.2 Geographic Replacements

**Jamaica Locations → Florida Locations:**

| Find | Replace | Context |
|------|---------|---------|
| `Jamaica` | `Florida` | All references |
| `Jamaican` | `Florida` | All references |
| `Jamaica-based` | `Florida-based` | All references |
| `Negril` | `Key West` | Sample data |
| `Ocho Rios` | `Orlando` | Sample data |
| `Kingston` | `Miami` | Sample data |
| `Montego Bay` | `Fort Lauderdale` | Sample data |
| `Falmouth` | `Tampa` | Sample data |
| `Dunn's River Falls` | `Everglades National Park` | Sample data |
| `Rick's Cafe` | `Sunset Cruises` | Sample data |
| `Blue Mountains` | `Everglades` | Sample data |

**Administrative Divisions:**

| Find | Replace | Context |
|------|---------|---------|
| `parish` | `county` | Database field, UI labels |
| `Parish` | `County` | Titles, headers |
| `parishes` | `counties` | Plural references |

---

### 1.3 Currency Replacements

**Remove Dual Currency System:**

| Find | Replace | Action |
|------|---------|--------|
| `currency_pref: 'USD' \| 'JMD'` | `currency_pref: 'USD'` | Remove JMD option |
| `price_jmd` | DELETE | Remove field entirely |
| `total_price_jmd` | DELETE | Remove field entirely |
| `JMD` | DELETE | Remove all references |
| `J$` | `$` | Currency symbol |
| `currency_pref === 'JMD' ?` | DELETE | Remove ternary checks |

**Example Before:**
```typescript
const price = currency_pref === 'JMD'
  ? `J$${(experience.price_jmd / 100).toFixed(0)}`
  : `$${(experience.price_usd / 100).toFixed(0)}`;
```

**Example After:**
```typescript
const price = `$${(experience.price_usd / 100).toFixed(0)}`;
```

---

### 1.4 Database Field Replacements

**Operators Table:**

| Find | Replace | Notes |
|------|---------|-------|
| `parish text` | `county text` | Column name |
| `trn text` | `ein text` | Tax ID field |
| `TRN` | `EIN` | UI labels |
| `Tax Registration Number` | `Employer Identification Number` | Help text |

---

### 1.5 LocalStorage Keys

| Find | Replace |
|------|---------|
| `lookyah_visited` | `tourflo_visited` |
| `lookyah_onboarded` | `tourflo_onboarded` |
| `lookyah_guest_mode` | `tourflo_guest_mode` |

---

### 1.6 Service Worker & PWA

**File:** `public/sw.js`
```javascript
// Before
const CACHE_NAME = 'lookyah-v2';
const DYNAMIC_CACHE = 'lookyah-dynamic-v2';

// After
const CACHE_NAME = 'tourflo-v2';
const DYNAMIC_CACHE = 'tourflo-dynamic-v2';
```

**File:** `public/manifest.json`
```json
{
  "name": "TourFlo Florida",
  "short_name": "TourFlo",
  "description": "Book Amazing Florida Experiences"
}
```

---

## PART 2: COMPONENT-BY-COMPONENT UPDATES

### 2.1 App.tsx

**Console Logs:**
```typescript
// Before
console.log('%c🌴 LOOKYAH JAMAICA 😎', 'font-size: 24px; font-weight: bold; color: #4A1A4A;');

// After
console.log('%c🌴 TOURFLO FLORIDA 🌊', 'font-size: 24px; font-weight: bold; color: #0077BE;');
```

**Dev Mode Labels:**
```typescript
// Before
console.log('🔧 DEV MODE ACTIVE → Showing:', devScreen);

// After
console.log('🔧 DEV MODE ACTIVE → Showing:', devScreen);
// (No change needed - generic)
```

---

### 2.2 OnboardingFlow.tsx

**Location Options (Lines 9-14):**
```typescript
// Before
const LOCATIONS = [
  { flagUrl: 'https://flagcdn.com/w160/us.png', label: 'USA', value: 'usa' },
  { flagUrl: 'https://flagcdn.com/w160/gb.png', label: 'UK', value: 'uk' },
  { flagUrl: 'https://flagcdn.com/w160/ca.png', label: 'Canada', value: 'canada' },
  { flagUrl: 'https://flagcdn.com/w160/jm.png', label: 'In Jamaica', value: 'jamaica' },
];

// After
const LOCATIONS = [
  { flagUrl: 'https://flagcdn.com/w160/us.png', label: 'USA', value: 'usa' },
  { flagUrl: 'https://flagcdn.com/w160/gb.png', label: 'UK', value: 'uk' },
  { flagUrl: 'https://flagcdn.com/w160/ca.png', label: 'Canada', value: 'canada' },
  { flagUrl: 'https://flagcdn.com/w160/us.png', label: 'In Florida', value: 'florida' },
];
```

**Welcome Copy (Line 288):**
```typescript
// Before
"Perfect! Let me show you Jamaica..."

// After
"Perfect! Let me show you Florida..."
```

**Logo Reference (Line 81):**
```typescript
// Before
alt="Lookyah Jamaica"

// After
alt="TourFlo Florida"
```

**VIBES - Keep As Is:**
```typescript
// NO CHANGES NEEDED - Universal categories
const VIBES = [
  { emoji: '😎', label: 'Chill', value: 'chill' },
  { emoji: '🔥', label: 'Adventure', value: 'adventure' },
  { emoji: '🎉', label: 'Party', value: 'party' },
  { emoji: '🍴', label: 'Foodie', value: 'foodie' },
];
```

---

### 2.3 DiscoveryFeed.tsx

**Location Filters (Line 415):**
```typescript
// Before
{['All', 'Negril', 'Ocho Rios', 'Kingston', 'Falmouth'].map(location => (

// After
{['All', 'Miami', 'Key West', 'Orlando', 'Tampa', 'Fort Lauderdale'].map(location => (
```

**Loading Message (Line 301):**
```typescript
// Before
<p className="text-sm text-gray-600">Finding the best Jamaica has to offer</p>

// After
<p className="text-sm text-gray-600">Finding the best Florida has to offer</p>
```

**Share Text (Line 228):**
```typescript
// Before
text: `Check out ${experience.title} on LOOKYAH Jamaica!`,

// After
text: `Check out ${experience.title} on TourFlo Florida!`,
```

**Currency Display (Line 330):**
```typescript
// Before
const price = currency_pref === 'JMD'
  ? `J$${(currentExperience.price_jmd / 100).toFixed(0)}`
  : `$${(currentExperience.price_usd / 100).toFixed(0)}`;

// After
const price = `$${(currentExperience.price_usd / 100).toFixed(0)}`;
```

---

### 2.4 ExperienceDetailPage.tsx

**Category Emoji Mapping (Lines 219-224):**
```typescript
// KEEP AS IS - Universal categories
const categoryEmoji = {
  chill: '😎',
  adventure: '🏄',
  party: '🎉',
  foodie: '🍽️',
}[experience.category] || '😎';
```

**Guide Description (Line 567):**
```typescript
// Before
"Born in Negril • 8 years guiding"

// After
"Born in Miami • 8 years guiding"
```

**Guide Quote (Line 586):**
```typescript
// Before
"I love showing visitors the real Jamaica! Can't wait to share this sunset with you!"

// After
"I love showing visitors the real Florida! Can't wait to share this adventure with you!"
```

**Review Quote (Line 667):**
```typescript
// Before
text: 'Best experience in Jamaica! The cliff diving was thrilling and the atmosphere was amazing!',

// After
text: 'Best experience in Florida! The tour was incredible and the guides were amazing!',
```

**Price Display (Line 211):**
```typescript
// Before
const price = currency_pref === 'JMD'
  ? `J$${(experience.price_jmd / 100).toFixed(0)}`
  : `$${(experience.price_usd / 100).toFixed(0)}`;

// After
const price = `$${(experience.price_usd / 100).toFixed(0)}`;
```

---

### 2.5 ChatScreen.tsx

**ALREADY FLORIDA-FOCUSED - Minimal Changes:**

**Greeting (Line 36):**
```typescript
// Before
text: "Hello! 👋 I'm TourGuide AI, your personal Florida tour assistant..."

// After (unchanged - already correct)
text: "Hello! 👋 I'm FlorBot AI, your personal Florida tour assistant. I can help you find the best experiences, answer questions, or book activities. What are you interested in?"
```

**Bot Name Display (Line 134):**
```typescript
// Before
TourGuide AI

// After
FlorBot AI
```

**Bot Description (Line 138):**
```typescript
// Before
Your AI Florida Guide

// After (unchanged - already correct)
Your AI Florida Guide
```

**Responses - Already Florida-specific:**
```typescript
// Lines 52-72 - NO CHANGES NEEDED
// Already references: Florida beaches, Clearwater, Sanibel, Everglades, theme parks, etc.
```

---

### 2.6 AuthScreen.tsx

**Logo Alt Text (Line 94):**
```typescript
// Before
alt="Lookyah Jamaica"

// After
alt="TourFlo Florida"
```

**Tagline (Line 179):**
```typescript
// Before
"Start exploring Jamaica's best experiences"

// After
"Start exploring Florida's best experiences"
```

---

### 2.7 SavedScreen.tsx

**Share Text (Line 68-69):**
```typescript
// Before
title: 'My Jamaica Wishlist',
text: 'Check out my LOOKYAH wishlist!',

// After
title: 'My Florida Wishlist',
text: 'Check out my TourFlo wishlist!',
```

**Empty State Message (Line 164):**
```typescript
// Before
"to create your Jamaica wishlist!"

// After
"to create your Florida wishlist!"
```

**Price Display (Line 172):**
```typescript
// Before
const price = currency_pref === 'JMD'
  ? `J$${...}`
  : `$${...}`;

// After
const price = `$${(experience.price_usd / 100).toFixed(0)}`;
```

---

### 2.8 TripsScreen.tsx

**Price Display (Line 155):**
```typescript
// Before
const price = currency_pref === 'JMD'
  ? `J$${...}`
  : `$${...}`;

// After
const price = `$${(booking.total_price_usd / 100).toFixed(2)}`;
```

---

### 2.9 ProfileScreen.tsx

**About Link (Line 340):**
```typescript
// Before
"About LOOKYAH"

// After
"About TourFlo"
```

---

### 2.10 BookingSheet.tsx

**QR Code Format (Line 52):**
```typescript
// Before
const qrData = `LOOKYAH-${Date.now()}-${experience.id}`;

// After
const qrData = `TOURFLO-${Date.now()}-${experience.id}`;
```

**Confirmation Message (Line 309):**
```typescript
// Before
<p className="text-gray-600">JAHBOI told them you're coming!</p>

// After
<p className="text-gray-600">FlorBot confirmed your booking!</p>
```

**Price Calculation (Lines 33-37):**
```typescript
// Before
const totalJMD = experience.price_jmd * groupSize;
const totalUSD = experience.price_usd * groupSize;
const displayPrice = currency_pref === 'JMD'
  ? `J$${(totalJMD / 100).toFixed(2)}`
  : `$${(totalUSD / 100).toFixed(2)}`;

// After
const totalUSD = experience.price_usd * groupSize;
const displayPrice = `$${(totalUSD / 100).toFixed(2)}`;
```

---

### 2.11 BookingConfirmationScreen.tsx

**Share Text (Line 57):**
```typescript
// Before
text: `Join me for an amazing experience in Jamaica!`,

// After
text: `Join me for an amazing experience in Florida!`,
```

---

### 2.12 PaymentMethodScreen.tsx

**Payment Label (Line 196):**
```typescript
// Before
<p className="text-xs text-gray-600">Fast & secure Jamaican payment</p>

// After
<p className="text-xs text-gray-600">Fast & secure payment</p>
```

---

### 2.13 CardPaymentScreen.tsx

**Card Label (Line 122):**
```typescript
// Before
"LOOKYAH CARD"

// After
"TOURFLO CARD"
```

---

### 2.14 PWABanner.tsx

**Banner Text (Lines 52-53):**
```typescript
// Before
<p className="font-semibold text-gray-900">Add LOOKYAH to home screen</p>
<p className="text-sm text-gray-700">Quick access to Jamaica experiences</p>

// After
<p className="font-semibold text-gray-900">Add TourFlo to home screen</p>
<p className="text-sm text-gray-700">Quick access to Florida experiences</p>
```

---

### 2.15 Operator Components

**OperatorOnboarding.tsx:**

**Welcome Header (Line 115):**
```typescript
// Before
<h1 className="text-5xl font-bold mb-4 text-center text-gray-900">Welcome to LOOKYAH</h1>

// After
<h1 className="text-5xl font-bold mb-4 text-center text-gray-900">Welcome to TourFlo</h1>
```

**Terms Agreement (Line 538):**
```typescript
// Before
"I agree to the Terms of Service and Privacy Policy. I understand that LOOKYAH will review my application."

// After
"I agree to the Terms of Service and Privacy Policy. I understand that TourFlo will review my application."
```

**Parish Field → County Field (Line 126):**
```typescript
// Before
const parishes = ['Kingston', 'St. Andrew', 'St. Catherine', ...];

// After
const counties = [
  'Miami-Dade', 'Broward', 'Palm Beach', 'Monroe', 'Collier',
  'Lee', 'Orange', 'Osceola', 'Pinellas', 'Hillsborough',
  'Manatee', 'Sarasota', 'Polk', 'Brevard', 'Volusia',
  'St. Johns', 'Duval', 'Escambia', 'Okaloosa', 'Bay'
];
```

**Label Changes:**
```typescript
// Before
<label>Parish</label>

// After
<label>County</label>
```

**TRN → EIN (Tax ID):**
```typescript
// Before
<label>TRN (Tax Registration Number)</label>
<input name="trn" .../>

// After
<label>EIN (Employer Identification Number)</label>
<input name="ein" .../>
```

**ExperienceCreation.tsx:**

**Categories - EXPAND to 9 (Line 116):**
```typescript
// Before
const categories = ['Tour', 'Adventure', 'Food & Drink', 'Culture', 'Nature', 'Water Sports', 'Nightlife', 'Shopping'];

// After
const categories = [
  'Fishing Charter',
  'Boat Tour',
  'Water Sports',
  'Airboat Tour',
  'Eco-Tour',
  'Food Tour',
  'Cultural Tour',
  'Adventure Tour',
  'Bus Tour'
];
```

**BookingManagement.tsx:**

**Location Examples (Lines 45, 58):**
```typescript
// Before
location: 'Dunn\'s River Falls, Ocho Rios',
location: 'Blue Mountains, Kingston',

// After
location: 'Everglades National Park, Miami',
location: 'Key West Historic Seaport',
```

---

## PART 3: DATABASE SCHEMA CHANGES

### 3.1 Migration SQL Script

**File:** `supabase/migrations/YYYYMMDD_convert_to_florida.sql`

```sql
/*
  # Convert LookYah Jamaica → TourFlo Florida

  1. Schema Updates
    - Remove JMD price fields
    - Change parish → county
    - Change TRN → EIN
    - Rename jahboi_chats → chat_history

  2. Data Migration
    - Update location references
    - Remove JMD prices
    - Clear sample Jamaica data
*/

-- Rename jahboi_chats table
ALTER TABLE jahboi_chats RENAME TO chat_history;

-- Update operators table
ALTER TABLE operators
  RENAME COLUMN parish TO county;

ALTER TABLE operators
  RENAME COLUMN trn TO ein;

-- Update column comments
COMMENT ON COLUMN operators.county IS 'Florida county where operator is based';
COMMENT ON COLUMN operators.ein IS 'Employer Identification Number (EIN)';

-- Remove JMD price columns from experiences
ALTER TABLE experiences
  DROP COLUMN IF EXISTS price_jmd;

-- Remove JMD price columns from bookings
ALTER TABLE bookings
  DROP COLUMN IF EXISTS total_price_jmd;

-- Update users table default location
ALTER TABLE users
  ALTER COLUMN location SET DEFAULT 'florida';

-- Clear sample data (optional - for fresh start)
DELETE FROM experiences WHERE operator_id IN (
  SELECT id FROM operators WHERE name LIKE '%Rick%' OR name LIKE '%Dunn%'
);

-- Update indexes
DROP INDEX IF EXISTS idx_chats_user;
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON chat_history(user_id);

-- Update RLS policy names
DROP POLICY IF EXISTS "Users can view own chats" ON jahboi_chats;
CREATE POLICY "Users can view own chat history"
  ON chat_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own chats" ON jahboi_chats;
CREATE POLICY "Users can create own chat history"
  ON chat_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own chats" ON jahboi_chats;
CREATE POLICY "Users can update own chat history"
  ON chat_history FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update trigger name
DROP TRIGGER IF EXISTS jahboi_chats_updated_at ON jahboi_chats;
CREATE TRIGGER chat_history_updated_at
  BEFORE UPDATE ON chat_history
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

### 3.2 Update Store Schema

**File:** `src/lib/store.ts`

```typescript
// Before
interface AppState {
  user_id: string | null;
  isOnboarded: boolean;
  isFirstVisit: boolean;
  hasCompletedOnboarding: boolean;
  currency_pref: 'USD' | 'JMD';  // ← REMOVE JMD
  userPreferences: Record<string, any>;
  setUser: (id: string | null) => void;
  completeOnboarding: () => void;
  setCurrency: (currency: 'USD' | 'JMD') => void;  // ← REMOVE JMD
  setUserPreference: (key: string, value: any) => void;
  markVisited: () => void;
}

// After
interface AppState {
  user_id: string | null;
  isOnboarded: boolean;
  isFirstVisit: boolean;
  hasCompletedOnboarding: boolean;
  // currency_pref removed - always USD
  userPreferences: Record<string, any>;
  setUser: (id: string | null) => void;
  completeOnboarding: () => void;
  // setCurrency removed - always USD
  setUserPreference: (key: string, value: any) => void;
  markVisited: () => void;
}

// Update localStorage keys
export const useAppStore = create<AppState>((set) => ({
  user_id: null,
  isOnboarded: false,
  isFirstVisit: localStorage.getItem('tourflo_visited') !== 'true',  // ← Changed
  hasCompletedOnboarding: localStorage.getItem('tourflo_onboarded') === 'true',  // ← Changed
  userPreferences: {},
  setUser: (id) => set({ user_id: id }),
  completeOnboarding: () => {
    localStorage.setItem('tourflo_onboarded', 'true');  // ← Changed
    set({ isOnboarded: true, hasCompletedOnboarding: true });
  },
  setUserPreference: (key, value) =>
    set((state) => ({
      userPreferences: { ...state.userPreferences, [key]: value },
    })),
  markVisited: () => {
    localStorage.setItem('tourflo_visited', 'true');  // ← Changed
    set({ isFirstVisit: false });
  },
}));
```

---

### 3.3 Update Sample Data

**File:** `src/lib/sampleData.ts`

**REPLACE ENTIRE FILE with:**

```typescript
export const sampleExperiences = [
  {
    id: '1',
    title: 'Everglades Airboat Adventure',
    description: 'Blast through sawgrass marshes and see wild alligators up close!',
    image_url: 'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=800',
    video_url: null,
    price_usd: 4500,  // $45.00
    location_name: 'Miami',
    category: 'adventure',
    duration_minutes: 60,
    operator_id: '1',
  },
  {
    id: '2',
    title: 'Key West Sunset Cruise',
    description: 'Sail into the sunset with champagne and live music',
    image_url: 'https://images.pexels.com/photos/1118874/pexels-photo-1118874.jpeg?auto=compress&cs=tinysrgb&w=800',
    video_url: null,
    price_usd: 8500,  // $85.00
    location_name: 'Key West',
    category: 'chill',
    duration_minutes: 120,
    operator_id: '2',
  },
  {
    id: '3',
    title: 'Miami Beach Jet Ski Tour',
    description: 'Ride along Miami\'s stunning coastline on your own jet ski',
    image_url: 'https://images.pexels.com/photos/163933/dubai-jet-ski-marine-sports-sea-163933.jpeg?auto=compress&cs=tinysrgb&w=800',
    video_url: null,
    price_usd: 18000,  // $180.00
    location_name: 'Miami Beach',
    category: 'adventure',
    duration_minutes: 90,
    operator_id: '3',
  },
  {
    id: '4',
    title: 'Little Havana Food Tour',
    description: 'Taste authentic Cuban cuisine in Miami\'s most vibrant neighborhood',
    image_url: 'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=800',
    video_url: null,
    price_usd: 9500,  // $95.00
    location_name: 'Miami',
    category: 'foodie',
    duration_minutes: 180,
    operator_id: '4',
  },
];
```

---

## PART 4: ASSET REPLACEMENTS

### 4.1 Logo Files to Replace

**Directory:** `public/logos/`

**Files to Replace:**
1. `lookyahjamaicablack.png` → `tourflo-black.png` ✅ (Already exists)
2. `jahboismall.png` → `florbot-small.png` (New file needed)
3. `tourguide.png` → `florbot.png` (Rename/update)
4. `tourguidesmall.png` → `florbot-small.png` (Rename/update)
5. `tourguidewhite.png` → `florbot-white.png` (Rename/update)
6. `tourflo-white.png` ✅ (Keep - already exists)

**Logo Asset Mapping (Update branding.ts):**

```typescript
// Before
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

// After
export const TOURFLO_LOGOS = {
  florbot: '/logos/florbot.png',
  florbotSmall: '/logos/florbot-small.png',
  florbotWhite: '/logos/florbot-white.png',
  tourfloBlack: '/logos/tourflo-black.png',
  tourfloWhite: '/logos/tourflo-white.png',
  splash: '/logos/florbot.png',
  navHeader: '/logos/tourflo-black.png',
  chatAvatarWhite: '/logos/florbot-white.png',
  chatAvatar: '/logos/florbot-small.png',
};

export const LOOKYAH_LOGOS = TOURFLO_LOGOS; // Keep alias for compatibility
```

---

### 4.2 Favicon & App Icons

**Files to Update:**
- `public/favicon.ico`
- `public/logo192.png`
- `public/logo512.png`
- `public/apple-touch-icon.png`

**Colors:** Update from purple/Jamaica theme to ocean blue/Florida theme

---

### 4.3 Manifest Updates

**File:** `public/manifest.json`

```json
{
  "name": "TourFlo Florida",
  "short_name": "TourFlo",
  "description": "Book Amazing Florida Experiences",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0077BE",
  "background_color": "#FFFFFF",
  "icons": [
    {
      "src": "/logo192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/logo512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "shortcuts": [
    {
      "name": "Chat with FlorBot",
      "url": "/chat",
      "description": "Get help from FlorBot AI"
    },
    {
      "name": "My Trips",
      "url": "/trips",
      "description": "View your bookings"
    }
  ]
}
```

---

### 4.4 HTML Meta Tags

**File:** `index.html`

```html
<!-- Before -->
<title>LOOKYAH Jamaica - Book Authentic Experiences</title>
<meta name="description" content="It's here. Just look - Book authentic Jamaica experiences with JAHBOI AI guide" />
<meta name="apple-mobile-web-app-title" content="LOOKYAH" />

<!-- After -->
<title>TourFlo Florida - Book Amazing Experiences</title>
<meta name="description" content="Discover and book the best tours and activities in Florida. From fishing charters to eco-tours, find your perfect adventure with FlorBot AI." />
<meta name="apple-mobile-web-app-title" content="TourFlo" />
```

---

## PART 5: COLOR SCHEME UPDATES (OPTIONAL)

### 5.1 Current Jamaica Theme

**Primary Colors:**
- Purple: `#390067` (Jamaica Purple)
- Purple Accent: `#4D0085`
- Gold: `#DAA520`
- Gradient: Sky to amber/sand

---

### 5.2 Proposed Florida Theme

**Primary Colors:**
- Ocean Blue: `#0077BE`
- Turquoise: `#00CED1`
- Sunset Orange: `#FF8C00`
- Sky Blue: `#87CEEB`

**Gradient Backgrounds:**
```css
/* Before - Jamaica */
.bg-gradient-skysand {
  background: linear-gradient(to bottom, #87CEEB, #FFF8DC, #F5DEB3);
}

/* After - Florida */
.bg-gradient-florida {
  background: linear-gradient(to bottom, #0077BE, #00CED1, #87CEEB);
}

.bg-gradient-florida-sunset {
  background: linear-gradient(to bottom, #FF8C00, #FFD700, #87CEEB);
}
```

**Update Primary Purple:**

Find/Replace in CSS:
- `#390067` → `#0077BE` (buttons, accents)
- `#4D0085` → `#0099E6` (hover states)
- `purple-700` → `blue-600`
- `purple-600` → `blue-500`

---

### 5.3 Tailwind Config Updates

**File:** `tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'florida-ocean': '#0077BE',
        'florida-turquoise': '#00CED1',
        'florida-sand': '#FFF8DC',
        'florida-sunset': '#FF8C00',
        'florida-sky': '#87CEEB',
      },
      backgroundImage: {
        'gradient-florida': 'linear-gradient(to bottom, #0077BE, #00CED1, #87CEEB)',
        'gradient-sunset': 'linear-gradient(to right, #FF8C00, #FFD700)',
      }
    }
  }
}
```

---

## PART 6: BOOKING REFERENCE UPDATES

### 6.1 Booking Reference Format

**Current Format:** `LYH-{timestamp}-{random}`

**New Format:** `TFL-{timestamp}-{random}`

**File:** `src/components/MainLayout.tsx` (Line 57-62)

```typescript
// Before
const generateBookingReference = () => {
  const prefix = 'LYH';  // LookYah
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

// After
const generateBookingReference = () => {
  const prefix = 'TFL';  // TourFlo
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};
```

---

## PART 7: TESTING CHECKLIST

### 7.1 Visual Verification

- [ ] Logo displays correctly on all screens
- [ ] FlorBot avatar shows in chat
- [ ] Colors match Florida theme (if updated)
- [ ] No "Jamaica" references in UI
- [ ] No "LOOKYAH" or "JAHBOI" in UI
- [ ] County dropdown (not parish) in operator onboarding
- [ ] EIN field (not TRN) in operator registration

---

### 7.2 Functional Verification

- [ ] Onboarding completes and saves "Florida" location
- [ ] Sample experiences load (Florida locations)
- [ ] Booking flow works (USD only, no JMD)
- [ ] Search filters work (Florida cities)
- [ ] Currency displays as $ (not J$)
- [ ] Booking reference starts with TFL-
- [ ] QR codes contain TOURFLO-
- [ ] Chat bot responds with Florida info
- [ ] LocalStorage uses tourflo_ keys
- [ ] PWA install works with TourFlo name

---

### 7.3 Database Verification

- [ ] jahboi_chats renamed to chat_history
- [ ] operators.parish renamed to county
- [ ] operators.trn renamed to ein
- [ ] price_jmd columns removed
- [ ] total_price_jmd columns removed
- [ ] Sample Jamaica data cleared
- [ ] RLS policies updated for new table names

---

## PART 8: DEPLOYMENT STEPS

### 8.1 Pre-Deployment

1. **Backup current database:**
   ```bash
   pg_dump > lookyah_backup_$(date +%Y%m%d).sql
   ```

2. **Test migrations locally:**
   ```bash
   supabase db reset
   supabase db push
   ```

3. **Run build to catch errors:**
   ```bash
   npm run build
   ```

---

### 8.2 Deployment Sequence

1. **Deploy database migrations** (downtime required)
2. **Deploy new frontend** (with updated code)
3. **Clear CDN cache** (if using Cloudflare/similar)
4. **Clear localStorage** for existing users (optional banner)
5. **Update documentation**

---

### 8.3 Post-Deployment

1. **Monitor error logs** for 24-48 hours
2. **Test all user flows** on production
3. **Verify analytics tracking** (update GA/Mixpanel events)
4. **Update SEO metadata** (Google Search Console)
5. **Notify operators** of brand change (email campaign)

---

## PART 9: OPERATOR COMMUNICATION

### 9.1 Email Template

**Subject:** Important Update: We're Now TourFlo!

**Body:**
```
Hi [Operator Name],

Exciting news! LookYah Jamaica is becoming TourFlo, expanding to serve the entire Florida tourism market.

What's Changing:
✓ New brand name: TourFlo
✓ Florida-focused (no longer Jamaica-only)
✓ Simplified currency (USD only)
✓ Enhanced operator dashboard

What's NOT Changing:
✓ Your commission rate
✓ Your existing bookings
✓ Your operator account
✓ Your payout schedule

Action Required:
1. Update your business info with Florida county (instead of parish)
2. Update your tax ID from TRN to EIN
3. Review your experiences and pricing (USD only)

Login at: app.tourflo.com

Questions? Contact support@tourflo.com

Best,
The TourFlo Team
```

---

## PART 10: ROLLBACK PLAN

### 10.1 If Migration Fails

**Database Rollback:**
```sql
-- Restore from backup
psql < lookyah_backup_YYYYMMDD.sql

-- Or revert specific changes
ALTER TABLE chat_history RENAME TO jahboi_chats;
ALTER TABLE operators RENAME COLUMN county TO parish;
ALTER TABLE operators RENAME COLUMN ein TO trn;
```

**Frontend Rollback:**
- Revert git commit
- Redeploy previous version
- Clear CDN cache

---

## SUMMARY CHECKLIST

### Critical Path Items:

- [ ] **Global Find/Replace** (25+ patterns)
- [ ] **Database Migration** (5 schema changes)
- [ ] **Component Updates** (15 components)
- [ ] **Sample Data Replacement** (4 Florida experiences)
- [ ] **Asset Replacement** (6 logo files)
- [ ] **Manifest Updates** (1 file)
- [ ] **HTML Meta Tags** (1 file)
- [ ] **Testing** (20+ verification points)
- [ ] **Deployment** (8-step sequence)
- [ ] **Communication** (operator email campaign)

### Estimated Timeline:

- Development: 8-12 hours
- Testing: 4-6 hours
- Migration: 2-4 hours (includes downtime)
- **Total: 14-22 hours**

---

**END OF MIGRATION GUIDE**

Generated: 2025-11-18
Platform: TourFlo Florida
Source: LookYah Jamaica
