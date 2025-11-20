import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import OperatorOnboarding from './operator/OperatorOnboarding';
import OperatorDashboardSimple from './operator/OperatorDashboardSimple';
import BookingManagement from './operator/BookingManagement';
import ExperienceCreation from './operator/ExperienceCreation';
import EarningsDashboard from './operator/EarningsDashboard';

type DemoView = 'onboarding' | 'dashboard' | 'bookings' | 'create' | 'earnings';

export default function OperatorDemo() {
  const [currentView, setCurrentView] = useState<DemoView>('dashboard'); // Start on dashboard

  const views: DemoView[] = ['onboarding', 'dashboard', 'bookings', 'create', 'earnings'];
  const viewLabels: Record<DemoView, string> = {
    onboarding: 'Onboarding',
    dashboard: 'Dashboard',
    bookings: 'Bookings',
    create: 'Create Experience',
    earnings: 'Earnings'
  };

  const currentIndex = views.indexOf(currentView);

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % views.length;
    setCurrentView(views[nextIndex]);
  };

  const goToPrev = () => {
    const prevIndex = (currentIndex - 1 + views.length) % views.length;
    setCurrentView(views[prevIndex]);
  };

  return (
    <>
      <div className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between">
        <button
          onClick={goToPrev}
          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="bg-white/90 backdrop-blur-sm px-6 py-2 rounded-full shadow-lg">
          <span className="font-bold text-sm">{viewLabels[currentView]}</span>
        </div>

        <button
          onClick={goToNext}
          className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {currentView === 'onboarding' && <OperatorOnboarding />}
      {currentView === 'dashboard' && <OperatorDashboardSimple />}
      {currentView === 'bookings' && <BookingManagement />}
      {currentView === 'create' && <ExperienceCreation />}
      {currentView === 'earnings' && <EarningsDashboard />}
    </>
  );
}
