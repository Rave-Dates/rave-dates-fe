"use client"

import { TicketCard } from "@/components/roles/admin/TicketCard"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import FormInput from "@/components/ui/inputs/FormInput"
import { notifyError, notifyPending } from "@/components/ui/toast-notifications"
import { useEditEvent } from "@/hooks/useEditEvent"
import { getTicketTypesById } from "@/services/admin-events"
import { useCreateEventStore } from "@/store/createEventStore"
import { combineDateAndTimeToISO, formatColombiaTimeToUTC, formatDate } from "@/utils/formatDate"
import { onInvalid } from "@/utils/onInvalidFunc"
import { useQuery } from "@tanstack/react-query"
import { useReactiveCookiesNext } from "cookies-next"
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import { useFieldArray, useForm } from "react-hook-form"

export default function EditTicketConfiguration() {
  const { eventFormData, updateEventFormData, hasLoadedTickets, setHasLoadedTickets, hasLoadedEvent } = useCreateEventStore()
  const { register, handleSubmit, watch, setValue, getValues, control, reset } = useForm<IEventFormData>({
    defaultValues: eventFormData,
  })
  const route = useRouter()
  const { mutate: editEvent } = useEditEvent(reset)

  const { fields, remove } = useFieldArray({
    control,
    name: "tickets",
  })

  const { getCookie } = useReactiveCookiesNext()
  const token = getCookie("token")
  const params = useParams()
  const eventId = Number(params.eventId)

  // 🟢 Traemos tickets del evento
  const { data: ticketsData } = useQuery<IEventTicket[]>({
    queryKey: ["eventTickets", eventId],
    queryFn: () => getTicketTypesById(token, eventId),
    enabled: !!token && !!eventId,
  })

  useEffect(() => {
    if (!hasLoadedEvent) {
      console.log(hasLoadedEvent)
      notifyError("Por favor vuelva a seleccionar un ticket")
      route.push(`/admin/events/edit-event/${eventId}`)
    }
  }, [eventFormData]);

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

      const updatedData = {
        ...eventFormData,
        tickets: formattedTickets,
      };

      setValue("tickets", formattedTickets);
      updateEventFormData(updatedData);
      setHasLoadedTickets(true);
    }
  }, [ticketsData, eventFormData]);

  const piggyBank = watch("piggyBank", false)
  if (piggyBank === false) setValue("commission", undefined)

  const onSubmit = (data: IEventFormData) => {
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

    if (!data.date || !data.time) return
    const validDate = combineDateAndTimeToISO(data.date, data.time)
    const formattedTimeUTC = formatColombiaTimeToUTC(validDate)
    
    updateEventFormData({
      ...eventFormData,
      ...data,
      tickets: data.tickets,
    })

    const cleanedEventData = {
      eventId: eventFormData.eventId,
      title: data.title,
      subtitle: data.subtitle,
      date: formattedTimeUTC,
      geo: data.geo,
      description: data.description,
      type: data.type,
      isActive: data.isActive,
      feeRD: data.feeRD,
      feePB: data.feePB,
      categoriesToUpdate: data.categoriesToUpdate,
      transferCost: data.transferCost,
      discountCode: data.discountCode,
      discountType: data.discountType,
      discount: data.discount,
      maxPurchase: data.maxPurchase,
      images: data.images,
      timeOut: data.timeOut,
      labels: data.labels,
      tickets: formattedTickets,
    }

    console.log("cleanedEventData",cleanedEventData)

    // // funcion para editar evento
    notifyPending(
      new Promise((resolve, reject) => {
        editEvent(cleanedEventData, {
          onSuccess: () => {
            resolve("");
            route.push("/admin/events");
          },
          onError: (err) => {
            console.log(err)
            reject(err);
            route.push("/admin/events");
          },
        });
      }),
      {
        loading: "Editando evento...",
        success: "Evento editado correctamente",
        error: "Error al editar el evento",
      }
    );
  }
  
  // const handleAddTicket = () => {
  //   const formTickets = getValues("tickets") || [];

  //   // Buscar el ticketTypeId más alto
  //   const maxId = Math.max(...formTickets.map(t => t.ticketTypeId || 0))

  //   const newId = maxId + 1;

  //   const newTicket = {
  //     ticketTypeId: newId,
  //     name: "",
  //     stages: [
  //       {
  //         stageId: 1,
  //         date: null,
  //         dateMax: null,
  //         price: 0,
  //         quantity: 0,
  //       },
  //     ],
  //   };

  //   append(newTicket);
  //   updateEventFormData({
  //     ...eventFormData,
  //     tickets: [...(eventFormData.tickets || []), newTicket],
  //   });
  // };

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
              key={ticket.id}
              ticketNumber={ticket.ticketTypeId}
              onDelete={() => handleDeleteTicket(index)}
            />
          ))}
        </div>

        {/* <button
          onClick={handleAddTicket}
          className="w-full bg-primary outline-none text-black font-medium py-3 rounded-lg text-sm flex items-center justify-center gap-2"
        >
          + Incorporar ticket
        </button> */}

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4 pt-4">
          {/* Inputs de configuración */}
          <div className="flex flex-col xs:flex-row gap-x-5">
            <FormInput title="Comisión RD" inputName="feeRD" register={register("feeRD", { valueAsNumber: true, required: "La comisión RD es obligatoria", max: 100 })} />
            <FormInput title="Comisión PB" inputName="feePB" register={register("feePB", { valueAsNumber: true, required: "La comisión PB es obligatoria", max: 100 })} />
          </div>
          <div className="flex flex-col xs:flex-row gap-x-5">
            <FormInput title="Costo transferencia de ticket" inputName="transferCost" register={register("transferCost", { valueAsNumber: true, required: "El costo de transferencia es obligatorio" })} />
            <FormInput title="Descuento" inputName="discount" register={register("discount", { valueAsNumber: true, required: "El descuento es obligatorio" })} />
          </div>
          <div className="flex flex-col xs:flex-row gap-x-5">
            <FormInput type="number" title="Máx. de tickets p/ persona" inputName="maxPurchase" register={register("maxPurchase", { valueAsNumber: true, required: "El máximo de tickets es obligatorio" })} />
            <FormInput title="Tiempo de compra (minutos)" inputName="timeOut" register={register("timeOut", { required: "El tiempo de compra es obligatorio", valueAsNumber: true })} />
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
