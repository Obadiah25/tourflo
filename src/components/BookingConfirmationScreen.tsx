import { useEffect } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { haptics } from '../lib/haptics';

interface BookingConfirmationScreenProps {
  onBackToHome: () => void;
}

export default function BookingConfirmationScreen({ onBackToHome }: BookingConfirmationScreenProps) {
  const { bookingData } = useBooking();

  useEffect(() => {
    haptics.success();
  }, []);

  const handleAddToCalendar = () => {
    const event = {
      title: bookingData.experience?.title || '',
      description: `Booking ref: ${bookingData.bookingReference}`,
      location: bookingData.experience?.location || '',
      startDate: bookingData.selectedDate || ''
    };

    const calendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
DTSTART:${event.startDate.replace(/-/g, '')}
END:VEVENT
END:VCALENDAR`;

    const link = document.createElement('a');
    link.href = calendarUrl;
    link.download = 'booking.ics';
    link.click();
  };

  const handleChatWithGuide = () => {
    const message = `Hi! I just booked ${bookingData.experience?.title} (Ref: ${bookingData.bookingReference}). Looking forward to it!`;
    const whatsappUrl = `https://wa.me/${bookingData.experience?.host.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleViewOnMap = () => {
    const location = bookingData.experience?.location || '';
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleShareBooking = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `I'm going to ${bookingData.experience?.title}!`,
          text: `Join me for an amazing experience in Jamaica!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="h-screen gradient-skysand overflow-y-auto">

      <div className="flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 pb-32 sm:pb-40">

        <div className="mb-4 sm:mb-6 animate-scale-in">
          <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl">
            <svg className="w-12 h-12 sm:w-14 sm:h-14 text-white animate-check" fill="none" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center" style={{ fontFamily: 'Poppins' }}>
          Booking Confirmed!
        </h1>
        <p className="text-base sm:text-lg text-gray-600 text-center mb-6 sm:mb-8">
          Get ready for an amazing experience 🎉
        </p>

        <div className="w-full bg-white rounded-3xl shadow-2xl overflow-hidden mb-4 sm:mb-6">

          <div className="bg-gradient-to-r from-[#390067] to-[#4D0085] px-4 sm:px-6 py-4 sm:py-5">
            <p className="text-white/80 text-sm mb-1">Booking Reference</p>
            <p className="text-white text-xl sm:text-2xl font-bold tracking-wide" style={{ fontFamily: 'Poppins' }}>
              {bookingData.bookingReference}
            </p>
          </div>

          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-start gap-4">
              <img
                src={bookingData.experience?.image}
                className="w-24 h-24 rounded-2xl object-cover shadow-lg"
                alt={bookingData.experience?.title}
              />
              <div className="flex-1">
                <h2 className="font-bold text-xl text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>
                  {bookingData.experience?.title}
                </h2>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{bookingData.selectedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{bookingData.guestCount} {bookingData.guestCount === 1 ? 'guest' : 'guests'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{bookingData.experience?.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <h3 className="font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>
              Guest Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Name</span>
                <span className="font-medium text-gray-900">{bookingData.guestInfo.fullName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-900">{bookingData.guestInfo.email}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phone</span>
                <span className="font-medium text-gray-900">{bookingData.guestInfo.phone}</span>
              </div>
            </div>
          </div>

        </div>

        <div className="w-full bg-white rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="font-bold text-gray-900 mb-3" style={{ fontFamily: 'Poppins' }}>
            Payment Summary
          </h3>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">${bookingData.subtotal} USD</span>
            </div>
            {bookingData.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">-${bookingData.discount} USD</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Processing Fee</span>
              <span className="font-medium text-gray-900">${bookingData.processingFee} USD</span>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="font-bold text-gray-900">Total Paid</span>
            <span className="text-2xl font-bold text-gray-900">
              ${bookingData.totalPrice} <span className="text-sm font-normal text-gray-600">USD</span>
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">
                Paid via {bookingData.paymentMethod === 'card' ? 'Credit Card' : bookingData.paymentMethod === 'lynk' ? 'Lynk' : bookingData.paymentMethod === 'wipay' ? 'WiPay' : 'Cash on Arrival'}
              </span>
            </div>
          </div>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-2xl p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="text-center mb-4">
            <h3 className="font-bold text-xl text-gray-900 mb-2" style={{ fontFamily: 'Poppins' }}>
              Your Ticket
            </h3>
            <p className="text-sm text-gray-600">
              Show this QR code to your guide on arrival
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-2xl border-4 border-[#390067] shadow-lg">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(bookingData.bookingReference || '')}`}
                alt="Booking QR Code"
                className="w-48 h-48"
              />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
            <svg className="w-5 h-5 text-[#390067]" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>Save to Apple Wallet or Google Pay</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-800 transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              <span>Apple Wallet</span>
            </button>

            <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 10V9l-2.5 1.5L17 9v1l1.5 1L17 12v1l1.5-1.5L21 13v-1l-1.5-1L21 10m-5 9c-.6 2.3-2.8 4-5.5 4S4.1 21.3 3.5 19H2c.6 3.3 3.5 6 7 6s6.4-2.7 7-6h-1.5m.5-4c0-.6-.4-1-1-1H3c-.6 0-1 .4-1 1v4c0 .6.4 1 1 1h13c.6 0 1-.4 1-1v-4M9.5 7C10.9 7 12 8.1 12 9.5S10.9 12 9.5 12 7 10.9 7 9.5 8.1 7 9.5 7m0 2c-.3 0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5z"/>
              </svg>
              <span>Google Pay</span>
            </button>
          </div>
        </div>

        <div className="w-full space-y-2 sm:space-y-3 mb-4 sm:mb-6">

          <button
            onClick={handleAddToCalendar}
            className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Add to Calendar</p>
                <p className="text-sm text-gray-600">Don't forget your experience</p>
              </div>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={handleChatWithGuide}
            className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Chat with {bookingData.experience?.host.name}</p>
                <p className="text-sm text-gray-600">Ask questions on WhatsApp</p>
              </div>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            onClick={handleViewOnMap}
            className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">View on Map</p>
                <p className="text-sm text-gray-600">Get directions to meeting point</p>
              </div>
            </div>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

        </div>

        <div className="w-full bg-purple-50 border border-purple-200 rounded-2xl p-4 sm:p-5 mb-4 sm:mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[#390067] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Confirmation Email Sent</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                We've sent all the details to <span className="font-medium text-gray-900">{bookingData.guestInfo.email}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="w-full space-y-2 sm:space-y-3">
          <button
            onClick={onBackToHome}
            className="w-full bg-gradient-to-r from-[#390067] to-[#4D0085] text-white font-bold text-lg py-3 rounded-xl shadow-lg hover:shadow-[#390067]/50 transition-all active:scale-98"
            style={{ fontFamily: 'Poppins' }}
          >
            Explore More Experiences
          </button>

          <button
            onClick={handleShareBooking}
            className="w-full bg-white text-[#390067] font-bold text-lg py-3 rounded-xl shadow-md border-2 border-[#390067] hover:bg-purple-50 transition-all active:scale-98"
            style={{ fontFamily: 'Poppins' }}
          >
            Share with Friends
          </button>
        </div>

      </div>

    </div>
  );
}
