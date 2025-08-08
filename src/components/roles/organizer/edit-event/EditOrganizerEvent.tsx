"use client";

import EventImageSwiper from "@/components/roles/admin/events/EventImagesSwiper";
import LabelTagButton from "@/components/ui/buttons/LabelTagButton";
import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyPending } from "@/components/ui/toast-notifications";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { useCreateEventStore } from "@/store/createEventStore";
import { combineDateAndTimeToISO, formatColombiaTimeToUTC, formatDate, formatDateToColombiaTime, parseISODate, validateDateYyyyMmDd } from "@/utils/formatDate";
import { extractLatAndLng, extractPlaceFromGeo } from "@/utils/formatGeo";
import { useReactiveCookiesNext } from "cookies-next";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useAdminAllCategories, useAdminEvent, useAdminEventCategories, useAdminEventImages, useAdminImagesData, useAdminLabelsTypes, useAdminTicketTypes } from "@/hooks/admin/queries/useAdminData";
import GeoAutocomplete from "../../admin/events/GeoAutocomplete";
import { useEditEvent } from "@/hooks/admin/mutations/useEditEvent";

export default function EditOrganizerEvent({ eventId }: { eventId: number }) {
  const { eventFormData, updateEventFormData, setHasLoadedEvent, setHasLoadedTickets, hasLoadedTickets, hasLoadedEvent } = useCreateEventStore();
  const router = useRouter()
  const { register, handleSubmit, setValue, control, reset } = useForm<IEventFormData>({
    defaultValues: defaultEventFormData,
  });
  const { getCookie } = useReactiveCookiesNext();
  const { mutate: editEvent } = useEditEvent(reset);

  register("labels", {
    validate: (value) =>
      value && value.length > 0 ? true : "Debes seleccionar al menos una etiqueta",
  });

  register("images", {
    validate: (value) =>
      value && value.length > 0 ? true : "Debes subir al menos una imagen",
  });

  const watchedLabels = useWatch({ name: "labels", control });
  const watchedImages = useWatch({ name: "images", control });
  const watchedIsActive = useWatch({ name: "isActive", control });
  
  const token = getCookie("token");

  const { eventCategories } = useAdminEventCategories({ eventId, token });
  const { categories } = useAdminAllCategories({ token });
  const { selectedEvent: event } = useAdminEvent({ eventId, token });
  const { labelsTypes } = useAdminLabelsTypes({ token }); 
  const { eventImages, isErrorEventImages } = useAdminEventImages({ token, eventId }); 
  const { errorImages, imagesData, loadingImages } = useAdminImagesData({ token, eventImages }); 
  const { ticketTypes } = useAdminTicketTypes({ token, eventId });
  
  useEffect(() => {
    if (!event) return;
    if (event.type !== 'free') {
      router.replace("/organizer/events")
    }

    const result = parseISODate(event.date)

    const validDate = combineDateAndTimeToISO(result.date, result.time)
    const formattedTimeZone = formatDateToColombiaTime(validDate)

    const formattedPromoters = event.promoters?.map((promoter) => ({
      promoterId: promoter.promoterId,
    }))

    const validatedFormPromoters = 
      hasLoadedEvent ? eventFormData.formPromoters : formattedPromoters;

    // Seteamos todo al formulario
    const setters = {
      title: event.title,
      subtitle: event.subtitle,
      discount: event.discount,
      discountCode: event.discountCode,
      feeRD: event.feeRD,
      date: formattedTimeZone.date,
      time: formattedTimeZone.time,
      maxPurchase: event.maxPurchase,
      geo: extractLatAndLng(event.geo),
      place: extractPlaceFromGeo(event.geo),
      description: event.description,
      transferCost: event.transferCost,
      feePB: event.feePB,
      type: event.type,
      isActive: event.isActive,
      timeOut: event.timeOut,
      formPromoters: validatedFormPromoters,
    };

    Object.entries(setters).forEach(([key, value]) => {
      setValue(key as keyof IEventFormData, value);
    });

    const finalLabels = hasLoadedEvent ? eventFormData.labels : event.labels; 
    setValue("labels", finalLabels);

    // Guardamos en Zustand
    updateEventFormData({ ...event });
    setHasLoadedEvent(true);
    setHasLoadedTickets(false);
  }, [event]);

  useEffect(() => {
    if (ticketTypes?.length && ticketTypes?.length > 0 && !hasLoadedTickets) {
      console.log("ticketTypes",ticketTypes)
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

  useEffect(() => {
    if (imagesData) {
      setValue("images", imagesData);
    }
  }, [imagesData]);

  useEffect(() => {
    console.log(eventFormData)
  });

  // Actualiza Zustand solo si cambia eventImages
  useEffect(() => {
    if (eventImages) {
      const same = JSON.stringify(eventFormData.images) === JSON.stringify(eventImages);
      if (!same) {
      updateEventFormData({
        images: imagesData ?? [],
      });
      }
    }
  }, [eventImages]);

useEffect(() => {
  const defaultCategoryValues: { [key: string]: string } = {};

  eventCategories?.forEach((cat) => {
    const selectedValue = cat.value;
    if (selectedValue) {
      defaultCategoryValues[cat.categoryId] = JSON.stringify({
        valueId: selectedValue.valueId,
        categoryId: cat.categoryId,
        value: selectedValue.value,
      });
    }
  });

  setValue("oldCategories", defaultCategoryValues);
}, [eventCategories, categories]);


  const handleGoToPromoters = (data: IEventFormData) => {
    updateEventFormData({
      ...eventFormData,
      ...data,
    });

    router.push("/organizer/events/assign-promoters");
  }

  // creamos evento local
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
    const formattedGeo = `${data.geo};${data.place?.trim()}`;

    const parsedCategories = data.oldCategories && Object.values(data.oldCategories).map((cat) => JSON.parse(cat));
    const formattedOldCategories = eventCategories?.map((category) => ({
      categoryId: category.categoryId,
      valueId: category.valueId,
    }));

    const categoriesToUpdate = parsedCategories && parsedCategories
      .map((newCat: IEventCategoryValue) => {
        const oldCat = formattedOldCategories?.find((old) => old.categoryId === newCat.categoryId);
        if (!oldCat || oldCat.valueId === newCat.valueId) return null;
        return {
          categoryId: newCat.categoryId,
          oldCategoryValueId: oldCat.valueId,
          newCategoryValueId: newCat.valueId,
        };
      })
      .filter(Boolean);

    updateEventFormData({
      ...eventFormData,
      ...data,
      tickets: data.tickets,
    })

    const cleanedEventData = {
      eventId: eventFormData.eventId,
      title: data.title,
      subtitle: data.subtitle,
      date: formattedTimeUTC,
      geo: formattedGeo,
      description: data.description,
      type: data.type,
      isActive: data.isActive,
      feeRD: data.feeRD,
      feePB: data.feePB,
      categoriesToUpdate: categoriesToUpdate,
      transferCost: data.transferCost,
      discountCode: data.discountCode,
      discountType: data.discountType,
      discount: data.discount,
      maxPurchase: data.maxPurchase,
      images: data.images,
      timeOut: data.timeOut,
      labels: data.labels,
      tickets: [formattedTickets[0]],
      formPromoters: data.formPromoters
    }

    notifyPending(
      new Promise((resolve, reject) => {
        editEvent({formData: cleanedEventData, isOrganizer: true}, {
          onSuccess: () => {
            resolve("");
            router.push("/organizer/events");
          },
          onError: (err) => {
            console.log(err)
            reject(err);
            router.push("/organizer/events");
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
    <DefaultForm handleSubmit={handleSubmit(onSubmit, onInvalid)} title="Editar evento">
      <div className="flex items-center justify-between mt-5">
        <span className="text-white text-lg">Activo</span>
        <button
          type="button"
          onClick={() => setValue("isActive", !watchedIsActive)}
          className="w-12 h-6 rounded-full transition-colors pointer-events-auto bg-cards-container"
        >
          <div
            className={`w-5 h-5 rounded-full transition-transform ${
              watchedIsActive ? "translate-x-6 bg-primary" : "translate-x-0.5 bg-system-error"
            }`}
          />
        </button>
      </div>
      <FormInput
        title="Título del evento*"
        inputName="title"
        register={register("title", { required: "El título es obligatorio"  })}
      />
      <FormInput
        title="Subtítulo del evento*"
        inputName="subtitle"
        register={register("subtitle", { required: "El subtítulo es obligatorio"  })}
      />
      
      <div className="w-full gap-x-5 flex justify-between">
        <FormInput
          title="Fecha*"
          inputName="date"
          placeholder="yyyy-mm-dd"
          register={register("date", { 
            required: "La fecha es obligatoria", 
            validate: validateDateYyyyMmDd
          })}
        />

        <FormInput
          title="Hora (COL)*"
          inputName="time"
          placeholder="00:00"
          register={register("time", { 
            required: "La fecha es obligatoria", 
          })}
        />
      </div>

      <FormInput
        title="Lugar*"
        inputName="place"
        register={register("place", { required: "El lugar es obligatorio"  })}
      />

      <GeoAutocomplete
        setValue={setValue}
        defaultGeo={eventFormData?.geo ? eventFormData.geo : event?.geo}
        isEditing={true}
      />

      <EventImageSwiper isErrorEventImages={isErrorEventImages} isError={errorImages} isLoading={loadingImages} setImages={setValue} images={watchedImages} />

      <FormInput
        title="Información general*"
        inputName="description"
        register={register("description", { required: "La descripción es obligatoria"  })}
      />

       <h1 className="font-semibold text-3xl mt-8">Configura los tickets</h1> 

       <div className="flex gap-x-4">
        <FormInput
          title="Nombre*"
          inputName="ticketName"
          register={register("tickets.0.name", { required: "El nombre es obligatorio"  })}
        />
        <FormInput
          title="Cantidad*"
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

      <br />

       { 
          categories?.map((category) => (
            <FormDropDown
              key={category.categoryId}
              title={category.name}
              register={register(`oldCategories.${category.categoryId}`, { required: true })}
            >
              {
                category.values.map((value) => (
                  <option 
                    key={value.valueId}   
                    value={JSON.stringify({
                      valueId: value.valueId,
                      categoryId: value.categoryId,
                      value: value.value
                    })}
                  >
                    {value.value}
                  </option>
                ))
              }
            </FormDropDown>
          ))
        }
      <br />
      {
        labelsTypes && watchedLabels &&
        <LabelTagButton setValue={setValue} watchedLabels={watchedLabels} labelsTypes={labelsTypes} title="Etiquetas" />
      }

      <br />

      <button
        type="button"
        onClick={handleSubmit(handleGoToPromoters, onInvalid)}
        className="border border-primary text-primary mt-10 input-button"
      >
        Promotores
      </button>
      <button
        type="submit"
        className="bg-primary block text-center text-black input-button"
      >
        Continuar
      </button>
    </DefaultForm>
  );
}
