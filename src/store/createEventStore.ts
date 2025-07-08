import { defaultEventFormData } from '@/constants/defaultEventFormData';
import { create } from 'zustand';

interface StageData {
  stageId: number;
  date: string | null;
  dateMax: number | null;
  price: number | null;
  quantity: number | null;
}

export interface CategoryValues {
  eventId: number;
  categoryId: number;
  valueId: number;
  value: {
    value: string;
    valueId: number;
    categoryId: number;
  };
}

export interface TicketData {
  ticketId?: number;
  eventId?: number;
  name: string | null;
  stages: StageData[];
}

export interface EventFormData {
  eventId?: string;
  title: string;
  date: string;
  geo: string;
  place: string;
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
  eventCategoryValues?: CategoryValues[],
}

interface CreateEventState {
  hasLoadedTickets: boolean;
  editingTicketId: number | null;
  eventFormData: Partial<EventFormData>;
  updateEventFormData: (newData: Partial<EventFormData>) => void;
  setEditingTicketId: (id: number | null) => void;
  setHasLoadedTickets: (value: boolean) => void;
}

export const useCreateEventStore = create<CreateEventState>()((set) => ({
  eventFormData: defaultEventFormData,
  hasLoadedTickets: false,
  editingTicketId: null,
  setHasLoadedTickets: (value) => set({ hasLoadedTickets: value }),
  updateEventFormData: (newData: Partial<EventFormData>) =>
    set((state) => ({
      eventFormData: {
        ...state.eventFormData,
        ...newData,
      },
  })),
  setEditingTicketId: (id) => set({ editingTicketId: id }),
}));
