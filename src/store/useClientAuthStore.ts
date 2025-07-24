import { create } from 'zustand';

type ClientAuthStore = {
  emailOrWhatsapp?: string;
  redirectToCheckout?: boolean;
  setClientAuthData: ({ emailOrWhatsapp }: { emailOrWhatsapp?: string }) => void;
  setRedirectToCheckout: (redirectToCheckout: boolean) => void;
};

export const useClientAuthStore = create<ClientAuthStore>((set) => ({
  emailOrWhatsapp: "",
  redirectToCheckout: false,
  setClientAuthData: ({ emailOrWhatsapp }) => set({ emailOrWhatsapp }),
  setRedirectToCheckout: (redirectToCheckout) => set({ redirectToCheckout }),
}));
