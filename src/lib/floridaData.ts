export interface Review {
    id: string;
    author: string;
    rating: number;
    text: string;
    date: string;
}

export interface FloridaExperience {
    id: string;
    title: string;
    description: string;
    image_url: string;
    video_url: string | null;
    price_usd: number;
    price_note?: string; // e.g., "per person", "group of 4"
    location_name: string;
    category_id: string;
    duration_hours: number;
    operator_name: string;
    operator_verified: boolean;
    includes: string[];
    amenities: string[];
    rating: number;
    reviews_count: number;
    reviews: Review[];
}

export const floridaExperiences: FloridaExperience[] = [
    // Fishing Charters
    {
        id: 'fish-1',
        title: 'Miami Deep Sea Sport Fishing',
        description: 'Battle sailfish, mahi-mahi, and tuna on our 45ft Hatteras. All equipment and license included.',
        image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070&auto=format&fit=crop',
        video_url: null,
        price_usd: 199,
        price_note: 'per person',
        location_name: 'Miami Beach Marina',
        category_id: 'fishing',
        duration_hours: 4,
        operator_name: "Captain's Deep Sea Charters",
        operator_verified: true,
        includes: ['Fishing License', 'Bait & Tackle', 'Cooler with Ice', 'Mate Service'],
        amenities: ['Restroom', 'AC Cabin', 'Fighting Chair'],
        rating: 4.8,
        reviews_count: 124,
        reviews: [
            { id: 'r1', author: 'Mike T.', rating: 5, text: 'Caught a massive Sailfish! Captain was great.', date: '2023-10-15' },
            { id: 'r2', author: 'Sarah L.', rating: 4, text: 'Fun trip, but a bit choppy today.', date: '2023-09-22' }
        ]
    },
    {
        id: 'fish-2',
        title: 'Keys Backcountry Fly Fishing',
        description: 'Stalk tarpon and bonefish in the crystal clear flats of Islamorada.',
        image_url: 'https://images.unsplash.com/photo-1516967124798-10656f7dca28?q=80&w=2070&auto=format&fit=crop',
        video_url: null,
        price_usd: 450,
        price_note: 'half day (2 ppl)',
        location_name: 'Islamorada',
        category_id: 'fishing',
        duration_hours: 4,
        operator_name: "Silver King Outfitters",
        operator_verified: true,
        includes: ['Fly Gear', 'Poling Skiff', 'Water & Snacks'],
        amenities: ['Top-tier Gear', 'Expert Guide'],
        rating: 4.9,
        reviews_count: 89,
        reviews: [
            { id: 'r3', author: 'John D.', rating: 5, text: 'World class guide. Put us right on the fish.', date: '2023-11-01' }
        ]
    },

    // Boat Tours
    {
        id: 'boat-1',
        title: 'Millionaire\'s Row Sightseeing',
        description: 'Cruise by the homes of the rich and famous on Star Island and Fisher Island.',
        image_url: 'https://images.unsplash.com/photo-1540573133985-87b6da6dce60?q=80&w=2110&auto=format&fit=crop',
        video_url: null,
        price_usd: 35,
        price_note: 'per person',
        location_name: 'Bayside Marketplace, Miami',
        category_id: 'boat-tours',
        duration_hours: 1.5,
        operator_name: "Miami Aqua Tours",
        operator_verified: true,
        includes: ['Audio Guide', 'Cash Bar'],
        amenities: ['Restroom', 'Upper Deck Seating', 'Wheelchair Accessible'],
        rating: 4.5,
        reviews_count: 2500,
        reviews: [
            { id: 'r4', author: 'Elena R.', rating: 4, text: 'Nice views, good narration.', date: '2023-10-30' }
        ]
    },

    // Eco-Tours
    {
        id: 'eco-1',
        title: 'Mangrove Tunnel Kayak Tour',
        description: 'Paddle through peaceful mangrove tunnels and spot manatees and dolphins.',
        image_url: 'https://images.unsplash.com/photo-1541343672885-9be56236302a?q=80&w=1974&auto=format&fit=crop',
        video_url: null,
        price_usd: 65,
        price_note: 'per person',
        location_name: 'Key Largo',
        category_id: 'eco-tours',
        duration_hours: 2.5,
        operator_name: "Keys Eco Adventures",
        operator_verified: true,
        includes: ['Kayak Rental', 'Life Vest', 'Dry Bag', 'Guide'],
        amenities: ['Free Parking', 'Shower Facilities'],
        rating: 4.9,
        reviews_count: 310,
        reviews: [
            { id: 'r5', author: 'Tom H.', rating: 5, text: 'Saw two manatees! Magical experience.', date: '2023-11-05' }
        ]
    },

    // Airboat Tours
    {
        id: 'air-1',
        title: 'Everglades Airboat Safari',
        description: 'High-speed thrill ride through the River of Grass. See alligators up close!',
        image_url: 'https://images.unsplash.com/photo-1603989872210-591494945a48?q=80&w=2069&auto=format&fit=crop',
        video_url: null,
        price_usd: 89,
        price_note: 'per person',
        location_name: 'Homestead',
        category_id: 'airboat',
        duration_hours: 1.5,
        operator_name: "Everglades Explorer",
        operator_verified: true,
        includes: ['Ear Protection', 'Live Gator Show', 'Photo Op'],
        amenities: ['Gift Shop', 'Cafe', 'Free Parking'],
        rating: 4.7,
        reviews_count: 850,
        reviews: [
            { id: 'r6', author: 'Chris P.', rating: 5, text: 'Loud but awesome! Kids loved the gators.', date: '2023-10-20' }
        ]
    },

    // Historical Tours
    {
        id: 'hist-1',
        title: 'St. Augustine Ghost & History',
        description: 'Walk the cobblestone streets of the oldest city in the US and hear spooky tales.',
        image_url: 'https://images.unsplash.com/photo-1590524266836-652c824d6246?q=80&w=1974&auto=format&fit=crop',
        video_url: null,
        price_usd: 25,
        price_note: 'per person',
        location_name: 'St. Augustine',
        category_id: 'historical',
        duration_hours: 1.5,
        operator_name: "Ancient City Tours",
        operator_verified: true,
        includes: ['Expert Guide', 'EMF Meter Rental'],
        amenities: ['Walking Tour'],
        rating: 4.6,
        reviews_count: 420,
        reviews: [
            { id: 'r7', author: 'Amanda B.', rating: 5, text: 'Very atmospheric and informative.', date: '2023-10-31' }
        ]
    },

    // Water Sports
    {
        id: 'sport-1',
        title: 'Key West Jet Ski Tour',
        description: '28-mile guided jet ski tour around the entire island of Key West.',
        image_url: 'https://images.unsplash.com/photo-1564353564043-19783171504e?q=80&w=2070&auto=format&fit=crop',
        video_url: null,
        price_usd: 149,
        price_note: 'per ski (up to 2)',
        location_name: 'Key West',
        category_id: 'water-sports',
        duration_hours: 1.5,
        operator_name: "Island Water Sports",
        operator_verified: true,
        includes: ['Jet Ski Rental', 'Safety Gear', 'Guide'],
        amenities: ['Lockers', 'Showers'],
        rating: 4.8,
        reviews_count: 600,
        reviews: [
            { id: 'r8', author: 'Jake S.', rating: 5, text: 'Highlight of our trip! So much fun.', date: '2023-11-10' }
        ]
    },
    {
        id: 'sport-2',
        title: 'Parasailing Over Miami Beach',
        description: 'Soar 800ft above the Atlantic Ocean for breathtaking views of South Beach.',
        image_url: 'https://images.unsplash.com/photo-1505852903341-fc8d3db10436?q=80&w=2070&auto=format&fit=crop',
        video_url: null,
        price_usd: 85,
        price_note: 'per person',
        location_name: 'South Beach',
        category_id: 'water-sports',
        duration_hours: 1,
        operator_name: "Miami Sky High",
        operator_verified: true,
        includes: ['Safety Briefing', 'Photo Package Option'],
        amenities: ['Boat Ride'],
        rating: 4.7,
        reviews_count: 330,
        reviews: []
    },

    // Sunset Cruises
    {
        id: 'sunset-1',
        title: 'Key West Sunset Celebration',
        description: 'Live music, appetizers, and the world-famous Key West sunset from a catamaran.',
        image_url: 'https://images.unsplash.com/photo-1534234828563-0252171f8422?q=80&w=2070&auto=format&fit=crop',
        video_url: null,
        price_usd: 79,
        price_note: 'per person',
        location_name: 'Key West',
        category_id: 'sunset',
        duration_hours: 2,
        operator_name: "Sunset Dreams Cruise Line",
        operator_verified: true,
        includes: ['Open Bar', 'Appetizers', 'Live Music'],
        amenities: ['Restroom', 'Covered Deck'],
        rating: 4.9,
        reviews_count: 1500,
        reviews: [
            { id: 'r9', author: 'Linda M.', rating: 5, text: 'Beautiful sunset and great margaritas!', date: '2023-11-12' }
        ]
    },

    // Nature Walks
    {
        id: 'nature-1',
        title: 'Corkscrew Swamp Sanctuary Walk',
        description: 'Walk the 2.25-mile boardwalk through the largest old-growth bald cypress forest.',
        image_url: 'https://images.unsplash.com/photo-1440557653067-1533960533d3?q=80&w=2074&auto=format&fit=crop',
        video_url: null,
        price_usd: 17,
        price_note: 'admission',
        location_name: 'Naples',
        category_id: 'nature',
        duration_hours: 3,
        operator_name: "Audubon Florida",
        operator_verified: true,
        includes: ['Map', 'Nature Center Access'],
        amenities: ['Restrooms', 'Gift Shop', 'Picnic Area'],
        rating: 4.8,
        reviews_count: 200,
        reviews: []
    },

    // Adventure
    {
        id: 'adv-1',
        title: 'Canyons Zip Line & Canopy Tour',
        description: 'Zip line over cliffs and lakes in this unique Florida quarry landscape.',
        image_url: 'https://images.unsplash.com/photo-1533587851505-d119e13fa0d7?q=80&w=2070&auto=format&fit=crop',
        video_url: null,
        price_usd: 110,
        price_note: 'per person',
        location_name: 'Ocala',
        category_id: 'adventure',
        duration_hours: 2.5,
        operator_name: "The Canyons Zip Line",
        operator_verified: true,
        includes: ['All Gear', 'Guides', '9 Zip Lines'],
        amenities: ['Parking', 'Water Stations'],
        rating: 4.9,
        reviews_count: 550,
        reviews: []
    },

    // Cultural
    {
        id: 'cult-1',
        title: 'Little Havana Food & Culture',
        description: 'Taste authentic Cuban sandwiches, coffee, and pastries while learning the history.',
        image_url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
        video_url: null,
        price_usd: 69,
        price_note: 'per person',
        location_name: 'Little Havana, Miami',
        category_id: 'cultural',
        duration_hours: 2.5,
        operator_name: "Miami Culinary Tours",
        operator_verified: true,
        includes: ['5 Food Tastings', 'Mojito', 'Guide'],
        amenities: ['Walking Tour'],
        rating: 4.8,
        reviews_count: 900,
        reviews: [
            { id: 'r10', author: 'Carlos G.', rating: 5, text: 'Best food tour I have ever been on. Come hungry!', date: '2023-10-05' }
        ]
    },
    {
        id: 'cult-2',
        title: 'Wynwood Graffiti Golf Cart Tour',
        description: 'Explore the famous Wynwood Walls and street art scene in a comfortable golf cart.',
        image_url: 'https://images.unsplash.com/photo-1580666853726-456d38699109?q=80&w=1974&auto=format&fit=crop',
        video_url: null,
        price_usd: 45,
        price_note: 'per person',
        location_name: 'Wynwood, Miami',
        category_id: 'cultural',
        duration_hours: 1,
        operator_name: "Wynwood Art Rides",
        operator_verified: true,
        includes: ['Driver/Guide', 'Photo Stops'],
        amenities: ['Golf Cart'],
        rating: 4.6,
        reviews_count: 180,
        reviews: []
    }
];
