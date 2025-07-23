import { create } from 'zustand';

type ClientAuthStore = {
  emailOrWhatsapp?: string;
  setClientAuthData: ({ emailOrWhatsapp }: { emailOrWhatsapp?: string }) => void;
};

export const useClientAuthStore = create<ClientAuthStore>((set) => ({
  emailOrWhatsapp: "",
  setClientAuthData: ({ emailOrWhatsapp }) => set({ emailOrWhatsapp }),
}));
