"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { assignOrganizerToEvent, assignPromoterToEvent, deleteOrganizerEvent, deletePromoterEvent, getAllEvents } from "@/services/admin-events";
import { getUserById } from "@/services/admin-users";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const queryClient = useQueryClient();
  const params = useParams();
  const userId = Number(params.userId)
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      [`assignedEvent-${userId}`]: "",
      assignedCommission: ""
    }
  });

  const deleteOrganizerEventMutation = useMutation<void, Error, {data: {organizerId: number | null | undefined}, eventId: number}>({
    mutationFn: ({data, eventId}) => deleteOrganizerEvent(token, data, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`assignedEvent-${userId}`] });
    },
  });

  const deletePromoterEventMutation = useMutation<void, Error, {data: {promoters: {promoterId: number; fee: number;}[]}, eventId: number}>({
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

  useEffect(() => {
    if (!selectedUser) return;

    const assignedEvent =
      selectedUser.role.name === "ORGANIZER"
        ? selectedUser.organizer?.events?.[0]
        : selectedUser.promoter?.events?.[0];

    reset({
      [`assignedEvent-${userId}`]: assignedEvent?.eventId?.toString() || "",
      assignedCommission: "" // podés setear un valor real si lo tenés
    });
  }, [selectedUser, reset, userId]);


  const onSubmit = async (data: FormValues) => {
    if (!selectedUser) return;
    const newEventId = Number(data[`assignedEvent-${userId}`]);
    const commission = Number(data.assignedCommission); // solo para PROMOTER

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
        if (!selectedUser.promoter || !selectedUser.promoter.promoterId) return;
        // Eliminar evento anterior si existe
        if (currentEventId) {
          await deletePromoterEvent(
            token,
            { promoters: [{ promoterId: selectedUser.promoter.promoterId, fee: commission }] },
            currentEventId
          );
        }

        // Asignar nuevo evento
        await assignPromoterToEvent(
          token,
          { promoters: [{ promoterId: selectedUser.promoter.promoterId, fee: commission }] },
          newEventId
        );
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
    console.log("handleDelete")
    const selectedEventId = Number(data[`assignedEvent-${userId}`]);
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
          console.log(error)
          notifyError("Error al eliminar evento de un organizador");
        },
      });
    } else if (selectedUser?.role.name === "PROMOTER") {
      if (!selectedUser.promoter || !selectedUser.promoter.promoterId) return
      const selectedEventId = Number(data[`assignedEvent-${userId}`]);
      const formattedData = {
        promoters: [{
          promoterId: selectedUser.promoter.promoterId,
          fee: 2,
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
          console.log(error)
          notifyError("Error al eliminar evento de un promotor");
        },
      });
      console.log("PROMOTER formattedData",formattedData)
    }
  }

  return (
    <div className="min-h-screen px-4 bg-primary-black pb-40 sm:pb-32 flex flex-col justify-between">
      <DefaultForm className="h-full pb-10 sm:pb-20" handleSubmit={handleSubmit(onSubmit, onInvalid)} title="Asignar evento">
        <FormDropDown
          title="Evento*"
          register={register(`assignedEvent-${userId}`, { required: "El evento es obligatorio" })}
        >
          <option value="" disabled hidden>Seleccioná un evento</option>
          {
            clientEvents?.map((event) => (
              <option key={event.eventId} value={event.eventId}>
                {event.title}
              </option>
            ))
          }
        </FormDropDown>
        {
          selectedUser?.role.name === "PROMOTER" && (
            <FormInput
              type="number"
              title="Comisión (%)*"
              inputName="commission"
              register={register("assignedCommission", { required: "La comisión es obligatoria" })}
            />
          )
        }
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
            className="bg-primary max-w-xl self-center text-black input-button"
          >
            Guardar cambios
          </button>
        </div>
      </DefaultForm>
    </div>
  );
}
