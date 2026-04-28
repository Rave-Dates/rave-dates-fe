"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useAdminAllEvents, useAdminEvent, useAdminUserById } from "@/hooks/admin/queries/useAdminData";
import { assignOrganizerToEvent, assignPromoterToEvent } from "@/services/admin-events";
import { formatDate } from "@/utils/formatDate";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export default function AssignEvent({ isOrganizer = false }: { isOrganizer?: boolean }) {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const params = useParams();
  const userId = Number(params.userId)
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const router = useRouter();

  // Decode JWT to get the logged-in organizer's user data
  const decoded: IUserLogin | null = isOrganizer && token ? jwtDecode(token.toString()) : null;
  const { data: loggedInUser } = useAdminUserById({ token, userId: decoded?.id ?? 0 });

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

  // Filter events based on role:
  // - Organizer: only show events assigned to the logged-in organizer
  // - Admin: show all events except free ones
  const filteredEvents = useMemo(() => {
    if (!allEvents) return [];

    const todayStr = formatDate(new Date());
    let events = allEvents.filter((event) => {
      const eventDateStr = formatDate(event.date);
      return eventDateStr >= todayStr;
    });

    if (isOrganizer) {
      // Only show events assigned to this organizer
      const organizerEventIds = new Set(
        loggedInUser?.organizer?.events?.map((e) => e.eventId) ?? []
      );
      events = events.filter((event) => organizerEventIds.has(event.eventId));
    } else {
      // Admin: filter out free events
      events = events.filter((event) => event.type !== 'free');
    }

    return events;
  }, [allEvents, isOrganizer, loggedInUser?.organizer?.events]);

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
            filteredEvents.map((event) => (
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
        className="bg-primary max-w-xl self-center text-primary-white input-button"
      >
        Asignar evento
      </button>
    </div>
  );
}
