import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Check, Mail, Bell, DollarSign, UserCheck, Clock } from 'lucide-react';
import { triggerHaptic } from '../../lib/gestures';

interface Booking {
  id: string;
  experience: string;
  guest: string;
  guestCount: number;
  date: string;
  time: string;
  phone: string;
  email?: string;
  payment_status: 'paid' | 'pending';
  payment_id?: string;
  total_amount: number;
  assignedGuide?: { id: string; name: string };
}

interface CancellationFlowProps {
  booking: Booking;
  onClose: () => void;
  onComplete: () => void;
}

const CANCELLATION_REASONS = [
  { value: 'weather', label: 'Severe Weather Conditions' },
  { value: 'guide_unavailable', label: 'Guide Unavailable' },
  { value: 'equipment', label: 'Equipment Issue' },
  { value: 'low_bookings', label: 'Low Bookings' },
  { value: 'emergency', label: 'Emergency Situation' },
  { value: 'other', label: 'Other Reason' }
];

export default function CancellationFlow({ booking, onClose, onComplete }: CancellationFlowProps) {
  const [step, setStep] = useState<'reason' | 'processing' | 'confirmation'>('reason');
  const [selectedReason, setSelectedReason] = useState('');
  const [offerRefund, setOfferRefund] = useState(true);
  const [customReason, setCustomReason] = useState('');
  const [notificationResults, setNotificationResults] = useState({
    guestsNotified: 0,
    guidesNotified: 0,
    waitlistNotified: 0,
    refundProcessed: false,
    refundAmount: 0
  });

  const handleCancel = async () => {
    if (!selectedReason) {
      alert('Please select a cancellation reason');
      return;
    }

    triggerHaptic('medium');
    setStep('processing');

    // Simulate cancellation process
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Simulate notification results
    const results = {
      guestsNotified: booking.guestCount,
      guidesNotified: booking.assignedGuide ? 1 : 0,
      waitlistNotified: Math.floor(Math.random() * 3),
      refundProcessed: booking.payment_status === 'paid' && offerRefund,
      refundAmount: offerRefund ? booking.total_amount : 0
    };

    setNotificationResults(results);
    setStep('confirmation');
    triggerHaptic('success');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-end"
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
          {step === 'reason' && (
            <>
              <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Cancel Booking</h2>
                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                  <h3 className="font-bold text-red-900 mb-2">{booking.experience}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm text-red-800">
                    <div>
                      <div className="text-red-600 text-xs">Date & Time</div>
                      <div className="font-medium">{new Date(booking.date).toLocaleDateString()} at {booking.time}</div>
                    </div>
                    <div>
                      <div className="text-red-600 text-xs">Guest</div>
                      <div className="font-medium">{booking.guest}</div>
                    </div>
                    <div>
                      <div className="text-red-600 text-xs">Party Size</div>
                      <div className="font-medium">{booking.guestCount} guests</div>
                    </div>
                    {booking.assignedGuide && (
                      <div>
                        <div className="text-red-600 text-xs">Assigned Guide</div>
                        <div className="font-medium">{booking.assignedGuide.name}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-gray-900 mb-3 block">
                    Cancellation Reason *
                  </label>
                  <select
                    value={selectedReason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  >
                    <option value="">Select reason...</option>
                    {CANCELLATION_REASONS.map((reason) => (
                      <option key={reason.value} value={reason.value}>
                        {reason.label}
                      </option>
                    ))}
                  </select>

                  {selectedReason === 'other' && (
                    <textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Please provide details..."
                      className="w-full mt-3 px-4 py-3 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
                    />
                  )}
                </div>

                {booking.payment_status === 'paid' && (
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-bold text-gray-900 mb-1">Automatic Refund</div>
                        <div className="text-sm text-gray-600">
                          Process ${(booking.total_amount / 100).toFixed(2)} refund
                        </div>
                      </div>
                      <button
                        onClick={() => setOfferRefund(!offerRefund)}
                        className={`w-14 h-8 rounded-full transition-all ${
                          offerRefund ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <motion.div
                          animate={{ x: offerRefund ? 24 : 0 }}
                          className="w-6 h-6 bg-white rounded-full ml-1"
                        />
                      </button>
                    </div>
                    {offerRefund && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-800">
                        <Check className="w-4 h-4 inline mr-1" />
                        Refund will be processed automatically via Stripe
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <div className="font-bold text-blue-900 mb-2">Who will be notified:</div>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{booking.guestCount} guests via email & push</span>
                    </div>
                    {booking.assignedGuide && (
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        <span>Assigned guide: {booking.assignedGuide.name}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      <span>Waitlist customers (if applicable)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-2 border-yellow-300 rounded-2xl p-4 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <div className="font-bold mb-1">Warning</div>
                    <div>This will immediately cancel the booking and send notifications to all parties. This action cannot be undone.</div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-6 space-y-3">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  disabled={!selectedReason}
                  className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 ${
                    selectedReason
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <AlertTriangle className="w-6 h-6" />
                  CANCEL BOOKING & NOTIFY ALL
                </motion.button>
                <button
                  onClick={onClose}
                  className="w-full py-3 text-gray-600 font-medium"
                >
                  Nevermind, keep booking
                </button>
              </div>
            </>
          )}

          {step === 'processing' && (
            <div className="p-6 flex flex-col items-center justify-center min-h-[500px]">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 border-4 border-gray-200 border-t-red-500 rounded-full mb-6"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processing Cancellation...</h2>
              <div className="space-y-2 text-center text-gray-600">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Cancelling booking</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Processing refund</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Sending notifications</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Updating inventory</span>
                </motion.div>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <>
              <div className="p-6">
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Check className="w-10 h-10 text-green-600" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Cancellation Complete</h2>
                  <p className="text-gray-600">All parties have been notified</p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                  <h3 className="font-bold text-gray-900 mb-4 text-center">Impact Summary</h3>
                  <div className="space-y-3">
                    <div className="bg-white rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Guests Notified</div>
                          <div className="text-sm text-gray-600">Email + push sent</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {notificationResults.guestsNotified}
                      </div>
                    </div>

                    {notificationResults.guidesNotified > 0 && (
                      <div className="bg-white rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <UserCheck className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Guides Notified</div>
                            <div className="text-sm text-gray-600">Schedule updated</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {notificationResults.guidesNotified}
                        </div>
                      </div>
                    )}

                    {notificationResults.refundProcessed && (
                      <div className="bg-white rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Refund Processed</div>
                            <div className="text-sm text-gray-600">via Stripe</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          ${(notificationResults.refundAmount / 100).toFixed(2)}
                        </div>
                      </div>
                    )}

                    {notificationResults.waitlistNotified > 0 && (
                      <div className="bg-white rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                            <Bell className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">Waitlist Notified</div>
                            <div className="text-sm text-gray-600">Spot now available</div>
                          </div>
                        </div>
                        <div className="text-2xl font-bold text-orange-600">
                          {notificationResults.waitlistNotified}
                        </div>
                      </div>
                    )}

                    <div className="bg-white rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Inventory Updated</div>
                          <div className="text-sm text-gray-600">Slot reopened</div>
                        </div>
                      </div>
                      <Check className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <div className="font-bold mb-1">Cancellation Receipt</div>
                      <div>A detailed cancellation receipt with reference #{booking.id.slice(0, 8).toUpperCase()} has been sent to your email.</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onComplete();
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-florida-ocean to-florida-sunset text-white font-bold py-4 rounded-2xl text-lg"
                >
                  Done
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
