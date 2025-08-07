"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyPending } from "@/components/ui/toast-notifications";
import { useCreateGuest } from "@/hooks/admin/mutations/useCreateGuest";
import { useAdminTicketTypes } from "@/hooks/admin/queries/useAdminData";
import { useReactiveCookiesNext } from "cookies-next";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

export default function AddGuest() {
  const { register, handleSubmit} = useForm<IFormGuest>();
  const params = useParams();
  const eventId = Number(params.eventId);
  const { getCookie } = useReactiveCookiesNext();
  const { mutate: createGuestMutation } = useCreateGuest();

  const token = getCookie("token");

  const { ticketTypes } = useAdminTicketTypes({ token, eventId });

  const onSubmit = (data: Partial<IFormGuest>) => {
    if(!data.ticketTypeId || !data.name || !data.email || !data.whatsapp || !data.idCard) return;

    const cleanedEventData = {
      quantity: 1,
      ticketTypeId: data.ticketTypeId,
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      idCard: data.idCard,
      balance: 0,
      firstLogin: false,
    };

    notifyPending(
      new Promise((resolve, reject) => {
        createGuestMutation(cleanedEventData, {
          onSuccess: resolve,
          onError: reject,
        });
      }),
      {
        loading: "Creando invitado...",
        success: "Invitado creado correctamente",
        error: "Error al crear invitado",
      }
    );
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit)} title="Agregar invitado">
      <FormInput
        title="Nombre completo*"
        inputName="name"
        register={register("name", { required: true })}
      />
      <FormInput
        type="email"
        title="Mail*"
        inputName="email"
        register={register("email", { required: true })}
      />
      <FormInput
        title="Cédula o Pasaporte*"
        inputName="idCard"
        register={register("idCard", { required: true })}
      />
      <FormInput
        title="Celular*"
        inputName="whatsapp"
        register={register("whatsapp", { required: true })}
      />

      <FormDropDown
        title="Tipo de ticket*"
        register={register("ticketTypeId", { required: true, valueAsNumber: true })}
      >
        {
          ticketTypes?.map((ticket: IEventTicket) => (
            <option key={ticket.ticketTypeId} value={ticket.ticketTypeId}>
              {ticket.name}
            </option>
          ))
        }
      </FormDropDown>

      <button
        type="submit"
        className="bg-primary text-black input-button"
      >
        Agregar
      </button>
    </DefaultForm>
  );
}
