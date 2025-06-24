"use client"

import TrashSvg from "@/components/svg/TrashSvg"
import FormInput from "@/components/ui/inputs/FormInput"
import { useState } from "react"

interface TicketCardProps {
  ticketNumber: number,
  hasStages?: boolean
  stagesEnabled?: boolean
  onToggleStages?: (enabled: boolean) => void
  onDelete?: () => void
}

export function TicketCard({
  ticketNumber,
  hasStages = true,
  stagesEnabled = false,
  onToggleStages,
  onDelete,
}: TicketCardProps) {
  const [formData, setFormData] = useState({
    ticketNumber: 0,
    ticketName: "",
    quantity: "",
    price: "",
    receiveInfo: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className={`bg-main-container rounded-lg p-4 space-y-4 h-44 ${stagesEnabled && "h-60"} transition-all duration-400`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Ticket {ticketNumber}</h3>
        <button onClick={onDelete} className="text-text-inactive active:text-system-error">
          <TrashSvg />
        </button>
      </div>

      {/* Input Fields */}
      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-3">
        <FormInput
          className="!bg-cards-container !py-1"
          handleFunc={handleChange}
          title="Ticket"
          formName={formData.ticketName}
          inputName="ticketName"
        />
        <FormInput
          className="!bg-cards-container !py-1"
          handleFunc={handleChange}
          title="Cantidad"
          formName={formData.quantity}
          inputName="quantity"
        />
        <FormInput
          type="number"
          className="!bg-cards-container !py-1"
          handleFunc={handleChange}
          title="Precio"
          formName={formData.price}
          inputName="price"
        />
      </form>

      {/* Stages Section */}
      {hasStages && (
        <div className="space-y-3 pointer-events-none">
          <div className="flex items-center justify-between">
            <span className="text-white text-sm">Etapas</span>
            <button
              onClick={() => onToggleStages?.(!stagesEnabled)}
              className="w-12 h-6 rounded-full transition-colors pointer-events-auto bg-cards-container"
            >
              <div
                className={`w-5 h-5 rounded-full transition-transform ${
                  stagesEnabled ? "translate-x-6 bg-primary" : "translate-x-0.5 bg-text-inactive"
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            className={`${stagesEnabled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-all duration-300 w-full bg-primary text-black font-medium py-3 rounded-lg text-sm`} 
          >
            Editar etapa
          </button>
        </div>
      )}
    </div>
  )
}
