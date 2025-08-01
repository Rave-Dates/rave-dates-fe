"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import type React from "react";
import TitleCard from "../../common/TitleCard";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import FormInput from "@/components/ui/inputs/FormInput";
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
import { useEffect } from "react";
import { useClientEvent, useClientEventServedOneImage, useClientPurchasedOneTicket, useClientTransferred } from "@/hooks/client/queries/useClientData";

const TicketTransferredForm = ({
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

  const { purchasedTicket } = useClientPurchasedOneTicket({pruchaseTicketId: purchaseTicketId, clientToken});
  const { clientData } = useClientTransferred({transferredClientId: purchasedTicket?.transferredClientId, clientToken}); 
  const { selectedEvent, isEventLoading } = useClientEvent(eventId);
  const { servedImageUrl, isImageLoading } = useClientEventServedOneImage(eventId);

  const { register, handleSubmit, reset } = useForm<ITransferUser>();

  useEffect(() => {
    reset({
      name: clientData?.name,
      email: clientData?.email,
      whatsapp: clientData?.whatsapp,
      idCard: clientData?.idCard,
    });
  }, [reset, clientData]);

  const { mutate } = useMutation({
    mutationFn: transferTickets,
    onSuccess: () => {
      notifySuccess("Transferido correctamente");
      router.back();
    },
    onError: (error: { response: { data: { message: string } } }) => {
      if (error.response.data.message === "Client already exists") {
        notifyError("El cliente ya existe");      
      } else {
        notifyError("Error al transferir");
      }
    },
  });

  const onSubmit = (data: ITransferUser) => {
    mutate({
      ticketData: {
        email: data.email,
        whatsapp: data.whatsapp,
        idCard: data.idCard,
        name: data.name,
      },
      purchaseTicketId: purchaseTicketId,
      clientToken: clientToken,
    });
  };

  return (
    <DefaultForm
      handleSubmit={handleSubmit(onSubmit, onInvalid)}
      title="Reenviar ticket"
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
                      alt="logo"
                    />
                  )}
                </TitleCard>
              )
            )
          }
          {
            !afterCheckout &&
            <h3 className="bg-cards-container px-4 py-3 font-light rounded-xl">
              Ticket: {purchasedTicket?.ticketType.name}
            </h3>
          }
      </div>

      <FormInput
        title="Nombre y apellido*"
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
      <FormInput
        title="Celular con WhatsApp*"
        inputName="whatsapp"
        register={register("whatsapp", {
          required: "El WhatsApp es obligatorio",
        })}
      />

      <p className="text-sm">
        Te enviaremos los tickets vía email y/o WhatsApp
      </p>

      <button type="submit" className="bg-primary text-black input-button">
        Transferir
      </button>
    </DefaultForm>
  );
};

export default TicketTransferredForm;
