import { useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { supabase } from '../lib/supabase';
import sunAnimation from '../../public/Sun-separated.json';

interface AuthScreenProps {
  onAuth: (role?: 'tourist' | 'operator') => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'tourist' | 'operator'>('tourist');

  const handleGuestContinue = () => {
    setLoading(true);

    setTimeout(() => {
      localStorage.setItem('tourflo_guest_mode', 'true');
      onAuth('tourist');
    }, 400);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: role
            }
          }
        });

        if (!error && data.user) {
          await supabase.from('users').upsert({
            id: data.user.id,
            location: 'browsing',
            currency_pref: 'USD',
            timeline: 'browsing',
            vibe_pref: 'chill',
            referral_code: `USER-${Date.now().toString(36).toUpperCase()}`,
            role: role
          });

          onAuth(role);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data.user) {
          // Fetch user role if needed, or default to tourist if not found in metadata
          const userRole = data.user.user_metadata?.role || 'tourist';
          onAuth(userRole);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 gradient-skysand flex flex-col items-center justify-between px-6 py-12 overflow-y-auto overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="absolute top-4 right-4 z-30"
        style={{
          animation: 'sunPulse 3s ease-in-out infinite'
        }}
      >
        <Lottie
          animationData={sunAnimation}
          loop={true}
          autoplay={true}
          className="w-20 h-20 md:w-24 md:h-24"
        />
      </motion.div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <img
            src="/logos/tourflo-black.png"
            alt="TourFlo"
            className="h-32 md:h-40 w-auto"
          />
        </motion.div>

        <p className="text-2xl md:text-3xl text-gray-700 text-center mb-12 px-6"
          style={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 400,
            fontStyle: 'italic',
            letterSpacing: '0.02em'
          }}>
          "it deh yah jus luk!"
        </p>
      </div>

      <div className="w-full max-w-md space-y-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleGuestContinue}
          disabled={loading}
          className="w-full bg-gradient-to-r from-[#390067] to-purple-700 text-white font-semibold text-lg py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70"
          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          ) : (
            'Continue as Guest'
          )}
        </motion.button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-400"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 gradient-skysand text-gray-600">
              or sign in with email
            </span>
          </div>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-3">
          {isSignUp && (
            <div className="flex gap-4 mb-2">
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${role === 'tourist' ? 'border-[#0077BE] bg-blue-50' : 'border-gray-200 bg-white'}`}>
                <input
                  type="radio"
                  name="role"
                  value="tourist"
                  checked={role === 'tourist'}
                  onChange={() => setRole('tourist')}
                  className="hidden"
                />
                <span className="text-2xl">🏖️</span>
                <span className={`font-medium ${role === 'tourist' ? 'text-[#0077BE]' : 'text-gray-600'}`}>Tourist</span>
              </label>
              <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all ${role === 'operator' ? 'border-[#0077BE] bg-blue-50' : 'border-gray-200 bg-white'}`}>
                <input
                  type="radio"
                  name="role"
                  value="operator"
                  checked={role === 'operator'}
                  onChange={() => setRole('operator')}
                  className="hidden"
                />
                <span className="text-2xl">🚤</span>
                <span className={`font-medium ${role === 'operator' ? 'text-[#0077BE]' : 'text-gray-600'}`}>Operator</span>
              </label>
            </div>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white font-semibold text-lg py-3 rounded-xl shadow-lg hover:bg-[#390067] transition-all disabled:opacity-50"
            style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600 }}
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-700 text-base mt-6"
          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
          {isSignUp ? 'Already have an account? ' : 'Need an account? '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[#390067] font-semibold underline hover:text-purple-700"
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>

        <p className="text-center text-gray-600 text-sm mt-4 px-6"
          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 400 }}>
          Start exploring Florida's best experiences
        </p>
      </div>
    </div>
  );
}
