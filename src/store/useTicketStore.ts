import { create } from 'zustand';

type TicketStore = {
  eventId: number;
  selected: Record<string, { quantity: number; stage: TicketStage }>;
  setEventId: (eventId: number) => void;
  add: (ticket: TicketStage) => void;
  subtract: (ticketTypeId: number | undefined) => void;
  resetSelected: () => void;
  setSelected: (tickets: TicketStage[]) => void;
  replaceSelected: (tickets: TicketStage[]) => void;
};

export const useTicketStore = create<TicketStore>((set, get) => ({
  selected: {},
  eventId: 0,
  resetSelected: () => set({ selected: {} }),
  setEventId: (eventId) => set({ eventId }),
  add: (stage) => {
    const current = get().selected[stage.ticketTypeId || 0];
    const quantity = current ? current.quantity : 0;

    if (quantity >= stage.quantity) return; // 🔒 No permitir más de lo disponible

    set((state) => ({
      selected: {
        ...state.selected,
        [stage.ticketTypeId || 0]: {
          quantity: quantity + 1,
          stage,
        },
      },
    }));
  },
    setSelected: (tickets) => {
    const selected: TicketStore["selected"] = {};

    for (const ticket of tickets) {
      const id = ticket.ticketTypeId || 0;
      if (!selected[id]) {
        selected[id] = {
          quantity: 1,
          stage: ticket,
        };
      } else {
        selected[id].quantity += 1;
      }
    }

    set({ selected });
  },
    replaceSelected: (tickets) => {
    const selected: TicketStore["selected"] = {};

    for (const ticket of tickets) {
      const id = ticket.ticketTypeId || 0;
      selected[id] = {
        quantity: ticket.quantity,
        stage: ticket,
      };
    }

    set({ selected });
  },
  subtract: (ticketTypeId) => {
    const current = get().selected[ticketTypeId || 0];
    if (!current) return;
    const quantity = Math.max(0, current.quantity - 1);
    set((state) => {
      const updated = { ...state.selected };
      if (quantity === 0) {
        delete updated[ticketTypeId || 0];
      } else {
        updated[ticketTypeId || 0].quantity = quantity;
      }
      return { selected: updated };
    });
  }
}));
