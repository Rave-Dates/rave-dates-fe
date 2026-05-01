"use client";

import AddSvg from "@/components/svg/AddSvg";
import Link from "next/link";
import { useState } from "react";
import DefaultButton from "@/components/ui/buttons/DefaultButton";
import UserSvg from "@/components/svg/UserSvg";
import { useReactiveCookiesNext } from "cookies-next";
import { useAdminEvent, useAdminGetGuests, useAdminTicketMetrics } from "@/hooks/admin/queries/useAdminData";
import { useParams } from "next/navigation";
import SearchInput from "@/components/ui/inputs/search-input/SearchInput";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { exportGuestsToExcel } from "@/utils/exportExcel";
import { notifyError } from "@/components/ui/toast-notifications";

import DownloadAttendeesCSVButton from "@/components/ui/buttons/DownloadAttendeesCSVButton";

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IGuest[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");

  const params = useParams();
  const eventId = Number(params.eventId);

  const { selectedEvent } = useAdminEvent({ token, eventId });
  const { ticketMetrics } = useAdminTicketMetrics({ token, eventId });
  const { guests } = useAdminGetGuests({ token, eventId });

  console.log(ticketMetrics)

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
    <div className="w-full flex flex-col justify-between bg-primary-black text-primary-white min-h-screen pt-0 pb-40 lg:pt-24">
      <div className="w-full mx-auto animate-fade-in">
        {/* Search and Add User Section */}
        <h1 className="text-2xl text-center bg-main-container pt-8 pb-6 font-semibold">{selectedEvent?.title}</h1>
        <div className="flex items-center bg-main-container gap-2 pb-4 px-4 mb-4">
          <GoBackButton className="animate-fade-in !rounded-lg p-2.5" />
          <SearchInput
            placeholder="Busca un usuario"
            value={searchTerm}
            handleFunc={handleSearch}
            results={results}
            type="guest"
            setSearchTerm={setSearchTerm}
          />
          <Link
            href="attendees/add-attendee"
            className="border border-primary text-primary text-2xl p-2.5 rounded-lg flex items-center justify-center text-center"
            aria-label="Añadir usuario"
          >
            <AddSvg />
          </Link>
        </div>

        {/* Users Table/List */}
        <div className="rounded-md overflow-hidden px-4">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr] border-b border-divider text-text-inactive gap-x-2 text-sm py-2 px-3">
            <div className="text-start">Nombre</div>
            <div className="text-end">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-divider w-full">
            {paginatedGuests?.map((user) => (
              <div
                key={user.clientId}
                className="grid grid-cols-[2fr_1fr] items-center py-3 px-3 gap-x-2 text-sm"
              >
                <div className="text-start">{user.name}</div>
                <div className="flex justify-end">
                  <DefaultButton className="text-xl !bg-transparent border border-primary !text-primary" icon={<UserSvg stroke={1.5} />} href={`attendees/${user.clientId}/edit-attendee`} /> 
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {guests?.length === 0 && (
          <div className="text-center py-8 text-neutral-400">
            No se encontraron usuarios
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 pb-2 px-4">
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
      <div className="mx-5 flex flex-col gap-4 mt-20">
        <DownloadAttendeesCSVButton eventId={eventId} token={token} eventName={selectedEvent?.title} />
        <button
          onClick={() => {
            if (guests && guests.length > 0) {
              exportGuestsToExcel(guests);
            } else {
              notifyError("No hay invitados para exportar.");
            }
          }}          
          className="bg-primary text-primary-white input-button" 
        >
          Descargar invitados
        </button>
      </div>
    </div>
  );
}
