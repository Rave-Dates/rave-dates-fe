"use client";

import ImageUploader from "@/components/roles/admin/users/ImageUploader";
import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyPending } from "@/components/ui/toast-notifications";
import { useCreatePayment } from "@/hooks/useCreatePayment";
import { getAllEvents } from "@/services/admin-events";
import { getUserById } from "@/services/admin-users";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export default function Page() {
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const { mutate: createPaymentMutation } = useCreatePayment();
  console.log(selectedEventId)

  const params = useParams();
  const userId = Number(params.userId)
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");

  const { register, handleSubmit, setValue, control } = useForm<IPaymentForm>({
    defaultValues: {
      eventId: "",
      paymentAmount: 0,
    }
  });
  
  const { data: allEvents } = useQuery<IEvent[]>({
    queryKey: ["allEvents"],
    queryFn: () => getAllEvents({ token }),
    enabled: !!token,
  });

  const { data: selectedUser } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserById({ token, id: userId }),
    enabled: !!token && !!userId,
  });

  const watchedImage = useWatch({ name: "image", control });

  const onSubmit = (data: IPaymentForm) => {
    if (!selectedUser?.organizer || !data.eventId) return;
    const formattedData = {
      image: data.image,
      paymentAmount: Number(data.paymentAmount),
      eventId: Number(data.eventId),
      organizerId: selectedUser.organizer.organizerId || 0,
    };

    // Ejemplo de envío
    console.log(formattedData)
    notifyPending(
      new Promise((resolve, reject) => {
        createPaymentMutation(formattedData, {
          onSuccess: resolve,
          onError: reject,
        });
      }),
      {
        loading: "Ingresando movimiento...",
        success: "Movimiento ingresado correctamente",
        error: "Error al ingresar movimiento",
      }
    );
  }



  return (
    <div className="min-h-screen px-4 bg-primary-black pb-40 sm:pb-32 flex flex-col justify-between">
      <DefaultForm className="h-full pb-10 sm:pb-20" handleSubmit={handleSubmit(onSubmit, onInvalid)} title="Ingresar movimiento">
        <FormDropDown
          title="Evento*"
          register={register(`eventId`, {
            required: "El evento es obligatorio"
          })}
          onChange={(e) => {
            const val = e.target.value;
            const id = Number(val);
            if (!isNaN(id)) setSelectedEventId(id);
          }}
        >
          <option value="" disabled hidden>Selecciona un evento</option>
          {
            allEvents?.map((event) => (
              <option key={event.eventId} value={String(event.eventId)}>
                {event.title}
              </option>
            ))
          }
        </FormDropDown>
        <FormInput
          type="number"
          title="Monto*"
          inputName="paymentAmount"
          register={register("paymentAmount", { required: "El monto es obligatorio" })}
        />

        <ImageUploader
          setImages={setValue}
          image={watchedImage}
        />
        <button
          type="submit"
          className="bg-primary max-w-xl self-center text-black input-button"
        >
          Ingresar movimiento
        </button>
      </DefaultForm>
    </div>
  );
}
