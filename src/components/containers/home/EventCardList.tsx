"use client"

import React, { useEffect, useState } from "react";
import EventCard from "./EventCard";
import EventCardSkeleton from "@/utils/skeletons/event-skeletons/EventCardSkeleton";
import { useClientAllEvents } from "@/hooks/client/queries/useClientData";
import { useEventStore } from "@/store/useEventStore";

const EventCardList: React.FC = () => {
  const { filters } = useEventStore();

  useEffect(() => {
    console.log(filters)
  }, [filters])
  
  const [page, setPage] = useState(1);
  const limit = 10;
  const { 
    data,
    isLoading,
    isError,
    isFetching
  } = useClientAllEvents({page, limit}); 
  
  const clientEvents = (data ?? []) as IEvent[];

  useEffect(() => {
    console.log(clientEvents);
  }, [clientEvents]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  return (
    <div className="py-8 pb-40 sm:pb-8 sm:pt-[7.5rem] bg-primary-black mx-auto px-6">
      <div className="animate-fade-in">
        {!isError ? (
          <>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))
            ) : (
              clientEvents?.map((event) => (
                <div key={event.eventId} className="flex justify-center">
                  <EventCard href="event" {...event} />
                </div>
              ))
            )}
          </>
        ) : (
          <div className="text-center h-screen py-8 text-system-error">
            Error cargando eventos
          </div>
        )}
        {!isLoading && !isError && clientEvents?.length === 0 &&
          <div className="space-y-4 h-screen animate-fade-in">
            <div className="text-center py-8 text-neutral-400">
              No se encontraron eventos
            </div>
          </div>
        }
      </div>

      {/* Controles de paginado */}
      <div className="flex justify-center items-center mt-6 gap-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="px-4 py-2 text-primary-white bg-divider rounded disabled:opacity-50 disabled:pointer-events-none"
        >
          Anterior
        </button>
        <span className="text-white">{page}</span>
        <button
          onClick={() => setPage((prev) => prev + 1)}
          className="px-4 py-2 text-primary-white bg-divider rounded"
          disabled={isFetching || (clientEvents?.length || 0) < limit}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default EventCardList;
