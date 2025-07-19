import { create } from 'zustand';

type ClientStore = {
  name: string;
  email: string; 
  idCard: number; 
  whatsapp: string;
  setClientData: ({name, email, idCard, whatsapp}: { name?: string; email: string; idCard?: number; whatsapp: string }) => void;
};

export const useClientStore = create<ClientStore>((set) => ({
  name: "",
  email: "",
  idCard: 0,
  whatsapp: "",
  setClientData: ({name, email, idCard, whatsapp}) => set({ name, email, idCard, whatsapp }),
}));
