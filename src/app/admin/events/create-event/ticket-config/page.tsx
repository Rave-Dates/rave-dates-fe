"use client"

import { TicketCard } from "@/components/roles/admin/TicketCard"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifyPending } from "@/components/ui/toast-notifications";
import { useCreateFullEvent } from "@/hooks/useCreateEventFull";
import { useCreateEventStore } from "@/store/createEventStore";
import { validateDateYyyyMmDd } from "@/utils/formatDate";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export default function TicketConfiguration() {
  const { eventFormData, updateEventFormData } = useCreateEventStore();
  const { register, handleSubmit, watch, setValue, getValues, control, reset , formState} = useForm({
    defaultValues: eventFormData
  });
  const { mutate: createFullEvent, isLoading } = useCreateFullEvent(reset);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tickets",
  });

  const piggyBank = watch("piggyBank", false);

  piggyBank === false && setValue("commission", null)

  useEffect(() => {
    if (eventFormData.tickets?.length || eventFormData.title) {
      reset(eventFormData); // resetea todo: tickets y campos generales
    }
  }, [eventFormData]);

  const onSubmit = (data) => {
    console.log("data", data)
    const validTickets = data.tickets.map(({ ticketId, ...rest }) => rest);

    updateEventFormData({
      ...eventFormData,
      ...data,
      tickets: data.tickets,
    });

    const cleanedEventData = {
      eventCategoryValues: data.eventCategoryValues,
      title: data.title,
      date: data.date,
      geo: data.geo,
      description: data.description,
      type: data.type,
      isActive: data.isActive,
      feeRD: data.feeRD,
      feePB: data.feePB,
      transferCost: data.transferCost,
      discountCode: data.discountCode,
      discountType: data.discountType,
      discount: data.discount,
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

    // onSucces borrar los datos del form y del estado
  };

  const onInvalid = (errors) => {
    const findFirstError = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "object") {
          const child = findFirstError(obj[key]);
          if (child) return child;
        } else if (key === "message") {
          return obj[key];
        }
      }
      return null;
    };

    const firstErrorMessage = findFirstError(errors);

    if (firstErrorMessage) {
      notifyError(firstErrorMessage);
    } else {
      notifyError("Por favor completá todos los campos requeridos.");
    }
  };

  const handleAddTicket = () => {
    const formTickets = getValues("tickets") || [];

    const newId = (formTickets.at(-1)?.ticketId ?? 0) + 1;

    const newTicket = {
      ticketId: newId,
      name: '',
      stages: [
        {
          stageId: 1, // stageId comienza en 1
          date: null,
          dateMax: null,
          price: 0,
          quantity: 0,
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
                title="Comisión RD"
                inputName="feeRD"
                register={register("feeRD", {required: "La comisión RD es obligatoria", valueAsNumber: true})}
              />
              <FormInput
                title="Costo transferencia de ticket"
                inputName="transferCost"
                register={register("transferCost", {required: "El costo de transferencia es obligatorio", valueAsNumber: true})}
              />
            </div>
            <div className="flex flex-col xs:flex-row gap-x-5">
              <FormInput
                title="Código de descuento"
                inputName="discountCode"
                register={register("discountCode")}
              />
              <FormInput
                title="Descuento"
                inputName="discount"
                register={register("discount", { valueAsNumber: true })}
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
                title="Tiempo de compra"
                inputName="tomeOut"
                register={register("timeOut", {required: "El tiempo de compra es obligatorio", validate: validateDateYyyyMmDd})}
              />
            </div>
              <div className="flex items-center justify-between mt-5">
                <span className="text-white text-lg">Alcancía</span>
                <button
                  type="button"
                  onClick={() => setValue("piggyBank", !piggyBank)}
                  className="w-12 h-6 rounded-full transition-colors pointer-events-auto bg-cards-container"
                >
                  <div
                    className={`w-5 h-5 rounded-full transition-transform ${
                      piggyBank ? "translate-x-6 bg-primary" : "translate-x-0.5 bg-text-inactive"
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
