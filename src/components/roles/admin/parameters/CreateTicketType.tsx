"use client";

import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { getAllEvents } from "@/services/admin-events";
import { createTicketType } from "@/services/admin-parameters";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import React from "react";
import { useForm } from "react-hook-form";

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
    enabled: !!token, // solo se ejecuta si hay token
  });

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

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold mb-4">Crear tipo de ticket</h1>
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
