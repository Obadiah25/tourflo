import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../lib/store';

interface OnboardingFlowProps {
  onComplete?: () => void;
}

const LOCATIONS = [
  { flagUrl: 'https://flagcdn.com/w160/us.png', label: 'USA', value: 'usa' },
  { flagUrl: 'https://flagcdn.com/w160/gb.png', label: 'UK', value: 'uk' },
  { flagUrl: 'https://flagcdn.com/w160/ca.png', label: 'Canada', value: 'canada' },
  { flagUrl: 'https://flagcdn.com/w160/us.png', label: 'In Florida', value: 'florida' },
];

const TIMELINES = [
  { emoji: '🏝️', label: 'Already here!', value: 'already_here' },
  { emoji: '📅', label: 'This week', value: 'this_week' },
  { emoji: '🗓️', label: 'Next month', value: 'next_month' },
  { emoji: '👀', label: 'Just browsing', value: 'browsing' },
];

const VIBES = [
  { emoji: '😎', label: 'Chill', value: 'chill' },
  { emoji: '🔥', label: 'Adventure', value: 'adventure' },
  { emoji: '🎉', label: 'Party', value: 'party' },
  { emoji: '🍴', label: 'Foodie', value: 'foodie' },
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const { setUserPreference, completeOnboarding } = useAppStore();

  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  const handleLocationSelect = (value: string) => {
    setSelectedLocation(value);
    setUserPreference('location', value);
    setTimeout(() => setStep(1), 300);
  };

  const handleTimelineSelect = (value: string) => {
    setSelectedTimeline(value);
    setUserPreference('timeline', value);
    setTimeout(() => setStep(2), 300);
  };

  const handleVibeToggle = (value: string) => {
    const newVibes = selectedVibes.includes(value)
      ? selectedVibes.filter(v => v !== value)
      : [...selectedVibes, value];

    setSelectedVibes(newVibes);
    setUserPreference('vibe_pref', newVibes.join(','));

    if (newVibes.length > 0) {
      setTimeout(() => {
        completeOnboarding();
        if (onComplete) {
          onComplete();
        }
      }, 1500);
    }
  };

  const slideVariants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-florida-ocean via-florida-sand to-florida-sunset flex flex-col overflow-hidden">
      <div className="w-full flex flex-col h-full">
        <div className="flex-shrink-0 px-6 pt-6 pb-3">
          <div className="flex items-center justify-center mb-3 animate-fadeIn">
            <img
              src="/logos/tourflo-black.png"
              alt="Lookyah Jamaica"
              className="h-20 animate-bounceIn"
              style={{ animationDelay: '0.1s' }}
            />
          </div>

          <div className="flex justify-center gap-2 mb-4">
        <div className={`w-8 h-2 rounded-full transition-colors duration-300 ${
          step >= 0 ? 'bg-[var(--accent-purple)]' : 'bg-gray-300'
        }`}></div>
        <div className={`w-8 h-2 rounded-full transition-colors duration-300 ${
          step >= 1 ? 'bg-[var(--accent-purple)]' : 'bg-gray-300'
        }`}></div>
        <div className={`w-8 h-2 rounded-full transition-colors duration-300 ${
          step >= 2 ? 'bg-[var(--accent-purple)]' : 'bg-gray-300'
        }`}></div>
      </div>

        </div>

        <div className="flex-1 flex flex-col px-6 pb-6 min-h-0">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="location"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-center"
              >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 mb-4 shadow-lg flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-1"
                  style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                Wah gwaan!
              </h1>
              <p className="text-base text-center text-gray-600"
                 style={{ fontFamily: 'Poppins', fontWeight: 400 }}>
                Where you at?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 flex-shrink-0">
              {LOCATIONS.map((location) => (
                <motion.button
                  key={location.value}
                  onClick={() => handleLocationSelect(location.value)}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Select ${location.label} as your location`}
                  role="radio"
                  aria-checked={selectedLocation === location.value}
                  className={`relative bg-white rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-2 border-2 ${
                    selectedLocation === location.value
                      ? 'border-[var(--accent-purple)] bg-[var(--accent-purple-subtle)] scale-[1.02]'
                      : 'border-transparent hover:border-[var(--accent-purple)]'
                  }`}
                >
                  <img
                    src={location.flagUrl}
                    alt={`${location.label} flag`}
                    className="w-20 h-14 mx-auto mb-1 rounded object-cover shadow-sm"
                  />
                  <p className="text-base md:text-lg font-semibold text-gray-900"
                     style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                    {location.label}
                  </p>
                  {selectedLocation === location.value && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--accent-purple)] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="text-center mt-2 flex-shrink-0">
              <button
                onClick={() => setStep(1)}
                className="text-gray-600 font-medium text-base px-6 py-2 rounded-full hover:bg-white/40 transition-all"
                style={{ fontFamily: 'Poppins' }}>
                Skip for now →
              </button>
            </div>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="timeline"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-center"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 mb-4 shadow-lg flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900"
                  style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                When you touching down?
              </h1>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 flex-shrink-0">
              {TIMELINES.map((timeline) => (
                <motion.button
                  key={timeline.value}
                  onClick={() => handleTimelineSelect(timeline.value)}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Select ${timeline.label}`}
                  role="radio"
                  aria-checked={selectedTimeline === timeline.value}
                  className={`relative bg-white rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-2 border-2 ${
                    selectedTimeline === timeline.value
                      ? 'border-[var(--accent-purple)] bg-[var(--accent-purple-subtle)] scale-[1.02]'
                      : 'border-transparent hover:border-[var(--accent-purple)]'
                  }`}
                >
                  <div className="text-4xl md:text-5xl mb-1" aria-hidden="true">{timeline.emoji}</div>
                  <p className="text-base md:text-lg font-semibold text-gray-900"
                     style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                    {timeline.label}
                  </p>
                  {selectedTimeline === timeline.value && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--accent-purple)] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            <div className="text-center mt-2 flex-shrink-0">
              <button
                onClick={() => setStep(2)}
                className="text-gray-600 font-medium text-base px-6 py-2 rounded-full hover:bg-white/40 transition-all"
                style={{ fontFamily: 'Poppins' }}>
                Skip for now →
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="vibe"
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-center"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 mb-4 shadow-lg flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900"
                  style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                What's your vibe?
              </h1>
              <p className="text-base text-center text-gray-600 mt-1"
                 style={{ fontFamily: 'Poppins', fontWeight: 400 }}>
                Pick what resonates with you
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3 flex-shrink-0">
              {VIBES.map((vibe) => (
                <motion.button
                  key={vibe.value}
                  onClick={() => handleVibeToggle(vibe.value)}
                  whileTap={{ scale: 0.95 }}
                  aria-label={`Select ${vibe.label} vibe`}
                  role="checkbox"
                  aria-checked={selectedVibes.includes(vibe.value)}
                  className={`relative bg-white rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all flex flex-col items-center gap-2 border-2 ${
                    selectedVibes.includes(vibe.value)
                      ? 'border-[var(--accent-purple)] bg-[var(--accent-purple-subtle)] scale-[1.02]'
                      : 'border-transparent hover:border-[var(--accent-purple)]'
                  }`}
                >
                  <div className="text-4xl md:text-5xl mb-1" aria-hidden="true">{vibe.emoji}</div>
                  <p className="text-base md:text-lg font-semibold text-gray-900"
                     style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                    {vibe.label}
                  </p>
                  {selectedVibes.includes(vibe.value) && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-[var(--accent-purple)] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                  )}
                </motion.button>
              ))}
            </div>

            {selectedVibes.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-center mt-4 flex-shrink-0"
              >
                <p className="text-xl md:text-2xl font-semibold"
                   style={{
                     fontFamily: 'Poppins',
                     fontWeight: 600,
                     color: 'var(--accent-purple)'
                   }}>
                  Perfect! Let me show you Jamaica...
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
