import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, AlertCircle, X, ChevronRight } from 'lucide-react';
import { triggerHaptic } from '../../lib/gestures';

interface TourSlot {
  id: string;
  tour_name: string;
  time: string;
  current_bookings: number;
  max_bookings: number;
  waitlist_count: number;
  guests: Array<{
    name: string;
    count: number;
    phone: string;
  }>;
  waitlist: Array<{
    name: string;
    count: number;
    phone: string;
    position: number;
  }>;
}

export default function InventoryStatus() {
  const [selectedSlot, setSelectedSlot] = useState<TourSlot | null>(null);
  const [showWaitlist, setShowWaitlist] = useState(false);

  const todaysSlots: TourSlot[] = [
    {
      id: '1',
      tour_name: 'Everglades Airboat Adventure',
      time: '9:00 AM',
      current_bookings: 6,
      max_bookings: 8,
      waitlist_count: 2,
      guests: [
        { name: 'John Smith', count: 4, phone: '+1 305-555-0123' },
        { name: 'Sarah Davis', count: 2, phone: '+1 305-555-0456' }
      ],
      waitlist: [
        { name: 'Mike Johnson', count: 2, phone: '+1 305-555-0789', position: 1 },
        { name: 'Lisa Brown', count: 1, phone: '+1 305-555-0321', position: 2 }
      ]
    },
    {
      id: '2',
      tour_name: 'Key West Sunset Cruise',
      time: '11:00 AM',
      current_bookings: 8,
      max_bookings: 8,
      waitlist_count: 4,
      guests: [
        { name: 'Emma Wilson', count: 3, phone: '+1 305-555-1111' },
        { name: 'David Lee', count: 2, phone: '+1 305-555-2222' },
        { name: 'Amy Chen', count: 3, phone: '+1 305-555-3333' }
      ],
      waitlist: [
        { name: 'Tom Harris', count: 2, phone: '+1 305-555-4444', position: 1 },
        { name: 'Jane Miller', count: 1, phone: '+1 305-555-5555', position: 2 },
        { name: 'Bob Taylor', count: 1, phone: '+1 305-555-6666', position: 3 }
      ]
    },
    {
      id: '3',
      tour_name: 'Miami Beach Food Tour',
      time: '2:00 PM',
      current_bookings: 4,
      max_bookings: 12,
      waitlist_count: 0,
      guests: [
        { name: 'Chris Anderson', count: 2, phone: '+1 305-555-7777' },
        { name: 'Maria Garcia', count: 2, phone: '+1 305-555-8888' }
      ],
      waitlist: []
    },
    {
      id: '4',
      tour_name: 'Everglades Airboat Adventure',
      time: '3:00 PM',
      current_bookings: 7,
      max_bookings: 8,
      waitlist_count: 0,
      guests: [
        { name: 'Robert King', count: 3, phone: '+1 305-555-9999' },
        { name: 'Nancy White', count: 4, phone: '+1 305-555-0000' }
      ],
      waitlist: []
    }
  ];

  const getCapacityStatus = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 100) return { color: 'red', label: 'FULL', urgency: 'high' };
    if (percentage >= 75) return { color: 'yellow', label: 'LIMITED', urgency: 'medium' };
    return { color: 'green', label: 'AVAILABLE', urgency: 'low' };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Today's Capacity</h2>
          <p className="text-sm text-gray-500">
            {todaysSlots.filter(s => s.current_bookings < s.max_bookings).length} slots available
          </p>
        </div>
        <div className="bg-gray-100 px-3 py-1.5 rounded-full text-xs font-bold text-gray-700">
          LIVE
        </div>
      </div>

      <div className="space-y-3">
        {todaysSlots.map((slot) => {
          const status = getCapacityStatus(slot.current_bookings, slot.max_bookings);
          const percentage = (slot.current_bookings / slot.max_bookings) * 100;

          return (
            <motion.div
              key={slot.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedSlot(slot);
                triggerHaptic('light');
              }}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{slot.tour_name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    {slot.time}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                  status.color === 'red' ? 'bg-red-100 text-red-700' :
                  status.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {status.label}
                </div>
              </div>

              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">
                    {slot.current_bookings}/{slot.max_bookings} booked
                  </span>
                  {slot.waitlist_count > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSlot(slot);
                        setShowWaitlist(true);
                        triggerHaptic('light');
                      }}
                      className="text-xs font-bold text-florida-ocean hover:underline flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3" />
                      {slot.waitlist_count} waitlist
                    </button>
                  )}
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      status.color === 'red' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                      status.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                      'bg-gradient-to-r from-green-500 to-green-600'
                    }`}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {slot.guests.length} bookings
                </div>
                <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedSlot && !showWaitlist && (
          <GuestListModal
            slot={selectedSlot}
            onClose={() => setSelectedSlot(null)}
            onViewWaitlist={() => setShowWaitlist(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedSlot && showWaitlist && (
          <WaitlistModal
            slot={selectedSlot}
            onClose={() => {
              setShowWaitlist(false);
              setSelectedSlot(null);
            }}
            onBack={() => setShowWaitlist(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function GuestListModal({
  slot,
  onClose,
  onViewWaitlist
}: {
  slot: TourSlot;
  onClose: () => void;
  onViewWaitlist: () => void;
}) {
  const totalGuests = slot.guests.reduce((sum, g) => sum + g.count, 0);

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
        className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{slot.tour_name}</h2>
            <p className="text-sm text-gray-500">{slot.time}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 mb-1">Capacity</div>
                <div className="text-2xl font-bold text-gray-900">
                  {slot.current_bookings}/{slot.max_bookings}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Total Guests</div>
                <div className="text-2xl font-bold text-gray-900">{totalGuests}</div>
              </div>
              {slot.waitlist_count > 0 && (
                <div>
                  <div className="text-sm text-gray-500 mb-1">Waitlist</div>
                  <div className="text-2xl font-bold text-florida-ocean">{slot.waitlist_count}</div>
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Confirmed Guests</h3>
            <div className="space-y-3">
              {slot.guests.map((guest, idx) => (
                <div key={idx} className="bg-white border border-gray-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-gray-900">{guest.name}</div>
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                      {guest.count} {guest.count === 1 ? 'guest' : 'guests'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{guest.phone}</div>
                </div>
              ))}
            </div>
          </div>

          {slot.waitlist_count > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onViewWaitlist}
              className="w-full bg-gradient-to-r from-florida-ocean to-florida-sunset text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
            >
              <AlertCircle className="w-6 h-6" />
              View Waitlist ({slot.waitlist_count})
            </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function WaitlistModal({
  slot,
  onClose,
  onBack
}: {
  slot: TourSlot;
  onClose: () => void;
  onBack: () => void;
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
        className="bg-white rounded-t-3xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 rotate-180" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Waitlist</h2>
              <p className="text-sm text-gray-500">{slot.tour_name} - {slot.time}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-orange-800">
              <div className="font-bold mb-1">Waitlist Active</div>
              <div>Tour is full. Contact guests when spots open up.</div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Waitlist Queue ({slot.waitlist_count})
          </h3>

          <div className="space-y-3">
            {slot.waitlist.map((person) => (
              <div key={person.position} className="bg-white border-2 border-orange-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {person.position}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-gray-900">{person.name}</div>
                      <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                        {person.count} {person.count === 1 ? 'guest' : 'guests'}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">{person.phone}</div>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full bg-florida-ocean text-white py-2 rounded-xl font-medium text-sm"
                    >
                      Contact Guest
                    </motion.button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
