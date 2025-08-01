import { create } from 'zustand';

type Filters = { [key: string]: string };

type EventStore = {
  events: IEvent[] | undefined;
  filters: Filters;
  setEvents: ({events}: {events: IEvent[]}) => void;
  setFilters: (filters: Filters) => void;
};

export const useEventStore = create<EventStore>((set) => ({
  events: undefined,
  filters: {},
  setEvents: ({ events }) => set({ events }),
  setFilters: (filters) => set({ filters }),
}));

