"use client"

import { OrganizerEventCard } from "@/components/roles/organizer/organizer-event/OrganizerEventCard"

interface Event {
  eventId: number
  title: string
  subtitle: string
  date: string
  location: string
  price: string
  amountSold: string
  avatar?: string
  avatarBg?: string
}

export default function OrganizerHome() {
  const events: Event[] = [
    {
      eventId: 1,
      title: "DYEN - Extended set",
      subtitle: "Extended set",
      date: "2025-09-24 08:00hs",
      location: "Movistar Arena",
      price: "COP 250.000",
      amountSold: "230",
      avatar: "D",
      avatarBg: "bg-red-900",
    },
    {
      eventId: 2,
      title: "DYEN - Extended set",
      subtitle: "Extended set",
      date: "2025-09-24 08:00hs",
      location: "Movistar Arena",
      price: "COP 250.000",
      amountSold: "230",
      avatar: "R",
      avatarBg: "bg-blue-900",
    },
  ]

  return (
    <div className="bg-primary-black pt-14 text-primary-white min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Available Balance Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold ">Disponible</h1>
          <p className="text-primary text-2xl">COP 55.000,00</p>
        </div>

        {/* Event Cards */}
        <div className="space-y-3">
          {events.map((event) => (
            <OrganizerEventCard
              key={event.eventId}
              eventId={event.eventId}
              title={event.title}
              subtitle={event.subtitle}
              date={event.date}
              location={event.location}
              price={event.price}
              amountSold={event.amountSold}
              avatar={event.avatar}
              avatarBg={event.avatarBg}
            />
          ))}
        </div>
      </div>
    </div>
  )
}