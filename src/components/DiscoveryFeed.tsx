import { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, PanInfo, AnimatePresence } from 'framer-motion';
import { Heart, MapPin, Share2, Search, X, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../lib/store';
import BookingSheet from './BookingSheet';
import { haptics } from '../lib/haptics';
import { floridaExperiences, FloridaExperience } from '../lib/floridaData';
import { FLORIDA_CATEGORIES } from '../constants/categories';
import Toast from './Toast';
import MapModal from './MapModal';

interface DiscoveryFeedProps {
  session: any;
  onBookingChange: (isOpen: boolean) => void;
  onExperienceSelect: (experience: FloridaExperience) => void;
}

export default function DiscoveryFeed({ session, onBookingChange, onExperienceSelect }: DiscoveryFeedProps) {
  const [experiences, setExperiences] = useState<FloridaExperience[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [bookingExperience, setBookingExperience] = useState<FloridaExperience | null>(null);
  const [heartAnimation, setHeartAnimation] = useState<{ x: number; y: number } | null>(null);
  const [hasSwipedBefore, setHasSwipedBefore] = useState(() => {
    return localStorage.getItem('has_swiped') === 'true';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPrice, setSelectedPrice] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const { currency_pref } = useAppStore();
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastTapTime = useRef(0);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('🏝️  DiscoveryFeed component mounted');
    // For this refactor, we are using the local Florida data as the primary source
    setExperiences(floridaExperiences);

    if (session) {
      loadSavedExperiences();
    }
  }, [session]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  }, [currentIndex]);

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

  const handleShare = async (experience: FloridaExperience) => {
    haptics.light();

    if (navigator.share) {
      try {
        await navigator.share({
          title: experience.title,
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

    const matchesCategory = selectedCategory === 'All' || exp.category_id === selectedCategory;

    const priceUSD = exp.price_usd;
    let matchesPrice = true;
    if (selectedPrice === 'Under $50') matchesPrice = priceUSD < 50;
    else if (selectedPrice === '$50-$100') matchesPrice = priceUSD >= 50 && priceUSD <= 100;
    else if (selectedPrice === '$100+') matchesPrice = priceUSD > 100;

    const matchesLocation = selectedLocation === 'All' ||
      exp.location_name.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesCategory && matchesPrice && matchesLocation;
  });

  const activeFiltersCount = [selectedCategory, selectedPrice, selectedLocation].filter(f => f !== 'All').length + (searchTerm ? 1 : 0);

  const handleClearAll = () => {
    setSearchTerm('');
    setSelectedCategory('All');
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
      <div className="fixed inset-0 bg-gradient-skysand flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-6xl mb-4 animate-pulse">🌴😎</div>
          <p className="text-xl text-gray-700 mb-2">Loading Florida experiences...</p>
        </div>
      </div>
    );
  }

  if (filteredExperiences.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-skysand flex items-center justify-center">
        <div className="text-center px-6">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-700 mb-4">No experiences found</p>
          <p className="text-sm text-gray-600 mb-6">Try different filters!</p>
          <button
            onClick={handleClearAll}
            className="bg-[var(--accent-purple)] text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    );
  }

  const currentExperience = filteredExperiences[currentIndex];
  const category = FLORIDA_CATEGORIES.find(c => c.id === currentExperience.category_id);
  const CategoryIcon = category?.icon;

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-0 left-0 right-0 flex-shrink-0 px-4 pt-4 pb-2 z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl mb-3 flex items-center px-4 py-3">
            <Search className="w-5 h-5 text-white/90 drop-shadow-md" />
            <input
              type="text"
              placeholder="Search Florida..."
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
              <div>
                <p className="text-xs font-semibold text-white/90 mb-2 drop-shadow-md">Category</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button
                    onClick={() => { setSelectedCategory('All'); setCurrentIndex(0); }}
                    className={`flex-shrink-0 rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === 'All'
                      ? 'bg-[#0077BE] text-white border-[#0077BE]'
                      : 'bg-white/10 text-white border-white/30'
                      }`}
                  >
                    All
                  </button>
                  {FLORIDA_CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat.id); setCurrentIndex(0); }}
                      className={`flex-shrink-0 rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${selectedCategory === cat.id
                        ? 'bg-[#0077BE] text-white border-[#0077BE]'
                        : 'bg-white/10 text-white border-white/30'
                        }`}
                      style={{ fontFamily: 'Poppins' }}
                    >
                      <cat.icon className="w-3 h-3" />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-white/90 mb-2 drop-shadow-md">Price</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {['All', 'Under $50', '$50-$100', '$100+'].map(price => (
                    <button
                      key={price}
                      onClick={() => { setSelectedPrice(price); setCurrentIndex(0); }}
                      className={`flex-shrink-0 rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${selectedPrice === price
                        ? 'bg-[#FF6B35] text-white border-[#FF6B35]'
                        : 'bg-white/10 text-white border-white/30'
                        }`}
                      style={{ fontFamily: 'Poppins' }}
                    >
                      {price}
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
                <Heart className="w-12 h-12 fill-[var(--accent-purple)] text-[var(--accent-purple)]" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-28 sm:bottom-36 left-0 right-0 px-4 sm:px-6 text-white">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="h-8 px-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center">
                <span className="text-xs text-white/90 font-medium">{currentExperience.operator_name}</span>
              </div>
              {category && (
                <span className="px-3 py-1.5 bg-white/15 backdrop-blur-md border border-white/20 rounded-full text-sm text-white font-medium shadow-lg flex items-center gap-1.5">
                  {CategoryIcon && <CategoryIcon className="w-3.5 h-3.5" />}
                  {category.name}
                </span>
              )}
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 leading-tight" style={{ fontFamily: 'Poppins', fontWeight: 700, textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 2px 6px rgba(0,0,0,0.6)' }}>
              {currentExperience.title}
            </h2>

            <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
              <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: 'Poppins', fontWeight: 800, textShadow: '0 3px 10px rgba(0,0,0,0.7)' }}>
                ${currentExperience.price_usd}
              </span>
              <span className="text-sm text-white/80 font-light">{currentExperience.price_note || 'per person'}</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 text-white/90 text-xs sm:text-sm mb-3 sm:mb-4" style={{ fontFamily: 'Poppins', fontWeight: 400 }}>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-lg"></div>
                  <div className="absolute inset-0 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping"></div>
                </div>
                <span className="font-medium">Available</span>
              </div>
              <span>•</span>
              <span>{currentExperience.location_name}</span>
            </div>

            <button
              onClick={() => {
                if (navigator.vibrate) {
                  navigator.vibrate(10);
                }
                onExperienceSelect(currentExperience);
              }}
              className="w-full bg-gradient-to-r from-[#390067] to-purple-700 text-white font-semibold text-base sm:text-lg py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all mb-2 sm:mb-3"
              style={{ fontFamily: 'Poppins', fontWeight: 600 }}
            >
              Explore & Book
            </button>

            <div className="flex items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/80" style={{ fontFamily: 'Poppins' }}>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {currentExperience.duration_hours}h</span>
              <span>•</span>
              <span>⭐ {currentExperience.rating} ({currentExperience.reviews_count})</span>
            </div>
          </div>

          <div className="absolute top-32 sm:top-36 right-4 sm:right-6 flex flex-col gap-3 sm:gap-4 z-20">
            <button
              onClick={handleSaveClick}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white/10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
            >
              <Heart
                className={`w-6 h-6 sm:w-7 sm:h-7 ${savedIds.has(currentExperience.id)
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
          experience={bookingExperience as any} // Casting for now as BookingSheet might need updates too
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
        experience={currentExperience as any}
      />
    </div>
  );
}
