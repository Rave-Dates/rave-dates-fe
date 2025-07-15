"use client"

import { TicketCard } from "@/components/roles/admin/TicketCard"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifyPending } from "@/components/ui/toast-notifications";
import { useCreateFullEvent } from "@/hooks/useCreateEventFull";
import { useCreateEventStore } from "@/store/createEventStore";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function FreeTicketConfiguration() {
  const { eventFormData, updateEventFormData } = useCreateEventStore();
  const { register, handleSubmit, reset} = useForm<IEventFormData>({
    defaultValues: eventFormData
  });
  const { mutate: createFullEvent } = useCreateFullEvent(reset);

  const onSubmit = (data: IEventFormData) => {
    const validTickets = data.tickets.map(({ ticketId, stages, ...rest }) => {
      const maxDate = stages?.[0]?.dateMax ?? null;
      return {
        ...rest,
        stages,
        maxDate,
      };
    });

    const firstTicket = validTickets.length > 0 ? [validTickets[0]] : [];

    updateEventFormData({
      ...eventFormData,
      ...data,
      tickets: data.tickets,
    });

    const yyyyMmDd = data.date?.toISOString().split('T')[0];

    const cleanedEventData = {
      title: data.title,
      date: yyyyMmDd,
      geo: data.geo,
      description: data.description,
      type: data.type,
      isActive: data.isActive,
      images: data.images,
      labels: data.labels,
      tickets: firstTicket,
    };

    notifyPending(
      new Promise((resolve, reject) => {
        createFullEvent(cleanedEventData, {
          onSuccess: resolve,
          onError: reject,
        });
      }),
      {
        loading: "Creando evento...",
        success: "Evento creado correctamente",
        error: "Error al crear el evento",
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
