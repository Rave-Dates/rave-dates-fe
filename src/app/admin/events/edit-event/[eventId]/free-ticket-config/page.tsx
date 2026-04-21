"use client"

import GoBackButton from "@/components/ui/buttons/GoBackButton"
import DatePicker from "@/components/ui/date-picker/date-picker";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyPending } from "@/components/ui/toast-notifications";
import { useEditEvent } from "@/hooks/admin/mutations/useEditEvent";
import { useAdminTicketTypes } from "@/hooks/admin/queries/useAdminData";
import { useCreateEventStore } from "@/store/createEventStore";
import { combineDateAndTimeToISO, formatColombiaTimeToUTC, formatDate, validateDateYyyyMmDd } from "@/utils/formatDate";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useReactiveCookiesNext } from "cookies-next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export default function FreeTicketConfiguration() {
  const { eventFormData, updateEventFormData, setHasLoadedTickets, hasLoadedTickets } = useCreateEventStore();
  const { register, handleSubmit, reset , setValue, control} = useForm<IEventFormData>({
    defaultValues: eventFormData
  });
  const { mutate: editEvent } = useEditEvent(reset);
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const params = useParams();
  const eventId = Number(params.eventId)
  const router = useRouter()

  const { ticketTypes } = useAdminTicketTypes({ token, eventId });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setValue("tickets.0.stages.0.date", today);
    if (eventFormData.date) {
      setValue("tickets.0.stages.0.dateMax", eventFormData.date);
    }
  }, [setValue, eventFormData.date]);
  
  useEffect(() => {
    if (ticketTypes && !hasLoadedTickets) {
      const formattedTickets = ticketTypes.map((ticket) => ({
        ...ticket,
        maxDate: formatDate(ticket.maxDate),
        stages: ticket.stages.map((stage) => ({
          ...stage,
          date: formatDate(stage.date),
          dateMax: formatDate(stage.dateMax),
        })),
      }));

      const updatedData = {
        ...eventFormData,
        tickets: [formattedTickets[0]],
      };

      setValue("tickets", formattedTickets);
      updateEventFormData(updatedData);
      setHasLoadedTickets(true);
    }
  }, [ticketTypes, eventFormData]);

  const onSubmit = (data: IEventFormData) => {
    const formattedTickets = data.tickets.map((ticket) => ({
      ticketTypeId: ticket.ticketTypeId,
      eventId: eventId,
      name: ticket.name,
      maxDate: formatDate(ticket.maxDate),
      stages: ticket.stages.map((stage) => ({
        date: formatDate(stage.date),
        dateMax: formatDate(stage.dateMax),
        quantity: stage.quantity,
        price: stage.price,
        promoterFee: stage.promoterFee,
        feeType: stage.feeType,
      })),
    }));

    if (!data.date || !data.time) return
    const validDate = combineDateAndTimeToISO(data.date, data.time)
    const formattedTimeUTC = formatColombiaTimeToUTC(validDate)
    
    updateEventFormData({
      ...eventFormData,
      ...data,
      tickets: data.tickets,
    })

    const cleanedEventData = {
      eventId: eventFormData.eventId,
      title: data.title,
      subtitle: data.subtitle || "",
      date: formattedTimeUTC,
      geo: data.geo,
      description: data.description || "",
      type: data.type,
      isActive: data.isActive,
      feeRD: data.feeRD,
      feePB: data.feePB,
      categoriesToUpdate: data.categoriesToUpdate,
      transferCost: data.transferCost,
      discountCode: data.discountCode,
      discountType: data.discountType,
      discount: data.discount,
      maxPurchase: data.maxPurchase,
      images: data.images,
      timeOut: data.timeOut,
      labels: data.labels || [],
      quantityComplimentaryTickets: data.quantityComplimentaryTickets,
      tickets: [formattedTickets[0]],
    }


    notifyPending(
      new Promise((resolve, reject) => {
        editEvent({formData: cleanedEventData}, {
          onSuccess: () => {
            resolve("");
            router.push("/admin/events");
          },
          onError: (err) => {
            console.log(err)
            reject(err);
            router.push("/admin/events");
          },
        });
      }),
      {
        loading: "Editando evento...",
        success: "Evento editado correctamente",
        error: "Error al editar el evento",
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
                title="Nombre"
                inputName="ticketName"
                register={register("tickets.0.name", { required: true })}
              />
              <FormInput
                title="Cantidad"
                inputName="quantity"
                register={register("tickets.0.stages.0.quantity", { 
                  required: true, 
                  setValueAs: (v) => v === "" ? undefined : Number(v) 
                })}
              />
            </div>
            <h2 className="mt-10 text-center">Opcional</h2>

              <div className="w-full gap-x-5 flex justify-between">
                <Controller
                  name="tickets.0.stages.0.date"
                  control={control}
                  rules={{ required: "La fecha de inicio es obligatoria", validate: validateDateYyyyMmDd }}
                  render={({ field }) => (
                    <DatePicker 
                      value={field.value} 
                      onChange={field.onChange} 
                      title="Fecha inicio*" 
                    />
                  )}
                />
                <Controller
                  name="tickets.0.stages.0.dateMax"
                  control={control}
                  rules={{ required: "La fecha máx. es obligatoria", validate: validateDateYyyyMmDd }}
                  render={({ field }) => (
                    <DatePicker 
                      value={field.value} 
                      onChange={field.onChange} 
                      title="Fecha máx.*" 
                    />
                  )}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-primary-white font-medium py-4 text-lg rounded-lg mt-10 flex items-center justify-center gap-2"
              >
                Editar evento
              </button>
            </form>
          </div>
      </div>
    </div>
  )
}
