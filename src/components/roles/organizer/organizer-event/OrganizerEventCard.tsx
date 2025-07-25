"use client"

import Link from "next/link"

interface EventCardProps {
  title: string
  subtitle: string
  date: string
  location: string
  price: string
  amountSold: string
  avatar?: string
  avatarBg?: string
  eventId: number
}

export function OrganizerEventCard({
  eventId,
  title,
  subtitle,
  date,
  location,
  price,
  amountSold,
  avatar = "D",
  avatarBg = "bg-red-500",
}: EventCardProps) {
  return (
    <Link href={`organizer/event/${eventId}`} className="bg-cards-container rounded-lg p-4 flex items-center gap-3">
      {/* Avatar */}
      <div
        className={`w-12 h-12 ${avatarBg} rounded-full flex items-center justify-center text-white font-bold text-lg`}
      >
        {avatar}
      </div>

      {/* Event Details */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium text-sm mb-1 truncate">{title} - {subtitle}</h3>
        <p className="text-xs mb-1 truncate">
          {date} - {location}
        </p>
        <p className="text-xs">
          {amountSold} vendidos - {price}
        </p>
      </div>
    </Link>
  )
}