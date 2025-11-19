import { useState } from 'react';
import OperatorOnboarding from './OperatorOnboarding';
import OperatorDashboard from './OperatorDashboard';
import BookingManagement from './BookingManagement';
import ExperienceCreation from './ExperienceCreation';
import EarningsDashboard from './EarningsDashboard';

type OperatorView = 'onboarding' | 'dashboard' | 'bookings' | 'experiences' | 'earnings' | 'create-experience';

export default function OperatorApp() {
  const [currentView, setCurrentView] = useState<OperatorView>('onboarding');
  const [isOnboarded, setIsOnboarded] = useState(false);

  if (!isOnboarded) {
    return <OperatorOnboarding />;
  }

  return (
    <>
      {currentView === 'dashboard' && <OperatorDashboard />}
      {currentView === 'bookings' && <BookingManagement />}
      {currentView === 'create-experience' && <ExperienceCreation />}
      {currentView === 'earnings' && <EarningsDashboard />}
    </>
  );
}
