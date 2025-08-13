"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useAdminGetGuests } from "@/hooks/admin/queries/useAdminData";
import { resendTicketGuest, updateGuest } from "@/services/admin-users";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function EditGuest({ clientId }: {clientId: number}) {
  const { register, handleSubmit, reset } = useForm<IFormGuest>();
  const params = useParams();
  const eventId = Number(params.eventId);
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const router = useRouter();
  
  const { guests } = useAdminGetGuests({ token, eventId });
  // const { ticketTypes } = useAdminTicketTypes({ token, eventId });

  const { mutate } = useMutation({
    mutationFn: updateGuest,
    onSuccess: () => {
      notifySuccess('Invitado editado correctamente');
      router.back();
    },
    onError: (error) => {
      console.log(error)
      notifyError("Error al editar invitado");
    },
  });

  const { mutate: resendTickets } = useMutation({
    mutationFn: resendTicketGuest,
    onSuccess: () => {
      notifySuccess('Tickets reenviados correctamente');
    },
    onError: (error) => {
      console.log(error)
      notifyError("Error al reenviar tickets");
    },
  });

  useEffect(() => {
    if (!guests) return;
    const guest = guests.find(g => g.clientId === clientId);
    if (!guest) return;
    reset(guest);
  }, [guests, clientId, reset]);

  const onSubmit = (data: Partial<IFormGuest>) => {
    console.log(data)
    if(!data.name || !data.email || !data.whatsapp || !data.idCard) return;

    const formData = {
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp,
      idCard: data.idCard,
      balance: 0,
      firstLogin: false,
    };

    mutate({
      token,
      data: formData,
      clientId,
    });
  };

  const handleResendTicket = () => {
    resendTickets({
      token,
      clientId,
      eventId
    });
  };

  return (
    <div className="bg-primary-black w-full flex justify-between flex-col text-primary-white min-h-screen pb-40">
      <DefaultForm className="px-6" handleSubmit={handleSubmit(onSubmit, onInvalid)} title="Editar invitado">
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

        {/* <FormDropDown
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
        </FormDropDown> */}

      </DefaultForm>
      <div className="flex flex-col items-center justify-center w-full px-6 gap-y-5">
        <button
          onClick={handleResendTicket}
          type="submit"
          className="border border-primary text-primary w-full rounded-lg py-4 font-medium mx-6"
        >
          Reenviar
        </button>
        <button
          onClick={handleSubmit(onSubmit, onInvalid)}
          type="submit"
          className="bg-primary rounded-lg py-4 font-medium w-full text-black mx-6"
        >
          Editar
        </button>
      </div>
    </div>
  );
}
