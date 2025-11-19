import { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { X, Check, MessageCircle, MapPin, Users, Clock, Phone, Ban } from 'lucide-react';
import { triggerHaptic } from '../../lib/gestures';
import CancellationFlow from './CancellationFlow';

interface Booking {
  id: string;
  experience: string;
  guest: string;
  guestCount: number;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  image: string;
  phone: string;
  location: string;
  notes?: string;
  assignedGuide?: { id: string; name: string; photo?: string };
  email?: string;
  payment_status?: 'paid' | 'pending';
  payment_id?: string;
  total_amount?: number;
}

interface Guide {
  id: string;
  name: string;
  photo_url: string;
  is_available: boolean;
}

export default function BookingManagement() {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      experience: 'Dunn\'s River Falls Climb',
      guest: 'John Smith',
      guestCount: 4,
      date: '2025-10-20',
      time: '9:00 AM',
      status: 'pending',
      image: 'https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=800',
      phone: '+1 876-555-0123',
      location: 'Dunn\'s River Falls, Ocho Rios',
      notes: 'First time visitors, might need extra guidance'
    },
    {
      id: '2',
      experience: 'Blue Mountain Coffee Tour',
      guest: 'Sarah Johnson',
      guestCount: 2,
      date: '2025-10-21',
      time: '11:30 AM',
      status: 'pending',
      image: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=800',
      phone: '+1 876-555-0456',
      location: 'Blue Mountains, Kingston',
      notes: 'Vegetarian meal preferences'
    },
    {
      id: '3',
      experience: 'Luminous Lagoon Night Tour',
      guest: 'Mike Davis',
      guestCount: 6,
      date: '2025-10-22',
      time: '7:00 PM',
      status: 'pending',
      image: 'https://images.pexels.com/photos/3851256/pexels-photo-3851256.jpeg?auto=compress&cs=tinysrgb&w=800',
      phone: '+1 876-555-0789',
      location: 'Luminous Lagoon, Falmouth'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showGuideSelector, setShowGuideSelector] = useState(false);
  const [bookingToAssign, setBookingToAssign] = useState<Booking | null>(null);
  const [showCancellation, setShowCancellation] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const availableGuides: Guide[] = [
    {
      id: '1',
      name: 'Mike Rodriguez',
      photo_url: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400',
      is_available: true
    },
    {
      id: '2',
      name: 'Sarah Martinez',
      photo_url: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
      is_available: true
    }
  ];

  const handleApprove = (booking: Booking) => {
    if (!booking.assignedGuide) {
      setBookingToAssign(booking);
      setShowGuideSelector(true);
      triggerHaptic('light');
    } else {
      setBookings(bookings.filter(b => b.id !== booking.id));
      triggerHaptic('success');
    }
  };

  const handleAssignGuide = (guide: Guide) => {
    if (bookingToAssign) {
      const updatedBooking = {
        ...bookingToAssign,
        assignedGuide: {
          id: guide.id,
          name: guide.name,
          photo: guide.photo_url
        }
      };
      setBookings(bookings.map(b => b.id === bookingToAssign.id ? updatedBooking : b));
      setShowGuideSelector(false);
      setBookingToAssign(null);
      setBookings(bookings.filter(b => b.id !== bookingToAssign.id));
      triggerHaptic('success');
    }
  };

  const handleDecline = (id: string) => {
    setBookings(bookings.filter(b => b.id !== id));
    triggerHaptic('medium');
  };

  const handleCancelClick = (booking: Booking) => {
    setBookingToCancel(booking);
    setShowCancellation(true);
    setSelectedBooking(null);
    triggerHaptic('medium');
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="p-6 pb-32">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
          <p className="text-gray-500">{bookings.length} pending approval</p>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          {['all', 'today', 'upcoming', 'past'].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f as any);
                triggerHaptic('light');
              }}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === f
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">All caught up!</h2>
              <p className="text-gray-500">No pending bookings to review</p>
            </div>
          ) : (
            bookings.map((booking) => (
              <SwipeableBookingCard
                key={booking.id}
                booking={booking}
                onApprove={() => handleApprove(booking)}
                onDecline={() => handleDecline(booking.id)}
                onTap={() => setSelectedBooking(booking)}
              />
            ))
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedBooking && (
          <BookingDetailModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onApprove={() => {
              handleApprove(selectedBooking);
              setSelectedBooking(null);
            }}
            onDecline={() => {
              handleDecline(selectedBooking.id);
              setSelectedBooking(null);
            }}
            onCancel={handleCancelClick}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showGuideSelector && bookingToAssign && (
          <GuideSelectionModal
            guides={availableGuides}
            onSelect={handleAssignGuide}
            onClose={() => {
              setShowGuideSelector(false);
              setBookingToAssign(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCancellation && bookingToCancel && (
          <CancellationFlow
            booking={{
              ...bookingToCancel,
              email: `${bookingToCancel.guest.toLowerCase().replace(' ', '.')}@email.com`,
              payment_status: 'paid',
              total_amount: 12000
            }}
            onClose={() => {
              setShowCancellation(false);
              setBookingToCancel(null);
            }}
            onComplete={() => {
              setBookings(bookings.filter(b => b.id !== bookingToCancel.id));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SwipeableBookingCard({
  booking,
  onApprove,
  onDecline,
  onTap
}: {
  booking: Booking;
  onApprove: () => void;
  onDecline: () => void;
  onTap: () => void;
}) {
  const x = useMotionValue(0);
  const rotateZ = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const approveOpacity = useTransform(x, [0, 100], [0, 1]);
  const declineOpacity = useTransform(x, [-100, 0], [1, 0]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      style={{ x, rotateZ, opacity }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 150) {
          onApprove();
        } else if (info.offset.x < -150) {
          onDecline();
        }
      }}
      onClick={onTap}
      className="relative cursor-pointer"
    >
      <motion.div
        style={{ opacity: declineOpacity }}
        className="absolute inset-0 bg-red-500 rounded-3xl flex items-center justify-start px-8"
      >
        <X className="w-12 h-12 text-white" />
      </motion.div>

      <motion.div
        style={{ opacity: approveOpacity }}
        className="absolute inset-0 bg-green-500 rounded-3xl flex items-center justify-end px-8"
      >
        <Check className="w-12 h-12 text-white" />
      </motion.div>

      <div className="relative bg-white rounded-3xl overflow-hidden shadow-lg">
        <div className="relative h-48">
          <img
            src={booking.image}
            alt={booking.experience}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white font-bold text-xl mb-2">{booking.experience}</h3>
            <div className="flex items-center gap-4 text-white/90 text-sm mb-2">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {booking.time}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {booking.guestCount} guests
              </div>
            </div>
            {booking.assignedGuide ? (
              <div className="flex items-center gap-2 bg-green-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
                <img src={booking.assignedGuide.photo} className="w-5 h-5 rounded-full" />
                <span className="text-xs font-medium text-white">Guide: {booking.assignedGuide.name}</span>
              </div>
            ) : (
              <div className="bg-red-500/90 backdrop-blur-sm px-3 py-1.5 rounded-full w-fit">
                <span className="text-xs font-bold text-white">⚠ Assign Guide</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-gray-900 text-lg">{booking.guest}</p>
              <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
            </div>
            <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-bold">
              Pending
            </div>
          </div>

          {booking.assignedGuide && (
            <div className="bg-green-50 rounded-2xl p-3 mb-4 flex items-center gap-3">
              <img src={booking.assignedGuide.photo} className="w-10 h-10 rounded-full" />
              <div>
                <div className="text-xs text-green-600 font-medium">Assigned Guide</div>
                <div className="text-sm font-bold text-gray-900">{booking.assignedGuide.name}</div>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-500 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {booking.location}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BookingDetailModal({
  booking,
  onClose,
  onApprove,
  onDecline,
  onCancel
}: {
  booking: Booking;
  onClose: () => void;
  onApprove: () => void;
  onDecline: () => void;
  onCancel: (booking: Booking) => void;
}) {
  const [showCancelButton, setShowCancelButton] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Booking Details</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="relative h-64 rounded-3xl overflow-hidden">
            <img
              src={booking.image}
              alt={booking.experience}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <h3 className="text-white font-bold text-2xl">{booking.experience}</h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="text-sm text-gray-500 mb-1">Guest</div>
              <div className="text-lg font-bold text-gray-900">{booking.guest}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="text-sm text-gray-500 mb-1">Date</div>
                <div className="font-bold text-gray-900">
                  {new Date(booking.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="text-sm text-gray-500 mb-1">Time</div>
                <div className="font-bold text-gray-900">{booking.time}</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="text-sm text-gray-500 mb-1">Guests</div>
              <div className="font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5" />
                {booking.guestCount} people
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="text-sm text-gray-500 mb-1">Contact</div>
              <div className="font-bold text-gray-900 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {booking.phone}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <div className="text-sm text-gray-500 mb-1">Location</div>
              <div className="font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {booking.location}
              </div>
            </div>

            {booking.notes && (
              <div className="bg-blue-50 rounded-2xl p-4">
                <div className="text-sm text-blue-600 mb-1">Special Notes</div>
                <div className="text-gray-900">{booking.notes}</div>
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onDecline}
            className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
          >
            <X className="w-6 h-6" />
            Decline
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onApprove}
            className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
          >
            <Check className="w-6 h-6" />
            Approve
          </motion.button>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-6 h-6" />
            WhatsApp Guest
          </motion.button>

          {!showCancelButton ? (
            <button
              onClick={() => setShowCancelButton(true)}
              className="w-full text-red-600 py-3 text-sm font-medium hover:underline"
            >
              Cancel this booking
            </button>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCancel(booking)}
              className="w-full bg-red-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <Ban className="w-6 h-6" />
              Confirm Cancellation
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function GuideSelectionModal({
  guides,
  onSelect,
  onClose
}: {
  guides: Guide[];
  onSelect: (guide: Guide) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-white rounded-t-3xl w-full max-h-[70vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Select Guide</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {guides.map((guide) => (
            <motion.button
              key={guide.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(guide)}
              className="w-full bg-white border-2 border-gray-200 rounded-3xl p-5 flex items-center gap-4 hover:border-florida-ocean transition-all"
            >
              <img
                src={guide.photo_url}
                alt={guide.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1 text-left">
                <h3 className="font-bold text-gray-900 text-lg">{guide.name}</h3>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                  guide.is_available
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  <div className="w-2 h-2 bg-current rounded-full" />
                  {guide.is_available ? 'Available' : 'Unavailable'}
                </div>
              </div>
              <Check className="w-6 h-6 text-florida-ocean" />
            </motion.button>
          ))}

          {guides.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🧑‍🏫</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Guides Available</h3>
              <p className="text-gray-500">Add guides to assign them to bookings</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
