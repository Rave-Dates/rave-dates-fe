"use client"

import { TicketCard } from "@/components/roles/admin/TicketCard"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifyPending } from "@/components/ui/toast-notifications";
import { useCreateFullEvent } from "@/hooks/admin/mutations/useCreateEventFull";
import { useCreateEventStore } from "@/store/createEventStore";
import { combineDateAndTimeToISO, formatColombiaTimeToUTC } from "@/utils/formatDate";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

export default function TicketConfiguration() {
  const { eventFormData, updateEventFormData, hasLoadedEvent } = useCreateEventStore();
  const { register, handleSubmit, setValue, getValues, control, reset} = useForm<IEventFormData>({
    defaultValues: eventFormData
  });
  const { mutate: createFullEvent } = useCreateFullEvent(reset);
  const router = useRouter()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });
  register("piggyBank");
  const watchedPiggyBank = useWatch({ name: "piggyBank", control });

  useEffect(() => {
    setValue("commission", undefined)
  }, [watchedPiggyBank, setValue]);

  useEffect(() => {
    setValue("piggyBank", false);
  }, [setValue]);

  useEffect(() => {
    console.log(eventFormData)
  }, [eventFormData]);

  useEffect(() => {
    if (!hasLoadedEvent) {
      notifyError("Por favor vuelva a crear un ticket")
      router.push(`/admin/events/create-event`)
    }
  });

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
      tickets: validTickets,
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
      tickets: validTickets,
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

  const handleAddTicket = () => {
    const formTickets = getValues("tickets") || [];

    const newId = (formTickets.at(-1)?.ticketId ?? 0) + 1;

    const newTicket: IEventTicket = {
      ticketId: newId,
      name: '',
      maxDate: "",
      stages: [
        {
          stageId: 1, // stageId comienza en 1
          date: "",
          dateMax: "",
          price: 0,
          quantity: 0,
          promoterFee: 0,
          feeType: "percentage",
        },
      ],
    };

    // 1. Agregar al formulario
    append(newTicket);

    // 2. Agregar al estado global (Zustand)
    const updatedTickets = [...(eventFormData.tickets || []), newTicket];

    updateEventFormData({
      ...eventFormData,
      tickets: updatedTickets,
    });
  };


  const handleDeleteTicket = (index: number) => {
    if (fields.length === 1) return;

    // 1. Obtener el ticketId del formulario
    const formTickets = getValues("tickets");
    const ticketIdToDelete = formTickets?.[index]?.ticketId;

    // 2. Eliminar del formulario (React Hook Form)
    remove(index);

    // 3. Eliminar del estado global (Zustand)
    const updatedTickets = eventFormData?.tickets?.filter(
      (ticket) => ticket.ticketId !== ticketIdToDelete
    );

    updateEventFormData({
      ...eventFormData,
      tickets: updatedTickets,
    });
  };
  

  return (
    <div className="bg-primary-black text-primary-white min-h-screen px-6 pt-28 pb-44">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="text-title font-bold mb-6">Configura los tickets</h1>

        {/* Ticket Cards */}
        <div className="space-y-4">
          {fields?.map((ticket, index) => (
            <TicketCard
              getValues={getValues}
              register={register}
              index={index}
              key={ticket?.ticketId}
              ticketNumber={ticket.ticketId}
              onDelete={() => handleDeleteTicket(index)}
            />
          ))}
        </div>

        <button
          onClick={() => handleAddTicket()}
          className="w-full bg-primary outline-none text-black font-medium py-3 rounded-lg text-sm flex items-center justify-center gap-2"
        >
          +
          Incorporar ticket
        </button>

        {/* Configuration Options */}
        <div className="space-y-1 pt-4">
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
            <div className="flex flex-col xs:flex-row gap-x-5">
              <FormInput
                title="Comisión Rave Dates"
                inputName="feeRD"
                typeOfValue="%"
                register={register("feeRD", {required: "La comisión RD es obligatoria (Max: 100%)", valueAsNumber: true, max: 100})}
              />
              <FormInput 
                type="number"
                title="Comisión de Alcancía" 
                inputName="feePB" 
                typeOfValue="%"
                register={register("feePB", { valueAsNumber: true, required: "La comisión de alcancía es obligatoria (Max: 100%)", max: 100 })} 
              />
            </div>
            <div className="flex flex-col xs:flex-row gap-x-5">
              <FormInput
                title="Costo transferencia de ticket"
                inputName="transferCost"
                register={register("transferCost", {required: "El costo de transferencia es obligatorio", valueAsNumber: true})}
              />
              <FormInput
                title="Descuento"
                inputName="discount"
                typeOfValue="%"
                register={register("discount", { valueAsNumber: true, max: 100 })}
              />
            </div>
            <div className="flex flex-col xs:flex-row gap-x-5">
              <FormInput
                type="number"
                title="Máx. de tickets p/ persona"
                inputName="maxPurchase"
                register={register("maxPurchase", {valueAsNumber: true})}
              />
              <FormInput
                type="number"
                title="Tiempo de compra (minutos)"
                inputName="timeOut"
                typeOfValue="min"
                register={register("timeOut", {required: "El tiempo de compra es obligatorio", valueAsNumber: true})}
              />
            </div>
            <FormInput
              title="Código de descuento"
              inputName="discountCode"
              register={register("discountCode")}
            />

              <div className="flex items-center justify-between mt-5">
                <span className="text-white text-lg">Alcancía</span>
                <button
                  type="button"
                  onClick={() => setValue("piggyBank", !watchedPiggyBank)}
                  className="w-12 h-6 rounded-full transition-colors pointer-events-auto bg-cards-container"
                >
                  <div
                    className={`w-5 h-5 rounded-full transition-transform ${
                      watchedPiggyBank ? "translate-x-6 bg-primary" : "translate-x-0.5 bg-text-inactive"
                    }`}
                  />
                </button>
              </div>

              {/* <div className={`${piggyBank ? "block" : "hidden"}`}>
                <FormInput
                  title="Comisión"
                  inputName="commission"
                  register={register("commission")}
                />
              </div> */}

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
