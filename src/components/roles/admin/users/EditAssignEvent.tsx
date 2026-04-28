"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { assignOrganizerToEvent, assignPromoterToEvent, deleteOrganizerEvent, deletePromoterEvent, getAllEvents } from "@/services/admin-events";
import { getUserById } from "@/services/admin-users";
import { useAdminUserById } from "@/hooks/admin/queries/useAdminData";
import { formatDate } from "@/utils/formatDate";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

export default function EditAssignEvent({ isOrganizer = false }: { isOrganizer?: boolean }) {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [assignedEventValue, setAssignedEventValue] = useState("");

  const queryClient = useQueryClient();
  const params = useParams();
  const userId = Number(params.userId)
  const eventId = Number(params.eventId)
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const router = useRouter();

  // Decode JWT to get the logged-in organizer's user data
  const decoded: IUserLogin | null = isOrganizer && token ? jwtDecode(token.toString()) : null;
  const { data: loggedInUser } = useAdminUserById({ token, userId: decoded?.id ?? 0 });

  interface FormValues {
    assignedEvent: string;
  }

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      assignedEvent: "",
    }
  });

  const deleteOrganizerEventMutation = useMutation<void, Error, {data: {organizerId: number | null | undefined}, eventId: number}>({
    mutationFn: ({data, eventId}) => deleteOrganizerEvent(token, data, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`assignedEvent-${userId}`] });
    },
  });

  const deletePromoterEventMutation = useMutation<void, Error, {data: {promoters: {promoterId: number }[]}, eventId: number}>({
    mutationFn: ({data, eventId}) => deletePromoterEvent(token, data, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`assignedEvent-${userId}`] });
    },
  });
  
  const { data: clientEvents } = useQuery<IEvent[]>({
    queryKey: ["clientEvents"],
    queryFn: () => getAllEvents({ token }),
    enabled: !!token, // solo se ejecuta si hay token
  });

  const { data: selectedUser } = useQuery<IUser>({
    queryKey: ["user"],
    queryFn: () => getUserById({ token, id: userId }),
    enabled: !!token, // solo se ejecuta si hay token
  });

  const { data: newEventData } = useQuery<IEvent>({
    queryKey: ["eventToAssign", selectedEventId],
    queryFn: () => getAllEvents({ token }).then(events => events.find(ev => ev.eventId === selectedEventId)!),
    enabled: !!token && !!selectedEventId,
  });

  // Filter events based on role:
  // - Organizer: only show events assigned to the logged-in organizer
  // - Admin: show all events except free ones
  const filteredEvents = useMemo(() => {
    if (!clientEvents) return [];

    const todayStr = formatDate(new Date());
    let events = clientEvents.filter((event) => {
      const eventDateStr = formatDate(event.date);
      return eventDateStr >= todayStr;
    });

    if (isOrganizer) {
      // Only show events assigned to this organizer
      const organizerEventIds = new Set(
        loggedInUser?.organizer?.events?.map((e) => e.eventId) ?? []
      );
      return events.filter((event) => organizerEventIds.has(event.eventId));
    } else {
      // Admin: filter out free events
      return events.filter((event) => event.type !== 'free');
    }
  }, [clientEvents, isOrganizer, loggedInUser?.organizer?.events]);

  useEffect(() => {
    if (!selectedUser) return;
    if (selectedUser.role.name === "ORGANIZER" && !selectedUser.organizer?.events?.length) return;
    if (selectedUser.role.name === "PROMOTER" && !selectedUser.promoter?.events?.length) return;

    const assignedOrganizerEvent =
      selectedUser.role.name === "ORGANIZER" && selectedUser.organizer?.events.find(e => e.eventId === eventId);

    const assignedPromotorEvent =
      selectedUser.role.name === "PROMOTER" && selectedUser.promoter?.events.find(e => e.eventId === eventId);

    if (assignedOrganizerEvent) {
      setAssignedEventValue(assignedOrganizerEvent.OrganizerEvent.eventId.toString());
      reset({
        assignedEvent: assignedOrganizerEvent.OrganizerEvent.eventId.toString(),
      });
    }

    if (assignedPromotorEvent && assignedPromotorEvent.eventId) {
      setAssignedEventValue(assignedPromotorEvent.eventId.toString());
      reset({
        assignedEvent: assignedPromotorEvent.eventId.toString(),
      });
    }
  }, [selectedUser, reset, userId, selectedUser?.organizer?.events?.length, selectedUser?.promoter?.events?.length ]);


  const onSubmit = async (data: FormValues) => {
    if (!selectedUser) return;
    const newEventId = Number(data.assignedEvent);

    const role = selectedUser?.role.name;

    // Obtener el evento asignado actual
    const currentEventId =
      role === "ORGANIZER"
        ? selectedUser.organizer?.events?.[0]?.eventId
        : selectedUser.promoter?.events?.[0]?.eventId;

    // Si no cambió, no hacemos nada
    if (currentEventId === newEventId) {
      notifyError("No se realizaron cambios");
      return;
    }

    try {
      if (role === "PROMOTER") {
        if (!selectedUser.promoter || !selectedUser.promoter.promoterId || !newEventData) return;

        const prevPromoters = newEventData.promoters?.filter(p => p.promoterId !== selectedUser.promoter?.promoterId) || [];

        const formattedData = {
          promoters: [
            ...prevPromoters.map(p => ({
              promoterId: p.promoterId!,
            })),
            {
              promoterId: selectedUser.promoter.promoterId,
            },
          ],
        };

        if (currentEventId) {
          await deletePromoterEvent(
            token,
            { promoters: [{ promoterId: selectedUser.promoter.promoterId }] },
            currentEventId
          );
        }

        await assignPromoterToEvent(token, formattedData, newEventId);
      }

      if (role === "ORGANIZER") {
        // Eliminar evento anterior si existe
        if (currentEventId) {
          await deleteOrganizerEvent(
            token,
            { organizerId: selectedUser.organizer?.organizerId },
            currentEventId
          );
        }

        // Asignar nuevo evento
        await assignOrganizerToEvent(
          token,
          { organizerId: selectedUser.organizer?.organizerId },
          newEventId
        );
      }

      notifySuccess("Asignación actualizada correctamente");
      router.back();
    } catch (err) {
      console.error(err);
      notifyError("Hubo un error al actualizar la asignación del evento");
    }
  };
  
  const handleDelete = (data: FormValues) => {
    const selectedEventId = Number(data["assignedEvent"]);
    if (selectedUser?.role.name === "ORGANIZER") {
      const formattedData = {
        organizerId: selectedUser.organizer?.organizerId,
      }
      console.log("ORGANIZER formattedData",formattedData)
      if (!formattedData.organizerId) return
      deleteOrganizerEventMutation.mutate(
        {
          data: formattedData, 
          eventId: selectedEventId
        }, {
        onSuccess: () => {
          notifySuccess("Evento de organizador eliminado correctamente");
          router.back();
        },
        onError: (error) => {
          notifyError("Error al eliminar evento de un organizador");
        },
      });
    } else if (selectedUser?.role.name === "PROMOTER") {
      if (!selectedUser.promoter || !selectedUser.promoter.promoterId) return
      const selectedEventId = Number(data["assignedEvent"]);
      const formattedData = {
        promoters: [{
          promoterId: selectedUser.promoter.promoterId,
        }],
      }
      deletePromoterEventMutation.mutate(
        {
          data:formattedData, 
          eventId: selectedEventId
        }, {
        onSuccess: () => {
          notifySuccess("Evento de promotor eliminado correctamente");
          router.back();
        },
        onError: (error) => {
          notifyError("Error al eliminar evento de un promotor");
        },
      });
    }
  }

  return (
    <div className="min-h-screen px-4 bg-primary-black pb-40 sm:pb-32 flex flex-col justify-between">
      <DefaultForm className="h-full pb-10 sm:pb-20" handleSubmit={handleSubmit(onSubmit, onInvalid)} title="Editar asignación de evento">
        <FormDropDown
          title="Evento*"
          register={register("assignedEvent", {
            required: "El evento es obligatorio"
          })}
          value={assignedEventValue}
          onChange={(e) => {
            const val = e.target.value;
            setAssignedEventValue(val);
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
      <div className="w-full flex flex-col">
        <button
          type="button"
          onClick={handleSubmit(handleDelete, onInvalid)}
          className="max-w-xl self-center text-system-error input-button"
        >
          Eliminar asignación de evento
        </button>
        <button
          type="submit"
          onClick={handleSubmit(onSubmit, onInvalid)}
          className="bg-primary max-w-xl self-center text-primary-white input-button"
        >
          Guardar cambios
        </button>
      </div>
    </div>
  );
}
