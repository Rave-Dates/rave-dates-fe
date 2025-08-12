"use client";

import AddSvg from "@/components/svg/AddSvg";
import Link from "next/link";
import { useState } from "react";
import DefaultButton from "@/components/ui/buttons/DefaultButton";
import UserSvg from "@/components/svg/UserSvg";
import { useReactiveCookiesNext } from "cookies-next";
import { useAdminGetGuests, useAdminTicketMetrics } from "@/hooks/admin/queries/useAdminData";
import { useParams } from "next/navigation";
import SearchInput from "@/components/ui/inputs/search-input/SearchInput";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { exportGuestsToExcel } from "@/utils/exportExcel";
import { notifyError } from "@/components/ui/toast-notifications";

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IGuest[]>([]);

  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");

  const params = useParams();
  const eventId = Number(params.eventId);

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
  
  return (
    <div className="w-full flex flex-col justify-between bg-primary-black text-primary-white min-h-screen pt-0 pb-40 sm:pt-32">
      <div className="max-w-xl w-full mx-auto animate-fade-in">
        {/* Search and Add User Section */}
        <div className="flex items-center bg-main-container gap-2 pt-10 pb-4 px-4 mb-4">
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
            <div className="text-start">Nombre y apellido</div>
            <div className="text-end">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-divider w-full">
            {guests?.map((user) => (
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
      </div>
      <div className="mx-5">
        <button
          onClick={() => {
            if (guests && guests.length > 0) {
              exportGuestsToExcel(guests);
            } else {
              notifyError("No hay invitados para exportar.");
            }
          }}          
          className="bg-primary mt-20 text-black input-button" 
        >
          Descargar
        </button>
      </div>
    </div>
  );
}
