import { useState, useEffect } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { haptics } from '../lib/haptics';

interface PaymentMethodScreenProps {
  onBack: () => void;
  onSelectPayment: (method: 'card' | 'lynk' | 'wipay' | 'applepay' | 'googlepay' | 'cash') => void;
}

export default function PaymentMethodScreen({ onBack, onSelectPayment }: PaymentMethodScreenProps) {
  const { bookingData } = useBooking();
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'lynk' | 'wipay' | 'applepay' | 'googlepay' | 'cash' | null>(null);
  const [showApplePay, setShowApplePay] = useState(false);
  const [showGooglePay, setShowGooglePay] = useState(false);

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    const isAndroid = /android/i.test(navigator.userAgent);
    const isChrome = /chrome/i.test(navigator.userAgent);

    setShowApplePay(isIOS || isSafari);
    setShowGooglePay(isAndroid || isChrome);
  }, []);

  const handleSelectMethod = (method: 'card' | 'lynk' | 'wipay' | 'applepay' | 'googlepay' | 'cash') => {
    haptics.light();
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    if (selectedMethod) {
      haptics.success();
      onSelectPayment(selectedMethod);
    }
  };

  return (
    <div className="min-h-screen gradient-skysand">

      <div className="px-6 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex justify-center gap-2">
            <div className="w-8 h-2 bg-[#390067] rounded-full"></div>
            <div className="w-8 h-2 bg-[#390067] rounded-full"></div>
            <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-6 pb-[140px]">

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600">Total Amount</span>
            <span className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Poppins' }}>
              ${bookingData.totalPrice}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            Including all fees and taxes
          </p>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
          Choose Payment Method
        </h3>

        <div className="space-y-3">

          {showApplePay && (
            <button
              onClick={() => handleSelectMethod('applepay')}
              className={`w-full bg-black rounded-xl p-4 shadow-md transition-all flex items-center justify-between ${selectedMethod === 'applepay'
                  ? 'ring-4 ring-[#390067] ring-opacity-50 shadow-lg'
                  : 'hover:shadow-lg'
                }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-sm">Apple Pay</p>
                  <p className="text-xs text-gray-300">Fast & secure with Face ID</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'applepay' ? 'border-white bg-white' : 'border-gray-400'
                }`}>
                {selectedMethod === 'applepay' && (
                  <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          )}

          {showGooglePay && (
            <button
              onClick={() => handleSelectMethod('googlepay')}
              className={`w-full bg-white rounded-xl p-4 shadow-md transition-all flex items-center justify-between border-2 border-gray-200 ${selectedMethod === 'googlepay'
                  ? 'ring-4 ring-[#390067] ring-opacity-50 shadow-lg'
                  : 'hover:shadow-lg'
                }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8" viewBox="0 0 48 24" fill="none">
                    <path d="M23.7 12.4v5.9h-1.9v-14h5c1.2 0 2.4.4 3.3 1.3.9.9 1.3 2 1.3 3.3 0 1.3-.5 2.4-1.3 3.3-.9.9-2.1 1.3-3.3 1.3h-3.1zm0-7.4v5.6h3.2c.7 0 1.4-.3 1.9-.8.5-.5.8-1.2.8-1.9s-.3-1.4-.8-1.9c-.5-.5-1.2-.8-1.9-.8h-3.2z" fill="#5F6368" />
                    <path d="M36.6 9.8c1.4 0 2.5.4 3.4 1.3.9.9 1.3 2 1.3 3.4v4.8h-1.8v-1.1h-.1c-.8 1-1.8 1.4-3 1.4-1.1 0-2.1-.3-2.9-1-.7-.6-1.1-1.5-1.1-2.5 0-1.1.4-1.9 1.2-2.5.8-.6 1.8-.9 3-.9 1 0 1.9.2 2.6.5v-.4c0-.7-.3-1.3-.8-1.8-.5-.5-1.1-.7-1.8-.7-.9 0-1.7.4-2.3 1.1l-1.6-1c.9-1.1 2.2-1.6 3.9-1.6zm-2.3 7.1c0 .5.2.9.6 1.2.4.3.9.5 1.5.5.8 0 1.6-.3 2.2-.9.6-.6 1-1.3 1-2.1-.6-.4-1.4-.6-2.3-.6-.7 0-1.4.2-1.9.5-.5.4-.8.9-.8 1.4z" fill="#5F6368" />
                    <path d="M51.1 10.1l-6.7 14.7h-1.9l2.5-5.3-4.4-9.4h2l3.3 7.4h.1l3.2-7.4h1.9z" fill="#5F6368" />
                    <path d="M18.8 11.8c0-.6-.1-1.2-.2-1.8H12v3.4h3.8c-.2.9-.7 1.6-1.4 2.1v2.2h2.2c1.3-1.2 2.1-3 2.1-5.2 0-.4 0-.8-.1-1.2v-.5z" fill="#4285F4" />
                    <path d="M12 20c1.9 0 3.5-.6 4.6-1.7l-2.2-1.7c-.6.4-1.4.7-2.4.7-1.8 0-3.4-1.2-3.9-2.9H5.8v2.3c1.1 2.2 3.4 3.7 6.1 3.7v-.4z" fill="#34A853" />
                    <path d="M8.1 14.4c-.3-.8-.3-1.6 0-2.4v-2.3H5.8c-1 2-1 4.4 0 6.4l2.3-1.7z" fill="#FBBC04" />
                    <path d="M12 7.4c1 0 2 .4 2.7 1.1l2-2C15.5 5.2 13.9 4.5 12 4.5c-2.7 0-5 1.5-6.2 3.7L8.1 10.5c.5-1.7 2.1-2.9 3.9-3.1z" fill="#EA4335" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 text-sm">Google Pay</p>
                  <p className="text-xs text-gray-600">Fast & secure checkout</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'googlepay' ? 'border-[#390067] bg-[#390067]' : 'border-gray-300'
                }`}>
                {selectedMethod === 'googlepay' && (
                  <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          )}

          <button
            onClick={() => handleSelectMethod('card')}
            className={`w-full bg-white rounded-xl p-4 shadow-md transition-all flex items-center justify-between ${selectedMethod === 'card'
                ? 'ring-4 ring-[#390067] ring-opacity-50 shadow-lg'
                : 'hover:shadow-lg'
              }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Credit / Debit Card</p>
                <p className="text-xs text-gray-600">Visa, Mastercard, Amex</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'card' ? 'border-[#390067] bg-[#390067]' : 'border-gray-300'
              }`}>
              {selectedMethod === 'card' && (
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>

          <button
            onClick={() => handleSelectMethod('lynk')}
            className={`w-full bg-white rounded-xl p-4 shadow-md transition-all flex items-center justify-between ${selectedMethod === 'lynk'
                ? 'ring-4 ring-[#390067] ring-opacity-50 shadow-lg'
                : 'hover:shadow-lg'
              }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Lynk</p>
                <p className="text-xs text-gray-600">Fast & secure Florida payment</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'lynk' ? 'border-[#390067] bg-[#390067]' : 'border-gray-300'
              }`}>
              {selectedMethod === 'lynk' && (
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>

          <button
            onClick={() => handleSelectMethod('wipay')}
            className={`w-full bg-white rounded-xl p-4 shadow-md transition-all flex items-center justify-between ${selectedMethod === 'wipay'
                ? 'ring-4 ring-[#390067] ring-opacity-50 shadow-lg'
                : 'hover:shadow-lg'
              }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">WiPay</p>
                <p className="text-xs text-gray-600">Caribbean payment gateway</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'wipay' ? 'border-[#390067] bg-[#390067]' : 'border-gray-300'
              }`}>
              {selectedMethod === 'wipay' && (
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>

          <button
            onClick={() => handleSelectMethod('cash')}
            className={`w-full bg-white rounded-xl p-4 shadow-md transition-all flex items-center justify-between ${selectedMethod === 'cash'
                ? 'ring-4 ring-[#390067] ring-opacity-50 shadow-lg'
                : 'hover:shadow-lg'
              }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900 text-sm">Cash on Arrival</p>
                <p className="text-xs text-gray-600">Pay when you arrive</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === 'cash' ? 'border-[#390067] bg-[#390067]' : 'border-gray-300'
              }`}>
              {selectedMethod === 'cash' && (
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>

        </div>

        <p className="text-sm text-gray-600 mt-4 text-center">
          Free cancellation up to 24 hours before your experience
        </p>

      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 pb-8 z-40">
        <button
          onClick={handleContinue}
          disabled={!selectedMethod}
          className={`w-full font-bold text-lg py-3 rounded-xl shadow-lg transition-all ${selectedMethod
              ? 'bg-gradient-to-r from-[#390067] to-[#4D0085] text-white hover:shadow-[#390067]/50 active:scale-98'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          style={{ fontFamily: 'Poppins' }}
        >
          Continue to Payment
        </button>
      </div>

    </div>
  );
}
