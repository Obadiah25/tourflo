import { useState } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { haptics } from '../lib/haptics';

interface GuestInfoScreenProps {
  onBack: () => void;
  onContinue: () => void;
}

export default function GuestInfoScreen({ onBack, onContinue }: GuestInfoScreenProps) {
  const { bookingData, updateBookingData } = useBooking();

  const [fullName, setFullName] = useState(bookingData.guestInfo.fullName || '');
  const [email, setEmail] = useState(bookingData.guestInfo.email || '');
  const [phone, setPhone] = useState(bookingData.guestInfo.phone || '');
  const [usePhoneForWhatsapp, setUsePhoneForWhatsapp] = useState(true);
  const [specialRequests, setSpecialRequests] = useState(bookingData.guestInfo.specialRequests || '');

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleContinue = () => {
    const newErrors = {
      fullName: '',
      email: '',
      phone: ''
    };

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);

    if (!newErrors.fullName && !newErrors.email && !newErrors.phone) {
      haptics.success();
      updateBookingData({
        guestInfo: {
          fullName,
          email,
          phone,
          whatsapp: usePhoneForWhatsapp ? phone : '',
          specialRequests
        }
      });
      onContinue();
    } else {
      haptics.error();
    }
  };

  const isFormValid = fullName.trim().split(' ').length >= 2 &&
                      validateEmail(email) &&
                      validatePhone(phone);

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
            <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
            <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="px-6 pb-[140px]">

        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          <div className="flex items-start gap-3.5">
            <img
              src={bookingData.experience?.image}
              className="w-16 h-16 rounded-lg object-cover shadow-md"
              alt={bookingData.experience?.title}
            />
            <div className="flex-1">
              <h2 className="font-bold text-sm text-gray-900 mb-1" style={{ fontFamily: 'Poppins' }}>
                {bookingData.experience?.title}
              </h2>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{bookingData.selectedDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{bookingData.guestCount} {bookingData.guestCount === 1 ? 'guest' : 'guests'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
            Contact Details
          </h3>

          <form className="space-y-5">

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Smith"
                className={`w-full px-4 py-3 rounded-xl bg-white border-2
                           ${errors.fullName ? 'border-red-500' : 'border-gray-200'}
                           focus:border-[#390067] focus:ring-2 focus:ring-[#390067]/10
                           focus:outline-none text-gray-900 placeholder-gray-400 transition-all`}
                style={{ fontFamily: 'Poppins' }}
              />
              {errors.fullName && (
                <p className="text-red-600 text-sm mt-1" role="alert">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className={`w-full px-4 py-3 rounded-xl bg-white border-2
                           ${errors.email ? 'border-red-500' : 'border-gray-200'}
                           focus:border-[#390067] focus:ring-2 focus:ring-[#390067]/10
                           focus:outline-none text-gray-900 placeholder-gray-400 transition-all`}
                style={{ fontFamily: 'Poppins' }}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1" role="alert">{errors.email}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">We'll send your confirmation here</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 876 555 1234"
                className={`w-full px-4 py-3 rounded-xl bg-white border-2
                           ${errors.phone ? 'border-red-500' : 'border-gray-200'}
                           focus:border-[#390067] focus:ring-2 focus:ring-[#390067]/10
                           focus:outline-none text-gray-900 placeholder-gray-400 transition-all`}
                style={{ fontFamily: 'Poppins' }}
              />
              {errors.phone && (
                <p className="text-red-600 text-sm mt-1" role="alert">{errors.phone}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Your guide may contact you here</p>

              <div className="mt-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usePhoneForWhatsapp}
                    onChange={(e) => setUsePhoneForWhatsapp(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-gray-300 text-[#390067]
                               focus:ring-2 focus:ring-[#390067]/20 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">This is my WhatsApp number</span>
                  </div>
                </label>
                {usePhoneForWhatsapp && (
                  <p className="text-xs text-gray-500 mt-1.5 ml-7">We'll send booking updates via WhatsApp</p>
                )}
              </div>
            </div>

          </form>
        </div>

      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 pb-8 z-40">
        <button
          onClick={handleContinue}
          disabled={!isFormValid}
          className={`w-full font-bold text-lg py-3 rounded-xl shadow-lg transition-all ${
            isFormValid
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
