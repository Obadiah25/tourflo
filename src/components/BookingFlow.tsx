import { useState } from 'react';
import { useBooking } from '../contexts/BookingContext';
import GuestInfoScreen from './GuestInfoScreen';
import PaymentMethodScreen from './PaymentMethodScreen';
import CardPaymentScreen from './CardPaymentScreen';
import BookingConfirmationScreen from './BookingConfirmationScreen';

interface BookingFlowProps {
    onClose: () => void;
    onNavigate?: (screen: any, params?: any) => void;
}

type BookingScreen = 'guest-info' | 'payment-method' | 'card-payment' | 'confirmation';

export default function BookingFlow({ onClose, onNavigate }: BookingFlowProps) {
    const { updateBookingData, resetBooking } = useBooking();
    const [currentScreen, setCurrentScreen] = useState<BookingScreen>('guest-info');

    const generateBookingReference = () => {
        const prefix = 'LYH';
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${timestamp}-${random}`;
    };

    const handleConfirmBooking = async () => {
        try {
            updateBookingData({ status: 'processing' });
            const bookingRef = generateBookingReference();
            await new Promise(resolve => setTimeout(resolve, 1500));
            updateBookingData({
                bookingReference: bookingRef,
                status: 'confirmed'
            });
            setCurrentScreen('confirmation');
        } catch (error) {
            console.error('Booking error:', error);
            updateBookingData({ status: 'failed' });
            alert('Booking failed. Please try again.');
        }
    };

    const handlePaymentComplete = async () => {
        try {
            updateBookingData({ status: 'processing' });
            const bookingRef = generateBookingReference();
            await new Promise(resolve => setTimeout(resolve, 1500));
            updateBookingData({
                bookingReference: bookingRef,
                status: 'confirmed'
            });
            setCurrentScreen('confirmation');
        } catch (error) {
            console.error('Payment error:', error);
            updateBookingData({ status: 'failed' });
            alert('Payment failed. Please try again.');
        }
    };

    if (currentScreen === 'guest-info') {
        return (
            <GuestInfoScreen
                onBack={onClose}
                onContinue={() => setCurrentScreen('payment-method')}
            />
        );
    }

    if (currentScreen === 'payment-method') {
        return (
            <PaymentMethodScreen
                onBack={() => setCurrentScreen('guest-info')}
                onSelectPayment={(method) => {
                    updateBookingData({ paymentMethod: method });
                    if (method === 'cash') {
                        handleConfirmBooking();
                    } else {
                        setCurrentScreen('card-payment');
                    }
                }}
            />
        );
    }

    if (currentScreen === 'card-payment') {
        return (
            <CardPaymentScreen
                onBack={() => setCurrentScreen('payment-method')}
                onPaymentComplete={handlePaymentComplete}
            />
        );
    }

    if (currentScreen === 'confirmation') {
        return (
            <BookingConfirmationScreen
                onBackToHome={() => {
                    resetBooking();
                    onClose();
                }}
                onCompleteProfile={() => onNavigate && onNavigate('onboarding')}
            />
        );
    }

    return null;
}
