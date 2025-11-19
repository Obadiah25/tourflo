import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { TOURFLO_LOGOS, LOGO_SIZES } from '../lib/branding';
import beachAnimation from '../../public/shore.json';
import sunAnimation from '../../public/Sun-separated.json';

interface SplashScreenProps {
  onComplete?: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 3000);

    const handleClick = () => {
      if (onComplete) {
        onComplete();
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleClick);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleClick);
    };
  }, [onComplete]);
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-florida-ocean via-florida-sand to-florida-sunset flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute top-4 right-4 z-30"
      >
        <Lottie
          animationData={sunAnimation}
          loop={true}
          autoplay={true}
          className="w-24 h-24 md:w-32 md:h-32"
        />
      </motion.div>

      <div className="absolute top-32 md:top-auto md:relative z-10 flex flex-col items-center w-full px-6">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-3"
        >
          <img
            src={TOURFLO_LOGOS.splash}
            alt="TourFlo - Your Florida Guide"
            className="w-auto h-[135px] md:h-[200px] drop-shadow-2xl"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl md:text-3xl text-gray-900 text-center mb-2"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 300,
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
            lineHeight: '1.3'
          }}
        >
          "Discover Florida's Best"
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-base md:text-lg text-gray-700 text-center mb-4 md:mb-12 max-w-md px-4"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            letterSpacing: '0',
            lineHeight: '1.5'
          }}
        >
          Your local guide to authentic Florida experiences
        </motion.p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[40vh] md:h-screen flex items-center justify-center z-0 md:-translate-y-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="w-full max-w-3xl md:max-w-7xl flex items-center justify-center md:scale-110"
        >
          <Lottie
            animationData={beachAnimation}
            loop={true}
            autoplay={true}
            className="w-full h-auto"
            style={{
              maxHeight: '715px',
              filter: 'drop-shadow(0 -4px 12px rgba(0,0,0,0.1))'
            }}
          />
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-[42vh] md:hidden left-0 right-0 text-center text-sm text-gray-800 z-20 px-6"
        style={{
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500
        }}
      >
        Tap anywhere to continue
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-[38vh] md:hidden left-0 right-0 flex justify-center space-x-2 z-20"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          className="w-3 h-3 bg-[var(--accent-purple)] rounded-full"
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
          className="w-3 h-3 bg-[var(--accent-purple)] rounded-full"
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
          className="w-3 h-3 bg-[var(--accent-purple)] rounded-full"
        />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"
        />
      </div>
    </div>
  );
}
