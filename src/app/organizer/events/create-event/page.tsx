"use client";

import EventImageSwiper from "@/components/roles/admin/events/EventImagesSwiper";
import FilterTagButton from "@/components/ui/buttons/LabelTagButton";
import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyPending } from "@/components/ui/toast-notifications";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { useCreateFullEvent } from "@/hooks/admin/mutations/useCreateEventFull";
import { useCreateOrganizerFreeEvent } from "@/hooks/admin/mutations/useCreateOrganizerFreeEvent";
import { useAdminAllCategories, useAdminLabelsTypes } from "@/hooks/admin/queries/useAdminData";
import { useCreateEventStore } from "@/store/createEventStore";
import { combineDateAndTimeToISO, formatColombiaTimeToUTC, validateDateYyyyMmDd } from "@/utils/formatDate";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

import { useForm, useWatch } from "react-hook-form";

const GeoAutocomplete = dynamic(() => import("@/components/roles/admin/events/GeoAutocomplete"), { ssr: false });

export default function Page() {
  const { eventFormData, updateEventFormData } = useCreateEventStore();
  
  const router = useRouter()
  const { register, handleSubmit, setValue, control, reset } = useForm<IEventFormData>({
    defaultValues: defaultEventFormData
  });

  const { mutate: createFullEvent } = useCreateOrganizerFreeEvent({reset, errorHref: "/organizer/events", successHref: "/organizer/events"});
  const { getCookie } = useReactiveCookiesNext();

  const token = getCookie("token");
  const decoded: IUserLogin | null = token ? jwtDecode(token.toString()) : null;
  
  register("labels", {
    validate: (value) =>
      value && value.length > 0 ? true : "Debes seleccionar al menos una etiqueta",
  });

  register("images", {
    validate: (value) =>
      value && value.length > 0 ? true : "Debes subir al menos una imagen",
  });
  
  const { categories } = useAdminAllCategories({ token });
  const { labelsTypes } = useAdminLabelsTypes({ token });

  useEffect(() => {
    register("geo", {
      required: "Debes seleccionar una ubicación válida",
      validate: (value) => {
        const parts = value?.split(";");
        if (parts?.length !== 2) return "Ubicación inválida";
        return true;
      },
    });

    register("editPlace");
  }, [register]);

  useEffect(() => {
    if (!eventFormData) return;

    const setters = {
      title: eventFormData.title,
      subtitle: eventFormData.subtitle,
      place: eventFormData.place,
      date: eventFormData.date,
      time: eventFormData.time,
      geo: eventFormData.geo,
      editPlace: eventFormData.editPlace,
      description: eventFormData.description,
      type: "free",
      labels: eventFormData.labels,
      images: eventFormData.images,
      tickets: eventFormData.tickets,
      categories: eventFormData.categories,
      formPromoters: eventFormData.formPromoters,
    };

    Object.entries(setters).forEach(([key, value]) => {
      setValue(key as keyof IEventFormData, value);
    });
  }, [eventFormData, setValue]);
  
  useEffect(() => {
  }, [eventFormData]);
    
  const watchedLabels = useWatch({ name: "labels", control });
  const watchedImages = useWatch({ name: "images", control });

  const handleGoToPromoters = (data: IEventFormData) => {
    updateEventFormData({
      ...eventFormData,
      ...data,
    });
    

    router.push("assign-promoters");
  }

  // creamos el evento 
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

    const parsedCategories = data.categories?.map((category: string) => JSON.parse(category))
    
    const formattedCategoryValues = 
      parsedCategories?.map((category: IEventCategoryValue) => ({
        ...category,
        valueId: category.valueId,
        categoryId: category.categoryId,
        value: category.value,
      }))

    const formattedGeo = `${data.geo};${data.place?.trim()}`;

    updateEventFormData({
      ...eventFormData,
      ...data,
      tickets: [validTickets[0]],
    });

    if (!data.date || !data.time) return
    const validDate = combineDateAndTimeToISO(data.date, data.time)

    const cleanedEventData = {
      eventCategoryValues: formattedCategoryValues,
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
      organizerId: decoded?.organizerId || 0,
      tickets: [validTickets[0]],
      formPromoters: data.formPromoters,
    };

    console.log(cleanedEventData)
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
    <DefaultForm handleSubmit={handleSubmit(onSubmit, onInvalid)} title="Nuevo evento">
      <FormInput
        title="Título del evento*"
        inputName="title"
        register={register("title", { required: "El titulo es obligatorio"  })}
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
        register={register("place", {required: "El lugar es obligatorio"  })}
      />

      <GeoAutocomplete
        setValue={setValue}
        defaultGeo={eventFormData.editPlace}
      />

      <EventImageSwiper setImages={setValue} images={watchedImages} />

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


       { 
        categories?.map((category) => (
            <FormDropDown
              key={category.categoryId}
              title={category.name}
              register={register(`categories.${category.categoryId}` as "categories", { required: true })}
            >
              {
                category.values?.map((value) => (
                  <option 
                  key={value.valueId}   
                  value={JSON.stringify({
                    valueId: value.valueId,
                    categoryId: value.categoryId,
                    value: value.value
                  })}>
                    {value.value}
                  </option>
                ))
              }
            </FormDropDown>
          ))
        }
      <br />

      {labelsTypes && watchedLabels && (
        <FilterTagButton
          setValue={setValue}
          watchedLabels={watchedLabels}
          labelsTypes={labelsTypes}
          title="Etiquetas"
        />
      )}

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
        Crear evento
      </button>
    </DefaultForm>
  );
}
