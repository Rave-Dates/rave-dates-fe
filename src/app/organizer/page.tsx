"use client"

import { OrganizerEventCard } from "@/components/roles/organizer/organizer-event/OrganizerEventCard"
import LogoutSvg from "@/components/svg/LogoutSvg"
import ConfirmationModal from "@/components/ui/modals/ConfirmationModal"
import { useAdminBinnacles, useAdminUserById } from "@/hooks/admin/queries/useAdminData"
import { useReactiveCookiesNext } from "cookies-next"
import { jwtDecode } from "jwt-decode"
import Link from "next/link"
import { useState } from "react"

export default function OrganizerHome() {
  
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const decoded: { id: number } = (token && jwtDecode(token.toString())) || {id: 0};
  
  // obtenemos user por id
  const { data: user, isPending: isUserLoading } = useAdminUserById({ token, userId: decoded.id }); 
  
  const organizerId = user?.organizer?.organizerId;

  const { organizerBinnacles } = useAdminBinnacles({ organizerId: organizerId ?? 0, token: token?.toString() });

  const [filters, setFilters] = useState<string[]>(["Activo"]);
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const isEventFuture = (date: string) => {
    return new Date(date).getTime() > new Date().getTime();
  };

  const getEventStatus = (event: IOrganizerEvent) => {
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
      name: "Finalizado",
      className: "bg-gray-400"
    }
  ];

  const filteredEvents = user?.organizer?.events?.filter((event: IOrganizerEvent) =>
    filters.includes(getEventStatus(event))
  ).sort((a, b) => {
    const timeA = new Date(a.date ?? "").getTime();
    const timeB = new Date(b.date ?? "").getTime();
    return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
  });

  const ITEMS_PER_PAGE = 5;
  const totalPages = Math.ceil((filteredEvents?.length || 0) / ITEMS_PER_PAGE);
  const paginatedEvents = filteredEvents?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const getTotalAvalible = () => {
    let pendingPayment = 0;
    if (organizerBinnacles) {
      organizerBinnacles.forEach((binnacle) => {
        pendingPayment += Number(binnacle.pendingPayment);
      });
    }
    return pendingPayment.toLocaleString('es-CO');
  }

  return (
    <div className="bg-primary-black pt-14 md:pt-32 text-primary-white min-h-screen pb-40 p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Available Balance Header */}
        <div className="flex w-full justify-between items-center">
          <h1 className="text-3xl max-w-70 font-semibold">{user?.name}</h1>

          <ConfirmationModal
            isLogout
            title="Cerrar Sesión"
            description="¿Estás seguro de que quieres cerrar tu sesión actual?"
            confirmText="Cerrar Sesión"
            showModal={true}
            trigger={
              <button
                type="button"
                className="bg-system-error text-primary-white text-2xl p-2.5 rounded-lg flex items-center justify-center text-center transition-all active:scale-95"
                aria-label="Desloguearse"
              >
                <LogoutSvg />
              </button>
            }
          />
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-semibold ">Disponible</h1>
          <p className="text-primary-white text-2xl"><span className="text-primary">COP $</span>{getTotalAvalible()}</p>
        </div>

        {/* Event Cards */}
        <div className="flex justify-between items-center w-full gap-x-4">
          <div className="flex gap-x-2 overflow-x-auto no-scrollbar pb-1">
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

          <button 
            onClick={() => {
              setSortOrder(prev => prev === "desc" ? "asc" : "desc");
              setCurrentPage(1);
            }}
            className="flex items-center justify-center p-2 rounded-full border border-white/20 bg-white/10 text-white transition-all active:scale-95 shrink-0"
            title={sortOrder === "desc" ? "Más recientes primero" : "Más antiguos primero"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={1.5} 
              stroke="currentColor" 
              className={`w-4 h-4 transition-transform duration-300 ${sortOrder === "asc" ? "rotate-180" : ""}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </button>
        </div>

        <div className="space-y-3 mt-2">
          {
            (!filteredEvents || filteredEvents.length === 0) && !isUserLoading &&
            <div className="w-full text-text-inactive h-23 rounded-xl gap-x-1 p-4 flex items-center justify-center">
              No se encontraron eventos
            </div>
          }
          {!isUserLoading && paginatedEvents && paginatedEvents.map((event: IOrganizerEvent) => (
            <OrganizerEventCard
              href="organizer/event"
              key={event.eventId}
              event={event}
              totalSold={Number(organizerBinnacles?.find(b => b.eventId === event.eventId)?.total ?? 0)}
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
          <div className="flex items-center justify-between pt-4 pb-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm rounded-lg border border-white/20 bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
            >
              Anterior
            </button>
            <span className="text-sm text-text-inactive">
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

        <Link
          href="organizer/events/create-event"
          className="bg-primary block text-center max-w-xl self-center text-primary-white input-button"
        >
          Crear evento gratuito
        </Link>
      </div>
    </div>
  )
}