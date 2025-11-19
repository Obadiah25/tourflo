import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, PanInfo, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, DollarSign, Share2, Search, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../lib/store';
import BookingSheet from './BookingSheet';
import { haptics } from '../lib/haptics';
import Toast from './Toast';
import MapModal from './MapModal';

// FLORIDA REFACTOR: Updated Experience interface - removed price_jmd, uses USD only
interface Experience {
  id: string;
  title: string;
  description: string;
  image_url: string;
  video_url: string | null;
  price_usd: number; // USD only - no JMD
  location_name: string;
  location_lat: number | null;
  location_lng: number | null;
  category: string;
  operator_id: string;
  operator?: {
    logo_url: string | null;
    name: string;
  };
}

interface DiscoveryFeedProps {
  session: any;
  onBookingChange: (isOpen: boolean) => void;
  onExperienceSelect: (experienceId: string) => void;
}

// FLORIDA REFACTOR: Updated with 8 vibe tags from TOURFLO_FLORIDA_CATEGORIES.md
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

// FLORIDA REFACTOR: Updated location filters to Florida counties/cities
const FLORIDA_LOCATIONS = [
  'All',
  'Miami',
  'Key West',
  'Orlando',
  'Tampa',
  'Fort Lauderdale',
  'Naples',
  'Clearwater',
  'St. Augustine'
];

// FLORIDA REFACTOR: Florida mock experiences from TOURFLO_MOCK_DATA.json
const FLORIDA_SAMPLE_DATA = [
  {
    id: 'exp_001',
    title: 'Half Day Deep Sea Fishing Adventure',
    description: 'Target mahi-mahi, sailfish, and kingfish on our 38-foot custom sportfisher.',
    image_url: 'https://images.pexels.com/photos/1423564/pexels-photo-1423564.jpeg?auto=compress&cs=tinysrgb&w=800',
    video_url: null,
    price_usd: 65000, // $650.00 in cents
    location_name: 'Key West',
    location_lat: 24.5657,
    location_lng: -81.7648,
    category: 'fishing_charter',
    operator_id: 'op_001'
  },
  {
    id: 'exp_002',
    title: 'Key West Sunset Cruise',
    description: 'Sail into the sunset with champagne and live music aboard our luxury catamaran.',
    image_url: 'https://images.pexels.com/photos/1118874/pexels-photo-1118874.jpeg?auto=compress&cs=tinysrgb&w=800',
    video_url: null,
    price_usd: 8500, // $85.00 in cents
    location_name: 'Key West',
    location_lat: 24.5551,
    location_lng: -81.7800,
    category: 'boat_tour',
    operator_id: 'op_002'
  },
  {
    id: 'exp_003',
    title: 'Everglades Airboat Adventure',
    description: 'Blast through sawgrass marshes and see wild alligators up close!',
    image_url: 'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=800',
    video_url: null,
    price_usd: 15000, // $150.00 in cents
    location_name: 'Miami',
    location_lat: 25.7617,
    location_lng: -80.1918,
    category: 'airboat_tour',
    operator_id: 'op_003'
  },
  {
    id: 'exp_004',
    title: 'Miami Beach Jet Ski Tour',
    description: 'Ride along Miami\'s stunning coastline on your own jet ski!',
    image_url: 'https://images.pexels.com/photos/163933/dubai-jet-ski-marine-sports-sea-163933.jpeg?auto=compress&cs=tinysrgb&w=800',
    video_url: null,
    price_usd: 18000, // $180.00 in cents
    location_name: 'Miami Beach',
    location_lat: 25.7907,
    location_lng: -80.1300,
    category: 'water_sports',
    operator_id: 'op_004'
  },
  {
    id: 'exp_005',
    title: 'Little Havana Food Tour',
    description: 'Taste authentic Cuban cuisine in Miami\'s most vibrant neighborhood!',
    image_url: 'https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=800',
    video_url: null,
    price_usd: 9500, // $95.00 in cents
    location_name: 'Miami',
    location_lat: 25.7657,
    location_lng: -80.2201,
    category: 'food_tour',
    operator_id: 'op_005'
  }
];

export default function DiscoveryFeed({ session, onBookingChange, onExperienceSelect }: DiscoveryFeedProps) {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [bookingExperience, setBookingExperience] = useState<Experience | null>(null);
  const [heartAnimation, setHeartAnimation] = useState<{ x: number; y: number } | null>(null);
  const [hasSwipedBefore, setHasSwipedBefore] = useState(() => {
    return localStorage.getItem('has_swiped') === 'true';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVibe, setSelectedVibe] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  // FLORIDA REFACTOR: Removed currency_pref - always USD
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTapTime = useRef(0);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('🏝️  DiscoveryFeed component mounted - Florida version');
    loadExperiences();
    if (session) {
      loadSavedExperiences();
    }
  }, [session]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  const loadExperiences = async () => {
    console.log('🔍 Loading Florida experiences from database...');
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select(`
          *,
          operator:operators(
            logo_url,
            name
          )
        `)
        .eq('is_active', true)
        .limit(20);

      if (error) {
        console.error('❌ Error loading experiences:', error);
        console.log('🔄 Falling back to Florida sample data');
        setExperiences(FLORIDA_SAMPLE_DATA as any);
        return;
      }

      if (data && data.length > 0) {
        console.log(`✅ Successfully loaded ${data.length} Florida experiences from database`);
        console.log('📋 First experience:', data[0].title);
        setExperiences(data);
      } else {
        console.warn('⚠️  No experiences found in database');
        console.log('🔄 Using Florida sample data as fallback');
        setExperiences(FLORIDA_SAMPLE_DATA as any);
      }
    } catch (err) {
      console.error('💥 Exception loading experiences:', err);
      console.log('🔄 Falling back to Florida sample data');
      setExperiences(FLORIDA_SAMPLE_DATA as any);
    }
  };

  const loadSavedExperiences = async () => {
    if (!session?.user?.id) return;

    const { data } = await supabase
      .from('saved_experiences')
      .select('experience_id')
      .eq('user_id', session.user.id);

    if (data) {
      setSavedIds(new Set(data.map((item) => item.experience_id)));
    }
  };

  const handleDragEnd = (_event: any, info: PanInfo) => {
    const offset = info.offset.y;
    const velocity = Math.abs(info.velocity.y);

    if (offset < -100 && currentIndex < filteredExperiences.length - 1) {
      haptics.light();
      setCurrentIndex(currentIndex + 1);
      y.set(0);
      if (!hasSwipedBefore) {
        localStorage.setItem('has_swiped', 'true');
        setHasSwipedBefore(true);
      }
    } else if (offset > 100 && currentIndex > 0) {
      haptics.light();
      setCurrentIndex(currentIndex - 1);
      y.set(0);
      if (!hasSwipedBefore) {
        localStorage.setItem('has_swiped', 'true');
        setHasSwipedBefore(true);
      }
    } else if (velocity > 500) {
      if (info.velocity.y < 0 && currentIndex < filteredExperiences.length - 1) {
        haptics.light();
        setCurrentIndex(currentIndex + 1);
        y.set(0);
        if (!hasSwipedBefore) {
          localStorage.setItem('has_swiped', 'true');
          setHasSwipedBefore(true);
        }
      } else if (info.velocity.y > 0 && currentIndex > 0) {
        haptics.light();
        setCurrentIndex(currentIndex - 1);
        y.set(0);
        if (!hasSwipedBefore) {
          localStorage.setItem('has_swiped', 'true');
          setHasSwipedBefore(true);
        }
      } else {
        y.set(0);
      }
    } else {
      y.set(0);
    }
  };

  const toggleSave = async (experienceId: string, tapX?: number, tapY?: number) => {
    if (!session) return;

    const isSaved = savedIds.has(experienceId);

    if (isSaved) {
      await supabase
        .from('saved_experiences')
        .delete()
        .eq('user_id', session.user.id)
        .eq('experience_id', experienceId);

      setSavedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(experienceId);
        return newSet;
      });
      haptics.light();
      setToastMessage('Removed from saved');
      setShowToast(true);
    } else {
      await supabase
        .from('saved_experiences')
        .insert({ user_id: session.user.id, experience_id: experienceId });

      setSavedIds((prev) => new Set(prev).add(experienceId));
      haptics.success();
      setToastMessage('Saved!');
      setShowToast(true);

      if (tapX !== undefined && tapY !== undefined) {
        setHeartAnimation({ x: tapX, y: tapY });
        setTimeout(() => setHeartAnimation(null), 1000);
      }
    }
  };

  const handleDoubleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = 'touches' in e ? e.changedTouches[0].clientX - rect.left : e.clientX - rect.left;
        const y = 'touches' in e ? e.changedTouches[0].clientY - rect.top : e.clientY - rect.top;
        toggleSave(currentExperience.id, x, y);
      }
    }
    lastTapTime.current = now;
  };

  const handleShare = async (experience: Experience) => {
    haptics.light();

    if (navigator.share) {
      try {
        await navigator.share({
          title: experience.title,
          // FLORIDA REFACTOR: Updated share text from "LOOKYAH Jamaica" to "TourFlo Florida"
          text: `Check out ${experience.title} on TourFlo Florida!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setToastMessage('Link copied!');
        setShowToast(true);
      } catch (error) {
        console.error('Failed to copy link', error);
      }
    }
  };

  const handleMapOpen = () => {
    haptics.light();
    setShowMapModal(true);
  };

  const handleSaveClick = () => {
    haptics.light();
    toggleSave(currentExperience.id);
  };

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = searchTerm === '' ||
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesVibe = selectedVibe === 'All' || exp.category.toLowerCase() === selectedVibe.toLowerCase();

    const priceUSD = exp.price_usd / 100;
    let matchesPrice = true;
    // FLORIDA REFACTOR: Updated price ranges to match Florida pricing
    if (selectedPrice === 'Under $50') matchesPrice = priceUSD < 50;
    else if (selectedPrice === '$50-$150') matchesPrice = priceUSD >= 50 && priceUSD <= 150;
    else if (selectedPrice === '$150+') matchesPrice = priceUSD > 150;

    const matchesLocation = selectedLocation === 'All' ||
      exp.location_name.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesVibe && matchesPrice && matchesLocation;
  });

  const activeFiltersCount = [selectedVibe, selectedPrice, selectedLocation].filter(f => f !== 'All').length + (searchTerm ? 1 : 0);

  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedVibe('All');
    setSelectedPrice('All');
    setSelectedLocation('All');
    setCurrentIndex(0);
  };

  const handleSearchChange = (value: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
      setCurrentIndex(0);
    }, 300);
  };

  if (experiences.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-florida-ocean via-florida-sand to-florida-sunset flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-6xl mb-4 animate-pulse">🌴🌊</div>
          <p className="text-xl text-gray-700 mb-2">Loading experiences...</p>
          {/* FLORIDA REFACTOR: Updated loading message */}
          <p className="text-sm text-gray-600">Finding the best Florida has to offer</p>
          <div className="mt-4 text-xs text-gray-500">
            {console.log('Current experiences count:', experiences.length)}
            Check console (F12) if this takes more than 3 seconds
          </div>
        </div>
      </div>
    );
  }

  if (filteredExperiences.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-florida-ocean via-florida-sand to-florida-sunset flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-700 mb-4">No experiences found</p>
          <p className="text-sm text-gray-600 mb-6">Try different filters!</p>
          <button
            onClick={handleClearAll}
            className="bg-florida-ocean text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    );
  }

  const currentExperience = filteredExperiences[currentIndex];
  // FLORIDA REFACTOR: Removed JMD currency logic - USD only
  const price = `$${(currentExperience.price_usd / 100).toFixed(0)}`;

  console.log('🎨 Rendering DiscoveryFeed (Florida) with', experiences.length, 'experiences');
  console.log('📍 Current experience:', currentExperience.title);

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-0 right-0 flex-shrink-0 px-4 pt-4 pb-2 z-30 pointer-events-none">
        <div className="pointer-events-auto">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl mb-3 flex items-center px-4 py-3">
          <Search className="w-5 h-5 text-white/90 drop-shadow-md" />
          <input
            type="text"
            placeholder="Search experiences..."
            defaultValue={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 ml-2 bg-transparent outline-none text-sm text-white placeholder-white/70"
            style={{ fontFamily: 'Poppins' }}
          />
          {searchTerm && (
            <button onClick={() => { setSearchTerm(''); setCurrentIndex(0); }}>
              <X className="w-5 h-5 text-white/90" />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl px-4 py-2 text-sm font-medium mb-3 text-white"
          style={{ fontFamily: 'Poppins' }}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'} {activeFiltersCount > 0 && `(${activeFiltersCount})`}
        </button>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-4 mb-3 space-y-3"
          >
            {/* FLORIDA REFACTOR: Updated vibe filters with 8 vibe tags */}
            <div>
              <p className="text-xs font-semibold text-white/90 mb-2 drop-shadow-md">Vibe Tags</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['All', ...VIBE_TAGS].map(vibe => (
                  <button
                    key={vibe}
                    onClick={() => { setSelectedVibe(vibe); setCurrentIndex(0); }}
                    className={`flex-shrink-0 rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                      selectedVibe === vibe
                        ? 'bg-florida-ocean text-white border-florida-ocean'
                        : 'bg-white/10 text-white border-white/30'
                    }`}
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {vibe}
                  </button>
                ))}
              </div>
            </div>

            {/* FLORIDA REFACTOR: Updated price ranges for Florida market */}
            <div>
              <p className="text-xs font-semibold text-white/90 mb-2 drop-shadow-md">Price</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {['All', 'Under $50', '$50-$150', '$150+'].map(price => (
                  <button
                    key={price}
                    onClick={() => { setSelectedPrice(price); setCurrentIndex(0); }}
                    className={`flex-shrink-0 rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                      selectedPrice === price
                        ? 'bg-florida-ocean text-white border-florida-ocean'
                        : 'bg-white/10 text-white border-white/30'
                    }`}
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {price}
                  </button>
                ))}
              </div>
            </div>

            {/* FLORIDA REFACTOR: Updated location filters to Florida cities/counties */}
            <div>
              <p className="text-xs font-semibold text-white/90 mb-2 drop-shadow-md">Location</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {FLORIDA_LOCATIONS.map(location => (
                  <button
                    key={location}
                    onClick={() => { setSelectedLocation(location); setCurrentIndex(0); }}
                    className={`flex-shrink-0 rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                      selectedLocation === location
                        ? 'bg-florida-ocean text-white border-florida-ocean'
                        : 'bg-white/10 text-white border-white/30'
                    }`}
                    style={{ fontFamily: 'Poppins' }}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={handleClearAll}
                className="w-full bg-white/20 text-white py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
                style={{ fontFamily: 'Poppins' }}
              >
                Clear All Filters
              </button>
            )}
          </motion.div>
        )}
        </div>
      </div>

      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden"
        onClick={handleDoubleTap}
        onTouchEnd={handleDoubleTap}
      >
        <motion.div
          key={currentIndex}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          style={{ y }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0"
        >
          {currentExperience.video_url ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              src={currentExperience.video_url}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : null}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${currentExperience.image_url})`,
              display: currentExperience.video_url ? 'none' : 'block',
            }}
          />

          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

          <AnimatePresence>
            {heartAnimation && (
              <motion.div
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: 3, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="absolute pointer-events-none"
                style={{ left: heartAnimation.x, top: heartAnimation.y }}
              >
                <Heart className="w-12 h-12 fill-florida-ocean text-florida-ocean" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-28 sm:bottom-36 left-0 right-0 px-4 sm:px-6 text-white">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              {currentExperience.operator?.logo_url ? (
                <img
                  src={currentExperience.operator.logo_url}
                  alt={currentExperience.operator.name}
                  className="h-8 w-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-2 py-1"
                />
              ) : (
                <div className="h-8 px-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center">
                  <span className="text-xs text-white/70">Operator Logo</span>
                </div>
              )}
              <span className="px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-sm text-white font-medium shadow-lg animate-pulse-slow">
                😎 Chill
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 leading-tight" style={{ fontFamily: 'Poppins', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.6)' }}>
              {currentExperience.title}
            </h2>

            <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
              {/* FLORIDA REFACTOR: Simplified price display - USD only */}
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Poppins', fontWeight: 800, textShadow: '0 3px 10px rgba(0,0,0,0.7)' }}>
                {price}
              </span>
              <span className="text-base sm:text-lg md:text-xl text-white/95 font-medium">USD</span>
              <span className="text-sm text-white/80 font-light">per person</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-white/90 text-xs sm:text-sm mb-3 sm:mb-4" style={{ fontFamily: 'Poppins', fontWeight: 400 }}>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-lg"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <span className="font-medium">Open now</span>
              </div>
              <span>•</span>
              <span>{currentExperience.location_name}</span>
              <span>•</span>
              <span>17 spots left</span>
            </div>

            <button
              onClick={() => {
                console.log('🎯 Explore & Book clicked!');
                console.log('📦 Experience ID:', currentExperience.id);
                console.log('📝 Experience Title:', currentExperience.title);
                if (navigator.vibrate) {
                  navigator.vibrate(10);
                }
                onExperienceSelect(currentExperience.id);
              }}
              className="w-full bg-gradient-to-r from-florida-ocean to-blue-700 text-white font-semibold text-base sm:text-lg py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all mb-2 sm:mb-3"
              style={{ fontFamily: 'Poppins', fontWeight: 600 }}
            >
              Explore & Book
            </button>

            <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/80" style={{ fontFamily: 'Poppins' }}>
              <span>⏱️ 2-3 hours</span>
              <span>•</span>
              <span>⭐ 4.9 (1,243)</span>
            </div>
          </div>

          <div className="absolute top-32 sm:top-36 right-4 sm:right-6 flex flex-col gap-3 sm:gap-4 z-20">
            <button
              onClick={handleSaveClick}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
            >
              <Heart
                className={`w-6 h-6 sm:w-7 sm:h-7 ${
                  savedIds.has(currentExperience.id)
                    ? 'text-red-500 fill-red-500'
                    : 'text-white'
                }`}
                strokeWidth={2.5}
              />
            </button>

            <button
              onClick={handleMapOpen}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
            >
              <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
            </button>

            <button
              onClick={() => handleShare(currentExperience)}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
            >
              <Share2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
            </button>
          </div>


          {currentIndex === 0 && !hasSwipedBefore && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute bottom-[480px] left-0 right-0 flex justify-center z-10 animate-bounce"
            >
              <div className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full text-white text-sm font-medium shadow-lg">
                👆 Swipe up for more
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {bookingExperience && (
        <BookingSheet
          experience={bookingExperience}
          session={session}
          onClose={() => {
            setBookingExperience(null);
            onBookingChange(false);
          }}
        />
      )}

      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        experience={currentExperience}
      />
    </div>
  );
}
