export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
    } catch (error) {
      // Silently fail in dev/unsupported environments
    }
  }
};

export const checkPWAInstallable = () => {
  return null;
};

export const trackPWAUsage = () => {
  const dismissed = localStorage.getItem('pwa_prompt_dismissed') === 'true';
  const standalone = window.matchMedia('(display-mode: standalone)').matches;

  return {
    shouldPrompt: false,
  };
};

export const dismissPWAPrompt = () => {
  localStorage.setItem('pwa_prompt_dismissed', 'true');
};
