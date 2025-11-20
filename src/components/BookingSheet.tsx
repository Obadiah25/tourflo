import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Calendar, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAppStore } from '../lib/store';

interface BookingSheetProps {
  experience: any;
  session: any;
  onClose: () => void;
}

export default function BookingSheet({ experience, session, onClose }: BookingSheetProps) {
  const [step, setStep] = useState<'booking' | 'processing' | 'success' | 'waitlist'>('booking');
  const [selectedDay, setSelectedDay] = useState('today');
  const [selectedTime, setSelectedTime] = useState('12pm');
  const [groupSize, setGroupSize] = useState(2);
  const [, setQrCode] = useState<string>('');
  const [isWaitlist, setIsWaitlist] = useState(false);
  const { currency_pref } = useAppStore();

  const timeSlotCapacity: Record<string, { current: number; max: number }> = {
    '9am': { current: 6, max: 8 },
    '12pm': { current: 8, max: 8 },
    '3pm': { current: 4, max: 12 },
    '6pm': { current: 7, max: 8 }
  };

  const currentCapacity = timeSlotCapacity[selectedTime];
  const spotsLeft = currentCapacity.max - currentCapacity.current;
  const isFull = spotsLeft <= 0;

  // Always use USD
  const totalUSD = experience.price_usd * groupSize;
  const displayPrice = `$${(totalUSD / 100).toFixed(2)} USD`;

  const handleBook = async () => {
    if (!session) {
      alert('Please sign in to book');
      return;
    }

    setStep('processing');

    const bookingDate = new Date();
    if (selectedDay === 'tomorrow') {
      bookingDate.setDate(bookingDate.getDate() + 1);
    }

    const qrData = `TOURFLO-${Date.now()}-${experience.id}`;

    const { data, error } = await supabase.from('bookings').insert({
      user_id: session.user.id,
      experience_id: experience.id,
      booking_date: bookingDate.toISOString().split('T')[0],
      booking_time: selectedTime,
      group_size: groupSize,
      total_price_usd: totalUSD,
      payment_method: 'pay_at_location',
      payment_status: 'pending',
      status: 'confirmed',
      qr_code: qrData,
    }).select();

    setTimeout(() => {
      if (!error && data) {
        setQrCode(qrData);
        setStep('success');
      } else {
        setStep('booking');
        alert('Booking failed. Please try again.');
      }
    }, 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-50 flex items-end"
      >
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full gradient-skysand rounded-t-3xl max-h-[80vh] flex flex-col"
        >
          {step === 'booking' && (
            <>
              <div className="flex-1 overflow-y-auto p-6 pb-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{experience.title}</h2>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full flex items-center justify-center btn-secondary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">WHEN</h3>
                  <div className="flex gap-3 mb-3">
                    {['today', 'tomorrow'].map((day) => (
                      <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`flex-1 py-3 rounded-xl font-medium transition-all ${selectedDay === day
                          ? 'bg-gradient-to-r from-[#d8e4fa] to-[#eecc8f] text-gray-900'
                          : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </button>
                    ))}
                    <button className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Choose date
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {['9am', '12pm', '3pm', '6pm'].map((time) => {
                      const capacity = timeSlotCapacity[time];
                      const spotsAvailable = capacity.max - capacity.current;
                      const isSlotFull = spotsAvailable <= 0;
                      const isLowCapacity = spotsAvailable > 0 && spotsAvailable <= 3;

                      return (
                        <button
                          key={time}
                          onClick={() => {
                            setSelectedTime(time);
                            setIsWaitlist(false);
                          }}
                          className={`py-2 rounded-lg font-medium transition-all relative ${selectedTime === time
                            ? 'time-slot-selected'
                            : isSlotFull
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          <div>{time}</div>
                          {!isSlotFull && isLowCapacity && (
                            <div className="text-[10px] text-orange-600 font-bold">
                              {spotsAvailable} left
                            </div>
                          )}
                          {isSlotFull && (
                            <div className="text-[10px] text-red-700 font-bold">FULL</div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedTime && (
                    <div className="mt-3 bg-white rounded-xl p-3 border-2 border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-bold text-gray-900">
                            {currentCapacity.current}/{currentCapacity.max}
                          </span>
                          <span className="text-gray-600"> spots booked</span>
                        </div>
                        {isFull ? (
                          <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                            FULL
                          </div>
                        ) : spotsLeft <= 3 ? (
                          <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                            <span className="animate-pulse">⚡</span>
                            {spotsLeft} LEFT
                          </div>
                        ) : (
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            AVAILABLE
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">GROUP SIZE</h3>
                  <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
                    <span className="text-gray-600">How many?</span>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setGroupSize(Math.max(1, groupSize - 1))}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[var(--accent-purple)] hover:bg-[var(--accent-purple-subtle)] transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-xl font-bold w-8 text-center">{groupSize}</span>
                      <button
                        onClick={() => setGroupSize(groupSize + 1)}
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[var(--accent-purple)] hover:bg-[var(--accent-purple-subtle)] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">PAYMENT</h3>
                  <button className="w-full bg-gray-100 rounded-xl p-4 text-left">
                    <div className="font-medium text-gray-900">Pay at Location</div>
                    <div className="text-sm text-gray-600">Cash or card accepted</div>
                  </button>
                </div>
              </div>

              <div className="flex-shrink-0 p-6 pt-4">
                <div className="flex items-center justify-between mb-4 text-xl font-bold">
                  <span>Total</span>
                  <span>{displayPrice}</span>
                </div>

                {isFull ? (
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                      <div className="text-sm text-red-700 font-medium">
                        This time slot is fully booked
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsWaitlist(true);
                        setStep('waitlist');
                      }}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 rounded-xl text-lg hover:shadow-lg transition-all"
                    >
                      Join Waitlist
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleBook}
                    className="w-full bg-gradient-to-r from-[#d8e4fa] to-[#eecc8f] text-gray-900 font-bold py-3 rounded-xl text-lg hover:shadow-lg transition-all"
                  >
                    {spotsLeft <= 3 ? '⚡ Book Now - Limited Spots!' : 'Confirm Booking'}
                  </button>
                )}
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-6xl mb-6 animate-pulse">🌴😎</div>
              <p className="text-xl font-semibold mb-4">Booking your spot...</p>
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                  className="h-full bg-gradient-to-r from-[#d8e4fa] to-[#eecc8f]"
                />
              </div>
            </div>
          )}

          {step === 'waitlist' && (
            <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
              <div className="text-6xl mb-6">📋</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Added to Waitlist</h2>
              <p className="text-gray-600 text-center mb-6 max-w-sm">
                We'll notify you immediately if a spot opens up for this time slot
              </p>
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 w-full max-w-sm mb-6">
                <div className="text-sm text-orange-800 text-center">
                  <div className="font-bold mb-1">{selectedTime} - {selectedDay}</div>
                  <div>{groupSize} {groupSize === 1 ? 'guest' : 'guests'}</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full max-w-sm bg-gradient-to-r from-florida-ocean to-florida-sunset text-white font-bold py-3 rounded-xl text-lg"
              >
                Done
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="p-6">
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-10 h-10 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h2>
                <p className="text-gray-600">JAHBOI told them you're coming!</p>
              </div>

              <div className="bg-gray-100 rounded-2xl p-6 mb-6">
                <div className="bg-white rounded-xl p-8 mb-4 flex items-center justify-center">
                  <div className="text-6xl">📱</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Experience</span>
                    <span className="font-semibold">{experience.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time</span>
                    <span className="font-semibold">{selectedDay} at {selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group Size</span>
                    <span className="font-semibold">{groupSize} people</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="font-semibold">{displayPrice}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mb-4">
                <button className="flex-1 btn-outline py-3 rounded-xl">
                  Add to Calendar
                </button>
                <button className="flex-1 btn-outline py-3 rounded-xl">
                  Share
                </button>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-[#d8e4fa] to-[#eecc8f] text-gray-900 font-bold py-3 rounded-xl text-lg"
              >
                Done
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
