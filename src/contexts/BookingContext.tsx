import { createContext, useContext, useState, ReactNode } from 'react';

interface Experience {
  id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  duration: string;
  host: {
    name: string;
    phone: string;
    avatar: string;
  };
}

interface GuestInfo {
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  specialRequests?: string;
}

interface BookingData {
  experience: Experience | null;
  selectedDate: string | null;
  guestCount: number;
  totalPrice: number;
  subtotal: number;
  processingFee: number;
  discount: number;
  guestInfo: GuestInfo;
  paymentMethod: 'card' | 'lynk' | 'wipay' | 'cash' | null;
  bookingReference: string | null;
  status: 'pending' | 'processing' | 'confirmed' | 'failed';
}

interface BookingContextType {
  bookingData: BookingData;
  updateBookingData: (data: Partial<BookingData>) => void;
  resetBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const initialBookingData: BookingData = {
  experience: null,
  selectedDate: null,
  guestCount: 1,
  totalPrice: 0,
  subtotal: 0,
  processingFee: 0,
  discount: 0,
  guestInfo: {
    fullName: '',
    email: '',
    phone: '',
    specialRequests: ''
  },
  paymentMethod: null,
  bookingReference: null,
  status: 'pending'
};

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookingData, setBookingData] = useState<BookingData>(initialBookingData);

  const updateBookingData = (data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBookingData(initialBookingData);
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBookingData, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};
