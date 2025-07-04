"use client"

import AddSvg from "@/components/svg/AddSvg"
import TrashSvg from "@/components/svg/TrashSvg"
import FormInput from "@/components/ui/inputs/FormInput"
import { notifyError } from "@/components/ui/toast-notifications"
import { useCreateEventStore } from "@/store/createEventStore"
import Link from "next/link"
import { redirect, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FieldValues, UseFormGetValues, UseFormRegister } from "react-hook-form"
import { toast } from "sonner"

interface TicketCardProps {
  ticketNumber: number,
  index: number,
  onDelete?: () => void,
  register: UseFormRegister<FieldValues>,
  getValues: UseFormGetValues<FieldValues>,
}

export function TicketCard({
  ticketNumber,
  index,
  onDelete,
  register,
  getValues,
}: TicketCardProps) {
  const router = useRouter()

  const [stagesEnabled, setStagesEnabled] = useState(false)
  const { eventFormData, updateEventFormData, setEditingTicketId } = useCreateEventStore();

  const onEditStages = () => {
    const formValues = getValues(); // obtiene todos los datos del formulario
    const formTickets = formValues.tickets as any[];

    if (!formTickets?.[index]?.name || !formTickets?.[index]?.maxDate) {
      notifyError('Completá los datos del ticket antes de continuar');
      return;
    }

    const normalizedTickets = formTickets.map((ticket) => ({
      ...ticket,
      stages: ticket.stages?.length
        ? ticket.stages
        : [
            {
              stageId: 1,
              date: null,
              dateMax: null,
              price: ticket.stages?.[0]?.price ?? 0,
              quantity: ticket.stages?.[0]?.quantity ?? 0,
            },
          ],
    }));

    // Guardar todos los datos del form, no solo los tickets
    updateEventFormData({
      ...eventFormData,
      ...formValues, // incluye title, date, geo, etc.
      tickets: normalizedTickets,
    });

    setEditingTicketId(ticketNumber);
    router.push("/admin/events/create-event/ticket-config/stage-config");
  };

  return (
    <div className={`bg-main-container rounded-lg p-4 space-y-4 h-64 ${stagesEnabled && "h-80"} transition-all duration-400`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Ticket {ticketNumber}</h3>
        <button onClick={onDelete} className="text-text-inactive active:text-system-error">
          <TrashSvg />
        </button>
      </div>

      {/* Input Fields */}
      <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-3 gap-3">
        <input
          type="hidden"
          {...register(`tickets.${index}.ticketId`, { required: true })}
        />
        <FormInput
          className="!bg-cards-container !py-1"
          title="Nombre"
          inputName="ticketName"
          register={register(`tickets.${index}.name`, { required: true })}

        />
        <FormInput
          className="!bg-cards-container !py-1"
          title="Cantidad"
          inputName="quantity"
          register={register(`tickets.${index}.stages.0.quantity`, { required: true, valueAsNumber: true })}

        />
        <FormInput
          type="number"
          className="!bg-cards-container !py-1"
          title="Precio"
          inputName="price"
          register={register(`tickets.${index}.stages.0.price`, { required: true, valueAsNumber: true})}
        />
        <div className="col-span-3"> 
          <FormInput
            placeholder="yyyy-mm-dd"
            className="!bg-cards-container !py-1"
            title="Fecha máx."
            inputName="maxDate"
            register={register(`tickets.${index}.maxDate`, { required: true })}
          />
        </div>
      </form>

      <div className="space-y-3 w-full pointer-events-none">
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">Etapas</span>
          <button
            type="button"
            onClick={() => setStagesEnabled(!stagesEnabled)}
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
          onClick={onEditStages}
          type="submit"
          className={`${stagesEnabled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} block text-center transition-all duration-300 w-full bg-primary text-black font-medium py-3 rounded-lg text-sm`} 
        >
          Editar etapa
        </button>
      </div>
      {/* Stages Section */}
    </div>
  )
}
