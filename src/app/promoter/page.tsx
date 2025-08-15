"use client"

import { OrganizerEventCard } from "@/components/roles/organizer/organizer-event/OrganizerEventCard"
import { useAdminPromoterBinnacles, useAdminUserById } from "@/hooks/admin/queries/useAdminData"
import { useReactiveCookiesNext } from "cookies-next"
import { jwtDecode } from "jwt-decode"
import Link from "next/link"

export default function OrganizerHome() {
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const decoded: { id: number } = (token && jwtDecode(token.toString())) || {id: 0};
  
  const { data: user, isPending: isUserLoading } = useAdminUserById({ token, userId: decoded.id }); 
  
  const promoterId = user?.promoter?.promoterId;

  const { promoterBinnacles } = useAdminPromoterBinnacles({ promoterId: promoterId ?? 0, token: token?.toString() });

  // const selectedPromoterBinnacle = promoterBinnacles?.find(b => b.eventId === eventId);

  return (
    <div className="bg-primary-black pt-14 text-primary-white min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Available Balance Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold ">Disponible</h1>
          <p className="text-primary text-2xl">COP ${promoterBinnacles?.total?.toLocaleString() ?? 0}</p>
        </div>

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
              href="promoter/event"
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

        <div className="bg-input mt-2 rounded-lg px-3 py-2">
          <h1 className="font-medium px-2 my-2">Dinero</h1>
          <div className="border-t-2 flex flex-col gap-y-3 pt-5 mt-3 px-2 pb-2 text-text-inactive border-dashed border-inactive">
            <div className="flex text-sm justify-between items-center">
              <h2>Total</h2>
              <h2 className="text-primary text-base text-end tabular-nums">COP ${Number(promoterBinnacles?.total ?? 0).toLocaleString() ?? 0}</h2>
            </div>

            <div className="flex text-sm justify-between items-center">
              <h2>Dinero entregado</h2>
              <h2 className="text-primary text-base text-end tabular-nums">COP ${promoterBinnacles?.alreadyPaid.toLocaleString()?? 0}</h2>
            </div>

            <div className="flex text-sm justify-between items-center">
              <h2>Dinero disponible</h2>
              <h2 className="text-primary text-base text-end tabular-nums">COP ${promoterBinnacles?.pendingPayment.toLocaleString()?? 0}</h2>
            </div>

            <Link href={`/promoter/money-withdrawn`} className="input-button block text-center text-sm py-3 text-primary-black bg-primary">
              Ver dinero entregado
            </Link>
          </div> 
        </div>
      </div>
    </div>
  )
}