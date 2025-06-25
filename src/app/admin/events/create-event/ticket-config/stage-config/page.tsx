"use client"

import { StageCard } from "@/components/roles/admin/StageCard";
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import { useState } from "react"

export default function StageConfig() {
  const [tickets, setTickets] = useState([
    { id: 1, stagesEnabled: false },
    { id: 2, stagesEnabled: true },
    { id: 3, stagesEnabled: false },
  ])

  const handleAddStage = () => {
    setTickets((prev) => [...prev, { id: tickets[tickets.length - 1]?.id + 1, stagesEnabled: false }])
  }

  const handleDeleteTicket = (ticketId: number) => {
    if (tickets.length === 1) return
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId))
  }

  return (
    <div className="bg-primary-black text-primary-white min-h-screen px-6 pt-28 pb-44">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-title font-bold mb-6">Configurar etapas</h1>

        {/* Ticket Cards */}
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <StageCard
              key={ticket.id}
              stageNumber={ticket.id}
              onDelete={() => handleDeleteTicket(ticket.id)}
            />
          ))}
        </div>

        <button
          onClick={() => handleAddStage()}
          className="w-full border outline-none border-primary text-primary font-medium py-5 rounded-lg flex items-center justify-center gap-2"
        >
          Agregar etapa
        </button>

        <button
          onClick={() => alert("Guardado")}
          className="w-full bg-primary text-black font-medium py-4 text-lg rounded-lg mt-10 flex items-center justify-center gap-2"
        >
          Guardar
        </button>
      </div>
    </div>
  )
}
