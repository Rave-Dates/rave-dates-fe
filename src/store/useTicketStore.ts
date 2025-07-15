import { create } from 'zustand';

type TicketStage = {
  ticketTypeId: number;
  stageId: string;
  price: number;
  quantity: number;
};

type TicketStore = {
  eventId: number;
  selected: Record<string, { quantity: number; stage: TicketStage }>;
  setEventId: (eventId: number) => void;
  add: (ticket: TicketStage) => void;
  subtract: (ticketTypeId: number) => void;
};

export const useTicketStore = create<TicketStore>((set, get) => ({
  selected: {},
  eventId: 0,
  setEventId: (eventId) => set({ eventId }),
  add: (stage) => {
    const current = get().selected[stage.ticketTypeId];
    const quantity = current ? current.quantity : 0;

    if (quantity >= stage.quantity) return; // 🔒 No permitir más de lo disponible

    set((state) => ({
      selected: {
        ...state.selected,
        [stage.ticketTypeId]: {
          quantity: quantity + 1,
          stage,
        },
      },
    }));
  },
  subtract: (ticketTypeId) => {
    const current = get().selected[ticketTypeId];
    if (!current) return;
    const quantity = Math.max(0, current.quantity - 1);
    set((state) => {
      const updated = { ...state.selected };
      if (quantity === 0) {
        delete updated[ticketTypeId];
      } else {
        updated[ticketTypeId].quantity = quantity;
      }
      return { selected: updated };
    });
  }
}));
