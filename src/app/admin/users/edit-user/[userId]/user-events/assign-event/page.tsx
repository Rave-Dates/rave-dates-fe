"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { assignOrganizerToEvent, assignPromoterToEvent, getAllEvents } from "@/services/admin-events";
import { getUserById } from "@/services/admin-users";
import { getAllClientEvents } from "@/services/clients-events";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
  const queryClient = useQueryClient();
  const params = useParams();
  const userId = Number(params.userId)
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const router = useRouter();

  const { register, handleSubmit, formState } = useForm({
    defaultValues: {
      [`assignedEvent-${userId}`]: "",
      assignedCommission: ""
    }
  });
  
  const assignOrganizerEvent = useMutation({
    mutationFn: ({data, eventId}) => assignOrganizerToEvent(token, data, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`assignedEvent-${userId}`] });
    },
  });

  const assignPromoterEvent = useMutation({
    mutationFn: ({data, eventId}) => assignPromoterToEvent(token, data, eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`assignedEvent-${userId}`] });
    },
  });
  
  const { data: clientEvents } = useQuery({
    queryKey: ["clientEvents"],
    queryFn: () => getAllEvents({ token }),
    enabled: !!token, // solo se ejecuta si hay token
  });

  const { data: selectedUser } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserById({ token, id: userId }),
    enabled: !!token, // solo se ejecuta si hay token
  });


  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    console.log("selectedUser",selectedUser)
    if (selectedUser?.role.name === "ORGANIZER") {
      const formattedData = {
        organizerId: selectedUser.organizer.organizerId,
      }
      console.log("ORGANIZER formattedData",formattedData)
      assignOrganizerEvent.mutate({data:formattedData, eventId: data[`assignedEvent-${userId}`]}, {
        onSuccess: () => {
          notifySuccess("Evento asignado a un organizador correctamente");
          router.back();
        },
        onError: (error) => {
          console.log(error)
          notifyError("Error al asignar evento a un organizador");
        },
      });
    } else if (selectedUser?.role.name === "PROMOTER") {
      const formattedData = {
        promoters: [{
          promoterId: selectedUser.promoter.promoterId,
        }],
      }
      assignPromoterEvent.mutate({data:formattedData, eventId: data[`assignedEvent-${userId}`]}, {
        onSuccess: () => {
          notifySuccess("Evento asignado a un promotor correctamente");
          router.back();
        },
        onError: () => {
          notifyError("Error al asignar evento a un promotor");
        },
      });
      console.log("PROMOTER formattedData",formattedData)
    }
    
  };

  const onInvalid = (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      notifyError(firstError.message);
    } else {
      notifyError("Por favor completá todos los campos requeridos.");
    }
  };

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
        <button
          type="submit"
          className="bg-primary max-w-xl self-center text-black input-button"
        >
          Asignar evento
        </button>
      </DefaultForm>
    </div>
  );
}
