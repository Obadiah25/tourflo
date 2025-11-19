import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock, Edit, Plus, Minus, AlertCircle, X, Check, Calendar } from 'lucide-react';
import { triggerHaptic } from '../../lib/gestures';

interface TimeSlot {
  id: string;
  tour_name: string;
  tour_id: string;
  date: string;
  time: string;
  current_bookings: number;
  max_bookings: number;
  waitlist_count: number;
}

export default function InventoryManagement() {
  const [slots, setSlots] = useState<TimeSlot[]>([
    {
      id: '1',
      tour_name: 'Everglades Airboat Adventure',
      tour_id: 'tour_1',
      date: '2025-11-18',
      time: '9:00 AM',
      current_bookings: 6,
      max_bookings: 8,
      waitlist_count: 2
    },
    {
      id: '2',
      tour_name: 'Key West Sunset Cruise',
      tour_id: 'tour_2',
      date: '2025-11-18',
      time: '11:00 AM',
      current_bookings: 8,
      max_bookings: 8,
      waitlist_count: 4
    },
    {
      id: '3',
      tour_name: 'Miami Beach Food Tour',
      tour_id: 'tour_3',
      date: '2025-11-18',
      time: '2:00 PM',
      current_bookings: 4,
      max_bookings: 12,
      waitlist_count: 0
    },
    {
      id: '4',
      tour_name: 'Everglades Airboat Adventure',
      tour_id: 'tour_1',
      date: '2025-11-18',
      time: '3:00 PM',
      current_bookings: 7,
      max_bookings: 8,
      waitlist_count: 0
    },
    {
      id: '5',
      tour_name: 'Key West Sunset Cruise',
      tour_id: 'tour_2',
      date: '2025-11-18',
      time: '6:00 PM',
      current_bookings: 5,
      max_bookings: 10,
      waitlist_count: 0
    }
  ]);

  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null);
  const [filter, setFilter] = useState<'all' | 'full' | 'available' | 'waitlist'>('all');

  const filteredSlots = slots.filter(slot => {
    if (filter === 'full') return slot.current_bookings >= slot.max_bookings;
    if (filter === 'available') return slot.current_bookings < slot.max_bookings;
    if (filter === 'waitlist') return slot.waitlist_count > 0;
    return true;
  });

  const handleUpdateCapacity = (slotId: string, newMax: number) => {
    if (newMax < 1) return;

    setSlots(slots.map(slot => {
      if (slot.id === slotId) {
        if (newMax < slot.current_bookings) {
          alert(`Cannot reduce capacity below current bookings (${slot.current_bookings})`);
          return slot;
        }
        return { ...slot, max_bookings: newMax };
      }
      return slot;
    }));
    triggerHaptic('medium');
  };

  const getCapacityPercentage = (current: number, max: number) => {
    return (current / max) * 100;
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 100) return 'red';
    if (percentage >= 75) return 'yellow';
    return 'green';
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col h-full">
        <div className="flex-shrink-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory</h1>
              <p className="text-gray-500">Manage tour capacity & waitlists</p>
            </div>
            <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-bold">LIVE SYNC</span>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {['all', 'available', 'full', 'waitlist'].map((f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f as any);
                  triggerHaptic('light');
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-florida-ocean text-white'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pb-32">
          <div className="space-y-3">
            {filteredSlots.map((slot) => {
              const percentage = getCapacityPercentage(slot.current_bookings, slot.max_bookings);
              const statusColor = getStatusColor(percentage);
              const spotsLeft = slot.max_bookings - slot.current_bookings;

              return (
                <motion.div
                  key={slot.id}
                  layout
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">{slot.tour_name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {slot.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            Today
                          </div>
                        </div>
                      </div>

                      {slot.waitlist_count > 0 && (
                        <div className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-xs font-bold">{slot.waitlist_count} waiting</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-600">
                            <span className="font-bold text-gray-900">{slot.current_bookings}</span> / {slot.max_bookings} booked
                          </div>
                          <div className={`text-xs font-bold ${
                            statusColor === 'red' ? 'text-red-600' :
                            statusColor === 'yellow' ? 'text-orange-600' :
                            'text-green-600'
                          }`}>
                            {spotsLeft === 0 ? 'FULL' : `${spotsLeft} spots left`}
                          </div>
                        </div>

                        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5 }}
                            className={`h-full ${
                              statusColor === 'red' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                              statusColor === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                              'bg-gradient-to-r from-green-500 to-green-600'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                        <div className="flex-1">
                          <div className="text-xs text-gray-500 mb-1">Max Capacity</div>
                          <div className="flex items-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUpdateCapacity(slot.id, slot.max_bookings - 1)}
                              disabled={slot.max_bookings <= slot.current_bookings}
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                slot.max_bookings <= slot.current_bookings
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-red-100 text-red-600 hover:bg-red-200'
                              }`}
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>

                            <div className="flex items-center gap-1.5 bg-gray-50 px-4 py-2 rounded-xl min-w-[80px] justify-center">
                              <Users className="w-4 h-4 text-gray-600" />
                              <span className="font-bold text-gray-900">{slot.max_bookings}</span>
                            </div>

                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleUpdateCapacity(slot.id, slot.max_bookings + 1)}
                              className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setEditingSlot(slot);
                            triggerHaptic('light');
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {slot.current_bookings >= slot.max_bookings && slot.waitlist_count > 0 && (
                    <div className="bg-orange-50 border-t border-orange-200 px-5 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-orange-800">
                        <AlertCircle className="w-4 h-4" />
                        <span className="font-medium">Tour full - notify waitlist if cancellations occur</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}

            {filteredSlots.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No slots found</h2>
                <p className="text-gray-500">Try adjusting your filter</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {editingSlot && (
          <EditSlotModal
            slot={editingSlot}
            onClose={() => setEditingSlot(null)}
            onSave={(updatedSlot) => {
              setSlots(slots.map(s => s.id === updatedSlot.id ? updatedSlot : s));
              setEditingSlot(null);
              triggerHaptic('success');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function EditSlotModal({
  slot,
  onClose,
  onSave
}: {
  slot: TimeSlot;
  onClose: () => void;
  onSave: (slot: TimeSlot) => void;
}) {
  const [maxCapacity, setMaxCapacity] = useState(slot.max_bookings);

  const handleSave = () => {
    if (maxCapacity < slot.current_bookings) {
      alert(`Cannot set capacity below current bookings (${slot.current_bookings})`);
      return;
    }
    onSave({ ...slot, max_bookings: maxCapacity });
  };

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
        className="bg-white rounded-t-3xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Edit Capacity</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">{slot.tour_name}</h3>
            <p className="text-sm text-gray-600">{slot.time}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="text-sm text-gray-500 mb-1">Current Bookings</div>
            <div className="text-3xl font-bold text-gray-900">{slot.current_bookings}</div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Maximum Capacity
            </label>

            <div className="flex items-center justify-center gap-4 bg-gray-50 rounded-2xl p-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMaxCapacity(Math.max(slot.current_bookings, maxCapacity - 1))}
                className="w-14 h-14 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Minus className="w-6 h-6" />
              </motion.button>

              <div className="bg-white border-2 border-gray-200 rounded-2xl px-8 py-4 min-w-[120px]">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900">{maxCapacity}</div>
                  <div className="text-xs text-gray-500 mt-1">guests</div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMaxCapacity(maxCapacity + 1)}
                className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg"
              >
                <Plus className="w-6 h-6" />
              </motion.button>
            </div>

            {maxCapacity < slot.current_bookings && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  Cannot reduce capacity below current bookings
                </div>
              </div>
            )}
          </div>

          {slot.waitlist_count > 0 && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-orange-800">
                  <div className="font-bold mb-1">{slot.waitlist_count} on waitlist</div>
                  <div>Increasing capacity will allow you to accept waitlisted guests</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={maxCapacity < slot.current_bookings}
            className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 ${
              maxCapacity < slot.current_bookings
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-florida-ocean to-florida-sunset text-white'
            }`}
          >
            <Check className="w-6 h-6" />
            Save Changes
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
