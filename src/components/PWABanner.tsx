import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { checkPWAInstallable, trackPWAUsage, dismissPWAPrompt } from '../lib/pwa';

export default function PWABanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const { shouldPrompt } = trackPWAUsage();

    if (shouldPrompt) {
      const timer = setTimeout(async () => {
        const prompt = await checkPWAInstallable();
        if (prompt) {
          setDeferredPrompt(prompt);
          setShowBanner(true);
        }
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    (deferredPrompt as any).prompt();
    const { outcome } = await (deferredPrompt as any).userChoice;

    if (outcome === 'accepted') {
      setShowBanner(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    dismissPWAPrompt();
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-0 right-0 z-50 px-4 animate-slide-up">
      <div className="bg-gradient-skysand-r rounded-2xl shadow-xl p-4 flex items-center gap-3">
        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl">
          🌴😎
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">Add TourFlo to home screen</p>
          <p className="text-sm text-gray-700">Quick access to Florida experiences</p>
        </div>
        <button
          onClick={handleInstall}
          className="flex-shrink-0 bg-white rounded-xl px-4 py-2 font-medium text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Add
        </button>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 text-gray-700 hover:text-gray-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
