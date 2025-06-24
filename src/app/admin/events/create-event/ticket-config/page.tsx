"use client"

import { TicketCard } from "@/components/roles/admin/TicketCard"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import FormInput from "@/components/ui/inputs/FormInput";
import { useState } from "react"

export default function TicketConfiguration() {
  const [formData, setFormData] = useState({
    rdComission: "",
    discountCode: "",
    maxTicketsPerPerson: "",
    timeToBuy: "",
    discount: "",
    transferCost: "",
    commission: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };
  const [tickets, setTickets] = useState([
    { id: 1, stagesEnabled: false },
    { id: 2, stagesEnabled: true },
    { id: 3, stagesEnabled: false },
  ])
  const [piggyBankEnabled, setPiggyBankEnabled] = useState(false)

  const handleToggleStages = (ticketId: number, enabled: boolean) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, stagesEnabled: enabled } : ticket)),
    )
  }

  const handleAddTicket = () => {
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
        <h1 className="text-title font-bold mb-6">Configura los tickets</h1>

        {/* Ticket Cards */}
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticketNumber={ticket.id}
              stagesEnabled={ticket.stagesEnabled}
              onToggleStages={(enabled) => handleToggleStages(ticket.id, enabled)}
              onDelete={() => handleDeleteTicket(ticket.id)}
            />
          ))}
        </div>

        <button
          onClick={() => handleAddTicket()}
          className="w-full bg-primary text-black font-medium py-3 rounded-lg text-sm flex items-center justify-center gap-2"
        >
          +
          Incorporar ticket
        </button>

        {/* Configuration Options */}
        <div className="space-y-1 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col xs:flex-row gap-x-5">
              <FormInput
                handleFunc={handleChange}
                title="Comisión RD"
                formName={formData.rdComission}
                inputName="rdComission"
              />
              <FormInput
                handleFunc={handleChange}
                title="Costo transferencia de ticket"
                formName={formData.transferCost}
                inputName="transferCost"
              />
            </div>
            <div className="flex flex-col xs:flex-row gap-x-5">
              <FormInput
                handleFunc={handleChange}
                title="Código de descuento"
                formName={formData.discountCode}
                inputName="discountCode"
              />
              <FormInput
                handleFunc={handleChange}
                title="Descuento"
                formName={formData.discount}
                inputName="discount"
              />
            </div>
            <div className="flex flex-col xs:flex-row gap-x-5">
              <FormInput
                handleFunc={handleChange}
                title="Máx. de tickets p/ persona"
                formName={formData.maxTicketsPerPerson}
                inputName="maxTicketsPerPerson"
              />
              <FormInput
                handleFunc={handleChange}
                title="Tiempo de compra"
                formName={formData.timeToBuy}
                inputName="timeToBuy"
              />
            </div>
          </form>

          {/* Piggy Bank Toggle */}
          <div className="flex items-center justify-between mt-5">
            <span className="text-white text-lg">Alcancía</span>
            <button
              onClick={() => setPiggyBankEnabled(!piggyBankEnabled)}
              className="w-12 h-6 rounded-full transition-colors pointer-events-auto bg-cards-container"
            >
              <div
                className={`w-5 h-5 rounded-full transition-transform ${
                  piggyBankEnabled ? "translate-x-6 bg-primary" : "translate-x-0.5 bg-text-inactive"
                }`}
              />
            </button>
          </div>

          <div className={`${piggyBankEnabled ? "block" : "hidden"}`}>
            <FormInput
              handleFunc={handleChange}
              title="Comisión"
              formName={formData.commission}
              inputName="commission"
            />
          </div>

          <button
            className="w-full bg-primary text-black font-medium py-4 text-lg rounded-lg mt-10 flex items-center justify-center gap-2"
          >
            Crear evento
          </button>
        </div>
      </div>
    </div>
  )
}
