"use client";

import ArrowDownSvg from "@/components/svg/ArrowDown";
import EditableItem from "@/components/ui/EditableItem";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { editTicketTypes, getAllEvents } from "@/services/admin-events";
import { createTicketType, deleteTicketType } from "@/services/admin-parameters";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CookieValueTypes, useReactiveCookiesNext } from "cookies-next";
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
  const queryClient = useQueryClient();

  const token = getCookie("token");

  // mutation to create
  const { mutate: createMutate } = useMutation({
    mutationFn: createTicketType,
    onSuccess: () => {
      notifySuccess('Tipo de ticket creado correctamente'); 
      setValue("name", "");
      setValue("eventId", undefined);
      setValue("maxDate", "");
      queryClient.invalidateQueries({ queryKey: ["ticketTypes", selectedPreviewEvent] });
    },
    onError: (error) => {
      notifyError("Error al crear tipo de ticket.");
      console.log(error)
    },
  });

  // mutation to update
  const { mutate: updateMutate } = useMutation({
    mutationFn: ({token, data, id}: {token: CookieValueTypes, data: IEventTicket, id: number}) => editTicketTypes(token, data, id),
    onSuccess: () => {
      notifySuccess('Tipo de ticket actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ["ticketTypes", selectedPreviewEvent] });
    },
    onError: (error) => {
      notifyError("Error al actualizar tipo de ticket.");
      console.log(error)
    },
  });

  // mutation to delete
  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteTicketType,
    onSuccess: () => {
      notifySuccess("Tipo de ticket eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["ticketTypes", selectedPreviewEvent] });
    },
    onError: (error) => {
      notifyError("Error al eliminar tipo de ticket.");
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
    
    createMutate({
      token,
      data: formattedData,
    });
  };

  const handleDelete = (ticketTypeId: number) => {
    deleteMutate({ token, ticketTypeId });
  }

  const handleUpdate = (ticketType: IEventTicket, newName: string) => {
    const updatedTicket = { ...ticketType, name: newName };
    updateMutate({ token, data: updatedTicket, id: ticketType.ticketTypeId ?? 0 });
  }

  return (
    <form autoComplete="off" className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-semibold mb-4">Crear tipo de ticket</h1>
      
      <div className="flex flex-col items-start my-3">
        
        <p className="mb-3 text-sm font-medium">Ver tipos de ticket activos:</p>
        <div className="relative w-full">
          <label
            htmlFor="preview-event-select"
            className="block mb-2 text-xs text-primary-white/60"
          >
            Vista previa por evento
          </label>
          <div className="relative">
            <select
              id="preview-event-select"
              onChange={(e) => setSelectedPreviewEvent(Number(e.target.value))}
              value={selectedPreviewEvent}
              className="w-full appearance-none mt-1 bg-main-container outline-none rounded-lg py-3 px-4 text-white relative transition-colors focus:border-primary/50"
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
            <ArrowDownSvg className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2" />
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4 mb-4">
          {
            ticketTypes && ticketTypes.length > 0 ? (
              ticketTypes.map((ticketType: IEventTicket) => (
                <EditableItem
                  key={ticketType.ticketTypeId}
                  initialValue={ticketType.name}
                  onSave={(newName) => handleUpdate(ticketType, newName)}
                  onDelete={() => handleDelete(ticketType.ticketTypeId ?? 0)}
                />
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
          register={register(`eventId`, { 
            required: true, 
            setValueAs: (v) => v === "" ? undefined : Number(v) 
          })}
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
