"use client"

import GoBackButton from "@/components/ui/buttons/GoBackButton"
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyPending } from "@/components/ui/toast-notifications";
import { useCreateFullEvent } from "@/hooks/useCreateEventFull";
import { useCreateEventStore } from "@/store/createEventStore";
import { combineDateAndTimeToISO, formatColombiaTimeToUTC, validateDateYyyyMmDd } from "@/utils/formatDate";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useForm } from "react-hook-form";

export default function FreeTicketConfiguration() {
  const { eventFormData, updateEventFormData } = useCreateEventStore();
  const { register, handleSubmit, reset} = useForm<IEventFormData>({
    defaultValues: eventFormData
  });
  const { mutate: createFullEvent } = useCreateFullEvent(reset);

  const onSubmit = (data: IEventFormData) => {
    const validTickets = data.tickets.map(({ ticketId, ticketTypeId, ...rest }) => {
      console.log(ticketId, ticketTypeId)
      if (rest.stages.length === 1) return { ...rest, maxDate: rest.stages[0].dateMax };
      const lastStageMaxDate = rest.stages.at(-1)?.dateMax || "";
      return {
        ...rest,
        maxDate: lastStageMaxDate,
      }
    });

    const formattedGeo = `${data.geo};${data.place?.trim()}`;

    updateEventFormData({
      ...eventFormData,
      ...data,
      tickets: [validTickets[0]],
    });

    if (!data.date || !data.time) return
    const validDate = combineDateAndTimeToISO(data.date, data.time)

    const cleanedEventData = {
      eventCategoryValues: data.eventCategoryValues,
      title: data.title,
      subtitle: data.subtitle,
      date: formatColombiaTimeToUTC(validDate),
      geo: formattedGeo,
      description: data.description,
      type: data.type,
      isActive: data.isActive,
      feeRD: data.feeRD,
      feePB: data.feePB,
      transferCost: data.transferCost,
      discountCode: data.discountCode,
      discountType: data.discountType,
      discount: data.discount,
      piggyBank: data.piggyBank,
      maxPurchase: data.maxPurchase,
      images: data.images,
      timeOut: data.timeOut,
      labels: data.labels,
      tickets: [validTickets[0]],
    };

    notifyPending(
      new Promise((resolve, reject) => {
        createFullEvent(cleanedEventData, {
          onSuccess: resolve,
          onError: reject,
        });
      }),
      {
        loading: "Creando evento...",
        success: "Evento creado correctamente",
        error: "Error al crear el evento",
      }
    );
  };

  return (
    <div className="bg-primary-black text-primary-white min-h-screen px-6 pt-28 pb-44">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-title font-bold mb-6">Configura los tickets</h1>

        {/* Configuration Options */}
        <div className="space-y-1 pt-4">
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
            <div className="flex gap-x-5">
              <FormInput
                className="!bg-cards-container"
                title="Nombre"
                inputName="ticketName"
                register={register("tickets.0.name", { required: "El nombre es obligatorio"  })}
              />
              <FormInput
                className="!bg-cards-container"
                title="Cantidad"
                inputName="quantity"
                register={register("tickets.0.stages.0.quantity", { required: "La cantidad es obligatoria", valueAsNumber: true })}
              />
            </div>
            <div className="flex gap-x-5">
              <FormInput
                className="!bg-cards-container"
                title="Fecha inicio"
                placeholder="yyyy-mm-dd"
                inputName="date"
                register={register("tickets.0.stages.0.date", { required: "La fecha es obligatoria", validate: validateDateYyyyMmDd })}
              />
              <FormInput
                className="!bg-cards-container"
                title="Fecha máx."
                placeholder="yyyy-mm-dd"
                inputName="dateMax"
                register={register(`tickets.0.stages.0.dateMax`, { required: "La fecha máx. es obligatoria", validate: validateDateYyyyMmDd })}
              />
            </div>
              <button
                type="submit"
                className="w-full bg-primary text-black font-medium py-4 text-lg rounded-lg mt-10 flex items-center justify-center gap-2"
              >
                Crear evento
              </button>
            </form>
          </div>
      </div>
    </div>
  )
}
