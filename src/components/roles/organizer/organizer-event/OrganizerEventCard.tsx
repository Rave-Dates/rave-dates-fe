"use client"

import SpinnerSvg from "@/components/svg/SpinnerSvg";
import { useEventImage } from "@/hooks/admin/queries/useEventImage";
import { formatDateToColombiaTime } from "@/utils/formatDate";
import { extractPlaceFromGeo } from "@/utils/formatGeo";
import { useReactiveCookiesNext } from "cookies-next";
import Image from "next/image";
import Link from "next/link"

export function OrganizerEventCard({event, href = "organizer/event"}: { event: IOrganizerEvent | IPromoterEvent, href?: string }) {
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const { eventId, title, subtitle, date, geo } = event;
  const { servedImageUrl, isImageLoading } = useEventImage({ eventId, token: token?.toString() });

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
        <h3 className="text-white font-medium text-sm mb-1 truncate">{title} - {subtitle}</h3>
        <p className="text-xs mb-1 truncate">
          {date && formatDateToColombiaTime(date).date} - {geo && extractPlaceFromGeo(geo)}
        </p>
        <p className="text-xs">
          {/* {amountSold} vendidos - {price} */}
          230 vendidos - COP 250.000
        </p>
      </div>
    </Link>
  )
}