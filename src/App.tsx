import { useEffect, useState } from 'react';
import { useAppStore } from './lib/store';
import { registerServiceWorker } from './lib/pwa';
import PWABanner from './components/PWABanner';
import SplashScreen from './components/SplashScreen';
import OnboardingFlow from './components/OnboardingFlow';
import AuthScreen from './components/AuthScreen';
import MainLayout from './components/MainLayout';
import OperatorDemo from './components/OperatorDemo';
import { BookingProvider } from './contexts/BookingContext';
import { supabase } from './lib/supabase';
import { ChevronLeft, ChevronRight } from 'lucide-react';

console.log('%c🌴 LOOKYAH JAMAICA 😎', 'font-size: 24px; font-weight: bold; color: #4A1A4A;');
console.log('%cWelcome to the console! Watch the logs below to debug the app flow.', 'color: #666;');
console.log('%c─────────────────────────────────────────────────────', 'color: #ddd;');

type ScreenName = 'splash' | 'auth' | 'onboarding' | 'main' | 'operator';

function App() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [devMode, setDevMode] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('splash');
  const [devScreen, setDevScreen] = useState<ScreenName>('splash');
  const { isFirstVisit, hasCompletedOnboarding, markVisited } = useAppStore();

  useEffect(() => {
    console.log('═══════════════════════════════════════');
    console.log('📱 LOOKYAH APP STATE:');
    console.log('   Loading:', loading);
    console.log('   Has Session:', !!session);
    console.log('   Guest Mode:', isGuestMode);
    console.log('   First Visit:', isFirstVisit);
    console.log('   Onboarding Done:', hasCompletedOnboarding);
    console.log('═══════════════════════════════════════');
    if (!loading) {
      if (!session && !isGuestMode) {
        console.log('🔐 SHOULD SHOW: Auth Screen');
      } else if (!hasCompletedOnboarding && isFirstVisit) {
        console.log('👋 SHOULD SHOW: Onboarding Flow');
      } else {
        console.log('🏝️  SHOULD SHOW: Main App (Discovery Feed)');
      }
    }
    console.log('💡 To reset: localStorage.clear(); location.reload()');
  }, [loading, session, isGuestMode, isFirstVisit, hasCompletedOnboarding]);

  useEffect(() => {
    registerServiceWorker();

    const guestMode = localStorage.getItem('lookyah_guest_mode') === 'true';
    setIsGuestMode(guestMode);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session as any);
      setLoading(false);

      if (session) {
        if (hasCompletedOnboarding) {
          setCurrentScreen('main');
        } else {
          setCurrentScreen('onboarding');
        }
      } else if (guestMode) {
        if (hasCompletedOnboarding) {
          setCurrentScreen('main');
        } else {
          setCurrentScreen('onboarding');
        }
      } else {
        setCurrentScreen('splash');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session as any);
    });

    return () => subscription.unsubscribe();
  }, [hasCompletedOnboarding]);

  const handleSplashComplete = () => {
    setCurrentScreen('auth');
  };

  const handleAuthComplete = () => {
    if (hasCompletedOnboarding) {
      setCurrentScreen('main');
    } else {
      setCurrentScreen('onboarding');
    }
  };

  const handleOnboardingComplete = () => {
    markVisited();
    setCurrentScreen('main');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('lookyah_guest_mode');
    setSession(null);
    setIsGuestMode(false);
    setCurrentScreen('auth');
  };

  useEffect(() => {
    if (!loading && (session || isGuestMode) && !devMode) {
      const timer = setTimeout(() => {
        markVisited();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, session, isGuestMode, markVisited, devMode]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setDevMode(prev => !prev);
        console.log('🔧 DEV MODE:', !devMode ? 'ENABLED' : 'DISABLED');
      }
      if (e.ctrlKey && e.shiftKey && e.key === 'O') {
        setDevMode(true);
        setDevScreen('operator');
        console.log('🏢 OPERATOR MODE: ENABLED');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [devMode]);

  const screens: ScreenName[] = ['splash', 'auth', 'onboarding', 'main', 'operator'];
  const currentScreenIndex = screens.indexOf(devScreen);

  const goToNextScreen = () => {
    const nextIndex = (currentScreenIndex + 1) % screens.length;
    setDevScreen(screens[nextIndex]);
  };

  const goToPrevScreen = () => {
    const prevIndex = (currentScreenIndex - 1 + screens.length) % screens.length;
    setDevScreen(screens[prevIndex]);
  };

  if (devMode) {
    console.log('🔧 DEV MODE ACTIVE → Showing:', devScreen);
    const prevScreenName = screens[(currentScreenIndex - 1 + screens.length) % screens.length];
    const nextScreenName = screens[(currentScreenIndex + 1) % screens.length];

    return (
      <>
        <button
          onClick={goToPrevScreen}
          className="fixed left-4 top-4 z-50 transition-all"
          title={`Go to ${prevScreenName}`}
        >
          <ChevronLeft className="w-8 h-8 text-gray-900" />
        </button>

        <button
          onClick={goToNextScreen}
          className="fixed right-4 top-4 z-50 transition-all"
          title={`Go to ${nextScreenName}`}
        >
          <ChevronRight className="w-8 h-8 text-gray-900" />
        </button>

        {devScreen === 'splash' && <SplashScreen onComplete={() => setDevScreen('auth')} />}
        {devScreen === 'auth' && <AuthScreen onAuth={() => setDevScreen('onboarding')} />}
        {devScreen === 'onboarding' && <OnboardingFlow onComplete={() => setDevScreen('main')} />}
        {devScreen === 'main' && (
          <BookingProvider>
            <PWABanner />
            <MainLayout session={session} onLogout={handleLogout} />
          </BookingProvider>
        )}
        {devScreen === 'operator' && <OperatorDemo />}
      </>
    );
  }

  if (loading || currentScreen === 'splash') {
    console.log('🎬 RENDERING → SplashScreen');
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (currentScreen === 'auth') {
    console.log('🎬 RENDERING → AuthScreen');
    return <AuthScreen onAuth={handleAuthComplete} />;
  }

  if (currentScreen === 'onboarding') {
    console.log('🎬 RENDERING → OnboardingFlow');
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  console.log('🎬 RENDERING → MainLayout (includes DiscoveryFeed)');
  return (
    <BookingProvider>
      <PWABanner />
      <MainLayout session={session} onLogout={handleLogout} />
    </BookingProvider>
  );
}

export default App;
