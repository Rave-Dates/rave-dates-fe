// store/useTicketChangeStore.ts
import { create } from "zustand";

type TicketChangeStore = {
  storePurchaseId: number | null;
  oldTicketsPriceTotal: number;
  oldTicketsTotal: number;
  restados: Record<number, { cantidadActual: number; price: number }>;
  restar: (ticketTypeId: number, price: number) => void;
  setCantidadRestada: (ticketTypeId: number, cantidad: number, price: number) => void;
  getTotalRestados: () => number;
  resetStore: () => void;
  setOldTicketsTotal: (total: number) => void;
  setOldTicketsPriceTotal: (total: number) => void;
  resetOldTicketsTotal: () => void;
  setStorePurchaseId: (purchaseId: number) => void;
};

export const useChangeTicketStore = create<TicketChangeStore>((set, get) => ({
  storePurchaseId: null,
  oldTicketsPriceTotal: 0,
  oldTicketsTotal: 0,
  restados: {},
  restar: (ticketTypeId, price) => {
    set((state) => {
      const actual = state.restados[ticketTypeId]?.cantidadActual || 0;
      return { restados: { ...state.restados, [ticketTypeId]: { cantidadActual: actual - 1, price } } };
    });
  },
  setCantidadRestada: (ticketTypeId, cantidad, price) => {
    set((state) => ({
      restados: { ...state.restados, [ticketTypeId]: { cantidadActual: cantidad, price } },
    }));
  },
  getTotalRestados: () => {
    return Object.values(get().restados).reduce((acc, val) => acc + val.cantidadActual, 0);
  },
  resetStore: () => {
    set({ restados: {} });
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
    set({ oldTicketsPriceTotal: total });
  },
  setStorePurchaseId: (purchaseId) => {
    set({ storePurchaseId: purchaseId });
  },
}));
