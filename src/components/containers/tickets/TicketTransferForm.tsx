"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import type React from "react";
import TitleCard from "../../common/TitleCard";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import FormInput from "@/components/ui/inputs/FormInput";
import PhoneInput from "@/components/ui/inputs/PhoneInput";
import { transferTickets } from "@/services/clients-tickets";
import { useReactiveCookiesNext } from "cookies-next";
import { onInvalid } from "@/utils/onInvalidFunc";
import {
  notifyError,
  notifySuccess,
} from "@/components/ui/toast-notifications";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import SpinnerSvg from "@/components/svg/SpinnerSvg";
import { useClientEvent, useClientEventServedOneImage, useClientGetById } from "@/hooks/client/queries/useClientData";
import { jwtDecode } from "jwt-decode";
import { useTransferStore } from "@/store/useTransferStore";

const TicketTransferForm = ({
  purchaseTicketId,
  afterCheckout = false,
}: {
  purchaseTicketId: number;
  afterCheckout?: boolean;
}) => {
  const { getCookie } = useReactiveCookiesNext();
  const router = useRouter();
  const clientToken = getCookie("clientToken");
  const params = useParams();
  const eventId = Number(params.eventId);
  const { selectedEvent, isEventLoading } = useClientEvent(eventId);
  const { servedImageUrl, isImageLoading } = useClientEventServedOneImage(eventId);

  const decoded: { id: number } | null = clientToken ? jwtDecode(clientToken.toString()) : null;
  const { clientData } = useClientGetById({ clientId: decoded?.id, clientToken });

  const { register, handleSubmit, control } = useForm<ITransferUser>();

  const { mutate, isPending } = useMutation({
    mutationFn: transferTickets,
    onSuccess: () => {
      notifySuccess("Transferido correctamente");
      router.back();
    },
    onError: () => {
      notifyError("Error al transferir");
    },
  });

  const setTransferData = useTransferStore((state) => state.setTransferData);

  const onSubmit = (data: ITransferUser) => {
    // Prevent self-transfer by email
    if (clientData?.email && data.email.trim().toLowerCase() === clientData.email.trim().toLowerCase()) {
      notifyError("No puedes transferir un ticket a tu propio email");
      return;
    }
    // Prevent self-transfer by WhatsApp
    if (clientData?.whatsapp && data.whatsapp && data.whatsapp.replace(/\D/g, "") === clientData.whatsapp.replace(/\D/g, "")) {
      notifyError("No puedes transferir un ticket a tu propio WhatsApp");
      return;
    }

    if (selectedEvent && selectedEvent.transferCost && selectedEvent.transferCost > 0) {
      setTransferData(
        {
          email: data.email,
          whatsapp: data.whatsapp,
          idCard: data.idCard,
          name: data.name,
        },
        purchaseTicketId,
        eventId
      );
      router.push(`/checkout?transfer=true`);
      return;
    }

    mutate({
      ticketData: {
        email: data.email,
        whatsapp: data.whatsapp,
        idCard: data.idCard,
        name: data.name,
        method: "BOLD"
      },
      purchaseTicketId: purchaseTicketId,
      clientToken: clientToken,
    });
  };

  return (
    <DefaultForm
      handleSubmit={handleSubmit(onSubmit, onInvalid)}
      title={afterCheckout ? "Ingresa los datos del receptor" : "Tickets propios"}
    >
      <div className="flex flex-col w-full gap-y-2">
        { 
          !afterCheckout &&
            isEventLoading ? (
              <div className="w-full bg-cards-container h-20 rounded-xl gap-x-5 px-4 py-3 flex items-center justify-start">
                <div className="w-14 h-14 animate-pulse bg-inactive rounded-lg"></div>
                <div className="flex flex-col gap-y-2 items-start justify-center">
                  <div className="w-44 h-6 animate-pulse bg-inactive rounded-lg"></div>
                  <div className="w-28 h-4 animate-pulse bg-inactive rounded-lg"></div>
                </div>
              </div>
            ) : (
              selectedEvent && (
                <TitleCard
                  title={selectedEvent.title}
                  description={selectedEvent.subtitle}
                >
                  {isImageLoading ? (
                    <div className="w-14 h-14 flex items-center justify-center">
                      <SpinnerSvg className="fill-primary text-inactive w-5" />
                    </div>
                  ) : (
                    <Image
                      className="w-14 h-14 rounded"
                      src={servedImageUrl ?? "/images/event-placeholder.png"}
                      width={1000}
                      height={1000}
                      alt="placeholder"
                    />
                  )}
                </TitleCard>
              )
            )
          }
          {
            !afterCheckout &&
            <h3 className="bg-cards-container px-4 py-3 font-light rounded-xl">
              Entrada general
            </h3>
          }
      </div>

      <FormInput
        title="Nombre*"
        inputName="name"
        register={register("name", { required: "El nombre es obligatorio" })}
      />
      <FormInput
        title="Cédula o Pasaporte*"
        inputName="idCard"
        register={register("idCard", {
          required: "La cédula o pasaporte es obligatoria",
        })}
      />
      <FormInput
        type="email"
        title="Email*"
        inputName="email"
        register={register("email", { required: "El email es obligatorio" })}
      />
      <PhoneInput
        title="Celular con WhatsApp*"
        name="whatsapp"
        control={control}
        rules={{ required: "El WhatsApp es obligatorio" }}
      />

      <p className="text-sm">
        Enviaremos los tickets vía email y/o WhatsApp
      </p>

      <button 
        type="submit" 
        className="bg-primary text-primary-white input-button flex items-center justify-center gap-x-2 disabled:opacity-70 disabled:pointer-events-none"
        disabled={isPending}
      >
        {isPending && <SpinnerSvg className="fill-primary-white text-inactive w-5 h-5" />}
        {isPending ? "Transfiriendo..." : "Transferir"}
      </button>
    </DefaultForm>
  );
};

export default TicketTransferForm;
