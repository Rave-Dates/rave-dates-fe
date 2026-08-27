"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormInput from "@/components/ui/inputs/FormInput";
import PhoneInput from "@/components/ui/inputs/PhoneInput";
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
  const { register, handleSubmit, reset, control } = useForm<IFormGuest>();
  const params = useParams();
  const eventId = parseInt(params.eventId as string, 10);
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

  const { mutate: resendTickets, isPending: isResending } = useMutation({
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
          title="Email*"
          inputName="email"
          register={register("email", { required: true })}
        />
        <FormInput
          type="text"
          title="Cédula o Pasaporte*"
          inputName="idCard"
          register={register("idCard", { required: true })}
        />
        <PhoneInput
          title="Celular*"
          name="whatsapp"
          control={control}
          rules={{ required: true }}
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
      <div className="flex pt-10 max-w-2xl w-full mx-auto flex-col items-center justify-center w-full px-6 gap-y-5">
        <button
          onClick={handleResendTicket}
          disabled={isResending}
          type="button"
          className="border border-primary text-primary w-full rounded-lg py-4 font-medium mx-6 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isResending ? (
            <>
              <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Reenviando...
            </>
          ) : (
            "Reenviar"
          )}
        </button>
        <button
          onClick={handleSubmit(onSubmit, onInvalid)}
          type="submit"
          className="bg-primary rounded-lg py-4 font-medium w-full text-primary-white mx-6"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
