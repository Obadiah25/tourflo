# TourFlo Florida Component Changes - Implementation Guide

This document provides exact code changes for converting 6 React components from LookYah Jamaica to TourFlo Florida.

## Files Generated/To Update:

1. ✅ **DiscoveryFeed_FLORIDA.tsx** - Complete file generated (reference implementation)
2. **ExperienceDetailPage.tsx** - Changes needed below
3. **OnboardingFlow.tsx** - Changes needed below
4. **ExperienceCreation.tsx** - Changes needed below
5. **OperatorDashboard.tsx** - Changes needed below
6. **FlorBot.tsx** (rename from ChatScreen.tsx) - Changes needed below

---

## 2. ExperienceDetailPage.tsx Changes

### Remove JMD Currency Logic (Lines 15-16, 211-217)

**REMOVE:**
```typescript
price_jmd: number;
price_usd: number;
```

**REPLACE WITH:**
```typescript
price_usd: number; // USD only
```

**REMOVE:**
```typescript
const price = currency_pref === 'JMD'
  ? `J$${(experience.price_jmd / 100).toFixed(0)}`
  : `$${(experience.price_usd / 100).toFixed(0)}`;

const totalPrice = currency_pref === 'JMD'
  ? (experience.price_jmd / 100) * peopleCount
  : (experience.price_usd / 100) * peopleCount;
```

**REPLACE WITH:**
```typescript
const price = `$${(experience.price_usd / 100).toFixed(0)} USD`;
const totalPrice = (experience.price_usd / 100) * peopleCount;
```

### Update Florida Category Icons & Colors (Lines 219-224)

**REPLACE:**
```typescript
const categoryEmoji = {
  chill: '😎',
  adventure: '🏄',
  party: '🎉',
  foodie: '🍽️',
}[experience.category] || '😎';
```

**WITH:**
```typescript
// Florida operator category icons from TOURFLO_FLORIDA_CATEGORIES.md
const categoryIcon = {
  fishing_charter: '🎣',
  boat_tour: '⛵',
  water_sports: '🏄',
  airboat_tour: '🌪️',
  eco_tour: '🌿',
  food_tour: '🍴',
  cultural_tour: '🏛️',
  adventure_tour: '⛰️',
  bus_tour: '🚌',
}[experience.category] || '🌴';
```

### Update Location Display from "Parish" to "County" (Line 437)

**CHANGE:**
```typescript
<span className="flex items-center gap-1">
  <MapPin className="w-4 h-4" />
  {experience.location_name}
</span>
```

**TO:**
```typescript
<span className="flex items-center gap-1">
  <MapPin className="w-4 h-4" />
  {experience.location_name}, FL
</span>
```

### Update Guide References (Lines 565-567, 586)

**CHANGE:**
```typescript
<p className="text-gray-700 mb-4">
  Born in Negril • 8 years guiding
</p>
```

**TO:**
```typescript
<p className="text-gray-700 mb-4">
  Born in {experience.location_name || 'Florida'} • 8 years guiding
</p>
```

**CHANGE:**
```typescript
<p className="text-gray-800 italic text-sm mb-4">
  "I love showing visitors the real Jamaica! Can't wait to share this sunset with you!"
</p>
```

**TO:**
```typescript
<p className="text-gray-800 italic text-sm mb-4">
  "I love showing visitors the real Florida! Can't wait to share this adventure with you!"
</p>
```

### Update Review Examples (Line 667)

**CHANGE:**
```typescript
text: 'Best experience in Jamaica! The cliff diving was thrilling and the atmosphere was amazing!',
```

**TO:**
```typescript
text: 'Best experience in Florida! The tour was incredible and the guides were amazing!',
```

---

## 3. OnboardingFlow.tsx Changes

### Update Location Options (Lines 9-14)

**CHANGE:**
```typescript
const LOCATIONS = [
  { flagUrl: 'https://flagcdn.com/w160/us.png', label: 'USA', value: 'usa' },
  { flagUrl: 'https://flagcdn.com/w160/gb.png', label: 'UK', value: 'uk' },
  { flagUrl: 'https://flagcdn.com/w160/ca.png', label: 'Canada', value: 'canada' },
  { flagUrl: 'https://flagcdn.com/w160/us.png', label: 'In Florida', value: 'florida' },
];
```

**TO:**
```typescript
const LOCATIONS = [
  { flagUrl: 'https://flagcdn.com/w160/us.png', label: 'USA', value: 'usa' },
  { flagUrl: 'https://flagcdn.com/w160/gb.png', label: 'UK', value: 'uk' },
  { flagUrl: 'https://flagcdn.com/w160/ca.png', label: 'Canada', value: 'canada' },
  { flagUrl: 'https://flagcdn.com/w160/us.png', label: 'In Florida', value: 'florida' }, // Already correct!
];
```

### Add 8 Vibe Tags (Lines 23-28)

**REPLACE:**
```typescript
const VIBES = [
  { emoji: '😎', label: 'Chill', value: 'chill' },
  { emoji: '🔥', label: 'Adventure', value: 'adventure' },
  { emoji: '🎉', label: 'Party', value: 'party' },
  { emoji: '🍴', label: 'Foodie', value: 'foodie' },
];
```

**WITH:**
```typescript
// Keep 4 core vibes for tourist onboarding
const VIBES = [
  { emoji: '😎', label: 'Chill', value: 'chill' },
  { emoji: '🔥', label: 'Adventure', value: 'adventure' },
  { emoji: '🎉', label: 'Party', value: 'party' },
  { emoji: '🍴', label: 'Foodie', value: 'foodie' },
];

// 8 vibe tags for filtering (used later in DiscoveryFeed)
const VIBE_TAGS = [
  'Family Friendly',
  'Romantic',
  'Scenic',
  'Group Friendly',
  'Local Experience',
  'Photography-Friendly',
  'Educational',
  'Active/Fitness'
];
```

### Update Welcome Copy (Line 288)

**CHANGE:**
```typescript
<p className="text-xl md:text-2xl font-semibold"
   style={{
     fontFamily: 'Poppins',
     fontWeight: 600,
     color: 'var(--accent-purple)'
   }}>
  Perfect! Let me show you Jamaica...
</p>
```

**TO:**
```typescript
<p className="text-xl md:text-2xl font-semibold"
   style={{
     fontFamily: 'Poppins',
     fontWeight: 600,
     color: 'var(--florida-ocean)'
   }}>
  Perfect! Let me show you Florida...
</p>
```

### Update Logo Alt Text (Line 81)

**CHANGE:**
```typescript
alt="Lookyah Jamaica"
```

**TO:**
```typescript
alt="TourFlo Florida"
```

### Update Gradient Background (Line 75)

**CHANGE:**
```typescript
<div className="fixed inset-0 bg-gradient-to-br from-florida-ocean via-florida-sand to-florida-sunset flex flex-col overflow-hidden">
```

This is already correct! Just ensure `tailwind.config.js` has these colors defined:

```javascript
colors: {
  'florida-ocean': '#0077BE',
  'florida-turquoise': '#00CED1',
  'florida-sand': '#FFF8DC',
  'florida-sunset': '#FF8C00',
  'florida-sky': '#87CEEB',
}
```

---

## 4. ExperienceCreation.tsx Changes (Operator-Facing)

### Update Categories to 9 Florida Categories (Line 116)

**REPLACE:**
```typescript
const categories = ['Tour', 'Adventure', 'Food & Drink', 'Culture', 'Nature', 'Water Sports', 'Nightlife', 'Shopping'];
```

**WITH:**
```typescript
// 9 Florida operator categories from TOURFLO_FLORIDA_CATEGORIES.md
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

### Update Vibe Tags to 8 Florida Tags (Line 117)

**REPLACE:**
```typescript
const vibes = ['Family Friendly', 'Romantic', 'Adventure', 'Relaxing', 'Educational', 'Party', 'Luxury', 'Budget'];
```

**WITH:**
```typescript
// 8 vibe tags from TOURFLO_FLORIDA_CATEGORIES.md
const vibes = [
  'Family Friendly',
  'Romantic',
  'Scenic',
  'Group Friendly',
  'Local Experience',
  'Photography-Friendly',
  'Educational',
  'Active/Fitness'
];
```

### Add Location Picker for Florida Counties

**ADD NEW COMPONENT** after `BasicsStep`:

```typescript
function LocationStep({ formData, setFormData, onNext }: any) {
  const floridaCounties = [
    'Miami-Dade', 'Broward', 'Palm Beach', 'Monroe', 'Collier',
    'Lee', 'Orange', 'Osceola', 'Pinellas', 'Hillsborough',
    'Manatee', 'Sarasota', 'Polk', 'Brevard', 'Volusia',
    'St. Johns', 'Duval', 'Escambia', 'Okaloosa', 'Bay'
  ];

  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-3">County</label>
          <select
            value={formData.county || ''}
            onChange={(e) => setFormData({ ...formData, county: e.target.value })}
            className="w-full bg-white/20 border-0 rounded-2xl px-4 py-4 text-white text-lg"
          >
            <option value="">Select County</option>
            {floridaCounties.map(county => (
              <option key={county} value={county}>{county}</option>
            ))}
          </select>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-2">City</label>
          <input
            type="text"
            value={formData.city || ''}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full bg-white/20 border-0 rounded-2xl px-4 py-4 text-white placeholder-white/50 text-lg"
            placeholder="Enter city name"
          />
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <button
          onClick={onNext}
          disabled={!formData.county}
          className="w-full bg-white text-purple-600 py-5 rounded-2xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### Update Currency Display - Remove JMD

**IN PricingStep**: Remove all JMD references, USD only

```typescript
function PricingStep({ formData, setFormData, onNext }: any) {
  return (
    <div className="h-full overflow-y-auto px-6 pt-12 pb-32">
      <div className="max-w-lg mx-auto space-y-6">
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20">
          <label className="block text-white text-sm mb-2">Price per Person (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 text-2xl">$</span>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-white/20 border-0 rounded-2xl pl-12 pr-4 py-4 text-white text-2xl font-bold focus:ring-2 focus:ring-white/50"
              placeholder="0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 text-lg">USD</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 left-6 right-6">
        <button
          onClick={onNext}
          disabled={!formData.price || Number(formData.price) <= 0}
          className="w-full bg-white text-purple-600 py-5 rounded-2xl font-bold text-lg disabled:opacity-50 shadow-2xl"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## 5. OperatorDashboard.tsx Changes

### Update Header Logo & Branding (Lines 42-43)

**CHANGE:**
```typescript
<img src="/logos/tourflo-black.png" alt="TourFlo" className="h-8" />
```

This is already correct!

### Update Example Tour Locations (Lines 92, 103)

**CHANGE:**
```typescript
name: 'Everglades Airboat Adventure',  // ✅ Already Florida!
```

**CHANGE:**
```typescript
name: 'Miami Beach Food Tour',  // ✅ Already Florida!
```

**CHANGE:**
```typescript
name: 'Key West Sunset Cruise',  // ✅ Already Florida!
```

These are already correct!

### Add County Field to Operator Settings

**ADD** to settings section (if you create one):

```typescript
<div className="bg-white rounded-2xl p-6 shadow-sm">
  <h3 className="text-lg font-bold text-gray-900 mb-4">Business Location</h3>

  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">County</label>
      <select className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-florida-ocean focus:outline-none">
        <option>Miami-Dade</option>
        <option>Monroe</option>
        <option>Broward</option>
        <option>Orange</option>
        {/* ... more counties ... */}
      </select>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
      <input
        type="text"
        value="Florida"
        disabled
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50 text-gray-500"
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">EIN (Employer Identification Number)</label>
      <input
        type="text"
        placeholder="XX-XXXXXXX"
        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-florida-ocean focus:outline-none"
      />
    </div>
  </div>
</div>
```

### Update Currency Displays - USD Only

**FIND ALL** currency displays and ensure they show USD only:

```typescript
// BEFORE:
{currency_pref === 'JMD' ? `J$${amount}` : `$${amount} USD`}

// AFTER:
{`$${amount} USD`}
```

---

## 6. FlorBot.tsx (Renamed from ChatScreen.tsx)

### Rename File & Update Component Name

**CREATE NEW FILE:** `src/components/FlorBot.tsx`

### Update Bot Name References (Lines 34-36, 134, 138)

**CHANGE ALL:**
```typescript
text: "Hello! 👋 I'm TourGuide AI, your personal Florida tour assistant..."
```

**TO:**
```typescript
text: "Hello! 👋 I'm FlorBot, your personal Florida tour assistant. I can help you find amazing experiences, answer questions about Florida attractions, or book activities. What interests you?"
```

**CHANGE:**
```typescript
<h1 className="text-2xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'Poppins', fontWeight: 700 }}>
  TourGuide AI
</h1>
```

**TO:**
```typescript
<h1 className="text-2xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'Poppins', fontWeight: 700 }}>
  FlorBot
</h1>
```

**CHANGE:**
```typescript
<p className="text-sm text-white/90 drop-shadow-md flex items-center gap-2">
  <Sparkles className="w-4 h-4" />
  Your AI Florida Guide
</p>
```

This is already correct!

### Update Response Logic - Florida Context (Lines 48-72)

**REPLACE ENTIRE `getTourGuideResponse` FUNCTION:**

```typescript
const getTourGuideResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();

  if (msg.includes('beach')) {
    return "Florida has incredible beaches! 🏖️ Clearwater Beach is famous for crystal-white sand. South Beach Miami is perfect for people-watching and nightlife. Or try Sanibel Island for peaceful shell collecting. Which vibe are you feeling?";
  }

  if (msg.includes('theme') || msg.includes('park') || msg.includes('disney') || msg.includes('universal')) {
    return "Orlando is the theme park capital of the world! 🎢 Disney World has 4 parks, Universal has 2 (plus Harry Potter!), and there's SeaWorld, LEGOLAND, and more. Looking for thrills or family-friendly fun?";
  }

  if (msg.includes('popular') || msg.includes('best') || msg.includes('recommend')) {
    return "Right now, the hottest Florida experiences are: Everglades airboat tours 🐊, Key West sunset cruises ⛵, Miami food tours 🍽️, and of course theme parks! What kind of adventure are you after?";
  }

  if (msg.includes('fishing') || msg.includes('fish')) {
    return "Florida Keys fishing is world-class! 🎣 Half-day charters start around $650, full-day deep-sea trips go for $1,200+. Best season is December-April. Interested in offshore or inshore fishing?";
  }

  if (msg.includes('miami') || msg.includes('south beach')) {
    return "Miami is amazing! 🌴 Little Havana for Cuban food & culture, Wynwood for street art, South Beach for nightlife, and Biscayne Bay for boat tours. How many days are you there?";
  }

  if (msg.includes('key west') || msg.includes('keys')) {
    return "Key West is paradise! 🌅 Sunset Celebration at Mallory Square is a MUST. Also try fishing charters, snorkeling, and Duval Street nightlife. The drive down US-1 through the Keys is stunning. When are you going?";
  }

  if (msg.includes('everglades') || msg.includes('alligator') || msg.includes('airboat')) {
    return "Everglades airboat tours are thrilling! 🐊 You'll see gators, birds, and unique ecosystems. Tours run $100-250 per person. Best time is November-April (cooler weather, fewer bugs). Want me to find availability?";
  }

  if (msg.includes('book') || msg.includes('reserve')) {
    return "Great! I can help you book. Which experience caught your eye? Also, how many people and what dates? 📅";
  }

  if (msg.includes('family') || msg.includes('kids') || msg.includes('child')) {
    return "Perfect for families! 👨‍👩‍👧‍👦 How old are the kids? Theme parks work for all ages (6+), airboat tours are thrilling for 8+, beach activities for everyone! Most tours have family discounts too.";
  }

  if (msg.includes('food') || msg.includes('eat') || msg.includes('restaurant')) {
    return "Florida food scene is diverse! 🍽️ Cuban food in Miami, fresh seafood everywhere, Key lime pie in the Keys, and food tours in every major city. Looking for fine dining or local spots?";
  }

  return "Great question! I'm here to help you discover Florida's best experiences. Interested in beaches, theme parks, nature adventures, or food tours? Just ask! 🌴";
};
```

### Update Logo Reference (Line 121)

**ENSURE:**
```typescript
<img
  src={TOURFLO_LOGOS.chatAvatarWhite}
  alt="FlorBot"
  className="w-16 h-16 object-contain drop-shadow-2xl"
/>
```

### Update Background Gradient (Line 114)

**CHANGE:**
```typescript
<div className="absolute inset-0 bg-gradient-to-b from-florida-ocean/50 via-florida-ocean/40 to-black/70" />
```

This is already correct!

### Update Export Name

**AT END OF FILE:**
```typescript
export default function FlorBot({ session }: ChatScreenProps) {
  // ... component code
}
```

---

## Summary Checklist

### DiscoveryFeed.tsx:
- [x] Remove JMD currency logic (USD only)
- [x] Update location filters (Jamaica → Florida cities)
- [x] Add 8 vibe tags from taxonomy
- [x] Update price ranges for Florida market
- [x] Update share text ("TourFlo Florida")
- [x] Update loading messages
- [x] Update color scheme (ocean blue)

### ExperienceDetailPage.tsx:
- [ ] Remove JMD currency logic
- [ ] Update category icons (9 Florida categories)
- [ ] Update location display (add ", FL")
- [ ] Update guide references (Florida context)
- [ ] Update review examples (Florida experiences)

### OnboardingFlow.tsx:
- [ ] Verify location options (already has Florida)
- [ ] Keep 4 core vibes (already correct)
- [ ] Update welcome message ("Florida")
- [ ] Update logo alt text
- [ ] Update gradient colors

### ExperienceCreation.tsx:
- [ ] Update categories to 9 Florida categories
- [ ] Update vibe tags to 8 Florida tags
- [ ] Add county picker (20 Florida counties)
- [ ] Remove JMD currency option
- [ ] Add state field (Florida, disabled)

### OperatorDashboard.tsx:
- [ ] Verify logo (already TourFlo)
- [ ] Verify example locations (already Florida)
- [ ] Add county field to settings
- [ ] Add EIN field (replace TRN)
- [ ] Update all currency displays (USD only)

### FlorBot.tsx (ChatScreen.tsx):
- [ ] Rename file ChatScreen → FlorBot
- [ ] Update bot name references
- [ ] Update response logic (Florida context)
- [ ] Update quick response examples
- [ ] Ensure Florida gradient colors

---

## Color Theme Updates (tailwind.config.js)

Ensure these colors are defined:

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
      }
    }
  }
}
```

---

**END OF COMPONENT CHANGES SUMMARY**

Generated: 2025-11-18
Platform: TourFlo Florida
All 6 components documented with exact line-by-line changes.
