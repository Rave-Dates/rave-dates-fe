"use client"

import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { useAdminBinnacles, useAdminEvent, useAdminPromoterBinnacles, useAdminPromoterTicketMetrics, useAdminTicketMetrics, useAdminUserById } from "@/hooks/admin/queries/useAdminData";
import { useReactiveCookiesNext } from "cookies-next";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EventBalance({eventId}: { eventId: number }) {
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const params = useParams();
  const userId = Number(params.userId);

  const { data: user } = useAdminUserById({ token, userId });

  const { selectedEvent } = useAdminEvent({ token, eventId });

  const { organizerBinnacles } = useAdminBinnacles({
    organizerId: user?.organizer?.organizerId ?? 0,
    token: token?.toString() ?? "",
  });

  const { promoterBinnacles } = useAdminPromoterBinnacles({
    promoterId: user?.promoter?.promoterId ?? 0,
    token: token?.toString() ?? "",
  });

  const { ticketMetrics } = useAdminTicketMetrics({ token, eventId });
  const { promoterTicketMetrics } = useAdminPromoterTicketMetrics({ token, eventId, promoterId: user?.promoter?.promoterId });
  
  const selectedBinnacle = organizerBinnacles?.find(b => b.eventId === eventId);
  const selectedPromoterBinnacle = promoterBinnacles?.events.find(b => b.eventId === eventId);

  const binnacleToUse = user?.role.name === "PROMOTER" ? selectedPromoterBinnacle : selectedBinnacle;
  const ticketMetricsToUse = user?.role.name === "PROMOTER" ? promoterTicketMetrics : ticketMetrics;

  console.log(selectedPromoterBinnacle)
  console.log(user?.role.name === "ORGANIZER" || user?.role.name === "PROMOTER")

  return (
    <div className="w-full flex flex-col justify-between bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <div>
        <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
        <div className="absolute z-30 top-10 right-5 animate-fade-in">
          {
            (user?.role.name === "ORGANIZER" || user?.role.name === "PROMOTER") &&
            <Link
              href={user?.role.name === "ORGANIZER" ? "event-balance/event-info" : `/admin/users/edit-user/2/user-events/${eventId}/event-balance/event-info?organizerId=true`}
              className="bg-primary text-primary-black p-3 text-sm px-5 rounded-lg font-medium flex items-center justify-center text-center"
              aria-label="Añadir usuario"
            >
              Ver asistentes
            </Link>
          }
        </div>
        <div className="max-w-xl pt-24 mx-auto animate-fade-in">
          <h1 className="text-title font-semibold">Saldo y movimientos</h1>
          <h2 className="text-xl text-primary">{selectedEvent?.title}</h2>

          {/* Users Table/List */}
          <div className="rounded-md overflow-hidden mt-5">
            <div className="space-y-2 w-full">
              {ticketMetricsToUse?.ticketsTypesMetrics.map((data) => (
                <div key={data.name} className="bg-main-container rounded-lg p-4 ps-3">
                  <div className="space-y-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="">
                        <span>{data.name}</span>
                        <span> vendidas:</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-primary text-sm">{data.quantity} de {data.total} disponibles</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {
                ticketMetricsToUse?.ticketsTypesMetrics.length === 0 &&
                <div className="text-center pt-2 pb-6 text-text-inactive">
                  No se encontraron entradas vendidas
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="mt-20 max-w-xl self-center w-full animate-fade-in">
        <div className="flex justify-between text-sm gap-y-2 py-3 px-3">
          <div className="text-text-inactive">
            Total
          </div>
          <div className="tabular-nums">
            ${Number(binnacleToUse?.total?? "0").toLocaleString()}
          </div>
        </div>
        <div className="flex h-[44px] justify-between items-center text-sm gap-y-2 py-3 px-3">
          <div className="text-text-inactive">
            Comisión de Rave Dates
          </div>
          <div className="tabular-nums flex items-center justify-center">
            <span className="text-system-error text-2xl">-</span>
            ${Number(binnacleToUse?.feeRD?? "0").toLocaleString()}
          </div>
        </div>
        {
          user?.role.name === "ORGANIZER" &&
          <div className="flex h-[44px] justify-between items-center text-sm gap-y-2 py-3 px-3">
            <div className="text-text-inactive">
              Comisión de promotor
            </div>
            <div className="tabular-nums flex items-center justify-center">
              <span className="text-system-error text-2xl">-</span>
              ${Number(binnacleToUse?.feePromoter?? "0").toLocaleString()}
            </div>
          </div>
        }
        <div className="flex justify-between text-sm gap-y-2 py-3 px-3">
          <div className="text-text-inactive">
            Retirado
          </div>
          <div className="tabular-nums">
            ${Number(binnacleToUse?.alreadyPaid?? "0").toLocaleString()}
          </div>
        </div>
        <div className="flex justify-between text-sm gap-y-2 py-3 px-3">
          <div className="text-text-inactive">
            DISPONIBLE
          </div>
          <div className="tabular-nums text-primary">
            {
              user?.role.name === "ORGANIZER" ?
              `$${Number(binnacleToUse?.pendingPayment?? "0").toLocaleString()}`
              :
              `$${Number(binnacleToUse?.feePromoter?? "0").toLocaleString()}`
            }
          </div>
        </div>
      </div>
    </div>
  );
}
