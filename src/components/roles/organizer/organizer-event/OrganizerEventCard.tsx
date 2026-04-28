"use client"

import SpinnerSvg from "@/components/svg/SpinnerSvg";
import UserSvg from "@/components/svg/UserSvg";
import { useAdminPromoterTicketMetrics, useAdminTicketMetrics } from "@/hooks/admin/queries/useAdminData";
import { useEventImage } from "@/hooks/admin/queries/useEventImage";
import { formatDateToColombiaTime } from "@/utils/formatDate";
import { extractPlaceFromGeo } from "@/utils/formatGeo";
import { useReactiveCookiesNext } from "cookies-next";
import Image from "next/image";
import Link from "next/link"

type Props = {
  event: IOrganizerEvent | IPromoterEvent, 
  href?: string
  totalSold?: number;
  promoterId?: number;
}

export function OrganizerEventCard({event, href = "organizer/event", totalSold, promoterId}: Props) {
  console.log("totalSold", totalSold)
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const { eventId, title, subtitle, date, geo } = event;
  const { servedImageUrl, isImageLoading } = useEventImage({ eventId, token: token?.toString() });

  const { ticketMetrics } = useAdminTicketMetrics({ token, eventId, isPromoter: !!promoterId });
  const { promoterTicketMetrics } = useAdminPromoterTicketMetrics({ token, eventId, promoterId });

  const metricsToUse = ticketMetrics || promoterTicketMetrics;

  return (
    <Link href={`${href}/${eventId}`} className="bg-cards-container rounded-lg p-4 flex items-center gap-3">
      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
      >
        {
          isImageLoading ?
          <div className="w-full h-full flex items-center justify-center bg-main-container rounded-full">
            <SpinnerSvg className="fill-primary text-inactive w-4" />
          </div>
          :
          <Image className="w-full h-full rounded-full" 
            src={servedImageUrl ?? "/images/event-placeholder.png"} 
            width={1000} 
            height={1000} 
            alt="logo" 
          />
        }
      </div>

      {/* Event Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-x-2 mb-1">
          {
            !promoterId && (
              new Date(date ?? "").getTime() > new Date().getTime() ?
              event.isActive ? 
              <div className="h-2 w-2 flex-shrink-0 bg-green-500 rounded-full"></div> 
              :
              <div className="h-2 w-2 flex-shrink-0 bg-orange-400 rounded-full"></div>
              :
              <div className="h-2 w-2 flex-shrink-0 bg-gray-400 rounded-full"></div>
            )
          }
          <h3 className="text-white font-medium text-sm truncate">{title} - {subtitle}</h3>
        </div>
        <p className="text-xs mb-1 truncate">
          {date && formatDateToColombiaTime(date).date} - {geo && extractPlaceFromGeo(geo)}
        </p>
        <p className="text-xs">
          {/* {amountSold} vendidos - {price} */}
          {metricsToUse?.ticketsPurchased ?? 0} Total vendido - {event.type === "free" ? "Gratis" : `COP ${totalSold?.toLocaleString() ?? 0}`}
        </p>
      </div>

        {
          promoterId &&
          <div className="flex justify-end gap-x-2">
            <Link
              href={`events/${eventId}/attendees`}
              className="w-8 h-8 rounded-lg flex items-center justify-center justify-self-end border border-primary text-primary"
            >
              <UserSvg stroke={1.5} className="text-xl" />
            </Link>
          </div>
        }
    </Link>
  )
}