"use client"

import TitleCard from "@/components/common/TitleCard"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import Image from "next/image"
import OrganizerEventInfo from "./OrganizerEventInfo"
import { useReactiveCookiesNext } from "cookies-next"
import { formatDateToColombiaTime } from "@/utils/formatDate"
import { useEventImage } from "@/hooks/admin/queries/useEventImage"
import SpinnerSvg from "@/components/svg/SpinnerSvg"
import { useAdminEvent } from "@/hooks/admin/queries/useAdminData"

export function OrganizerEventDetails({ eventId, isPromoter }: { eventId: number, isPromoter?: boolean }) {
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const { servedImageUrl, isImageLoading } = useEventImage({ eventId, token: token?.toString() });

  const { selectedEvent, isEventLoading } = useAdminEvent({ eventId, token: token?.toString() });

  return (
    <div className="bg-primary-black min-h-screen flex flex-col text-primary-white pt-10 rounded-lg p-4 items-center">
      {/* Avatar */}
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3" />

      <div className="flex py-4 px-5 w-full mt-16 bg-input rounded-lg flex-col items-start justify-center">
        {
          selectedEvent && !isEventLoading &&
            <TitleCard className="pb-4 bg-input" title={selectedEvent.title} description={selectedEvent.subtitle}>
              {
                isImageLoading ?
                <div className="w-15 h-15 flex items-center justify-center bg-main-container rounded-full">
                  <SpinnerSvg className="fill-primary text-inactive w-4" />
                </div>
                :
                <Image className="w-15 h-15 rounded-full" 
                  src={servedImageUrl ?? "/images/event-placeholder.png"} 
                  width={60} 
                  height={60} 
                  alt="logo" 
                />
              }            
            </TitleCard>
        }
        {
          !selectedEvent && isEventLoading &&
          <div className="w-full pb-4 rounded-xl gap-x-4 flex items-center justify-start">
            <div className="w-15 h-15 animate-pulse bg-inactive rounded-full"></div>
            <div className="flex flex-col gap-y-2 items-start justify-center">
              <div className="w-44 h-4 animate-pulse bg-inactive rounded"></div>
              <div className="w-28 h-3 animate-pulse bg-inactive rounded"></div>
            </div>
          </div>
        }
        <div className="flex pt-4 w-full justify-between border-t-2 border-inactive border-dashed  items-center gap-x-4">
          <h2 className="text-text-inactive">Fecha y hora</h2>
          <h2 className="text-end">{selectedEvent &&formatDateToColombiaTime(selectedEvent?.date).date} - {selectedEvent && formatDateToColombiaTime(selectedEvent?.date).time}hs</h2>
        </div>
      </div>

      <OrganizerEventInfo isPromoter={isPromoter} token={token} eventId={eventId} />
    </div>
  )
}