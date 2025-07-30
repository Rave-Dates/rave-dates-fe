"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import type React from "react";
import TitleCard from "../../common/TitleCard";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import FormInput from "@/components/ui/inputs/FormInput";
import { transferTickets } from "@/services/clients-tickets";
import { useReactiveCookiesNext } from "cookies-next";
import { onInvalid } from "@/utils/onInvalidFunc";
import {
  notifyError,
  notifySuccess,
} from "@/components/ui/toast-notifications";
import { useParams, useRouter } from "next/navigation";
import {
  getClientEventById,
  getClientEventImagesById,
  getClientImageById,
} from "@/services/clients-events";
import Image from "next/image";
import SpinnerSvg from "@/components/svg/SpinnerSvg";

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

  const { data: selectedEvent, isLoading: isEventLoading } = useQuery<IEvent>({
    queryKey: ["selectedEvent"],
    queryFn: async () => {
      if (!eventId) throw new Error("EventId missing");
      return await getClientEventById(eventId);
    },
    enabled: !!eventId && !afterCheckout,
  });

  const { data: eventImages } = useQuery<IEventImages[]>({
    queryKey: [`eventImages-${eventId}`],
    queryFn: async () => {
      const images = await getClientEventImagesById(eventId);
      return images;
    },
    enabled: !!eventId && !afterCheckout,
  });

  const { data: servedImageUrl, isLoading: isImageLoading } = useQuery<
    string | null
  >({
    queryKey: [`servedImageUrl-${eventId}`],
    queryFn: async () => {
      if (!eventImages) return null;
      const blob = await getClientImageById(Number(eventImages[0].imageId));
      return URL.createObjectURL(blob);
    },
    enabled: !!eventImages && !afterCheckout,
  });

  const { register, handleSubmit } = useForm<ITransferUser>();

  const { mutate } = useMutation({
    mutationFn: transferTickets,
    onSuccess: () => {
      notifySuccess("Transferido correctamente");
      router.back();
    },
    onError: () => {
      notifyError("Error al transferir");
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
      ticketButtons={!afterCheckout}
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
              Entrada general
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

export default TicketTransferForm;
