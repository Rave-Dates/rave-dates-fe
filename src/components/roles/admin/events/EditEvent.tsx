"use client";

import EventImageSwiper from "@/components/roles/admin/events/EventImagesSwiper";
import FilterTagButton from "@/components/ui/buttons/FilterTagButton";
import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError } from "@/components/ui/toast-notifications";
import { getAllCategories } from "@/services/admin-categories";
import { getEventById, getEventImages, getImageById } from "@/services/admin-events";
import { getAllLabels } from "@/services/admin-labels";
import { useCreateEventStore } from "@/store/createEventStore";
import { useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

import { useForm } from "react-hook-form";

export default function EditEvent({ eventId }: { eventId: number }) {
  const { eventFormData, updateEventFormData } = useCreateEventStore();
  const router = useRouter()
  const { register, handleSubmit, watch, setValue } = useForm();
  const { getCookie } = useReactiveCookiesNext();

    const isEventActive = watch("isEventActive");

  const token = getCookie("token");
  
  const labels = watch("labels", [1]);
  const images = watch("images", []);
  const type = ['free', 'paid'];

// useEffect(() => {
//   console.log("eventFormData actualizado:", eventFormData);
// }, [eventFormData]);
  

  // TODO: TERMINAR
  // const { data: categories, isLoading } = useQuery({
  //   queryKey: ["roles"],
  //   queryFn: () => getAllCategories({ token }),
  //   enabled: !!token, // solo se ejecuta si hay token
  // });

  const { data: event } = useQuery({
    queryKey: ["eventById"],
    queryFn: () => getEventById({ token, id: eventId }),
    enabled: !!token, // solo se ejecuta si hay token
  });
    
  const { data: labelsTypes } = useQuery({
    queryKey: ["labelsTypes"],
    queryFn: () => getAllLabels({ token }),
    enabled: !!token, // solo se ejecuta si hay token
  });

  const { data: eventImages } = useQuery({
    queryKey: ["eventImages", eventId],
    queryFn: () => getEventImages({ token, eventId }),
    enabled: !!token && !!eventId,
  });

  const { data: imagesData, isLoading: loadingImages, isError: errorImages } = useQuery({
    queryKey: ["iamgesData", eventImages?.map(img => img.imageId)],
    queryFn: async () => {
      if (!eventImages || !token) return [];
      const processedImages = await Promise.all(
        eventImages?.map(async (img) => {
          const blob = await getImageById({ token, imageId: img.imageId });
          const url = URL.createObjectURL(blob);

          return {
            id: String(img.imageId),
            url,
          };
        })
      );

      return processedImages;
    },
    enabled: !!token,
  });

  // TODO: agregar el input de lugar para poner la ubicacion
  useEffect(() => {
    if (event) {
      // Labels como array de IDs
      const labelIds = event.labels.map((label) => label.labelId);

      // Seteamos todo al formulario
      setValue("title", event.title);
      setValue("date", event.date);
      setValue("geo", event.geo);
      setValue("description", event.description);
      setValue("type", event.type);
      setValue("labels", labelIds);
      setValue("isEventActive", event.isActive);

      // Guardamos en zustand 
      updateEventFormData({
        ...event,
        labels: labelIds,
        isActive: isEventActive,
      });
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
        updateEventFormData((prev) => ({
          ...prev,
          images: eventImages,
        }));
      }
    }
  }, [eventImages]);

  // creamos evento local
  const onSubmit = (data: any) => {
    if (loadingImages) {
      notifyError("Por favor espere a que se carguen las imágenes")
      return
    }
    updateEventFormData({
      ...eventFormData,
      ...data,
    })

    router.push(
      watch("type") === "free" ? 
      `/admin/events/edit-event/${eventId}/free-ticket-config` 
      : `/admin/events/edit-event/${eventId}/ticket-config`
    )
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit)} title="Nuevo evento">
      <div className="flex items-center justify-between mt-5">
        <span className="text-white text-lg">Activo</span>
        <button
          type="button"
          onClick={() => setValue("isEventActive", !isEventActive)}
          className="w-12 h-6 rounded-full transition-colors pointer-events-auto bg-cards-container"
        >
          <div
            className={`w-5 h-5 rounded-full transition-transform ${
              isEventActive ? "translate-x-6 bg-primary" : "translate-x-0.5 bg-text-inactive"
            }`}
          />
        </button>
      </div>
      <FormInput
        title="Título del evento*"
        inputName="title"
        register={register("title", { required: true })}
      />
      <FormInput
        title="Fecha y hora*"
        inputName="date"
        register={register("date", { required: true, valueAsDate: true })}
      />
      {/* <FormInput
        title="Lugar*"
        inputName="place"
        register={register("place", { required: true })}
      /> */}
      <FormInput
        title="Geolocalización*"
        inputName="geo"
        register={register("geo", { required: true })}
      />

      <EventImageSwiper isError={errorImages} isLoading={loadingImages} setImages={setValue} images={images} />

      <FormInput
        title="Información general*"
        inputName="description"
        register={register("description", { required: true })}
      />

       {/* { 
        categories?.map((category) => (
            <FormDropDown
              key={category.categoryId}
              title={category.name}
              register={register(category.name, { required: true })}
            >
              {
                category.categoryValues.map((value) => (
                  <option key={value.id} value={value.id}>{value.name}</option>
                ))
              }
            </FormDropDown>
          ))
        } */}
      <br />

      <FilterTagButton setValue={setValue} organizers={labels} values={labelsTypes} type="organizers" title="Etiquetas" />

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
