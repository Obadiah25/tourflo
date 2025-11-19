import { useEffect, useState } from 'react';
import { Calendar, MapPin, QrCode, Navigation, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../lib/store';
import { haptics } from '../lib/haptics';

interface Booking {
  id: string;
  experience_id: string;
  booking_date: string;
  booking_time: string;
  group_size: number;
  total_price_jmd: number;
  total_price_usd: number;
  status: string;
  qr_code: string;
  experiences: {
    title: string;
    image_url: string;
    location_name: string;
  };
}

interface TripsScreenProps {
  session: any;
}

export default function TripsScreen({ session }: TripsScreenProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const { currency_pref } = useAppStore();

  useEffect(() => {
    if (session) {
      loadBookings();
    }
  }, [session, activeTab]);

  const loadBookings = async () => {
    const today = new Date().toISOString().split('T')[0];

    const query = supabase
      .from('bookings')
      .select('*, experiences(title, image_url, location_name)')
      .eq('user_id', session.user.id);

    if (activeTab === 'upcoming') {
      query.gte('booking_date', today);
    } else {
      query.lt('booking_date', today);
    }

    const { data } = await query.order('booking_date', { ascending: activeTab === 'upcoming' });

    if (data) {
      setBookings(data as any);
    }
  };

  const handleTabChange = (tab: 'upcoming' | 'past') => {
    haptics.light();
    setActiveTab(tab);
  };

  if (!session) {
    return (
      <div className="fixed inset-0 flex flex-col">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=1920)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

        <div className="relative z-10 flex items-center justify-center h-full px-6">
          <div className="text-center">
            <div className="text-7xl mb-6">🎫</div>
            <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-lg" style={{ fontFamily: 'Poppins' }}>
              Sign in to view trips
            </h2>
            <p className="text-lg text-white/90 drop-shadow-md">Create an account to book experiences</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/2246476/pexels-photo-2246476.jpeg?auto=compress&cs=tinysrgb&w=1920)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex-shrink-0 px-6 pt-6 pb-4">
          <h1
            className="text-3xl font-bold text-white drop-shadow-lg mb-4"
            style={{ fontFamily: 'Poppins', fontWeight: 700 }}
          >
            My Trips
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => handleTabChange('upcoming')}
              className={`flex-1 py-3 px-6 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-white text-[#390067] shadow-lg'
                  : 'bg-white/20 backdrop-blur-md border border-white/30 text-white'
              }`}
              style={{ fontFamily: 'Poppins' }}
            >
              UPCOMING
            </button>
            <button
              onClick={() => handleTabChange('past')}
              className={`flex-1 py-3 px-6 rounded-2xl font-semibold text-sm transition-all ${
                activeTab === 'past'
                  ? 'bg-white text-[#390067] shadow-lg'
                  : 'bg-white/20 backdrop-blur-md border border-white/30 text-white'
              }`}
              style={{ fontFamily: 'Poppins' }}
            >
              PAST
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {bookings.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-7xl mb-6">🌴😎</div>
                <h2
                  className="text-2xl font-bold text-white mb-4 drop-shadow-lg"
                  style={{ fontFamily: 'Poppins' }}
                >
                  {activeTab === 'upcoming' ? 'No trips yet!' : 'No past trips'}
                </h2>
                <p className="text-lg text-white/90 drop-shadow-md mb-6">
                  {activeTab === 'upcoming' ? "Let's fix that..." : 'Time to plan your next adventure!'}
                </p>
              </div>
            </div>
          ) : activeTab === 'upcoming' ? (
            <div className="space-y-4 py-4">
              {bookings.map((booking, index) => {
                const price = currency_pref === 'JMD'
                  ? `J$${(booking.total_price_jmd / 100).toFixed(2)}`
                  : `$${(booking.total_price_usd / 100).toFixed(2)} USD`;

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => { haptics.light(); setSelectedBooking(booking); }}
                    className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-3xl overflow-hidden shadow-2xl cursor-pointer hover:bg-white/20 transition-all"
                  >
                    <div
                      className="h-40 bg-cover bg-center relative"
                      style={{ backgroundImage: `url(${booking.experiences.image_url})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3
                          className="font-bold text-xl text-white drop-shadow-lg"
                          style={{ fontFamily: 'Poppins' }}
                        >
                          {booking.experiences.title}
                        </h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-sm text-white/90 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span className="drop-shadow-md">
                          {new Date(booking.booking_date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })} at {booking.booking_time}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-white/90 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="drop-shadow-md">{booking.experiences.location_name}</span>
                      </div>
                      <div className="flex items-center justify-between mb-4 text-white">
                        <span className="text-sm drop-shadow-md">{booking.group_size} {booking.group_size === 1 ? 'person' : 'people'}</span>
                        <span className="font-bold text-lg drop-shadow-md" style={{ fontFamily: 'Poppins' }}>{price}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); haptics.medium(); }}
                        className="w-full bg-white text-[#390067] font-semibold py-3 rounded-2xl hover:scale-[1.02] transition-transform shadow-lg"
                        style={{ fontFamily: 'Poppins' }}
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 py-4">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative rounded-3xl overflow-hidden shadow-2xl"
                >
                  <div
                    className="aspect-square bg-cover bg-center"
                    style={{ backgroundImage: `url(${booking.experiences.image_url})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <p className="text-white font-semibold text-sm mb-1 drop-shadow-lg">
                      {booking.experiences.title}
                    </p>
                    <p className="text-white/90 text-xs drop-shadow-md">
                      {new Date(booking.booking_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <button
                    onClick={() => haptics.light()}
                    className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-[#390067] text-xs font-medium px-3 py-1.5 rounded-full shadow-lg hover:scale-105 transition-transform"
                  >
                    Book Again
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setSelectedBooking(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl overflow-hidden w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-48 bg-cover bg-center" style={{ backgroundImage: `url(${selectedBooking.experiences.image_url})` }}>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
                  {selectedBooking.experiences.title}
                </h2>
                <div className="bg-gray-100 rounded-2xl p-4 mb-4 flex items-center justify-center">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-gray-600">Show this QR code at check-in</p>
                </div>
                <button
                  onClick={() => haptics.medium()}
                  className="w-full bg-gradient-to-r from-[#390067] to-purple-700 text-white font-semibold py-4 rounded-2xl shadow-lg hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  style={{ fontFamily: 'Poppins' }}
                >
                  <Navigation className="w-5 h-5" />
                  Get Directions
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
