import { create } from 'zustand';

type CityStore = {
  selectedCity: string;
  hasSelectedCity: boolean;
  isModalOpen: boolean;
  setSelectedCity: (city: string) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  clearCity: () => void;
  hydrate: () => void;
};

const getStoredCity = (): { city: string; hasSelected: boolean } => {
  if (typeof window === 'undefined') return { city: '', hasSelected: false };
  const stored = localStorage.getItem('selectedCity');
  if (stored) return { city: stored, hasSelected: true };
  return { city: '', hasSelected: false };
};

export const useCityStore = create<CityStore>((set) => {
  return {
    selectedCity: '',
    hasSelectedCity: false,
    isModalOpen: false,
    setSelectedCity: (city: string) => {
      localStorage.setItem('selectedCity', city);
      set({ selectedCity: city, hasSelectedCity: true, isModalOpen: false });
    },
    setIsModalOpen: (isOpen: boolean) => set({ isModalOpen: isOpen }),
    clearCity: () => {
      localStorage.removeItem('selectedCity');
      set({ selectedCity: '', hasSelectedCity: false, isModalOpen: true });
    },
    // Action to load from localStorage after mount
    hydrate: () => {
      const stored = localStorage.getItem('selectedCity');
      if (stored) {
        set({ selectedCity: stored, hasSelectedCity: true, isModalOpen: false });
      } else {
        set({ isModalOpen: true });
      }
    }
  };
});
