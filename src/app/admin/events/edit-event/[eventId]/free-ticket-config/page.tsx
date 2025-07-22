"use client"

import GoBackButton from "@/components/ui/buttons/GoBackButton"
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifyPending } from "@/components/ui/toast-notifications";
import { useEditEvent } from "@/hooks/useEditEvent";
import { getTicketTypesById } from "@/services/admin-events";
import { useCreateEventStore } from "@/store/createEventStore";
import { formatDate } from "@/utils/formatDate";
import { useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function FreeTicketConfiguration() {
  const { eventFormData, updateEventFormData } = useCreateEventStore();
  const { register, handleSubmit, reset , setValue} = useForm<IEventFormData>({
    defaultValues: eventFormData
  });
  const { mutate: editEvent } = useEditEvent(reset);
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const params = useParams();
  const eventId = Number(params.eventId)

  // 🟢 Traemos tickets del evento
  const { data: ticketsData } = useQuery<IEventTicket[]>({
    queryKey: ["eventTickets", eventId],
    queryFn: () => getTicketTypesById(token, eventId),
    enabled: !!token && !!eventId,
  })
  
  useEffect(() => {
    if (ticketsData) {
      const formattedTickets = ticketsData.map((ticket) => ({
        ticketTypeId: ticket.ticketTypeId,
        name: ticket.name,
        maxDate: formatDate(ticket.maxDate),
        stages: ticket.stages.map((stage) => ({
          price: stage.price,
          date: formatDate(stage.date),
          dateMax: formatDate(stage.dateMax),
          quantity: stage.quantity,
        })),
      }));

      console.log("formattedTickets",formattedTickets)

      const updatedData = {
        ...eventFormData,
        tickets: formattedTickets,
      };

      updateEventFormData(updatedData);
      setValue("tickets", ticketsData);
    }
  }, [ticketsData]);

  const onSubmit = (data: IEventFormData) => {
    console.log("ticketsDATA",ticketsData)
    console.log("eventFormData",eventFormData)
    const formattedTickets: IEventTicket[] = data.tickets.map((ticket) => ({
      ticketTypeId: ticket.ticketTypeId,
      eventId: eventId,
      name: ticket.name,
      maxDate: formatDate(ticket.maxDate),
      stages: ticket.stages.map((stage) => ({
        price: stage.price,
        date: formatDate(stage.date),
        dateMax: formatDate(stage.dateMax),
        quantity: stage.quantity,
      })),
    }));

    updateEventFormData({
      ...eventFormData,
      ...data,
      tickets: data.tickets,
    });

    const cleanedEventData = {
      eventId: eventId,
      title: data.title,
      date: formatToISO(data.date),
      geo: data.geo,
      description: data.description,
      type: data.type,
      isActive: data.isActive,
      images: data.images,
      labels: data.labels,
      tickets: formattedTickets,
    };

    notifyPending(
      new Promise((resolve, reject) => {
        editEvent(cleanedEventData, {
          onSuccess: resolve,
          onError: reject,
        });
      }),
      {
        loading: "Editando evento...",
        success: "Evento editado correctamente",
        error: "Error al editar el evento",
      }
    );

    // onSucces borrar los datos del form y del estado
  };

  const onInvalid = () => {
    notifyError("Por favor completá todos los campos.")
  }

  return (
    <div className="bg-primary-black text-primary-white min-h-screen px-6 pt-28 pb-44">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-title font-bold mb-6">Configura los tickets</h1>

        {/* Configuration Options */}
        <div className="space-y-1 pt-4">
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
            <div className="flex gap-x-5">
              <FormInput
                className="!bg-cards-container"
                title="Nombre"
                inputName="ticketName"
                register={register("tickets.0.name", { required: true })}
              />
              <FormInput
                className="!bg-cards-container"
                title="Cantidad"
                inputName="quantity"
                register={register("tickets.0.stages.0.quantity", { required: true, valueAsNumber: true })}
              />
            </div>
            <div className="flex gap-x-5">
              <FormInput
                className="!bg-cards-container"
                title="Fecha inicio"
                placeholder="yyyy-mm-dd"
                inputName="date"
                register={register("tickets.0.stages.0.date", { required: true, valueAsDate: true })}
              />
              <FormInput
                className="!bg-cards-container"
                title="Fecha máx."
                placeholder="yyyy-mm-dd"
                inputName="dateMax"
                register={register(`tickets.0.stages.0.dateMax`, { required: true })}
              />
            </div>
              <button
                type="submit"
                className="w-full bg-primary text-black font-medium py-4 text-lg rounded-lg mt-10 flex items-center justify-center gap-2"
              >
                Crear evento
              </button>
            </form>
          </div>
      </div>
    </div>
  )
}
