"use client"

import { useState } from "react"
import { CircularProgress } from "./ProgressCircular"
import { ProgressBar } from "./ProgressBar"
import AddSvg from "@/components/svg/AddSvg"
import EditSvg from "@/components/svg/EditSvg"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import SearchInput from "@/components/ui/inputs/search-input/SearchInput"
import { useAdminEvent, useAdminGetGuests, useAdminTicketMetrics } from "@/hooks/admin/queries/useAdminData"
import { useReactiveCookiesNext } from "cookies-next"
import Link from "next/link"

export default function OrganizerEventAttendees({eventId, isPromoter = false}: {eventId: number, isPromoter?: boolean}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IGuest[]>([]);

  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");

  const { ticketMetrics } = useAdminTicketMetrics({ token, eventId });
  const { selectedEvent } = useAdminEvent({ eventId, token });
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
    <div className="bg-primary-black text-primary-white min-h-screen px-5 pb-40">
      {/* Header */}
      <div className="flex justify-start items-center gap-x-3 pt-8">
        <GoBackButton className="z-30 top-10 left-5 px-3 py-3" />
        <h1 className="text-3xl font-medium">{selectedEvent?.title}</h1>
      </div>

      <div className="py-4 space-y-6">
        {/* Stats Section */}
        <div className="space-y-4">
          <div>
            <div className="text-text-inactive text-sm">Total asistentes</div>
            <div className="text-primary-white text-2xl font-bold">{ticketMetrics?.ticketsPurchased}</div>
          </div>

          <div className="flex items-center justify-between bg-cards-container rounded-lg py-2 px-4">
            <div>
              <div className="text-text-inactive text-sm">Total registrados</div>
              <div className="text-primary-white text-xl font-medium">
                {ticketMetrics?.ticketsPurchased}/{ticketMetrics?.totalTickets}
              </div>
            </div>
            {
              ticketMetrics?.totalTickets && ticketMetrics?.ticketsPurchased ?
              <CircularProgress current={ticketMetrics?.ticketsPurchased} total={ticketMetrics?.totalTickets} />
              :
              <CircularProgress current={0} total={100} />
            }
          </div>
        </div>

        {/* Progress Bars */}
        <div className="bg-cards-container space-y-4 rounded-lg pt-3 pb-5 px-4">
          {
            ticketMetrics?.ticketsTypesMetrics.map((ticketType) => (
              <div key={ticketType.name}>
                <h2 className="text-text-inactive">{ticketType.name}</h2>
                <ProgressBar current={ticketType.quantity} total={ticketType.total} />
              </div>
            ))
          }
          {
            ticketMetrics?.ticketsTypesMetrics.length === 0 &&
            <div className="text-center pt-2 text-text-inactive">
              No hay compras
            </div>
          }
        </div>

        {/* Search Section */}
        <div className="flex gap-x-4">
          <SearchInput
            placeholder="Busca un evento"
            value={searchTerm}
            handleFunc={handleSearch}
            results={results}
            isGuest={true}
            setSearchTerm={setSearchTerm}
          />
          <Link href={isPromoter ? `/event/${eventId}` : "attendees/add-guest"} className="border-primary flex justify-center items-center border text-primary text-2xl px-3 rounded-xl">
            <AddSvg />
          </Link>
        </div>

        {/* Attendees List */}
        <div className="space-y-3">
          {guests?.map((guest) => (
            <div key={guest.clientId} className="flex items-center justify-between py-2">
              <span className="text-primary-white">{guest.name}</span>
              <Link href={`attendees/${guest.clientId}/edit-guest`} className="bg-primary text-primary-black p-1.5 rounded-lg">
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
        </div>

        {/* Bottom Actions */}
        <button className="w-full bg-primary text-primary-black font-medium py-4 rounded-lg">Descargar lista</button>
      </div>
    </div>
  )
}
