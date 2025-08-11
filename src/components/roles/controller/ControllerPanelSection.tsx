"use client"

import QRSvg from "@/components/svg/QRSvg";
import Link from "next/link";
import { CircularProgress } from "../organizer/create-event/ProgressCircular";
import { useAdminCheckerTicketMetrics } from "@/hooks/admin/queries/useAdminData";
import { ProgressBar } from "../organizer/create-event/ProgressBar";

type Props = {
  eventId: number | undefined;
  token: string | undefined | null;
}

export default function ControllerPanelSection({ token, eventId }: Props) {
  const { checkerTicketMetrics } = useAdminCheckerTicketMetrics({ token, eventId });

  return (
    <div className="rounded-lg text-white w-full flex items-start justify-center mb-24 h-full">
      <div className="w-full h-full">
        <Link href="/checker/scan-qr" className="bg-input h-[400px] flex justify-center items-center px-2 py-1 rounded-lg mt-3">
          <QRSvg />
        </Link>
        <div className="bg-input h-[80px] flex px-5 justify-between items-center py-1 rounded-lg mt-3">
          <div>
            <h3 className="text-sm text-primary-white/50">Total leídos</h3>
            <h3 className="text-lg">{checkerTicketMetrics?.totalRead}/{checkerTicketMetrics?.ticketsPurchased}</h3>
          </div>

          {
            checkerTicketMetrics && 
            <CircularProgress current={checkerTicketMetrics.totalRead ?? 0} total={checkerTicketMetrics.ticketsPurchased ?? 0} />
          }
        </div>
        <div className="bg-input mt-3 space-y-4 rounded-lg pt-3 pb-5 px-4">
          {
            checkerTicketMetrics?.ticketsTypesMetrics.map((ticketType) => (
              <div key={ticketType.name}>
                <h2 className="text-text-inactive">{ticketType.name}</h2>
                <ProgressBar current={ticketType.read} total={ticketType.quantity} />
              </div>
            ))
          }
          {
            checkerTicketMetrics?.ticketsTypesMetrics.length === 0 &&
            <div className="text-center pt-2 text-text-inactive">
              No hay compras
            </div>
          }
        </div>
        <Link
          href={`/checker/${eventId}/attendees`}
          className="w-full block text-center bg-primary mt-5 text-black py-4 rounded-lg font-medium hover:opacity-85 transition-opacity"
        >
          Ver escaneados
        </Link>
      </div>
    </div>
  )
}
