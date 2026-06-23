"use client";

import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import EventCardSkeleton from "@/utils/skeletons/event-skeletons/EventCardSkeleton";
import { useClientAllEvents } from "@/hooks/client/queries/useClientData";
import { useEventStore } from "@/store/useEventStore";
import { useCityStore } from "@/store/useCityStore";

const EventCardList: React.FC = () => {
  const { setEvents } = useEventStore();
  const { selectedCity } = useCityStore();

  const [page, setPage] = useState(1);
  const limit = 10;
  const {
    data,
    isLoading,
    isError,
    // Eliminamos isFetching de la desestructuración si ya no la usamos directamente para el botón,
    // pero igual la pasamos si hace falta.
  } = useClientAllEvents({ page: 1, limit: 1000 });

  const clientEvents = (data ?? []) as IEvent[];

  // Filtrar para mostrar solo eventos próximos o que suceden el día de hoy
  const upcomingEvents = clientEvents
    .filter((event) => {
      if (!event.date) return false;

      const eventDate = new Date(event.date);
      const today = new Date();
      // Reiniciar la hora de "today" para que los eventos de hoy sigan viéndose
      today.setHours(0, 0, 0, 0);
      return eventDate.getTime() >= today.getTime();
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  useEffect(() => {
    if (data) {
      setEvents({ events: data });
    }
  }, [data, setEvents]);

  // Paginado desde el cliente
  const totalPages = Math.ceil((upcomingEvents?.length || 0) / limit);
  const paginatedEvents = upcomingEvents.slice(
    (page - 1) * limit,
    page * limit,
  );

  // Si llegamos a una página vacía por filtros, regresamos a la 1
  useEffect(() => {
    if (page > 1 && paginatedEvents.length === 0 && upcomingEvents.length > 0) {
      setPage(1);
    }
  }, [page, paginatedEvents.length, upcomingEvents.length]);

  return (
    <div className="pt-4 pb-40 sm:pb-50 lg:pt-32 bg-primary-black mx-auto px-0 sm:px-6">
      <p className="text-primary-white text-center gap-y-3 flex flex-col w-fit justify-center items-center mx-auto text-3xl xs:text-4xl font-semibold text-left py-4 pb-8 xs:pb-10">
        Próximos eventos
        <span
          className={`${!selectedCity && "hidden"} text-2xl xs:text-[1.75rem]`}
        >
          {selectedCity}
        </span>
      </p>
      <div className="animate-fade-in">
        {!isError ? (
          <>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))
              : paginatedEvents?.map((event) => (
                  <div key={event.eventId} className="flex justify-center">
                    <EventCard href="event" {...event} />
                  </div>
                ))}
          </>
        ) : (
          <div className="text-center h-screen py-8 text-primary">
            Error cargando eventos
          </div>
        )}
        {!isLoading && !isError && upcomingEvents?.length === 0 && (
          <div className="space-y-4 h-screen animate-fade-in">
            <div className="text-center py-8 text-neutral-400">
              No se encontraron eventos próximos
            </div>
          </div>
        )}
      </div>

      {/* Controles de paginado */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 gap-4">
          <button
            disabled={page === 1}
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setPage((prev) => Math.max(prev - 1, 1));
            }}
            className="px-4 py-2 text-primary-white bg-divider rounded disabled:opacity-50 disabled:pointer-events-none"
          >
            Anterior
          </button>
          <span className="text-white">
            {page} de {totalPages}
          </span>
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
              setPage((prev) => prev + 1);
            }}
            className="px-4 py-2 text-primary-white bg-divider rounded disabled:opacity-50 disabled:pointer-events-none"
            disabled={page >= totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default EventCardList;
