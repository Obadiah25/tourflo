import { create } from 'zustand';

interface AppState {
  user_id: string | null;
  isOnboarded: boolean;
  isFirstVisit: boolean;
  hasCompletedOnboarding: boolean;
  currency_pref: 'USD' | 'JMD';
  userPreferences: Record<string, any>;
  setUser: (id: string | null) => void;
  completeOnboarding: () => void;
  setCurrency: (currency: 'USD' | 'JMD') => void;
  setUserPreference: (key: string, value: any) => void;
  markVisited: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user_id: null,
  isOnboarded: false,
  isFirstVisit: localStorage.getItem('lookyah_visited') !== 'true',
  hasCompletedOnboarding: localStorage.getItem('lookyah_onboarded') === 'true',
  currency_pref: 'USD',
  userPreferences: {},
  setUser: (id) => set({ user_id: id }),
  completeOnboarding: () => {
    localStorage.setItem('lookyah_onboarded', 'true');
    set({ isOnboarded: true, hasCompletedOnboarding: true });
  },
  setCurrency: (currency) => set({ currency_pref: currency }),
  setUserPreference: (key, value) =>
    set((state) => ({
      userPreferences: { ...state.userPreferences, [key]: value },
    })),
  markVisited: () => {
    localStorage.setItem('lookyah_visited', 'true');
    set({ isFirstVisit: false });
  },
}));
