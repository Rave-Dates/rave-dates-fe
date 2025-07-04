import { defaultEventFormData } from '@/constants/defaultEventFormData';
import { create } from 'zustand';

interface StageData {
  stageId: number;
  date: string | null;
  dateMax: number | null;
  price: number | null;
  quantity: number | null;
}

export interface TicketData {
  ticketId?: number;
  eventId?: number;
  name: string | null;
  stages: StageData[];
}

export interface EventFormData {
  title: string;
  date: string;
  geo: string;
  description: string;
  type: 'free' | 'paid';
  tickets: TicketData[]; 
  feeRD: number | null,
  feePB?: number | null,
  transferCost: number,
  discountCode: string,
  discount: number,
  discountType?: string,
  maxPurchase: number,
  timeOut: number,
  commission?: number | null,
  isActive?: boolean,
  labels: string[],
}

interface CreateEventState {
  editingTicketId: number | null;
  eventFormData: Partial<EventFormData>;
  updateEventFormData: (newData: Partial<EventFormData>) => void;
  setEditingTicketId: (id: number | null) => void;
}

export const useCreateEventStore = create<CreateEventState>()((set) => ({
  eventFormData: defaultEventFormData,
  editingTicketId: null,
  updateEventFormData: (newData: Partial<EventFormData>) =>
    set((state) => ({
      eventFormData: {
        ...state.eventFormData,
        ...newData,
      },
  })),
  setEditingTicketId: (id) => set({ editingTicketId: id }),
}));
