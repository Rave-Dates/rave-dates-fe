"use client"

import TrashSvg from "@/components/svg/TrashSvg"
import FormInput from "@/components/ui/inputs/FormInput"
import { useCreateEventStore } from "@/store/createEventStore"
import { validateDateYyyyMmDd } from "@/utils/formatDate"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { UseFormGetValues, UseFormRegister } from "react-hook-form"

interface TicketCardProps {
  ticketNumber: number | undefined,
  index: number,
  isEditing?: boolean,
  onDelete?: () => void,
  register: UseFormRegister<IEventFormData>,
  getValues: UseFormGetValues<IEventFormData>,
}

export function TicketCard({
  ticketNumber,
  index,
  isEditing = false,
  onDelete,
  register,
  getValues,
}: TicketCardProps) {
  const router = useRouter()
  const params = useParams()

  const [stagesEnabled, setStagesEnabled] = useState(false)
  const { eventFormData, updateEventFormData, setEditingTicketId } = useCreateEventStore();

  useEffect(() => {
    if (isEditing) {
      setStagesEnabled(true)
    }
  }, [isEditing, setStagesEnabled]);

  const onEditStages = () => {
    const formValues = getValues(); // obtiene todos los datos del formulario
    const formTickets = formValues.tickets;
    const eventId = Number(params.eventId)

    const normalizedTickets = formTickets.map((ticket) => ({
      ...ticket,
      maxDate: !stagesEnabled ? ticket.stages[0].dateMax : ticket.maxDate,
      stages: ticket.stages?.length
        ? ticket.stages
        : [
            {
              stageId: 1,
              date: "",
              dateMax: "",
              price: ticket.stages?.[0]?.price ?? 0,
              quantity: ticket.stages?.[0]?.quantity ?? 0,
              promoterFee: ticket.stages?.[0]?.promoterFee ?? 0,
            },
          ],
    }));

    console.log("normalizedTickets",normalizedTickets)
    // Guardar todos los datos del form, no solo los tickets
    updateEventFormData({
      ...eventFormData,
      ...formValues, // incluye title, date, geo, etc.
      tickets: normalizedTickets,
    });

    if (ticketNumber) {
      setEditingTicketId(ticketNumber);
    }
    router.push(`/admin/events/${isEditing ? `edit-event/${eventId}` : "create-event"}/ticket-config/stage-config`);
  };

  return (
    <div className={`bg-main-container rounded-lg p-4 space-y-4 h-64 ${stagesEnabled && "h-80"} transition-all duration-400`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Ticket {ticketNumber}</h3>
        <button onClick={onDelete} className={`${isEditing && "hidden"} text-text-inactive active:text-system-error`}>
          <TrashSvg />
        </button>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-3 gap-3">
        <input
          type="hidden"
          {...register(`tickets.${index}.ticketTypeId`)}
        />
        <FormInput
          className="!bg-cards-container !py-1"
          title="Nombre"
          inputName="ticketName"
          register={register(`tickets.${index}.name`, { required: "El nombre es obligatorio" })}
        />
        <FormInput
          className="!bg-cards-container !py-1"
          title="Cantidad"
          inputName="quantity"
          register={register(`tickets.${index}.stages.0.quantity`, { required: "La cantidad es obligatoria", valueAsNumber: true })}
        />
        <FormInput
          type="number"
          className="!bg-cards-container !py-1"
          title="Precio"
          inputName="price"
          register={register(`tickets.${index}.stages.0.price`, { required: "El precio es obligatorio", valueAsNumber: true})}
        />
        <div className="col-span-3"> 
          <FormInput
            placeholder="yyyy-mm-dd"
            className="!bg-cards-container !py-1"
            title="Fecha máx."
            inputName="maxDate"
            register={
              stagesEnabled ?
              register(`tickets.${index}.maxDate`, { required: "la fecha máx. es obligatoria", validate: validateDateYyyyMmDd })
              :
              register(`tickets.${index}.stages.0.dateMax`, { required: "la fecha máx. es obligatoria", validate: validateDateYyyyMmDd })
            }
          />
        </div>
      </div>

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
