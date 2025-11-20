import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Camera, X, Check } from 'lucide-react';
import { triggerHaptic } from '../lib/gestures';

interface RatingScreenProps {
    bookingId: string;
    experienceTitle: string;
    experienceImage: string;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
}

export default function RatingScreen({
    bookingId,
    experienceTitle,
    experienceImage,
    onClose,
    onSubmit
}: RatingScreenProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;

        setIsSubmitting(true);
        triggerHaptic('medium');

        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 1500));

        onSubmit(rating, comment);
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
            >
                {/* Header Image */}
                <div className="relative h-48">
                    <img
                        src={experienceImage}
                        alt={experienceTitle}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="text-white/80 text-sm font-medium mb-1">How was your experience?</p>
                        <h2 className="text-white text-2xl font-bold leading-tight">{experienceTitle}</h2>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Star Rating */}
                    <div className="flex justify-center gap-3 mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                                key={star}
                                whileTap={{ scale: 0.8 }}
                                onClick={() => {
                                    triggerHaptic('light');
                                    setRating(star);
                                }}
                                className="focus:outline-none"
                            >
                                <Star
                                    className={`w-10 h-10 transition-all duration-300 ${rating >= star
                                            ? 'fill-yellow-400 text-yellow-400 scale-110 drop-shadow-md'
                                            : 'text-gray-300'
                                        }`}
                                    strokeWidth={rating >= star ? 0 : 1.5}
                                />
                            </motion.button>
                        ))}
                    </div>

                    <div className="text-center mb-8">
                        <p className="text-lg font-medium text-gray-900">
                            {rating === 5 ? 'Absolutely amazing! 🤩' :
                                rating === 4 ? 'Pretty good! 🙂' :
                                    rating === 3 ? 'It was okay 😐' :
                                        rating === 2 ? 'Could be better 😕' :
                                            rating === 1 ? 'Not great 😞' :
                                                'Tap a star to rate'}
                        </p>
                    </div>

                    {/* Comment Box */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tell us more (optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="What did you like? What could be improved?"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-0 bg-gray-50 text-gray-900 resize-none h-32 transition-colors"
                        />
                    </div>

                    {/* Photo Upload (Mock) */}
                    <button className="w-full mb-8 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors">
                        <Camera className="w-5 h-5" />
                        <span className="font-medium">Add photos</span>
                    </button>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={rating === 0 || isSubmitting}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${rating > 0
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:scale-[1.02]'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? (
                            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Submit Review</span>
                                <Check className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
