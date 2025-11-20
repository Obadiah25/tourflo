import { useEffect, useState } from 'react';
import { useAppStore } from './lib/store';
import { registerServiceWorker } from './lib/pwa';
import PWABanner from './components/PWABanner';
import SplashScreen from './components/SplashScreen';
import OnboardingFlow from './components/OnboardingFlow';
import AuthScreen from './components/AuthScreen';
import MainLayout from './components/MainLayout';
import OperatorDemo from './components/OperatorDemo';
import LandingPage from './components/LandingPage';
import { BookingProvider } from './contexts/BookingContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

console.log('%c🌴 TOURFLO FLORIDA ☀️', 'font-size: 24px; font-weight: bold; color: #0077BE;');
console.log('%cWelcome to the console! Watch the logs below to debug the app flow.', 'color: #666;');
console.log('%c─────────────────────────────────────────────────────', 'color: #ddd;');

type ScreenName = 'splash' | 'landing' | 'auth' | 'onboarding' | 'main' | 'operator';

function AppContent() {
  const { session, isGuestMode, loading, guestLogin, logout } = useAuth();
  const [devMode, setDevMode] = useState(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('landing');
  const [devScreen, setDevScreen] = useState<ScreenName>('landing');
  const { isFirstVisit, hasCompletedOnboarding, markVisited } = useAppStore();
  const [navigationParams, setNavigationParams] = useState<any>(null);

  useEffect(() => {
    console.log('═══════════════════════════════════════');
    console.log('📱 TOURFLO APP STATE:');
    console.log('   Loading:', loading);
    console.log('   Has Session:', !!session);
    console.log('   Guest Mode:', isGuestMode);
    console.log('   First Visit:', isFirstVisit);
    console.log('   Onboarding Done:', hasCompletedOnboarding);
    console.log('═══════════════════════════════════════');
    if (!loading) {
      if (!session && !isGuestMode) {
        console.log('🔐 SHOULD SHOW: Landing Page');
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

    if (!loading) {
      if (session) {
        const role = session.user.user_metadata?.role;
        if (role === 'operator') {
          setCurrentScreen('operator');
        } else {
          // Tourists go to main app, onboarding is optional
          setCurrentScreen('main');
        }
      } else if (isGuestMode) {
        // Guests go to main app
        setCurrentScreen('main');
      } else {
        setCurrentScreen('landing');
      }
    }
  }, [loading, session, isGuestMode, hasCompletedOnboarding]);

  const handleSplashComplete = () => {
    setCurrentScreen('landing');
  };

  const handleNavigate = (screen: ScreenName, params?: any) => {
    if (params) {
      setNavigationParams(params);
    }

    if (screen === 'main') {
      guestLogin();
    }

    setCurrentScreen(screen);
  };

  const handleLandingNavigate = (screen: 'auth' | 'operator' | 'main') => {
    if (screen === 'operator') {
      if (devMode) {
        setDevScreen('operator');
      } else {
        setCurrentScreen('operator');
      }
    } else if (screen === 'main') {
      // Guest browsing mode
      guestLogin();
      setCurrentScreen('main');
    } else {
      setCurrentScreen(screen);
    }
  };

  const handleAuthComplete = (role?: 'tourist' | 'operator') => {
    if (role === 'operator') {
      setCurrentScreen('operator');
    } else {
      // Check for return path
      if (navigationParams?.returnTo) {
        setCurrentScreen(navigationParams.returnTo);
        // Keep params if needed by the destination, or clear them if they were just for routing
        // For now, we'll keep them in state so MainLayout can read them if needed
      } else {
        setCurrentScreen('main');
      }
    }
  };

  const handleOnboardingComplete = () => {
    markVisited();
    setCurrentScreen('main');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentScreen('landing');
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

  const screens: ScreenName[] = ['splash', 'landing', 'auth', 'onboarding', 'main', 'operator'];
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

        {devScreen === 'splash' && <SplashScreen onComplete={() => setDevScreen('landing')} />}
        {devScreen === 'landing' && <LandingPage onNavigate={(screen) => setDevScreen(screen)} />}
        {devScreen === 'auth' && <AuthScreen onAuth={(role) => setDevScreen(role === 'operator' ? 'operator' : 'onboarding')} />}
        {devScreen === 'onboarding' && <OnboardingFlow onComplete={() => setDevScreen('main')} />}
        {devScreen === 'main' && (
          <BookingProvider>
            <PWABanner />
            <MainLayout
              session={session}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
              navigationParams={navigationParams}
            />
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

  if (currentScreen === 'landing') {
    console.log('🎬 RENDERING → LandingPage');
    return <LandingPage onNavigate={handleLandingNavigate} />;
  }

  if (currentScreen === 'auth') {
    console.log('🎬 RENDERING → AuthScreen');
    return <AuthScreen onAuth={handleAuthComplete} />;
  }

  if (currentScreen === 'onboarding') {
    console.log('🎬 RENDERING → OnboardingFlow');
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (currentScreen === 'operator') {
    console.log('🎬 RENDERING → OperatorDemo');
    return <OperatorDemo />;
  }

  console.log('🎬 RENDERING → MainLayout (includes DiscoveryFeed)');
  return (
    <BookingProvider>
      <PWABanner />
      <MainLayout
        session={session}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        navigationParams={navigationParams}
      />
    </BookingProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
