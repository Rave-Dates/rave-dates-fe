"use client"

import { TicketCard } from "@/components/roles/admin/TicketCard"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import FormInput from "@/components/ui/inputs/FormInput"
import { notifyError, notifyPending } from "@/components/ui/toast-notifications"
import { useCreateFullEvent } from "@/hooks/useCreateEventFull"
import { useEditEvent } from "@/hooks/useEditEvent"
import { getTicketTypesById } from "@/services/admin-events"
import { useCreateEventStore } from "@/store/createEventStore"
import { formatDate, formatToISO } from "@/utils/formatDate"
import { useQuery } from "@tanstack/react-query"
import { useReactiveCookiesNext } from "cookies-next"
import { useParams } from "next/navigation"
import { useEffect, useRef } from "react"
import { useFieldArray, useForm } from "react-hook-form"

export default function EditTicketConfiguration() {
  const { eventFormData, updateEventFormData, hasLoadedTickets, setHasLoadedTickets } = useCreateEventStore()
  const { register, handleSubmit, watch, setValue, getValues, control, reset, formState } = useForm({
    defaultValues: eventFormData,
  })
  const { mutate: editEvent } = useEditEvent(reset)


  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  })

  const { getCookie } = useReactiveCookiesNext()
  const token = getCookie("token")
  const params = useParams()
  const eventId = Number(params.eventId)

  // 🟢 Traemos tickets del evento
  const { data: ticketsData } = useQuery({
    queryKey: ["eventTickets", eventId],
    queryFn: () => getTicketTypesById(token, eventId),
    enabled: !!token && !!eventId,
  })

  useEffect(() => {
    console.log("eventFormData actualizado:", eventFormData);
  }, [eventFormData]);

  // 🟢 Cuando llegan los tickets, actualizamos el estado global y el form
  useEffect(() => {
    if (ticketsData && !hasLoadedTickets) {
      const formattedTickets = ticketsData.map((ticket) => ({
        ...ticket,
        maxDate: formatDate(ticket.maxDate),
        stages: ticket.stages.map((stage) => ({
          ...stage,
          date: formatDate(stage.date),
          dateMax: formatDate(stage.dateMax),
        })),
      }));
      console.log("formattedTickets",formattedTickets)

      const updatedData = {
        ...eventFormData,
        tickets: formattedTickets,
      };

      updateEventFormData(updatedData);
      setValue("tickets", formattedTickets);
      setHasLoadedTickets(true);
    }
  }, [ticketsData]);

  const piggyBank = watch("piggyBank", false)
  if (piggyBank === false) setValue("commission", null)

  const onSubmit = (data) => {
    
    const formattedTickets = data.tickets.map((ticket) => ({
      ticketTypeId: ticket.ticketTypeId,
      eventId: eventId,
      name: ticket.name,
      maxDate: formatDate(ticket.maxDate),
      stages: ticket.stages.map((stage) => ({
        date: formatDate(stage.date),
        dateMax: formatDate(stage.dateMax),
        quantity: stage.quantity,
        price: stage.price,
      })),
    }));

    
    updateEventFormData({
      ...eventFormData,
      ...data,
      tickets: data.tickets,
    })
    
    const cleanedEventData = {
      eventId: eventFormData.eventId,
      title: data.title,
      date: formatToISO(data.date),
      geo: data.geo,
      description: data.description,
      type: data.type,
      isActive: data.isActive,
      feeRD: data.feeRD,
      feePB: data.feePB,
      transferCost: data.transferCost,
      discountCode: data.discountCode,
      discountType: data.discountType,
      discount: data.discount,
      maxPurchase: data.maxPurchase,
      images: data.images,
      timeOut: formatToISO(data.timeOut),
      labels: data.labels,
      tickets: formattedTickets,
    }

    // funcion para editar evento
    notifyPending(
      new Promise((resolve, reject) => {
        editEvent(cleanedEventData, {
          onSuccess: resolve,
          onError: reject,
        });
      }),
      {
        loading: "Editando evento...",
        success: "Evento editaddo correctamente",
        error: "Error al editar el evento",
      }
    );
    
  }
  
  const onInvalid = () => {
    notifyError("Por favor completá todos los campos.")
  }

  const handleAddTicket = () => {
    const formTickets = getValues("tickets") || []
    const newId = (formTickets.at(-1)?.ticketTypeId ?? 0) + 1

    const newTicket = {
      ticketTypeId: newId,
      name: "",
      stages: [
        {
          stageId: 1,
          date: null,
          dateMax: null,
          price: 0,
          quantity: 0,
        },
      ],
    }

    append(newTicket)
    updateEventFormData({
      ...eventFormData,
      tickets: [...(eventFormData.tickets || []), newTicket],
    })
  }

  const handleDeleteTicket = (index: number) => {
    if (fields.length === 1) return

    const formTickets = getValues("tickets")
    const ticketIdToDelete = formTickets?.[index]?.ticketTypeId

    remove(index)

    const updatedTickets = eventFormData?.tickets?.filter(
      (ticket) => ticket.ticketTypeId !== ticketIdToDelete
    )

    updateEventFormData({
      ...eventFormData,
      tickets: updatedTickets,
    })
  }

  return (
    <div className="bg-primary-black text-primary-white min-h-screen px-6 pt-28 pb-44">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-title font-bold mb-6">Configura los tickets</h1>

        <div className="space-y-4">
          {fields?.map((ticket, index) => (
            <TicketCard
              getValues={getValues}
              register={register}
              index={index}
              isEditing={true}
              key={ticket?.ticketTypeId || index}
              ticketNumber={ticket.ticketTypeId}
              onDelete={() => handleDeleteTicket(index)}
            />
          ))}
        </div>

        <button
          onClick={handleAddTicket}
          className="w-full bg-primary outline-none text-black font-medium py-3 rounded-lg text-sm flex items-center justify-center gap-2"
        >
          + Incorporar ticket
        </button>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 pt-4">
          {/* Inputs de configuración */}
          <div className="flex flex-col xs:flex-row gap-x-5">
            <FormInput title="Comisión RD" inputName="feeRD" register={register("feeRD", { valueAsNumber: true, required: true, max: 100 })} />
            <FormInput title="Comisión PB" inputName="feePB" register={register("feePB", { valueAsNumber: true, required: true, max: 100 })} />
          </div>
          <div className="flex flex-col xs:flex-row gap-x-5">
            <FormInput title="Costo transferencia de ticket" inputName="transferCost" register={register("transferCost", { valueAsNumber: true, required: true })} />
            <FormInput title="Descuento" inputName="discount" register={register("discount", { valueAsNumber: true, required: true })} />
          </div>
          <div className="flex flex-col xs:flex-row gap-x-5">
            <FormInput type="number" title="Máx. de tickets p/ persona" inputName="maxPurchase" register={register("maxPurchase", { valueAsNumber: true, required: true })} />
            <FormInput title="Tiempo de compra" inputName="timeOut" register={register("timeOut", { required: true })} />
          </div>
          <FormInput title="Código de descuento" inputName="discountCode" register={register("discountCode")} />

          <div className="flex items-center justify-between mt-5">
            <span className="text-white text-lg">Alcancía</span>
            <button
              type="button"
              onClick={() => setValue("piggyBank", !piggyBank)}
              className="w-12 h-6 rounded-full transition-colors pointer-events-auto bg-cards-container"
            >
              <div className={`w-5 h-5 rounded-full transition-transform ${piggyBank ? "translate-x-6 bg-primary" : "translate-x-0.5 bg-text-inactive"}`} />
            </button>
          </div>

          <button type="submit" className="w-full bg-primary text-black font-medium py-4 text-lg rounded-lg mt-10 flex items-center justify-center gap-2">
            Actualizar evento
          </button>
        </form>
      </div>
    </div>
  )
}
