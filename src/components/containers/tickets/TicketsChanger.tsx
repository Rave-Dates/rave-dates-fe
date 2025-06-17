"use client"

import { myTickets } from "@/template-data"
import { TicketRow } from "./TicketRow"


export default function TicketsChanger() {
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

  const handleChangeTickets = () => {
    console.log("Change tickets")
    // Implement change tickets logic
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
        <button
          onClick={handleChangeTickets}
          className="w-full bg-primary text-black font-medium py-3 rounded-lg mt-6 hover:opacity-80 transition-opacity"
        >
          Cambiar tickets
        </button>
      </div>
    </div>
  )
}
