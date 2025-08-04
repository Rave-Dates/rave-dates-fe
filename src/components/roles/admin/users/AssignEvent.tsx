"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useAdminAllEvents, useAdminEvent, useAdminUserById } from "@/hooks/admin/queries/useAdminData";
import { assignOrganizerToEvent, assignPromoterToEvent } from "@/services/admin-events";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function AssignEvent() {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const params = useParams();
  const userId = Number(params.userId)
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const router = useRouter();

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      [`assignedEvent-${userId}`]: "",
    }
  });
  
  const assignOrganizerEvent = useMutation<void, Error, {data: {organizerId: number | null | undefined}, eventId: number}>({
    mutationFn: ({data, eventId}) => assignOrganizerToEvent(token, data, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`assignedEvent-${userId}`] });
    },
  });

  const assignPromoterEvent = useMutation<void, Error, {data: {promoters: {promoterId: number }[]}, eventId: number}>({
    mutationFn: ({data, eventId}) => assignPromoterToEvent(token, data, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`assignedEvent-${userId}`] });
    },
  });
  
  const { data: selectedUser } = useAdminUserById({ token, userId });
  const { allEvents } = useAdminAllEvents({ token });
  const { selectedEvent: eventById } = useAdminEvent({ token, eventId: selectedEventId! });

  const onSubmit = (data: FormValues) => {
    if (!selectedUser) return;
    const selectedEventId = Number(data[`assignedEvent-${userId}`]);

    if (selectedUser.role.name === "ORGANIZER") {
      const formattedData = {
        organizerId: selectedUser.organizer?.organizerId,
      };
      if (!formattedData.organizerId) return;
      
      assignOrganizerEvent.mutate(
        { data: formattedData, eventId: selectedEventId },
        {
          onSuccess: () => {
            notifySuccess("Evento asignado a un organizador correctamente");
            router.back();
          },
          onError: () => notifyError("Error al asignar evento a un organizador"),
        }
      );
    } else if (selectedUser.role.name === "PROMOTER") {
      if (!selectedUser.promoter?.promoterId || !eventById) return;

      const prevPromoters = eventById.promoters?.map((promoter) => ({
        promoterId: promoter.promoterId!,
      })) || [];

      const formattedData = {
        promoters: [
          ...prevPromoters,
          {
            promoterId: selectedUser.promoter.promoterId,
          },
        ],
      };

      assignPromoterEvent.mutate(
        { data: formattedData, eventId: selectedEventId },
        {
          onSuccess: () => {
            notifySuccess("Evento asignado a un promotor correctamente");
            router.back();
          },
          onError: () => notifyError("Evento ya asignado o error al asignar."),
        }
      );
    }
  };


  return (
    <div className="min-h-screen px-4 bg-primary-black pb-40 sm:pb-32 flex flex-col justify-between">
      <DefaultForm className="h-full pb-10 sm:pb-20" handleSubmit={handleSubmit(onSubmit, onInvalid)} title="Asignar evento">
        <FormDropDown
          title="Evento*"
          register={register(`assignedEvent-${userId}`, {
            required: "El evento es obligatorio"
          })}
          onChange={(e) => {
            const val = e.target.value;
            const id = Number(val);
            if (!isNaN(id)) setSelectedEventId(id);
          }}
        >
          <option value="" disabled hidden>Seleccioná un evento</option>
          {
            allEvents?.map((event) => (
              <option key={event.eventId} value={String(event.eventId)}>
                {event.title}
              </option>
            ))
          }
        </FormDropDown>
      </DefaultForm>
      <button
        onClick={handleSubmit(onSubmit, onInvalid)}
        type="submit"
        className="bg-primary max-w-xl self-center text-black input-button"
      >
        Asignar evento
      </button>
    </div>
  );
}
