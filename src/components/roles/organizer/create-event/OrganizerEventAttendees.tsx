"use client"

import { useState } from "react"
import { CircularProgress } from "./ProgressCircular"
import { ProgressBar } from "./ProgressBar"
import AddSvg from "@/components/svg/AddSvg"
import EditSvg from "@/components/svg/EditSvg"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import SearchInput from "@/components/ui/inputs/SearchInput"

export default function OrganizerEventAttendees({eventId}: {eventId: number}) {
  console.log(eventId)
  const [searchQuery, setSearchQuery] = useState("Gimenez")
  console.log(searchQuery)

  const attendees = [
    { id: 1, name: "Juan Gimenez" },
    { id: 2, name: "Luciana Gimenez" },
  ]

  const stats = {
    totalAttendees: 456,
    totalRegistered: 228,
    progress1: { current: 114, total: 228 },
    progress2: { current: 114, total: 228 },
    eliminated: 12,
  }

  return (
    <div className="bg-primary-black text-primary-white min-h-screen px-4">
      {/* Header */}
      <div className="flex justify-start items-center gap-x-3 pt-8">
        <GoBackButton className="z-30 top-10 left-5 px-3 py-3" />
        <h1 className="text-3xl font-medium">Nombre</h1>
      </div>

      <div className="py-4 space-y-6">
        {/* Stats Section */}
        <div className="space-y-4">
          <div>
            <div className="text-text-inactive text-sm">Total asistentes</div>
            <div className="text-primary-white text-2xl font-bold">{stats.totalAttendees}</div>
          </div>

          <div className="flex items-center justify-between bg-cards-container rounded-lg py-2 px-4">
            <div>
              <div className="text-text-inactive text-sm">Total registrados</div>
              <div className="text-primary-white text-xl font-medium">
                {stats.totalRegistered}/{stats.totalAttendees}
              </div>
            </div>
            <CircularProgress current={stats.totalRegistered} total={stats.totalAttendees} />
          </div>
        </div>

        {/* Progress Bars */}
        <div className=" bg-cards-container rounded-lg pt-3 pb-4 px-4">
          <h2 className="text-text-inactive">General</h2>
          <ProgressBar current={stats.progress1.current} total={stats.progress1.total} />
          <h2 className="text-text-inactive mt-4">Vip</h2>
          <ProgressBar current={stats.progress2.current} total={stats.progress2.total} />
        </div>

        {/* Search Section */}
        <div className="flex gap-x-4">
          <SearchInput placeholder="Buscar" handleFunc={(e) => setSearchQuery(e.target.value)} />
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
