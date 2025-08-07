import { create } from 'zustand';

type Filters = { [key: string]: string };

type EventStore = {
  events: IEvent[] | undefined;
  filters: Filters;
  setEvents: ({events}: {events: IEvent[]}) => void;
  setFilters: (filters: Filters) => void;
};

export const useEventStore = create<EventStore>((set, get) => ({
  events: undefined,
  filters: {},
  setEvents: ({ events }) => set({ events }),
  setFilters: (filters) => set({ filters }),
    searchEvents: (term: string) => {
    const search = term.toLowerCase();
    const filtered = get().events?.filter((event) =>
      event.title.toLowerCase().includes(search)
    );
    set({ events: filtered });
  },
}));

