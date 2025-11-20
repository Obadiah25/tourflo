import { create } from 'zustand';

interface AppState {
  user_id: string | null;
  isOnboarded: boolean;
  isFirstVisit: boolean;
  hasCompletedOnboarding: boolean;
  currency_pref: 'USD';
  userPreferences: Record<string, any>;
  setUser: (id: string | null) => void;
  completeOnboarding: () => void;
  setCurrency: (currency: 'USD') => void;
  setUserPreference: (key: string, value: any) => void;
  markVisited: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user_id: null,
  isOnboarded: false,
  isFirstVisit: localStorage.getItem('tourflo_visited') !== 'true',
  hasCompletedOnboarding: localStorage.getItem('tourflo_onboarded') === 'true',
  currency_pref: 'USD',
  userPreferences: {},
  setUser: (id) => set({ user_id: id }),
  completeOnboarding: () => {
    localStorage.setItem('tourflo_onboarded', 'true');
    set({ isOnboarded: true, hasCompletedOnboarding: true });
  },
  setCurrency: (currency) => set({ currency_pref: currency }),
  setUserPreference: (key, value) =>
    set((state) => ({
      userPreferences: { ...state.userPreferences, [key]: value },
    })),
  markVisited: () => {
    localStorage.setItem('tourflo_visited', 'true');
    set({ isFirstVisit: false });
  },
}));
