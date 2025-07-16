"use client"

import { myTickets } from "@/template-data"
import { TicketRow } from "./TicketRow"
import Link from "next/link"
import { usePathname } from "next/navigation";


export default function TicketsChanger({ ticketStatus } : { ticketStatus?: "paid" | "pending" }) {
  const pathname = usePathname();

  console.log(ticketStatus === "pending")
  
  const nonTransferredTickets: Ticket[] = myTickets.filter(ticket => !ticket.transferred)
  const transferredTickets: Ticket[] = myTickets.filter(ticket => ticket.transferred)

  const handleAction = (action: string, ticketType: string, userName: string) => {
    console.log(`Action: ${action}, Ticket: ${ticketType}, User: ${userName}`)
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
            {nonTransferredTickets.map((ticket) => (
              <TicketRow
                href="transfer"
                ticketId={ticket.id}
                key={ticket.id}
                ticketType={ticket.type}
                userName={ticket.userName}
                actions={ticket.actions}
                onAction={handleAction}
              />
            ))}
          </div>
        </div>

        {/* Transferred Tickets Section */}
        <div>
          <h2 className="text-lg font-medium mb-4">Tickets transferidos</h2>
          <div className="space-y-3">
            {transferredTickets.map((ticket) => (
              <TicketRow
                href="transferred"
                ticketId={ticket.id}
                key={ticket.id}
                ticketType={ticket.type}
                userName={ticket.userName}
                actions={ticket.actions}
                onAction={handleAction}
              />
            ))}
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
