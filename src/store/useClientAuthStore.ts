import { create } from 'zustand';

type ClientAuthStore = {
  isEmailOrWhatsapp: string;
  emailOrWhatsapp?: string;
  redirectToCheckout?: boolean;
  setClientAuthData: ({ emailOrWhatsapp }: { emailOrWhatsapp?: string }) => void;
  setRedirectToCheckout: (redirectToCheckout: boolean) => void;
  setIsEmailOrWhatsapp: (isEmailOrWhatsapp: string) => void;
};

export const useClientAuthStore = create<ClientAuthStore>((set) => ({
  isEmailOrWhatsapp: "",
  emailOrWhatsapp: "",
  redirectToCheckout: false,
  setClientAuthData: ({ emailOrWhatsapp }) => set({ emailOrWhatsapp }),
  setRedirectToCheckout: (redirectToCheckout) => set({ redirectToCheckout }),
  setIsEmailOrWhatsapp: (isEmailOrWhatsapp) => set({ isEmailOrWhatsapp }),
}));
