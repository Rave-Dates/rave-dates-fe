import { defaultEventFormData } from '@/constants/defaultEventFormData';
import { create } from 'zustand';

interface CreateEventState {
  hasLoadedEvent: boolean;
  hasLoadedTickets: boolean;
  editingTicketId: number | null;
  eventFormData: Partial<IEventFormData>;
  updateEventFormData: (newData: Partial<IEventFormData>) => void;
  setEditingTicketId: (id: number | null) => void;
  setHasLoadedTickets: (value: boolean) => void;
  setHasLoadedEvent: (value: boolean) => void;
}

export const useCreateEventStore = create<CreateEventState>()((set) => ({
  eventFormData: defaultEventFormData,
  hasLoadedEvent: false,
  hasLoadedTickets: false,
  editingTicketId: null,
  setHasLoadedTickets: (value) => set({ hasLoadedTickets: value }),
  setHasLoadedEvent: (value) => set({ hasLoadedEvent: value }),
  updateEventFormData: (newData: Partial<IEventFormData>) =>
    set((state) => ({
      eventFormData: {
        ...state.eventFormData,
        ...newData,
      },
  })),
  setEditingTicketId: (id) => set({ editingTicketId: id }),
}));
