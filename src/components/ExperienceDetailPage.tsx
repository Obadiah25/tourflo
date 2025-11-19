import { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Share2, Heart, MapPin, Star, Play, Clock, Sunset, Car, Coffee, User, Camera, UtensilsCrossed, DollarSign, Award, MessageCircle, ThumbsUp, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../lib/store';
import { haptics } from '../lib/haptics';
import { supabase } from '../lib/supabase';

interface Experience {
  id: string;
  title: string;
  description: string;
  image_url: string;
  video_url: string | null;
  price_jmd: number;
  price_usd: number;
  location_name: string;
  category: string;
  duration_minutes: number;
  operator_id: string;
}

interface Operator {
  id: string;
  name: string;
  whatsapp: string | null;
  verified: boolean;
}

interface ExperienceDetailPageProps {
  experienceId: string;
  onBack: () => void;
  onBookingStart?: (experienceData: any, date: string, guests: number, price: number) => void;
}

type CardType = 'hero' | '360' | 'timeline' | 'guide' | 'social-proof' | 'reviews' | 'included' | 'booking';

interface Card {
  id: string;
  type: CardType;
  title: string;
}

export default function ExperienceDetailPage({ experienceId, onBack, onBookingStart }: ExperienceDetailPageProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [operator, setOperator] = useState<Operator | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [peopleCount, setPeopleCount] = useState(2);
  const [showHint, setShowHint] = useState(true);
  const { currency_pref } = useAppStore();

  const cards: Card[] = [
    { id: 'hero', type: 'hero', title: 'Hero' },
    { id: 'preview', type: '360', title: '360° Preview' },
    { id: 'timeline', type: 'timeline', title: 'Timeline' },
    { id: 'guide', type: 'guide', title: 'Guide' },
    { id: 'bookings', type: 'social-proof', title: 'Live Bookings' },
    { id: 'reviews', type: 'reviews', title: 'Reviews' },
    { id: 'included', type: 'included', title: "What's Included" },
    { id: 'book', type: 'booking', title: 'Book' }
  ];

  useEffect(() => {
    loadExperience();
  }, [experienceId]);

  useEffect(() => {
    const hasSeenHint = localStorage.getItem('seen_card_swipe_hint');
    if (hasSeenHint) {
      setShowHint(false);
    }
  }, []);

  useEffect(() => {
    if (currentCard > 0) {
      setShowHint(false);
      localStorage.setItem('seen_card_swipe_hint', 'true');
    }
  }, [currentCard]);

  useEffect(() => {
    if (showHint) {
      const timer = setTimeout(() => {
        setShowHint(false);
        localStorage.setItem('seen_card_swipe_hint', 'true');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showHint]);

  const loadExperience = async () => {
    try {
      console.log('🔍 Loading experience:', experienceId);

      const { data: expData, error: expError } = await supabase
        .from('experiences')
        .select('*')
        .eq('id', experienceId)
        .maybeSingle();

      if (expError) {
        console.error('❌ Error loading experience:', expError);
        throw expError;
      }

      if (!expData) {
        console.error('❌ No experience found with id:', experienceId);
        setLoading(false);
        return;
      }

      console.log('✅ Experience loaded:', expData.title);
      setExperience(expData);

      if (expData.operator_id) {
        const { data: opData, error: opError } = await supabase
          .from('operators')
          .select('*')
          .eq('id', expData.operator_id)
          .maybeSingle();

        if (opError) {
          console.error('⚠️ Error loading operator:', opError);
        } else if (opData) {
          console.log('✅ Operator loaded:', opData.name);
          setOperator(opData);
        }
      }
    } catch (error) {
      console.error('💥 Error in loadExperience:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = (direction: 'next' | 'prev') => {
    if (navigator.vibrate) navigator.vibrate(10);

    if (direction === 'next' && currentCard < cards.length - 1) {
      setCurrentCard(prev => prev + 1);
    }
    if (direction === 'prev' && currentCard > 0) {
      setCurrentCard(prev => prev - 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedUp: () => {
      if (currentCard < cards.length - 1) {
        handleSwipe('next');
      }
    },
    onSwipedDown: () => {
      if (currentCard > 0) {
        handleSwipe('prev');
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
    trackTouch: true,
    delta: 40,
    swipeDuration: 500,
    touchEventOptions: { passive: false }
  });

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleSwipe('next');
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handleSwipe('prev');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentCard]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#0077BE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading experience...</p>
        </div>
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-200 via-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">Experience not found</p>
          <button
            onClick={onBack}
            className="bg-[#0077BE] text-white px-6 py-3 rounded-full font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const price = `$${(experience.price_usd / 100).toFixed(0)} USD`;

  const totalPrice = (experience.price_usd / 100) * peopleCount;

  const categoryEmoji = {
    chill: '😎',
    adventure: '🏄',
    party: '🎉',
    foodie: '🍽️',
    fishing: '🎣',
    boating: '⛵',
    surfing: '🏄',
    watersports: '🚤',
    nature: '🌿',
    dining: '🍽️',
    culture: '🏛️',
    climbing: '🧗',
    tours: '🚌',
  }[experience.category.toLowerCase()] || '🎣';

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Animated Background */}
      <div
        className="fixed inset-0 bg-gradient-to-b from-sky-200 via-amber-50 to-yellow-100"
      />

      {/* Progress Dots */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black/30 backdrop-blur-md rounded-full px-5 py-2.5 flex items-center gap-2.5">
        {cards.map((card, index) => (
          <button
            key={index}
            onClick={() => setCurrentCard(index)}
            className={`transition-all rounded-full ${
              index === currentCard
                ? 'w-10 h-2.5 bg-[#0077BE]'
                : index < currentCard
                ? 'w-2.5 h-2.5 bg-white/70'
                : 'w-2.5 h-2.5 bg-white/40'
            }`}
            aria-label={`Go to ${card.title}`}
          />
        ))}
      </div>

      {/* Card Stack Container */}
      <div className="relative h-screen flex items-center justify-center p-3 sm:p-4" {...handlers}>
        {cards.map((card, index) => {
          const offset = index - currentCard;
          const isVisible = offset >= 0 && offset < 3;
          const isActive = offset === 0;

          return isVisible && (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: offset === 0 ? 1 : 0.5,
                scale: 1 - offset * 0.06,
                zIndex: 50 - offset,
              }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute bg-white rounded-3xl shadow-2xl overflow-hidden"
              style={{
                left: `${12 + offset * 6}px`,
                right: `${12 + offset * 6}px`,
                top: `${72 + offset * 12}px`,
                bottom: `${88 + offset * 12}px`,
                pointerEvents: offset === 0 ? 'auto' : 'none'
              }}
            >
              {isActive && (
                <div className="h-full overflow-y-auto scrollbar-hide" style={{
                  WebkitOverflowScrolling: 'touch',
                  scrollBehavior: 'smooth'
                }}>
                  {renderCardContent(card.type, experience, operator, price, peopleCount, setPeopleCount, totalPrice, categoryEmoji, isSaved, setIsSaved, onBookingStart)}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* First-time Hint */}
      {currentCard === 0 && showHint && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="fixed bottom-32 left-0 right-0 flex justify-center z-40 pointer-events-none"
        >
          <div className="bg-black/70 backdrop-blur-md rounded-full px-6 py-3 text-white text-sm font-medium shadow-xl flex items-center gap-2 animate-bounce-subtle">
            <span>Swipe up to explore</span>
          </div>
        </motion.div>
      )}

      {/* Bottom Controls */}
      <div className="fixed bottom-6 sm:bottom-8 left-4 sm:left-6 right-4 sm:right-6 z-40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-11 h-11 sm:w-12 sm:h-12 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {currentCard > 0 && (
            <button
              onClick={() => handleSwipe('prev')}
              className="w-12 h-12 sm:w-14 sm:h-14 bg-white/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-all"
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-800" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          )}
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-md">
          <p className="text-sm font-semibold text-gray-800">{currentCard + 1}/{cards.length}</p>
        </div>

        {currentCard < cards.length - 1 ? (
          <button
            onClick={() => handleSwipe('next')}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-[#0077BE]/95 backdrop-blur-md rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
            style={{
              animation: 'bounce-pulse 2s ease-in-out infinite'
            }}
          >
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>
    </div>
  );
}

function renderCardContent(
  type: CardType,
  experience: Experience,
  operator: Operator | null,
  price: string,
  peopleCount: number,
  setPeopleCount: (count: number) => void,
  totalPrice: number,
  categoryEmoji: string,
  isSaved: boolean,
  setIsSaved: (saved: boolean) => void,
  onBookingStart?: (experienceData: any, date: string, guests: number, price: number) => void
) {
  switch (type) {
    case 'hero':
      return <HeroCard experience={experience} price={price} categoryEmoji={categoryEmoji} isSaved={isSaved} setIsSaved={setIsSaved} />;
    case '360':
      return <Preview360Card />;
    case 'timeline':
      return <TimelineCard />;
    case 'guide':
      return <GuideCard operator={operator} />;
    case 'social-proof':
      return <LiveBookingsCard />;
    case 'reviews':
      return <ReviewsCard />;
    case 'included':
      return <WhatsIncludedCard />;
    case 'booking':
      return <BookingCard price={price} peopleCount={peopleCount} setPeopleCount={setPeopleCount} totalPrice={totalPrice} experience={experience} onBookingStart={onBookingStart} />;
    default:
      return null;
  }
}

function HeroCard({ experience, price, categoryEmoji, isSaved, setIsSaved }: any) {
  return (
    <div className="relative h-full flex flex-col">
      <div className="relative h-1/2 -m-4 sm:-m-6 mb-0 rounded-t-3xl overflow-hidden">
        <img src={experience.image_url} alt={experience.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#0077BE]/90 backdrop-blur-md px-4 py-2 rounded-full">
          <p className="text-white text-sm font-semibold">Tap for 360° View</p>
        </div>

        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
            <Share2 className="w-5 h-5 text-gray-800" />
          </button>
          <button
            onClick={() => {
              haptics.light();
              setIsSaved(!isSaved);
            }}
            className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-800'}`} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between p-4 sm:p-6">
        <div className="flex gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-[#0077BE]">
            {experience.category}
          </span>
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight" style={{ fontFamily: 'Poppins', fontWeight: 700 }}>
            {experience.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900">4.9</span>
              <span>(1,243)</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {experience.location_name} County
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-4xl font-bold text-gray-900">{price}</span>
            <span className="text-sm text-gray-500">per person</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium">17 spots left today</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Preview360Card() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-6">
      <div className="mb-8">
        <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
          <Play className="w-16 h-16 text-purple-600" strokeWidth={2} />
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins', fontWeight: 700 }}>
        Step Inside Rick's Cafe
      </h2>

      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Explore every angle in immersive 360°. No VR headset needed!
      </p>

      <button className="bg-gradient-to-r from-[#0077BE] to-[#FF6B35] text-white font-bold text-lg px-10 py-3 rounded-xl shadow-xl inline-flex items-center gap-3 hover:scale-105 transition-transform">
        <span>Launch 360° View</span>
        <Play className="w-6 h-6" strokeWidth={2} />
      </button>

      <p className="text-sm text-gray-500 mt-8">
        Swipe up to continue exploring →
      </p>
    </div>
  );
}

function TimelineCard() {
  const timeline = [
    {
      time: '5:30 PM',
      title: 'Arrival & Welcome',
      description: 'Hotel pickup. Enjoy complimentary rum punch.',
      image: 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Coffee
    },
    {
      time: '6:00 PM',
      title: 'Cliff Diving',
      description: 'Watch divers plunge 35 feet. Jump yourself if you dare!',
      image: 'https://images.pexels.com/photos/163872/italy-cala-gonone-air-sky-163872.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: MapPin
    },
    {
      time: '6:45 PM',
      title: 'Sunset Views',
      description: "Caribbean's most breathtaking sunset. THE moment!",
      image: 'https://images.pexels.com/photos/1118874/pexels-photo-1118874.jpeg?auto=compress&cs=tinysrgb&w=800',
      icon: Sunset
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 sticky top-0 bg-white pb-4 z-10" style={{ fontFamily: 'Poppins', fontWeight: 700 }}>
        Your Evening at Rick's
      </h2>

      <div className="space-y-6">
        {timeline.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-20 text-right pt-1">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg mb-2">
                  <Clock className="w-6 h-6 text-[#0077BE]" strokeWidth={2} />
                </div>
                <p className="text-sm font-bold text-[#0077BE]">{item.time}</p>
              </div>
              <div className="flex-1">
                <div className="relative h-40 rounded-xl overflow-hidden mb-3 shadow-lg">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-2 left-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg p-1.5 shadow-lg">
                      <IconComponent className="w-full h-full text-white" strokeWidth={2} />
                    </div>
                    <p className="text-white font-bold">{item.title}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm">{item.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function GuideCard({ operator }: any) {
  return (
    <div className="flex flex-col h-full justify-center p-4 sm:p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center" style={{ fontFamily: 'Poppins', fontWeight: 700 }}>
        Meet Your Guide
      </h2>

      <div className="bg-gradient-to-br from-sky-200 via-amber-50 to-yellow-100 rounded-2xl p-6 mb-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
              <img src="https://i.pravatar.cc/300?img=12" alt="Marcus Thompson" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-2">{operator?.name || 'Marcus Thompson'}</h3>
          <p className="text-gray-700 mb-4">
            Born in Negril • 8 years guiding
          </p>

          <div className="flex gap-2 mb-4">
            <span className="px-3 py-1 bg-white/60 rounded-full text-sm font-medium flex items-center gap-1.5">
              <div className="w-5 h-5 bg-white/10 backdrop-blur-md rounded-lg p-0.5 shadow-lg">
                <Star className="w-full h-full text-yellow-600" strokeWidth={2} fill="currentColor" />
              </div>
              4.9
            </span>
            <span className="px-3 py-1 bg-white/60 rounded-full text-sm font-medium flex items-center gap-1.5">
              <div className="w-5 h-5 bg-white/10 backdrop-blur-md rounded-lg p-0.5 shadow-lg">
                <Award className="w-full h-full text-purple-600" strokeWidth={2} />
              </div>
              500+ Tours
            </span>
          </div>

          <p className="text-gray-800 italic text-sm mb-4">
            "I love showing visitors the real Jamaica! Can't wait to share this sunset with you!"
          </p>

          <button className="bg-white text-[#0077BE] font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
            <div className="w-5 h-5 bg-white/10 backdrop-blur-md rounded-lg p-0.5 shadow-lg">
              <MessageCircle className="w-full h-full text-[#0077BE]" strokeWidth={2} />
            </div>
            Chat with Guide
          </button>
        </div>
      </div>
    </div>
  );
}

function LiveBookingsCard() {
  const bookings = [
    { name: 'Sarah', country: 'USA', flag: '🇺🇸', spots: 2, time: '5 min ago', gradient: 'from-purple-400 to-pink-400', bg: 'from-purple-50 to-pink-50' },
    { name: 'James', country: 'UK', flag: '🇬🇧', spots: 4, time: '12 min ago', gradient: 'from-blue-400 to-green-400', bg: 'from-blue-50 to-green-50' },
    { name: 'Maria', country: 'Canada', flag: '🇨🇦', spots: 3, time: '18 min ago', gradient: 'from-yellow-400 to-orange-400', bg: 'from-yellow-50 to-orange-50' }
  ];

  return (
    <div className="flex flex-col h-full justify-center p-4 sm:p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center" style={{ fontFamily: 'Poppins', fontWeight: 700 }}>
        Booking Right Now
      </h2>
      <p className="text-gray-600 text-center mb-8">People love this experience!</p>

      <div className="space-y-3 mb-8">
        {bookings.map((booking, index) => (
          <div key={index} className={`bg-gradient-to-r ${booking.bg} rounded-xl p-4 flex items-center gap-3 shadow-md`}>
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${booking.gradient} flex items-center justify-center text-white font-bold`}>
              {booking.name.substring(0, 2)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{booking.name} from {booking.country} {booking.flag}</p>
              <p className="text-sm text-gray-600">Booked {booking.spots} spots • {booking.time}</p>
            </div>
            <div className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-lg p-1.5 shadow-lg">
              <UserCheck className="w-full h-full text-green-600" strokeWidth={2} />
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-[#0077BE] font-bold text-lg mb-2">
          8 people viewing right now
        </p>
        <p className="text-sm text-gray-600">
          Don't miss out on this popular experience!
        </p>
      </div>
    </div>
  );
}

function ReviewsCard() {
  const reviews = [
    {
      name: 'Sarah Mitchell',
      location: 'New York, USA 🇺🇸',
      time: '2 days ago',
      rating: 5,
      text: 'This was INCREDIBLE! Marcus was the best guide. The sunset was unreal. We even jumped! 😱 Book this NOW!',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      name: 'James Chen',
      location: 'Toronto, Canada 🇨🇦',
      time: '1 week ago',
      rating: 5,
      text: 'Honeymoon highlight! The sunset was magical. Marcus made us feel like family! 💍',
      gradient: 'from-blue-400 to-green-400'
    },
    {
      name: 'Emma Wilson',
      location: 'London, UK 🇬🇧',
      time: '2 weeks ago',
      rating: 5,
      text: 'Best experience in Jamaica! The cliff diving was thrilling and the atmosphere was amazing!',
      gradient: 'from-yellow-400 to-orange-400'
    }
  ];

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <div className="text-center mb-6 sticky top-0 bg-white pb-4 z-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins', fontWeight: 700 }}>
          1,243 Happy Adventurers
        </h2>
        <div className="flex items-center justify-center gap-2 text-xl text-gray-600">
          <Star className="w-5 h-5 text-yellow-400" strokeWidth={2} fill="currentColor" />
          <span>4.9 out of 5 stars</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="bg-gray-50 rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${review.gradient}`}></div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <span className="text-xs text-gray-500">{review.time}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{review.location}</p>
                <div className="flex gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400" strokeWidth={2} fill="currentColor" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-gray-800 leading-relaxed text-sm mb-3">
              "{review.text}"
            </p>
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <div className="w-5 h-5 bg-white/10 backdrop-blur-md rounded-lg p-0.5 shadow-lg">
                <ThumbsUp className="w-full h-full" strokeWidth={2} />
              </div>
              <span>Helpful</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhatsIncludedCard() {
  const included = [
    { icon: Car, title: 'Round-trip transport', desc: 'Hotel pickup included', color: 'text-blue-600' },
    { icon: Coffee, title: 'Welcome drink', desc: 'Rum punch or Red Stripe', color: 'text-amber-600' },
    { icon: User, title: 'Expert guide', desc: 'Local stories & history', color: 'text-purple-600' },
    { icon: Camera, title: 'Photo ops', desc: 'Group & individual photos', color: 'text-pink-600' }
  ];

  const notIncluded = [
    { icon: UtensilsCrossed, title: 'Food & drinks', desc: 'Meals $15-30 USD', color: 'text-gray-600' },
    { icon: DollarSign, title: 'Gratuities', desc: 'Optional (10-15%)', color: 'text-gray-600' }
  ];

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 sticky top-0 bg-white pb-4 z-10 text-center" style={{ fontFamily: 'Poppins', fontWeight: 700 }}>
        What's Included
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center gap-2">
            <span>Included</span>
          </h3>
          <div className="space-y-3">
            {included.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-start gap-3 bg-green-50 rounded-xl p-3">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg flex-shrink-0">
                    <IconComponent className={`w-6 h-6 ${item.color}`} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-bold text-gray-600 mb-4 flex items-center gap-2">
            <span>Not Included</span>
          </h3>
          <div className="space-y-3">
            {notIncluded.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl p-3 shadow-lg flex-shrink-0">
                    <IconComponent className={`w-6 h-6 ${item.color}`} strokeWidth={2} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingCard({ price, peopleCount, setPeopleCount, totalPrice, experience, onBookingStart }: any) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const handleConfirmBooking = () => {
    if (onBookingStart && experience) {
      const experienceData = {
        id: experience.id,
        title: experience.title,
        location: experience.location_name,
        price: price,
        image: experience.image_url,
        duration: `${Math.floor(experience.duration_minutes / 60)}h ${experience.duration_minutes % 60}m`,
        host: {
          name: 'Local Guide',
          phone: '18765551234',
          avatar: '/logos/jahboismall.png'
        }
      };
      onBookingStart(experienceData, selectedDate, peopleCount, totalPrice);
    }
  };

  return (
    <div className="flex flex-col h-full justify-center p-4 sm:p-6">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins', fontWeight: 700 }}>
          Book Your Spot
        </h2>
        <p className="text-gray-600">Secure your place at Rick's Cafe</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#0077BE] focus:outline-none"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Guests</label>
        <div className="flex items-center justify-center gap-6 bg-gray-50 rounded-xl py-4">
          <button
            onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
            className="w-12 h-12 rounded-full bg-white shadow-md font-bold text-2xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            −
          </button>
          <span className="text-3xl font-bold text-gray-900">{peopleCount}</span>
          <button
            onClick={() => setPeopleCount(peopleCount + 1)}
            className="w-12 h-12 rounded-full bg-white shadow-md font-bold text-2xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            +
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total ({peopleCount} {peopleCount === 1 ? 'guest' : 'guests'})</p>
            <p className="text-4xl font-bold text-gray-900">${totalPrice.toFixed(0)} <span className="text-lg font-normal text-gray-600">USD</span></p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-sm mb-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">17 spots left</span>
            </div>
            <p className="text-xs text-gray-500">Book now to secure</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleConfirmBooking}
        className="w-full bg-gradient-to-r from-[#0077BE] to-[#FF6B35] text-white font-bold text-xl py-5 rounded-xl shadow-2xl hover:shadow-[#0077BE]/50 transition-all active:scale-98 mb-4"
      >
        Confirm Booking →
      </button>

      <p className="text-center text-sm text-gray-500">
        Free cancellation up to 24 hours before
      </p>
    </div>
  );
}
