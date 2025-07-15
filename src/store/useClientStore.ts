import { create } from 'zustand';

type ClientStore = {
  name: string;
  email: string; 
  idCard: number; 
  whatsapp: number;
  setClientData: (name: string, email: string, idCard: number, whatsapp: number) => void;
};

export const useClientStore = create<ClientStore>((set) => ({
  name: "",
  email: "",
  idCard: 0,
  whatsapp: 0,
  setClientData: (name, email, idCard, whatsapp) => set({ name, email, idCard, whatsapp }),
}));
