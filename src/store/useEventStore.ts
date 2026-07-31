import { create } from 'zustand';

type Filters = { [key: string]: string[] };

type EventStore = {
  events: IEvent[] | undefined;
  filters: Filters;
  initialRaveFilterApplied: boolean;
  setEvents: ({events}: {events: IEvent[]}) => void;
  setFilters: (filters: Filters) => void;
  setInitialRaveFilterApplied: (val: boolean) => void;
};

export const useEventStore = create<EventStore>((set, get) => ({
  events: undefined,
  filters: {},
  initialRaveFilterApplied: false,
  setEvents: ({ events }) => set({ events }),
  setFilters: (filters) => set({ filters }),
  setInitialRaveFilterApplied: (val) => set({ initialRaveFilterApplied: val }),
    searchEvents: (term: string) => {
    const search = term.toLowerCase();
    const filtered = get().events?.filter((event) =>
      event.title.toLowerCase().includes(search)
    );
    set({ events: filtered });
  },
}));

