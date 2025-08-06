"use client"

import { useState } from "react"
import { CircularProgress } from "./ProgressCircular"
import { ProgressBar } from "./ProgressBar"
import AddSvg from "@/components/svg/AddSvg"
import EditSvg from "@/components/svg/EditSvg"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import SearchInput from "@/components/ui/inputs/search-input/SearchInput"
import { useAdminEvent, useAdminTicketMetrics } from "@/hooks/admin/queries/useAdminData"
import { useReactiveCookiesNext } from "cookies-next"

export default function OrganizerEventAttendees({eventId}: {eventId: number}) {
  console.log(eventId)
  const [searchQuery, setSearchQuery] = useState("Gimenez")
  console.log(searchQuery)
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");

  const { ticketMetrics } = useAdminTicketMetrics({ token, eventId });
  const { selectedEvent } = useAdminEvent({ eventId, token });

  const attendees = [
    { id: 1, name: "Juan Gimenez" },
    { id: 2, name: "Luciana Gimenez" },
  ]

  const stats = {
    totalAttendees: 456,
    totalRegistered: 228,
    progress1: { current: 114, total: 228 },
    progress2: { current: 114, total: 228 },
  }

  return (
    <div className="bg-primary-black text-primary-white min-h-screen px-5">
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
              ticketMetrics?.totalTickets && ticketMetrics?.ticketsPurchased &&
              <CircularProgress current={ticketMetrics?.ticketsPurchased} total={ticketMetrics?.totalTickets} />
            }
          </div>
        </div>

        {/* Progress Bars */}
        <div className="bg-cards-container space-y-4 rounded-lg pt-3 pb-4 px-4">
          {
            ticketMetrics?.ticketsTypesMetrics.map((ticketType) => (
              <div key={ticketType.name}>
                <h2 className="text-text-inactive">{ticketType.name}</h2>
                <ProgressBar current={ticketType.quantity} total={ticketType.total} />
              </div>
            ))
          }
        </div>

        {/* Search Section */}
        <div className="flex gap-x-4">
          {/* <SearchInput placeholder="Buscar" handleFunc={(e) => setSearchQuery(e.target.value)} /> */}
          <button className="border-primary border text-primary text-2xl px-3 rounded-xl">
            <AddSvg />
          </button>
        </div>

        {/* Attendees List */}
        <div className="space-y-3">
          {attendees.map((attendee) => (
            <div key={attendee.id} className="flex items-center justify-between py-2">
              <span className="text-primary-white">{attendee.name}</span>
              <button className="bg-primary text-primary-black p-1.5 rounded-lg">
                <EditSvg className="text-2xl" />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <button className="w-full bg-primary text-primary-black font-medium py-4 rounded-lg">Descargar lista</button>
      </div>
    </div>
  )
}
