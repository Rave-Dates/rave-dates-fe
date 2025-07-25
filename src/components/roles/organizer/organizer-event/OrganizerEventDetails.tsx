"use client"

import TitleCard from "@/components/common/TitleCard"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import Image from "next/image"
import OrganizerEventInfo from "./OrganizerEventInfo"

export function OrganizerEventDetails({ eventId }: { eventId: number }) {
  const event = {
    id: eventId,
    title: "DYEN",
    subtitle: "Extended set",
    date: "2025-09-24 08:00hs",
    location: "Movistar Arena",
    price: "COP 250.000",
    amountSold: "230",
    avatar: "D",
    avatarBg: "bg-red-900",
  }
  return (
    <div className="bg-primary-black min-h-screen flex flex-col text-primary-white pt-10 rounded-lg p-4 items-center">
      {/* Avatar */}
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3" />

      <div className="flex py-4 px-5 w-full mt-16 bg-input rounded-lg flex-col items-start justify-center">
        <TitleCard className="pb-4 bg-input" title={event.title} description={event.subtitle}>
          <Image src="/images/event-placeholder.png" className="rounded-full" alt="Event Avatar" width={60} height={60} />
        </TitleCard>
        <div className="flex pt-4 w-full justify-between border-t-2 border-inactive border-dashed  items-center gap-x-4">
          <h2 className="text-text-inactive">Fecha y hora</h2>
          <h2 className="text-end">2025-09-24 08:00hs</h2>
        </div>
      </div>

      <OrganizerEventInfo eventId={eventId} />
    </div>
  )
}