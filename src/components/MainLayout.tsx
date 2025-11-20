import { useState, useEffect } from 'react';
import { Home, MessageCircle, Ticket, Heart } from 'lucide-react';
import DiscoveryFeed from './DiscoveryFeed';
import ChatScreen from './ChatScreen';
import TripsScreen from './TripsScreen';
import SavedScreen from './SavedScreen';
import ProfileScreen from './ProfileScreen';
import ExperienceDetailPage from './ExperienceDetailPage';
import BookingFlow from './BookingFlow';
import { LOOKYAH_LOGOS, LOGO_SIZES } from '../lib/branding';
import { useBooking } from '../contexts/BookingContext';

interface MainLayoutProps {
  session: any;
  onLogout: () => void;
  onNavigate?: (screen: any, params?: any) => void;
  navigationParams?: any;
}

type Screen = 'discover' | 'chat' | 'trips' | 'saved' | 'profile' | 'settings';

export default function MainLayout({ session, onLogout, onNavigate, navigationParams }: MainLayoutProps) {
  const { updateBookingData } = useBooking();
  const [activeScreen, setActiveScreen] = useState<Screen>('discover');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<any | null>(null);
  const [isBookingFlowOpen, setIsBookingFlowOpen] = useState(false);

  // Check for return params on mount
  useEffect(() => {
    if (navigationParams?.experience && !selectedExperience) {
      setSelectedExperience(navigationParams.experience);
      // If we were returning to book, we might want to auto-start booking or just show the detail page
      // For now, let's just show the detail page
    }
  }, [navigationParams]);

  const navItems = [
    { id: 'discover' as Screen, icon: Home, label: 'Discover', customIcon: null },
    { id: 'chat' as Screen, icon: MessageCircle, label: 'TourGuide', customIcon: 'avatar' },
    { id: 'trips' as Screen, icon: Ticket, label: 'My Trips', customIcon: null },
    { id: 'saved' as Screen, icon: Heart, label: 'Saved', customIcon: null },
  ];

  const handleNavigateToScreen = (screen: 'trips' | 'saved' | 'settings') => {
    if (screen === 'settings') {
      alert('Settings page coming soon!');
      return;
    }
    setActiveScreen(screen);
  };

  const handleStartBooking = (experienceData: any, date: string, guests: number, price: number) => {
    if (!session) {
      // Guest trying to book - redirect to auth
      if (onNavigate) {
        onNavigate('auth', {
          returnTo: 'main',
          experience: experienceData
        });
      } else {
        alert('Please sign in to book this experience.');
      }
      return;
    }

    const subtotal = price;
    const processingFee = Math.round(subtotal * 0.03 * 100) / 100;
    const discount = 0;
    const totalPrice = subtotal + processingFee - discount;

    updateBookingData({
      experience: experienceData,
      selectedDate: date,
      guestCount: guests,
      subtotal,
      processingFee,
      discount,
      totalPrice
    });
    setIsBookingFlowOpen(true);
  };

  if (isBookingFlowOpen) {
    return (
      <BookingFlow
        onClose={() => setIsBookingFlowOpen(false)}
        onNavigate={onNavigate}
      />
    );
  }

  if (selectedExperience) {
    return (
      <div className="fixed inset-0 overflow-y-auto">
        <ExperienceDetailPage
          experienceId={selectedExperience.id}
          initialExperience={selectedExperience}
          onBack={() => setSelectedExperience(null)}
          onBookingStart={handleStartBooking}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0">

      <div className="absolute inset-0">
        {activeScreen === 'discover' && (
          <DiscoveryFeed
            session={session}
            onBookingChange={setIsBookingOpen}
            onExperienceSelect={setSelectedExperience}
          />
        )}
        {activeScreen === 'chat' && <ChatScreen session={session} />}
        {activeScreen === 'trips' && <TripsScreen session={session} />}
        {activeScreen === 'saved' && <SavedScreen key="saved" session={session} />}
        {activeScreen === 'profile' && (
          <ProfileScreen
            session={session}
            onBack={() => setActiveScreen('discover')}
            onNavigate={handleNavigateToScreen}
            onLogout={onLogout}
          />
        )}
        {activeScreen === 'settings' && (
          <div className="fixed inset-0 bg-gradient-skysand flex flex-col">
            <header className="flex-shrink-0 bg-white shadow-md">
              <div className="flex items-center justify-between px-4 py-4">
                <button
                  onClick={() => setActiveScreen('profile')}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>Settings</h1>
                <div className="w-10" />
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-lg text-gray-700 mb-4">Settings page coming soon!</p>
                <button
                  onClick={() => setActiveScreen('profile')}
                  className="bg-[#390067] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#4D0085] transition-colors"
                >
                  Back to Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {activeScreen !== 'settings' && !isBookingOpen ? (
        <nav className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl px-4 sm:px-6 py-3 sm:py-4 shadow-2xl">
            <div className="flex items-center justify-around">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeScreen === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveScreen(item.id)}
                    className="flex flex-col items-center gap-1 transition-transform hover:scale-110"
                  >
                    {item.customIcon === 'avatar' ? (
                      <img
                        src={LOOKYAH_LOGOS.chatAvatarWhite}
                        alt="JAHBOI"
                        className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-lg"
                      />
                    ) : (
                      <Icon
                        className={`w-6 h-6 sm:w-7 sm:h-7 drop-shadow-lg ${isActive ? 'text-white' : 'text-white/70'
                          }`}
                        fill={isActive && item.id === 'discover' ? 'currentColor' : 'none'}
                      />
                    )}
                    <span className={`text-[10px] sm:text-xs drop-shadow-md ${isActive ? 'text-white font-semibold' : 'text-white/70'
                      }`}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      ) : (
        <nav className="absolute bottom-0 left-0 right-0 h-20 flex items-center justify-around px-4 z-50 safe-area-inset-bottom bg-white/95 backdrop-blur-sm border-t border-gray-200">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all ${isActive
                  ? 'nav-active'
                  : 'text-gray-400'
                  }`}
              >
                {item.customIcon === 'avatar' ? (
                  <img
                    src={LOOKYAH_LOGOS.chatAvatar}
                    alt="JAHBOI"
                    className={`${LOGO_SIZES.navIcon} rounded-full transition-all ${isActive ? 'ring-2 ring-[var(--accent-purple)] scale-110' : 'opacity-60'
                      }`}
                  />
                ) : (
                  <Icon
                    className={`w-6 h-6 transition-transform ${isActive ? 'text-[var(--accent-purple)] scale-110' : 'text-gray-400'
                      }`}
                  />
                )}
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
