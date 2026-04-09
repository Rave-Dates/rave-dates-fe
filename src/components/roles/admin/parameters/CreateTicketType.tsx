"use client";

import ArrowDownSvg from "@/components/svg/ArrowDown";
import TrashSvg from "@/components/svg/TrashSvg";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { getAllEvents } from "@/services/admin-events";
import { createTicketType } from "@/services/admin-parameters";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { useAdminTicketTypes } from "@/hooks/admin/queries/useAdminData";

export default function CreateTicketType() {
  const { register, handleSubmit, setValue } = useForm<IEventTicket>({
    defaultValues: {
      eventId: 1,
      name: "",
      maxDate: "",
      stages: [{ stageId: 1, date: "2025-10-10", dateMax: "2025-10-10", price: 0, quantity: 0, promoterFee: 0, feeType: "percentage" }],
    },
  });
  const { getCookie } = useReactiveCookiesNext();
  const [selectedPreviewEvent, setSelectedPreviewEvent] = useState<number>(1);

  const token = getCookie("token");

  const { mutate } = useMutation({
    mutationFn: createTicketType,
    onSuccess: () => {
      notifySuccess('Tipo de ticket creado correctamente'); 
      setValue("name", "");
      setValue("eventId", undefined);
      setValue("maxDate", "");
    },
    onError: (error) => {
      notifyError("Error al crear tipo de ticket.");
      console.log(error)
    },
  });

  const { data: events } = useQuery<IEvent[]>({
    queryKey: ["roles"],
    queryFn: () => getAllEvents({ token }),
    enabled: !!token, 
  });

  const { ticketTypes } = useAdminTicketTypes({ token, eventId: selectedPreviewEvent });

  const onSubmit = (data: IEventTicket) => {
    const trimmedName = data.name.trim();
    const trimmedMaxDate = data.maxDate.trim();

    const formattedData = {
      ...data,
      name: trimmedName,
      maxDate: trimmedMaxDate,
    };
    
    mutate({
      token,
      data: formattedData,
    });
  };

  const deleteTicketType = (ticketTypeId: number) => {
    notifySuccess("Tipo de ticket eliminado correctamente " + ticketTypeId);
  }

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold mb-4">Crear tipo de ticket</h1>
      
      <div className="flex flex-col items-start my-3">
        
        <p className="w-34 mb-3 text-sm font-medium">Tipos de tickets activos:</p>
        <div className="relative w-full">
          <label
            htmlFor="preview-event-select"
            className={`block mb-2 text-xs text-primary-white/60`}
          >
            Vista previa por evento
          </label>
          <div className="relative">
            <select
              id="preview-event-select"
              onChange={(e) => setSelectedPreviewEvent(Number(e.target.value))}
              value={selectedPreviewEvent}
              className="w-full appearance-none mt-1 bg-input border outline-none border-divider rounded-lg py-3 px-4 text-white relative transition-colors focus:border-primary/50"
            >
              {
                events?.map((event) => (
                  <option 
                    key={event.eventId}   
                    value={event.eventId}
                  >
                    {event.title}
                  </option>
                ))
              }
            </select>
            <ArrowDownSvg className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4">
          {
            ticketTypes && ticketTypes.length > 0 ? (
              ticketTypes.map((ticketType: IEventTicket) => (
                <div className="bg-primary rounded-md flex items-center gap-2 animate-fade-in" key={ticketType.ticketTypeId}>
                  <h1 className="text-sm px-3 py-1 text-primary-black font-bold uppercase tracking-tight">{ticketType.name}</h1>
                  <button 
                    type="button"
                    onClick={() => deleteTicketType(ticketType.ticketTypeId ?? 0)} 
                    className="text-primary-black h-8 w-10 flex items-center justify-center rounded-r-md bg-system-error hover:bg-system-error/80 transition-colors"
                  >
                    <TrashSvg />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-inactive italic">No hay tipos de tickets para este evento</p>
            )
          }
        </div>
      </div>
      
      
      <div className="w-full flex gap-x-3">
        <FormInput
          title="Nombre*"
          inputName="name"
          register={register("name", { required: true })}
        />
        <FormDropDown
          title="Evento*"
          register={register(`eventId`, { required: true, valueAsNumber: true })}
        >
          {
            events?.map((event) => (
              <option 
                key={event.eventId}   
                value={event.eventId}
              >
                {event.title}
              </option>
            ))
          }
        </FormDropDown>
        <FormInput
          title="Fecha máx*"
          inputName="maxDate"
          register={register("maxDate", { required: true })}
        />
      </div>

      <button
        type="submit"
        className="text-primary border border-primary input-button" 
      >
        Crear tipo de ticket
      </button>
    </form>
  );
}
