import {
  Fish,
  Ship,
  Leaf,
  Wind,
  Landmark,
  Waves,
  Sunset,
  Eye,
  Compass,
  Music
} from 'lucide-react';

export interface Category {
  id: string;
  name: string;
  icon: any; // Lucide icon component
  description: string;
}

export const FLORIDA_CATEGORIES: Category[] = [
  {
    id: 'fishing',
    name: 'Fishing Charters',
    icon: Fish,
    description: 'Deep sea, inshore, and fly fishing adventures',
  },
  {
    id: 'boat-tours',
    name: 'Boat Tours',
    icon: Ship,
    description: 'Dinner cruises, party boats, and sightseeing',
  },
  {
    id: 'eco-tours',
    name: 'Eco-Tours',
    icon: Leaf,
    description: 'Mangrove tunnels, wildlife spotting, and nature reserves',
  },
  {
    id: 'airboat',
    name: 'Airboat Tours',
    icon: Wind,
    description: 'High-speed Everglades exploration',
  },
  {
    id: 'historical',
    name: 'Historical Tours',
    icon: Landmark,
    description: 'Heritage sites and colonial era history',
  },
  {
    id: 'water-sports',
    name: 'Water Sports',
    icon: Waves,
    description: 'Jet skiing, parasailing, and wakeboarding',
  },
  {
    id: 'sunset',
    name: 'Sunset Cruises',
    icon: Sunset,
    description: 'Romantic and family-friendly evening cruises',
  },
  {
    id: 'nature',
    name: 'Nature Walks',
    icon: Eye,
    description: 'Hiking, bird watching, and photography',
  },
  {
    id: 'adventure',
    name: 'Adventure',
    icon: Compass,
    description: 'Zip-lining, cliff jumping, and kayaking',
  },
  {
    id: 'cultural',
    name: 'Cultural',
    icon: Music,
    description: 'Food tours, art, and local music experiences',
  },
];
