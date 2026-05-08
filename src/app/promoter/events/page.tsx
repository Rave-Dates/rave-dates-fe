"use client"

import { OrganizerEventCard } from "@/components/roles/organizer/organizer-event/OrganizerEventCard";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { useAdminPromoterBinnacles, useAdminUserById } from "@/hooks/admin/queries/useAdminData";
import { useCreateEventStore } from "@/store/createEventStore";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export default function Page() {
  const { updateEventFormData, eventFormData, setHasLoadedEvent } = useCreateEventStore();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const decoded: { id: number } = (token && jwtDecode(token.toString())) || {id: 0};
  
  // obtenemos user por id
  const { data: user, isPending: isUserLoading } = useAdminUserById({ token, userId: decoded.id }); 
  const promoterId = user?.promoter?.promoterId;

  const { promoterBinnacles } = useAdminPromoterBinnacles({ promoterId: promoterId ?? 0, token: token?.toString() });

  const [filters, setFilters] = useState<string[]>(["Activo", "Inactivo"]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    updateEventFormData(defaultEventFormData);
    setHasLoadedEvent(false);
  }, [setHasLoadedEvent, updateEventFormData]);

  useEffect(() => {
    console.log("desde la lista",eventFormData)
  }, [eventFormData]);

  const isEventFuture = (date: string) => {
    return new Date(date).getTime() > new Date().getTime();
  };

  const getEventStatus = (event: any) => {
    if (!isEventFuture(event.date ?? "")) return "Finalizado";
    return event.isActive ? "Activo" : "Inactivo";
  };

  const toggleFilter = (statusName: string) => {
    setCurrentPage(1);
    setFilters((prev) =>
      prev.includes(statusName)
        ? prev.filter((s) => s !== statusName)
        : [...prev, statusName]
    );
  };

  const eventStatus = [
    {
      name: "Activo",
      className: "bg-green-500"
    },
    {
      name: "Inactivo",
      className: "bg-orange-400"
    },
    {
      name: "Finalizado",
      className: "bg-gray-400"
    }
  ];

  const filteredEvents = user?.promoter?.events?.filter((event: any) =>
    filters.includes(getEventStatus(event))
  ).sort((a: any, b: any) => {
    const timeA = new Date(a.date ?? "").getTime();
    const timeB = new Date(b.date ?? "").getTime();
    return timeB - timeA;
  });

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil((filteredEvents?.length || 0) / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  return (
    <div className="w-full flex flex-col gap-y-5 bg-primary-black text-primary-white min-h-screen pt-10 p-4 pb-40 lg:pt-32">
        <h1 className="text-3xl font-semibold mx-auto pb-3">Eventos asignados</h1>

        {/* Filter Bar */}
        <div className="flex justify-center items-center w-full max-w-md mx-auto gap-x-4">
          <div className="flex gap-2 overflow-x-auto no-scrollbar flex-wrap pb-1">
            {eventStatus.map((status) => {
              const isSelected = filters.includes(status.name);
              return (
                <button
                  key={status.name}
                  onClick={() => toggleFilter(status.name)}
                  className={`px-3 whitespace-nowrap text-sm py-1.5 rounded-full flex items-center gap-x-2 transition-all duration-300 border ${
                    isSelected
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-transparent border-transparent text-white/40 grayscale"
                  }`}
                >
                  <div
                    className={`h-2 w-2 flex-shrink-0 ${status.className} rounded-full ${
                      isSelected ? "animate-pulse" : ""
                    }`}
                  ></div>
                  {status.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Event Cards */}
        <div className="space-y-3 max-w-md mx-auto w-full">
          {
            (!paginatedEvents || paginatedEvents.length === 0) && !isUserLoading &&
            <div className="w-full text-text-inactive h-23 rounded-xl gap-x-1 p-4 flex items-center justify-center border border-white/5 bg-white/5">
              No se encontraron eventos
            </div>
          }
          {!isUserLoading && paginatedEvents && paginatedEvents.map((event: any) => (
            <OrganizerEventCard
              href="event"
              key={event.eventId}
              event={event}
              promoterId={promoterId}
              totalSold={Number(promoterBinnacles?.events?.find(b => b.eventId === event.eventId)?.feePromoter?? 0)}
            />
          ))}
          {
            isUserLoading &&
            <div className="w-full bg-cards-container h-23 rounded-xl gap-x-1 p-4 flex items-center justify-start">
              <div className="w-14 h-14 animate-pulse bg-inactive rounded-full"></div>
              <div className="flex flex-col gap-y-2 items-start justify-center">
                <div className="w-44 h-4 animate-pulse bg-inactive rounded"></div>
                <div className="w-28 h-3 animate-pulse bg-inactive rounded"></div>
                <div className="w-28 h-3 animate-pulse bg-inactive rounded"></div>
              </div>
            </div>
          }
        </div>

        {/* Pagination Controls */}
        {!isUserLoading && totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 pb-2 max-w-md mx-auto w-full">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm rounded-lg border border-white/20 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              Anterior
            </button>
            <span className="text-sm text-text-inactive font-light">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm rounded-lg border border-white/20 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              Siguiente
            </button>
          </div>
        )}
    </div>
  );
}
