"use client"

import React, { useEffect, useMemo, useState } from 'react';
import EventCard from '@/components/containers/home/EventCard';
import { useReactiveCookiesNext } from 'cookies-next';
import { jwtDecode } from 'jwt-decode';
import EventCardSkeleton from '@/utils/skeletons/event-skeletons/EventCardSkeleton';
import { getClientEventById } from '@/services/clients-events';
import { useClientPurchasedTickets } from '@/hooks/client/queries/useClientData';

const TicketsEventList: React.FC = () => {
  const [isUpcoming, setIsUpcoming] = useState(true);
  const [currentView, setCurrentView] = useState("upcoming");
  const [fade, setFade] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("clientToken");
  const decoded: { id: number } = (token && jwtDecode(token.toString())) || { id: 0 };
  const clientId = Number(decoded?.id);

  const { purchasedTickets, isTicketsLoading, isTicketsError } = useClientPurchasedTickets({clientId, clientToken: token});

  // Obtener los eventos asociados a los eventId de los tickets
  useEffect(() => {
    const fetchEvents = async () => {
      if (!purchasedTickets) return;

      const uniqueEventIds = Array.from(
        new Set(purchasedTickets.map(ticket => ticket.ticketType.eventId))
      );

      try {
        const fetchedEvents = await Promise.all(
          uniqueEventIds.map(eventId => getClientEventById(eventId))
        );

        setEvents(fetchedEvents.filter(Boolean)); // filtramos nulos si alguno falla
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    };

    fetchEvents();
  }, [purchasedTickets]);

  const activeEvents = useMemo(() => {
    const eventMap = new Map<number, IEvent>();
    purchasedTickets?.forEach(ticket => {
      if (ticket.status === "PENDING") {
        const eventId = ticket.ticketType.eventId;
        const event = events.find(e => e.eventId === eventId);
        if (event && !eventMap.has(eventId)) {
          eventMap.set(eventId, event);
        }
      }
    });
    return Array.from(eventMap.values());
  }, [purchasedTickets, events]);

  const finishedEvents = useMemo(() => {
    const eventMap = new Map<number, IEvent>();
    purchasedTickets?.forEach(ticket => {
      if (ticket.status === "READ" || ticket.status === "DEFEATED") {
        const eventId = ticket.ticketType.eventId;
        const event = events.find(e => e.eventId === eventId);
        if (event && !eventMap.has(eventId)) {
          eventMap.set(eventId, event);
        }
      }
    });
    return Array.from(eventMap.values());
  }, [purchasedTickets, events]);

  useEffect(() => {
    setFade(false);
    const timer = setTimeout(() => {
      setCurrentView(isUpcoming ? "upcoming" : "finished");
      setFade(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [isUpcoming]);

  return (
    <div className="py-8 pb-32 min-h-screen flex flex-col sm:pb-8 sm:pt-[7.5rem] text-primary-white bg-primary-black px-6">
      <div className="w-full sm:w-xl flex items-center justify-center mt-4 gap-1 relative bg-main-container mx-auto rounded-md px-2 py-1">
        <div
          className={`absolute bg-primary z-10 w-[47%] sm:w-1/2 h-10 pointer-events-auto rounded-md transition-all duration-300 ${
            isUpcoming
              ? "transform sm:translate-x-[-138px] translate-x-[-50%]"
              : "transform sm:translate-x-[140px] translate-x-[50%]"
          }`}
        ></div>
        <button
          onClick={() => setIsUpcoming(true)}
          className={`${isUpcoming && "text-primary-black"} w-1/2 py-2 sm:px-3 z-10`}
        >
          Próximos
        </button>
        <button
          onClick={() => setIsUpcoming(false)}
          className={`${!isUpcoming && "text-primary-black"} w-1/2 py-2 sm:px-3 z-10`}
        >
          Finalizados
        </button>
      </div>
      <div className={`transition-opacity duration-200 mt-5 ${fade ? "opacity-100" : "opacity-0"}`}>
        {isTicketsLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        {isTicketsError && !isTicketsLoading && (
          <div className="text-center h-screen py-8 text-system-error">
            Error cargando tickets
          </div>
        )}
        {!isTicketsLoading && !isTicketsError && currentView === "upcoming" ? (
          <div className="space-y-4 animate-fade-in">
            {activeEvents?.map((event) => (
              <div key={event.eventId} className="flex justify-center">
                <EventCard isTicketList={true} text="Detalles" href="/tickets/event-ticket" {...event} />
              </div>
            ))}
            {activeEvents?.length === 0 && (
              <div className="text-center py-8 text-neutral-400">
                No se encontraron tickets
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {finishedEvents?.map((event) => (
              <div key={event.eventId} className="flex justify-center">
                <EventCard isTicketList={true} text="Detalles" href="/tickets/event-ticket" {...event} />
              </div>
            ))}
            {finishedEvents?.length === 0 && (
              <div className="text-center py-8 text-neutral-400">
                No se encontraron tickets
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketsEventList;
