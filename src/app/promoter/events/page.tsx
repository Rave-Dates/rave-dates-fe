"use client"

import { OrganizerEventCard } from "@/components/roles/organizer/organizer-event/OrganizerEventCard";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { useAdminPromoterBinnacles, useAdminUserById } from "@/hooks/admin/queries/useAdminData";
import { useCreateEventStore } from "@/store/createEventStore";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export default function Page() {
  const { updateEventFormData, eventFormData, setHasLoadedEvent } = useCreateEventStore();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const decoded: { id: number } = (token && jwtDecode(token.toString())) || {id: 0};
  
  // obtenemos user por id
  const { data: user, isPending: isUserLoading } = useAdminUserById({ token, userId: decoded.id }); 
  const promoterId = user?.promoter?.promoterId;

  const { promoterBinnacles } = useAdminPromoterBinnacles({ promoterId: promoterId ?? 0, token: token?.toString() });

  useEffect(() => {
    updateEventFormData(defaultEventFormData);
    setHasLoadedEvent(false);
  }, [setHasLoadedEvent, updateEventFormData]);

  useEffect(() => {
    console.log("desde la lista",eventFormData)
  }, [eventFormData]);
  
  return (
    <div className="w-full flex flex-col gap-y-5 bg-primary-black text-primary-white min-h-screen pt-10 p-4 pb-40 md:pt-32">
        <h1 className="text-3xl font-semibold mx-auto pb-3">Eventos asignados</h1>

        {/* Event Cards */}
        <div className="space-y-3">
          {
            !user?.promoter?.events && !isUserLoading &&
            <div className="w-full text-text-inactive h-23 rounded-xl gap-x-1 p-4 flex items-center justify-center">
              No tienes eventos asignados
            </div>
          }
          {!isUserLoading && user?.promoter?.events && user.promoter.events.map((event) => (
            <OrganizerEventCard
              href="event"
              key={event.eventId}
              event={event}
              promoterId={promoterId}
              totalSold={Number(promoterBinnacles?.events?.find(b => b.eventId === event.eventId)?.feePromoter?? 0)}
            />
          ))}
          {
            isUserLoading &&
            <div className="w-full bg-cards-container h-23 rounded-xl gap-x-1 p-4 flex items-center justify-start">
              <div className="w-14 h-14 animate-pulse bg-inactive rounded-full"></div>
              <div className="flex flex-col gap-y-2 items-start justify-center">
                <div className="w-44 h-4 animate-pulse bg-inactive rounded"></div>
                <div className="w-28 h-3 animate-pulse bg-inactive rounded"></div>
                <div className="w-28 h-3 animate-pulse bg-inactive rounded"></div>
              </div>
            </div>
          }
        </div>
    </div>
  );
}
