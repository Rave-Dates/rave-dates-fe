import { create } from 'zustand';

type ClientStore = {
  emailOrWhatsapp?: string;
  name: string;
  email: string; 
  idCard: number; 
  whatsapp: string;
  setClientData: ({name, email, idCard, whatsapp, emailOrWhatsapp}: {name: string, email: string, idCard: number, whatsapp: string, emailOrWhatsapp?: string}) => void;
};

export const useClientStore = create<ClientStore>((set) => ({
  emailOrWhatsapp: "",
  name: "",
  email: "",
  idCard: 0,
  whatsapp: "",
  setClientData: ({name, email, idCard, whatsapp, emailOrWhatsapp }) => set({ name, email, idCard, whatsapp, emailOrWhatsapp }),
}));
