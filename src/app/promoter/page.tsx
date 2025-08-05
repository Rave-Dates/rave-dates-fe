"use client"

import { OrganizerEventCard } from "@/components/roles/organizer/organizer-event/OrganizerEventCard"
import { useAdminUserById } from "@/hooks/admin/queries/useAdminData"
import { useReactiveCookiesNext } from "cookies-next"
import { jwtDecode } from "jwt-decode"

export default function OrganizerHome() {
  
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const decoded: { id: number } = (token && jwtDecode(token.toString())) || {id: 0};
  
  const { data: user, isPending: isUserLoading } = useAdminUserById({ token, userId: decoded.id }); 
  
  // const organizerId = user?.promoter?.promoterId;

  // const { organizerBinnacles } = useAdminBinnacles({ organizerId: organizerId ?? 0, token: token?.toString() });

  // const getTotalAvalible = () => {
  //   let total = 0;
  //   if (organizerBinnacles) {
  //     organizerBinnacles.forEach((binnacle) => {
  //       total += Number(binnacle.total);
  //     });
  //   }
  //   return total.toLocaleString('es-CO');
  // }

  return (
    <div className="bg-primary-black pt-14 text-primary-white min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Available Balance Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold ">Disponible</h1>
          {/* <p className="text-primary text-2xl">COP ${getTotalAvalible()}</p> */}
          <p className="text-primary text-2xl">COP $500</p>
        </div>

        {/* Event Cards */}
        <div className="space-y-3">
          {
            !user?.promoter?.events &&
            <div className="w-full text-text-inactive h-23 rounded-xl gap-x-1 p-4 flex items-center justify-center">
              No tienes eventos asignados
            </div>
          }
          {!isUserLoading && user?.promoter?.events && user.promoter.events.map((event) => (
            <OrganizerEventCard
              key={event.eventId}
              event={event}
            />
          ))}
          {
            isUserLoading || !user &&
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
    </div>
  )
}