import { create } from 'zustand';

type ThemePreference = 'system' | 'light' | 'dark';

interface UIState {
  activeModal: string | null;
  themePreference: ThemePreference;
  openModal: (modal: string) => void;
  closeModal: () => void;
  setThemePreference: (pref: ThemePreference) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeModal: null,
  themePreference: 'system',
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  setThemePreference: (pref) => set({ themePreference: pref }),
}));
