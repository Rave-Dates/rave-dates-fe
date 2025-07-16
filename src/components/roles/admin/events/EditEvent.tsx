"use client";

import EventImageSwiper from "@/components/roles/admin/events/EventImagesSwiper";
import FilterTagButton from "@/components/ui/buttons/FilterTagButton";
import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError } from "@/components/ui/toast-notifications";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { getAllCategories } from "@/services/admin-categories";
import { getEventById, getEventCategoriesById, getEventImages, getImageById } from "@/services/admin-events";
import { getAllLabels } from "@/services/admin-labels";
import { useCreateEventStore } from "@/store/createEventStore";
import { validateDateYyyyMmDd } from "@/utils/formatDate";
import { extractLatAndLng, extractPlaceFromGeo } from "@/utils/formatGeo";
import { useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

import { useForm, useWatch } from "react-hook-form";
import GeoAutocomplete from "./GeoAutocomplete";
import { onInvalid } from "@/utils/onInvalidFunc";

export default function EditEvent({ eventId }: { eventId: number }) {
  const { eventFormData, updateEventFormData, setHasLoadedEvent, setHasLoadedTickets } = useCreateEventStore();
  const router = useRouter()
  const { register, handleSubmit, watch, setValue, control } = useForm<IEventFormData>({
    defaultValues: defaultEventFormData,
  });
  const { getCookie } = useReactiveCookiesNext();

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
  
  const type = ['free', 'paid'];
  
  const { data: eventCategories } = useQuery<IEventCategoryValue[]>({
    queryKey: ["eventCategories"],
    queryFn: () => getEventCategoriesById(token, eventId),
    enabled: !!token, // solo se ejecuta si hay token
  });

  const { data: categories } = useQuery<IEventCategories[]>({
    queryKey: ["oldCategories"],
    queryFn: () => getAllCategories({ token }),
    enabled: !!token, // solo se ejecuta si hay token
  });
    
  const { data: event } = useQuery<IEvent>({
    queryKey: ["eventById"],
    queryFn: () => getEventById({ token, id: eventId }),
    enabled: !!token, // solo se ejecuta si hay token
  });
  
  const { data: labelsTypes } = useQuery<IEventLabel[]>({
    queryKey: ["labelsTypes"],
    queryFn: () => getAllLabels({ token }),
    enabled: !!token, // solo se ejecuta si hay token
  });
  
  const { data: eventImages, isError: isErrorEventImages } = useQuery<IEventImages[]>({
    queryKey: ["eventImages", eventId],
    queryFn: () => getEventImages({ token, eventId }),
    enabled: !!token && !!eventId,
  });

  const { data: imagesData, isLoading: loadingImages, isError: errorImages } = useQuery<IImageData[]>({
    queryKey: ["imagesData", eventImages?.map(img => img.imageId)],
    queryFn: async () => {
      if (!eventImages || !token) return [];

      const processedImages = await Promise.all(
        eventImages.map(async (img) => {
          const blob = await getImageById({ token, imageId: img.imageId });
          const url = URL.createObjectURL(blob);

          return {
            id: img.imageId.toString(),
            url,
            // file no viene del backend, solo se añade en frontend si hay uploads
          };
        })
      );

      return processedImages;
    },
    enabled: !!token && !!eventImages,
  });
  
  useEffect(() => {
    if (event) {
      // Labels como array de IDs
      const labelIds = event?.labels?.map((label) => label.labelId);
      
      // Seteamos todo al formulario
      setValue("title", event.title);
      setValue("discount", event.discount);
      setValue("discountCode", event.discountCode);
      setValue("feeRD", event.feeRD);
      setValue("date", event.date);
      setValue("maxPurchase", event.maxPurchase);
      setValue("geo", extractLatAndLng(event.geo));
      setValue("place", extractPlaceFromGeo(event.geo));
      setValue("description", event.description);
      setValue("transferCost", event.transferCost);
      setValue("feePB", event.feePB);
      setValue("type", event.type);
      setValue("isActive", event.isActive);
      setValue("timeOut", event.timeOut);
      setValue("labels", labelIds);
      
      // Guardamos en zustand 
      updateEventFormData({
        ...event,
        labels: event.labels.map(label => label.labelId),
      });
      setHasLoadedEvent(true);
      setHasLoadedTickets(false);
    }
  }, [event]);

  useEffect(() => {
    if (imagesData) {
      setValue("images", imagesData);
    }
  }, [imagesData]);

  // Actualiza Zustand solo si cambia eventImages
  useEffect(() => {
    if (eventImages) {
      const same = JSON.stringify(eventFormData.images) === JSON.stringify(eventImages);
      if (!same) {
      updateEventFormData({
        ...eventFormData,
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

  // creamos evento local
  const onSubmit = (data: IEventFormData) => {
    console.log("data",data)
    if (loadingImages) {
      notifyError("Por favor espere a que se carguen las imágenes")
      return
    }
    
    if (!data.oldCategories) return
    const parsedCategories = Object.values(data.oldCategories).map((cat) => JSON.parse(cat));
    const formattedOldCategories = eventCategories?.map((category) => ({
      categoryId: category.categoryId,
      valueId: category.valueId,
    }));

    const categoriesToUpdate = parsedCategories
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

    const formattedGeo = `${data.geo};${data.place?.trim()}`;
    
    updateEventFormData({
      ...eventFormData,
      ...data,
      isActive: watchedIsActive,
      geo: formattedGeo,
      categoriesToUpdate
    })

    router.push(
      watch("type") === "free" ? 
      `/admin/events/edit-event/${eventId}/free-ticket-config` 
      : `/admin/events/edit-event/${eventId}/ticket-config`
    )
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
        register={register("title", { required: "El titulo es obligatorio"  })}
      />
      
      <FormInput
        title="Fecha y hora*"
        inputName="date"
        register={register("date", 
          { required: "La fecha es obligatoria", 
            validate: validateDateYyyyMmDd 
          })}
      />

      <FormInput
        title="Lugar*"
        inputName="place"
        register={register("place", { required: "El lugar es obligatorio"  })}
      />

      <GeoAutocomplete
        setValue={setValue}
        defaultGeo={eventFormData.geo}
        isEditing={true}
      />

      <EventImageSwiper isErrorEventImages={isErrorEventImages} isError={errorImages} isLoading={loadingImages} setImages={setValue} images={watchedImages} />

      <FormInput
        title="Información general*"
        inputName="description"
        register={register("description", { required: "La descripción es obligatoria"  })}
      />

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
        labelsTypes &&
        <FilterTagButton setValue={setValue} labels={watchedLabels} values={labelsTypes} title="Etiquetas" />
      }

      <br />

      <div>
        <h3 className="text-white text-sm font-medium mb-1">
          Tipo de evento
        </h3>
        <div className="px-4 flex rounded-xl gap-x-5">
          {type.map((item) => (
            <label
              key={item}
              className="flex gap-x-3 items-center py-3 justify-between cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="radio"
                  value={item}
                  {...register("type", { required: true })}
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 rounded-full border-1 flex items-center justify-center transition-colors ${
                    watch("type") === item
                      ? "border-inactive bg-primary-black"
                      : "border-inactive group-hover:border-primary/20"
                  }`}
                >
                  {watch("type") === item && (
                    <div className="w-3.5 h-3.5 bg-primary rounded-full"></div>
                  )}
                </div>
              </div>
              <span className="text-primary-white group-hover:text-lime-200 transition-colors">
                {item === 'free' ? 'Gratuito' : 'Pago'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-primary block text-center text-black input-button"
      >
        Continuar
      </button>
    </DefaultForm>
  );
}
