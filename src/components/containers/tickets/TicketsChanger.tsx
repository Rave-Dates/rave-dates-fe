"use client"

import { TicketRow } from "./TicketRow"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useReactiveCookiesNext } from "cookies-next";
import { useQuery } from "@tanstack/react-query";
import { getTicketsFromClient } from "@/services/clients-tickets";

export default function TicketsChanger({ ticketStatus } : { ticketStatus?: "paid" | "pending" }) {
  const pathname = usePathname();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("clientToken");
  const decoded: {id: number} = (token && jwtDecode(token.toString())) || {id: 0};
  const clientId = Number(decoded?.id);

  const { data: purchasedTickets } = useQuery<IPurchaseTicket[]>({
    queryKey: ["purchasedTickets", clientId], // agregamos clientId por seguridad
    queryFn: async () => {
      if (!token) throw new Error("Token missing");
      return await getTicketsFromClient(clientId, token);
    },
    enabled: !!token && !!clientId,
  });

  console.log(purchasedTickets)

  const transferredTickets = purchasedTickets?.filter(ticket => ticket.isTransferred)
  const nonTransferredTickets = purchasedTickets?.filter(ticket => !ticket.isTransferred)

  const handleAction = (action: string, ticketType: string) => {
    console.log(`Action: ${action}, Ticket: ${ticketType}`)
    // Implement action logic here
  }

  const handleDownloadAll = () => {
    console.log("Download all tickets")
    // Implement download all logic
  }

  return (
    <div className="w-full mb-6">
      <div className="space-y-6">
        {/* My Tickets Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Mis tickets</h2>
            <button onClick={handleDownloadAll} className="text-primary text-sm hover:underline">
              Descargar todos
            </button>
          </div>
          <div className="space-y-3">
            {nonTransferredTickets?.map((ticket) => (
              <TicketRow
                href="transfer"
                purchaseTicketId={ticket.purchaseTicketId}
                key={ticket.purchaseTicketId}
                ticketType={ticket.ticketType.name}
                onAction={handleAction}
              />
            ))}
            {
              nonTransferredTickets?.length === 0 &&
              <div className="text-center pb-4 text-neutral-400">
                No se encontraron tickets
              </div>
            }
          </div>
        </div>

        {/* Transferred Tickets Section */}
        <div>
          <h2 className="text-lg font-medium mb-4">Tickets transferidos</h2>
          <div className="space-y-3">
            {transferredTickets?.map((ticket) => (
              <TicketRow
                href="transfer"
                purchaseTicketId={ticket.purchaseTicketId}
                key={ticket.purchaseTicketId}
                ticketType={ticket.ticketType.name}
                onAction={handleAction}
              />
            ))}
            {
              transferredTickets?.length === 0 &&
              <div className="text-center pb-4 text-neutral-400">
                No se encontraron tickets transferidos
              </div>
            }
          </div>
        </div>

        {/* Change Tickets Button */}
        {ticketStatus === "pending" && (
          <>
            <h2 className="text-lg font-medium mb-4">
              Saldo pendiente
            </h2>
            <div className="bg-cards-container rounded-lg p-4 gap-x-5 text-sm flex items-center justify-between">
              Tienes hasta el 18/5 para pagar el saldo pendiente
            </div>
          </>
        )}
        <Link
          href={`${pathname}/change-tickets`}
          className="block text-center w-full bg-primary text-black font-medium py-3 rounded-lg mb-3 hover:opacity-80 transition-opacity"
          >
          Cambiar tickets
        </Link>
        {ticketStatus === "pending" && (
          <Link
            href="/checkout"
            className="block text-center w-full text-system-error border border-system-error font-medium py-3 rounded-lg mb-3 hover:opacity-80 transition-opacity"
          >
            Completar alcancía
          </Link>
        )}
      </div>
    </div>
  )
}
