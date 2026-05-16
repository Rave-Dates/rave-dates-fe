import { create } from "zustand";

type TransferStore = {
  transferData: ITransferUser | null;
  purchaseTicketId: number | null;
  eventId: number | null;
  setTransferData: (data: ITransferUser, purchaseTicketId: number, eventId: number) => void;
  clearTransferData: () => void;
};

export const useTransferStore = create<TransferStore>((set) => ({
  transferData: null,
  purchaseTicketId: null,
  eventId: null,
  setTransferData: (data, purchaseTicketId, eventId) => set({ transferData: data, purchaseTicketId, eventId }),
  clearTransferData: () => set({ transferData: null, purchaseTicketId: null, eventId: null }),
}));
