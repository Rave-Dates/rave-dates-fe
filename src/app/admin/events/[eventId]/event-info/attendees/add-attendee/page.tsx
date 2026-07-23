"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import PhoneInput from "@/components/ui/inputs/PhoneInput";
import { notifyPending } from "@/components/ui/toast-notifications";
import { useCreateGuest } from "@/hooks/admin/mutations/useCreateGuest";
import { useAdminTicketTypes } from "@/hooks/admin/queries/useAdminData";
import { useReactiveCookiesNext } from "cookies-next";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { suggestEmail } from "@/utils/emailSuggestion";
import { useDebounce } from "@/hooks/useDebounce";

export default function AddAttendee() {
  const { register, handleSubmit, control, watch, setValue } = useForm<IFormGuest>();
  const params = useParams();
  const eventId = parseInt(params.eventId as string, 10);
  const { getCookie } = useReactiveCookiesNext();
  const { mutate: createGuestMutation } = useCreateGuest();

  const token = getCookie("token");

  const { ticketTypes } = useAdminTicketTypes({ token, eventId });

  const emailValue = watch("email", "");
  const debouncedEmail = useDebounce(emailValue ?? "", 600);
  const [emailSuggestion, setEmailSuggestion] = React.useState<string | null>(null);

  React.useEffect(() => {
    setEmailSuggestion(suggestEmail(debouncedEmail));
  }, [debouncedEmail]);

  const applySuggestion = () => {
    if (!emailSuggestion) return;
    setValue("email", emailSuggestion, { shouldValidate: true });
    setEmailSuggestion(null);
  };

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
        title="Email*"
        inputName="email"
        register={register("email", { required: true })}
      />
      {emailSuggestion && (
        <button
          type="button"
          onClick={applySuggestion}
          className="-mt-1 flex items-center gap-1.5 w-fit text-xs text-primary-white/60 hover:text-primary-white transition-colors group"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary flex-shrink-0">
            <polyline points="9 11 12 14 22 4" />
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
          </svg>
          <span>
            ¿Quisiste decir{" "}
            <span className="text-primary font-medium group-hover:underline underline-offset-2">
              {emailSuggestion}
            </span>
            ?
          </span>
        </button>
      )}
      <FormInput
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
        className="bg-primary text-primary-white input-button"
      >
        Agregar
      </button>
    </DefaultForm>
  );
}
