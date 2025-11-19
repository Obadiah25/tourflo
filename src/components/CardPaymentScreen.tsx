import { useState } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { haptics } from '../lib/haptics';

interface CardPaymentScreenProps {
  onBack: () => void;
  onPaymentComplete: (paymentData: any) => void;
}

export default function CardPaymentScreen({ onBack, onPaymentComplete }: CardPaymentScreenProps) {
  const { bookingData } = useBooking();

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const groups = numbers.match(/.{1,4}/g);
    return groups ? groups.join(' ') : numbers;
  };

  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4);
    }
    return numbers;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.replace(/\D/g, '').length <= 4) {
      setExpiry(formatted);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/\D/g, '');
    if (numbers.length <= 4) {
      setCvv(numbers);
    }
  };

  const isCardFormValid =
    cardNumber.replace(/\s/g, '').length >= 15 &&
    cardName.trim().length > 0 &&
    expiry.length === 5 &&
    cvv.length >= 3;

  const handleProcessPayment = async () => {
    if (!isCardFormValid) return;

    setIsProcessing(true);
    haptics.medium();

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentData = {
        cardLast4: cardNumber.replace(/\s/g, '').slice(-4),
        cardBrand: 'visa',
        saveCard,
        timestamp: new Date().toISOString()
      };

      haptics.success();
      onPaymentComplete(paymentData);
    } catch (error) {
      haptics.error();
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen gradient-skysand">

      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            disabled={isProcessing}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex justify-center gap-2">
            <div className="w-8 h-2 bg-[#390067] rounded-full"></div>
            <div className="w-8 h-2 bg-[#390067] rounded-full"></div>
            <div className="w-8 h-2 bg-[#390067] rounded-full"></div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-6 pb-[100px]">

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-5 mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full -mr-8 -mt-8"></div>
          <div className="absolute bottom-0 left-0 w-14 h-14 bg-white/5 rounded-full -ml-7 -mb-7"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-5">
              <svg className="w-7 h-7 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <rect width="24" height="18" y="3" rx="3" fill="currentColor" opacity="0.3"/>
                <rect width="24" height="4" y="9" fill="currentColor"/>
              </svg>
              <div className="text-white/60 text-[9px]">
                LOOKYAH CARD
              </div>
            </div>

            <div className="mb-4">
              <p className="text-white/60 text-[9px] mb-0.5 tracking-wide">CARD NUMBER</p>
              <p className="text-white text-sm font-mono tracking-wider" style={{ fontFamily: 'Courier New' }}>
                {cardNumber || '•••• •••• •••• ••••'}
              </p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/60 text-[9px] mb-0.5 tracking-wide">CARDHOLDER</p>
                <p className="text-white text-xs font-semibold uppercase tracking-wide">
                  {cardName || 'YOUR NAME'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-[9px] mb-0.5 tracking-wide">EXPIRES</p>
                <p className="text-white text-xs font-semibold font-mono">
                  {expiry || 'MM/YY'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <h3 className="font-bold text-base text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
            Card Details
          </h3>

          <form className="space-y-4">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-3.5 py-3 rounded-xl bg-white border-2 border-gray-200
                           focus:border-[#390067] focus:ring-2 focus:ring-[#390067]/10
                           focus:outline-none text-gray-900 placeholder-gray-400 transition-all font-mono text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="JOHN SMITH"
                className="w-full px-3.5 py-3 rounded-xl bg-white border-2 border-gray-200
                           focus:border-[#390067] focus:ring-2 focus:ring-[#390067]/10
                           focus:outline-none text-gray-900 placeholder-gray-400 transition-all uppercase text-sm"
                style={{ fontFamily: 'Poppins' }}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Expiry Date
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full px-3.5 py-3 rounded-xl bg-white border-2 border-gray-200
                             focus:border-[#390067] focus:ring-2 focus:ring-[#390067]/10
                             focus:outline-none text-gray-900 placeholder-gray-400 transition-all font-mono text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  CVV
                </label>
                <input
                  type="text"
                  value={cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  className="w-full px-3.5 py-3 rounded-xl bg-white border-2 border-gray-200
                             focus:border-[#390067] focus:ring-2 focus:ring-[#390067]/10
                             focus:outline-none text-gray-900 placeholder-gray-400 transition-all font-mono text-sm"
                  required
                />
              </div>
            </div>

          </form>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl shadow-lg p-3">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={saveCard}
                onChange={(e) => setSaveCard(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-2 border-gray-300 text-[#390067]
                           focus:ring-2 focus:ring-[#390067]/20 focus:ring-offset-0"
              />
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-900 leading-tight">Save card</p>
                <p className="text-[10px] text-gray-600">For future use</p>
              </div>
            </label>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[#390067] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="text-xs font-semibold text-gray-900 leading-tight">Secure</p>
                <p className="text-[10px] text-gray-600">256-bit SSL</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 z-40">
        <button
          onClick={handleProcessPayment}
          disabled={!isCardFormValid || isProcessing}
          className={`w-full font-bold text-base py-3 rounded-xl shadow-lg transition-all ${
            isCardFormValid && !isProcessing
              ? 'bg-gradient-to-r from-[#390067] to-[#4D0085] text-white hover:shadow-[#390067]/50 active:scale-98'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          style={{ fontFamily: 'Poppins' }}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Processing...
            </span>
          ) : (
            `Pay $${bookingData.totalPrice} USD`
          )}
        </button>
      </div>

      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm mx-6 text-center">
            <div className="w-16 h-16 border-4 border-[#390067] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>
              Processing Payment
            </h3>
            <p className="text-gray-600">
              Please don't close this window...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
