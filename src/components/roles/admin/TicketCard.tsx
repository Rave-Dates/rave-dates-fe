"use client"

import TrashSvg from "@/components/svg/TrashSvg"
import DatePicker from "@/components/ui/date-picker/date-picker"
import FormInput from "@/components/ui/inputs/FormInput"
import { useCreateEventStore } from "@/store/createEventStore"
import { validateDateYyyyMmDd } from "@/utils/formatDate"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Control, Controller, UseFormGetValues, UseFormRegister } from "react-hook-form"

interface TicketCardProps {
  ticketNumber: number | undefined,
  index: number,
  isEditing?: boolean,
  control: Control<IEventFormData>,
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
  control,
}: TicketCardProps) {
  const router = useRouter()
  const params = useParams()

  const [stagesEnabled, setStagesEnabled] = useState(false)
  const { eventFormData, updateEventFormData, setEditingTicketId } = useCreateEventStore();

  useEffect(() => {
    const formValues = getValues(); // obtiene todos los datos del formulario
    const formTickets = formValues.tickets;

    const selectedTicket = formTickets?.[index];
    if (selectedTicket?.stages.length > 1) {
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
              price: ticket.stages?.[0]?.price ?? undefined,
              quantity: ticket.stages?.[0]?.quantity ?? undefined,
              promoterFee: ticket.stages?.[0]?.promoterFee ?? undefined,
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
    <div className={`bg-main-container relative rounded-lg p-4 space-y-4 h-58 ${stagesEnabled && "h-73"} transition-all duration-300`}>
      <button type="button" onClick={onDelete} className={`${isEditing && "hidden"} absolute right-0 top-0 text-primary-white px-2 py-1.5 rounded-bl-lg rounded-tr-lg bg-system-error`}>
        <TrashSvg />
      </button>
      
      {/* Input Fields */}
      <div className="grid grid-cols-3 gap-3 mt-2">
        <input
          type="hidden"
          {...register(`tickets.${index}.ticketTypeId`)}
        />
        <FormInput
          className="bg-cards-container! py-1!"
          title="Nombre"
          inputName="ticketName"
          register={register(`tickets.${index}.name`, { required: "El nombre es obligatorio" })}
        />
        <FormInput
          type="number"
          className="bg-cards-container! py-1!"
          title="Cantidad"
          inputName="quantity"
          register={register(`tickets.${index}.stages.0.quantity`, { 
            required: "La cantidad es obligatoria", 
            setValueAs: (v) => v === "" ? undefined : Number(v) 
          })}
        />
        <FormInput
          type="number"
          className="bg-cards-container! py-1!"
          title="Precio"
          typeOfValue="$"
          inputName="price"
          register={register(`tickets.${index}.stages.0.price`, { 
            required: "El precio es obligatorio", 
            setValueAs: (v) => v === "" ? undefined : Number(v) 
          })}
        />
        <div className={`col-span-3 grid grid-cols-2 gap-3 ${stagesEnabled && "grid-cols-1! mt-1.5!"}`}> 
          <Controller
            name={stagesEnabled ? `tickets.${index}.maxDate` : `tickets.${index}.stages.0.dateMax`}
            control={control}
            rules={{ required: "La fecha máx. es obligatoria", validate: validateDateYyyyMmDd }}
            render={({ field }) => (
              <DatePicker
                value={field.value as string} 
                onChange={field.onChange} 
                title="Fecha máx.*" 
                className="h-9 bg-cards-container"
                wrapperClassname="justify-end"
              />
            )}
          />

          {
            !stagesEnabled && (
              <FormInput
                className="bg-cards-container! py-1!"
                title="Comisión Promotores"
                inputName="promoterFee"
                typeOfValue="$"
                register={register(`tickets.${index}.stages.0.promoterFee`, { setValueAs: (v) => v === "" ? undefined : Number(v) })}
              />
            )
          }
        </div>
      </div>

      <div className="space-y-3 w-full pointer-events-none pt-2">
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
          className={`${stagesEnabled ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} block text-center transition-all duration-300 w-full bg-primary text-primary-white font-medium py-3 rounded-lg text-sm`} 
        >
          Editar etapa
        </button>
      </div>
      {/* Stages Section */}
    </div>
  )
}
