import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Settings,
  Camera,
  Calendar,
  Heart,
  CreditCard,
  User,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { haptics } from '../lib/haptics';

interface ProfileScreenProps {
  session: any;
  onBack: () => void;
  onNavigate: (screen: 'trips' | 'saved' | 'settings') => void;
  onLogout: () => void;
}

interface UserProfile {
  name: string;
  email: string;
  memberSince: string;
  bookingCount: number;
  savedCount: number;
  avatarUrl: string | null;
}

export default function ProfileScreen({ session, onBack, onNavigate, onLogout }: ProfileScreenProps) {
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Guest User',
    email: '',
    memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    bookingCount: 0,
    savedCount: 0,
    avatarUrl: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      loadUserProfile();
    } else {
      // Guest mode
      setIsLoading(false);
    }
  }, [session]);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);

      if (!session?.user) return;

      const email = session.user.email || '';
      const name = session.user.user_metadata?.full_name ||
        session.user.user_metadata?.name ||
        email.split('@')[0] ||
        'Guest User';

      const createdAt = new Date(session.user.created_at);
      const memberSince = createdAt.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });

      const { count: bookingCount } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      const { count: savedCount } = await supabase
        .from('saved_experiences')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      setProfile({
        name,
        email,
        memberSince,
        bookingCount: bookingCount || 0,
        savedCount: savedCount || 0,
        avatarUrl: session.user.user_metadata?.avatar_url || null
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleMenuClick = (action: string) => {
    haptics.light();

    switch (action) {
      case 'trips':
        onNavigate('trips');
        break;
      case 'saved':
        onNavigate('saved');
        break;
      case 'settings':
        onNavigate('settings');
        break;
      case 'logout':
        handleLogout();
        break;
    }
  };

  const handleLogout = async () => {
    haptics.medium();
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      await supabase.auth.signOut();
      onLogout();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-skysand flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">👤</div>
          <p className="text-lg text-gray-700">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-skysand">
      <header className="flex-shrink-0 bg-white shadow-md">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => { haptics.light(); onBack(); }}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1
            className="text-xl font-bold text-gray-900"
            style={{ fontFamily: 'Poppins' }}
          >
            Profile
          </h1>
          <button
            onClick={() => handleMenuClick('settings')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 pb-20">
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <div className="flex flex-col items-center">
              <div className="relative">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-purple-100"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#390067] to-purple-700 flex items-center justify-center border-4 border-purple-100">
                    <span
                      className="text-3xl font-bold text-white"
                      style={{ fontFamily: 'Poppins' }}
                    >
                      {getInitials(profile.name)}
                    </span>
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <h2
                className="text-2xl font-bold text-gray-900 mt-4 text-center"
                style={{ fontFamily: 'Poppins' }}
              >
                {profile.name}
              </h2>
              <p className="text-gray-600 text-center mt-1">{profile.email}</p>
              <p className="text-sm text-gray-500 text-center mt-2">
                Member since {profile.memberSince}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <div
                className="text-2xl font-bold text-[#390067] mb-1"
                style={{ fontFamily: 'Poppins' }}
              >
                {profile.bookingCount}
              </div>
              <div className="text-xs text-gray-600">Bookings</div>
            </div>

            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <div
                className="text-2xl font-bold text-[#390067] mb-1"
                style={{ fontFamily: 'Poppins' }}
              >
                {profile.savedCount}
              </div>
              <div className="text-xs text-gray-600">Saved</div>
            </div>

            <div className="bg-white rounded-2xl p-4 text-center shadow">
              <div
                className="text-2xl font-bold text-[#390067] mb-1"
                style={{ fontFamily: 'Poppins' }}
              >
                0
              </div>
              <div className="text-xs text-gray-600">Reviews</div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-lg mb-6 overflow-hidden">
            <button
              onClick={() => handleMenuClick('trips')}
              className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#390067]" />
                </div>
                <span
                  className="font-medium text-gray-900"
                  style={{ fontFamily: 'Poppins' }}
                >
                  My Trips
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => handleMenuClick('saved')}
              className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
                <span
                  className="font-medium text-gray-900"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Saved Experiences
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => handleMenuClick('settings')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600" />
                </div>
                <span
                  className="font-medium text-gray-900"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Settings
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-lg mb-6 overflow-hidden">
            <button
              onClick={() => haptics.light()}
              className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <span
                  className="font-medium text-gray-900"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Edit Profile
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => haptics.light()}
              className="w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-green-600" />
                </div>
                <span
                  className="font-medium text-gray-900"
                  style={{ fontFamily: 'Poppins' }}
                >
                  Help & Support
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => haptics.light()}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Info className="w-5 h-5 text-yellow-600" />
                </div>
                <span
                  className="font-medium text-gray-900"
                  style={{ fontFamily: 'Poppins' }}
                >
                  About TourFlo
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <button
            onClick={() => handleMenuClick('logout')}
            className="w-full bg-white rounded-2xl shadow p-4 hover:bg-red-50 transition-colors"
          >
            <div className="flex items-center justify-center gap-2">
              <LogOut className="w-5 h-5 text-red-500" />
              <span
                className="font-semibold text-red-500"
                style={{ fontFamily: 'Poppins' }}
              >
                Logout
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
