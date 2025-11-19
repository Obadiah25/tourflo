import { motion } from 'framer-motion';
import { X, Navigation } from 'lucide-react';
import { useEffect } from 'react';

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  experience: {
    title: string;
    location_name: string;
    location_lat: number | null;
    location_lng: number | null;
  };
}

export default function MapModal({ isOpen, onClose, experience }: MapModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const lat = experience.location_lat || 18.4095;
  const lng = experience.location_lng || -77.5024;

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${lat},${lng}&zoom=14`;

  const handleGetDirections = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="bg-white rounded-3xl overflow-hidden w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-skysand-r px-6 py-4 flex items-center justify-between border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{experience.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{experience.location_name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        <div className="flex-1 relative">
          <iframe
            src={mapUrl}
            className="w-full h-full"
            style={{ border: 0, minHeight: '400px' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleGetDirections}
            className="w-full bg-gradient-to-r from-[#390067] to-purple-700 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            style={{ fontFamily: 'Poppins', fontWeight: 600 }}
          >
            <Navigation className="w-5 h-5" />
            Get Directions
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
