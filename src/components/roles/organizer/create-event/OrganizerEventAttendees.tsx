"use client"

import { useState } from "react"
import { CircularProgress } from "./ProgressCircular"
import { ProgressBar } from "./ProgressBar"
import AddSvg from "@/components/svg/AddSvg"
import EditSvg from "@/components/svg/EditSvg"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import SearchInput from "@/components/ui/inputs/search-input/SearchInput"
import { useAdminEvent, useAdminGetGuests, useAdminPromoterTicketMetrics, useAdminTicketMetrics } from "@/hooks/admin/queries/useAdminData"
import { useReactiveCookiesNext } from "cookies-next"
import Link from "next/link"
import { exportGuestsToExcel } from "@/utils/exportExcel"
import { jwtDecode } from "jwt-decode"
import { notifyError } from "@/components/ui/toast-notifications"

import DownloadAttendeesCSVButton from "@/components/ui/buttons/DownloadAttendeesCSVButton"

export default function OrganizerEventAttendees({eventId, disableHeader = false}: {eventId: number, disableHeader?: boolean}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IGuest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const decoded: IUserLogin | null = token ? jwtDecode(token.toString()) : null;

  const { ticketMetrics } = useAdminTicketMetrics({ token, eventId });
  const { promoterTicketMetrics } = useAdminPromoterTicketMetrics({ token, eventId, promoterId: decoded?.promoterId ?? 0 });
  const { selectedEvent } = useAdminEvent({ eventId, token });
  const { guests } = useAdminGetGuests({ token, eventId });

  const metricsToUse = ticketMetrics || promoterTicketMetrics;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length === 0) {
      setResults([]);
      return;
    }

    const filtered = guests?.filter((event) =>
      event.name.toLowerCase().includes(term.toLowerCase())
    ) || [];

    setResults(filtered);
  };
  
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil((guests?.length || 0) / ITEMS_PER_PAGE);
  const paginatedGuests = guests?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="text-primary-white min-h-full px-5">
      {/* Header */}
      {
        !disableHeader &&
        <div className="flex justify-start items-center gap-x-3 pt-8">
          <GoBackButton className="z-30 top-10 left-5 px-3 py-3" />
          <h1 className="text-3xl font-medium">{selectedEvent?.title}</h1>
        </div>
      }

      <div className="py-4 space-y-6">
        {/* Stats Section */}
        <div className="space-y-4">
          <div>
            <div className="text-text-inactive text-sm">Total asistentes</div>
            <div className="text-primary-white text-2xl font-bold">{metricsToUse?.ticketsPurchased}</div>
          </div>

          <div className="flex items-center justify-between bg-cards-container rounded-lg py-2 px-4">
            <div>
              <div className="text-text-inactive text-sm">Asistentes / Aforo</div>
              <div className="text-primary-white text-xl font-medium">
                {metricsToUse?.ticketsPurchased}/{metricsToUse?.totalTickets}
              </div>
            </div>
            {
              metricsToUse?.totalTickets && metricsToUse?.ticketsPurchased ?
              <CircularProgress current={metricsToUse?.ticketsPurchased} total={metricsToUse?.totalTickets} />
              :
              <CircularProgress current={0} total={100} />
            }
          </div>
        </div>

        {/* Progress Bars */}
        <div className="bg-cards-container space-y-4 rounded-lg pt-3 pb-5 px-4">
          {
            metricsToUse?.ticketsTypesMetrics.map((ticketType) => {
              const percentage = ticketType.total > 0 
                ? ((ticketType.quantity / ticketType.total) * 100).toFixed(0) 
                : 0;
              return (
                <div key={ticketType.name}>
                  <p className="flex justify-between">
                    <h2 className="text-text-inactive">{ticketType.name}</h2>
                    <h3 className="text-primary-white">{percentage}%</h3>
                  </p>
                  <ProgressBar current={ticketType.quantity} total={ticketType.total} />
                </div>
              );
            })
          }
          {
            metricsToUse?.ticketsTypesMetrics.length === 0 &&
            <div className="text-center pt-2 text-text-inactive">
              No hay compras
            </div>
          }
        </div>

        {/* Search Section */}
        <div className="flex gap-x-4">
          <SearchInput
            placeholder="Busca un invitado"
            value={searchTerm}
            handleFunc={handleSearch}
            results={results}
            type="guest"
            setSearchTerm={setSearchTerm}
            searchClassname={disableHeader ? "bg-main-container!" : ""}
          />
          <Link href={`${eventId}/attendees/add-guest`} className="border-primary flex justify-center items-center border text-primary text-2xl px-3 rounded-xl">
            <AddSvg />
          </Link>
        </div>

        {/* Attendees List */}
        <div className="space-y-3">
          {paginatedGuests?.map((guest) => (
            <div key={guest.clientId} className="flex items-center justify-between py-2">
              <span className="text-primary-white">{guest.name}</span>
              <Link href={`${eventId}/attendees/${guest.clientId}/edit-guest`} className="bg-primary text-primary-white p-1.5 rounded-lg">
                <EditSvg className="text-2xl" />
              </Link>
            </div>
          ))}

          {
            guests?.length === 0 &&
            <div className="text-center py-4 text-text-inactive">
              No se encontraron invitados
            </div>
          }

          {/* Pagination Controls */}
          {totalPages > 1 && (
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
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col gap-4">
          <DownloadAttendeesCSVButton
            eventId={eventId}
            token={token}
            eventName={selectedEvent?.title}
            className="w-full bg-transparent border border-primary text-primary-white font-medium py-4 rounded-lg"
          />
          <button
            onClick={() => {
              if (guests && guests.length > 0) {
                exportGuestsToExcel(guests);
              } else {
                notifyError("No hay invitados para exportar.");
              }
            }}
            className="w-full bg-primary text-primary-white font-medium py-4 rounded-lg"
          >
            Descargar invitados
          </button>
        </div>      
      </div>
    </div>
  )
}
