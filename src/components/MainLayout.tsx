import { useState } from 'react';
import { Home, MessageCircle, Ticket, Heart, User } from 'lucide-react';
import DiscoveryFeed from './DiscoveryFeed';
import ChatScreen from './ChatScreen';
import TripsScreen from './TripsScreen';
import SavedScreen from './SavedScreen';
import ProfileScreen from './ProfileScreen';
import ExperienceDetailPage from './ExperienceDetailPage';
import GuestInfoScreen from './GuestInfoScreen';
import PaymentMethodScreen from './PaymentMethodScreen';
import CardPaymentScreen from './CardPaymentScreen';
import BookingConfirmationScreen from './BookingConfirmationScreen';
import { LOOKYAH_LOGOS, LOGO_SIZES } from '../lib/branding';
import { useBooking } from '../contexts/BookingContext';
import { supabase } from '../lib/supabase';

interface MainLayoutProps {
  session: any;
  onLogout: () => void;
}

type Screen = 'discover' | 'chat' | 'trips' | 'saved' | 'profile' | 'settings';
type BookingScreen = 'guest-info' | 'payment-method' | 'card-payment' | 'confirmation' | null;

export default function MainLayout({ session, onLogout }: MainLayoutProps) {
  const { bookingData, updateBookingData, resetBooking } = useBooking();
  const [activeScreen, setActiveScreen] = useState<Screen>('discover');
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedExperienceId, setSelectedExperienceId] = useState<string | null>(null);
  const [bookingScreen, setBookingScreen] = useState<BookingScreen>(null);

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
    setBookingScreen('guest-info');
  };

  const generateBookingReference = () => {
    const prefix = 'LYH';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const handleConfirmBooking = async () => {
    try {
      updateBookingData({ status: 'processing' });
      const bookingRef = generateBookingReference();
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateBookingData({
        bookingReference: bookingRef,
        status: 'confirmed'
      });
      setBookingScreen('confirmation');
    } catch (error) {
      console.error('Booking error:', error);
      updateBookingData({ status: 'failed' });
      alert('Booking failed. Please try again.');
    }
  };

  const handlePaymentComplete = async (paymentData: any) => {
    try {
      updateBookingData({ status: 'processing' });
      const bookingRef = generateBookingReference();
      await new Promise(resolve => setTimeout(resolve, 1500));
      updateBookingData({
        bookingReference: bookingRef,
        status: 'confirmed'
      });
      setBookingScreen('confirmation');
    } catch (error) {
      console.error('Payment error:', error);
      updateBookingData({ status: 'failed' });
      alert('Payment failed. Please try again.');
    }
  };

  if (bookingScreen === 'guest-info') {
    return (
      <GuestInfoScreen
        onBack={() => {
          setBookingScreen(null);
          setSelectedExperienceId(bookingData.experience?.id || null);
        }}
        onContinue={() => setBookingScreen('payment-method')}
      />
    );
  }

  if (bookingScreen === 'payment-method') {
    return (
      <PaymentMethodScreen
        onBack={() => setBookingScreen('guest-info')}
        onSelectPayment={(method) => {
          updateBookingData({ paymentMethod: method });
          if (method === 'cash') {
            handleConfirmBooking();
          } else {
            setBookingScreen('card-payment');
          }
        }}
      />
    );
  }

  if (bookingScreen === 'card-payment') {
    return (
      <CardPaymentScreen
        onBack={() => setBookingScreen('payment-method')}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

  if (bookingScreen === 'confirmation') {
    return (
      <BookingConfirmationScreen
        onBackToHome={() => {
          resetBooking();
          setBookingScreen(null);
          setSelectedExperienceId(null);
          setActiveScreen('discover');
        }}
      />
    );
  }

  if (selectedExperienceId) {
    return (
      <div className="fixed inset-0 overflow-y-auto">
        <ExperienceDetailPage
          experienceId={selectedExperienceId}
          onBack={() => setSelectedExperienceId(null)}
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
            onExperienceSelect={setSelectedExperienceId}
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
                        className={`w-6 h-6 sm:w-7 sm:h-7 drop-shadow-lg ${
                          isActive ? 'text-white' : 'text-white/70'
                        }`}
                        fill={isActive && item.id === 'discover' ? 'currentColor' : 'none'}
                      />
                    )}
                    <span className={`text-[10px] sm:text-xs drop-shadow-md ${
                      isActive ? 'text-white font-semibold' : 'text-white/70'
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
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'nav-active'
                    : 'text-gray-400'
                }`}
              >
                {item.customIcon === 'avatar' ? (
                  <img
                    src={LOOKYAH_LOGOS.chatAvatar}
                    alt="JAHBOI"
                    className={`${LOGO_SIZES.navIcon} rounded-full transition-all ${
                      isActive ? 'ring-2 ring-[var(--accent-purple)] scale-110' : 'opacity-60'
                    }`}
                  />
                ) : (
                  <Icon
                    className={`w-6 h-6 transition-transform ${
                      isActive ? 'text-[var(--accent-purple)] scale-110' : 'text-gray-400'
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
