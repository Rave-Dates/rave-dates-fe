// store/useTicketChangeStore.ts
import { create } from "zustand";

type TicketChangeStore = {
  storePurchaseId: number | null;
  oldTicketsPriceTotal: number;
  oldTicketsTotal: number;

  oldTickets: Record<number, { actualQuantity: number; price: number }>;
  oldSubtracted: Record<number, { currentSubtracted: number; price: number }>;

  addSubtractedOldTicket: (ticketTypeId: number, price: number) => void;
  subtractOldTicket: (ticketTypeId: number, price: number) => void;
  setOldQuantity: (ticketTypeId: number, cantidad: number, price: number) => void;
  getTotalOldTickets: () => number;
  getTotalOldSubtracted: () => number;

  setOldTicketsTotal: (total: number) => void;
  setStorePurchaseId: (purchaseId: number) => void;
  setOldTicketsPriceTotal: (total: number) => void;

  resetStore: () => void;
  resetSubtracted: () => void;
  resetOldTicketsTotal: () => void;
  resetOldTicketsPriceTotal: () => void;
};

export const useChangeTicketStore = create<TicketChangeStore>((set, get) => ({
  storePurchaseId: null,
  oldTicketsPriceTotal: 0,
  oldTicketsTotal: 0,
  oldTickets: {},
  oldSubtracted: {},
  addSubtractedOldTicket: (ticketTypeId, price) => {
    set((state) => {
      const actual = state.oldSubtracted[ticketTypeId]?.currentSubtracted || 0;
      return { oldSubtracted: { ...state.oldSubtracted, [ticketTypeId]: { currentSubtracted: actual + 1, price } } };
    });
  },
  subtractOldTicket: (ticketTypeId, price) => {
    set((state) => {
      const actual = state.oldTickets[ticketTypeId]?.actualQuantity || 0;
      return { oldTickets: { ...state.oldTickets, [ticketTypeId]: { actualQuantity: actual - 1, price } } };
    });
  },
  setOldQuantity: (ticketTypeId, cantidad, price) => {
    set((state) => ({
      oldTickets: { ...state.oldTickets, [ticketTypeId]: { actualQuantity: cantidad, price } },
    }));
  },
  getTotalOldTickets: () => {
    return Object.values(get().oldTickets).reduce((acc, val) => acc + val.actualQuantity, 0);
  },
  resetStore: () => {
    set({ oldTickets: {} });
  },
  resetSubtracted: () => {
    set({ oldSubtracted: {} });
  },
  setOldTicketsTotal: (total) => {
    set((state) => ({
      oldTicketsTotal: state.oldTicketsTotal + total,
    }));
  },
  resetOldTicketsTotal: () => {
    set({ oldTicketsTotal: 0 });
  },
  setOldTicketsPriceTotal: (total) => {
    set((state) => ({
      oldTicketsPriceTotal: state.oldTicketsPriceTotal + total,
    }));  
  },
  setStorePurchaseId: (purchaseId) => {
    set({ storePurchaseId: purchaseId });
  },
  resetOldTicketsPriceTotal: () => {
    set({ oldTicketsPriceTotal: 0 });
  },
  getTotalOldSubtracted: () => {
    return Object.values(get().oldTickets).reduce((acc, val) => acc + val.actualQuantity, 0);
  },
}));
