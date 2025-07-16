"use client";

import EventImageSwiper from "@/components/roles/admin/events/EventImagesSwiper";
import FilterTagButton from "@/components/ui/buttons/FilterTagButton";
import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError } from "@/components/ui/toast-notifications";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { getAllCategories } from "@/services/admin-categories";
import { getAllLabels } from "@/services/admin-labels";
import { useCreateEventStore } from "@/store/createEventStore";
import { validateDateYyyyMmDd } from "@/utils/formatDate";
import { useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

import { FieldErrors, useForm, useWatch } from "react-hook-form";

const GeoAutocomplete = dynamic(() => import("@/components/roles/admin/events/GeoAutocomplete"), { ssr: false });


export default function Page() {
  const { eventFormData, updateEventFormData, setHasLoadedEvent } = useCreateEventStore();
  const router = useRouter()
  const { register, handleSubmit, watch, setValue, getValues, control } = useForm<IEventFormData>({
    defaultValues: defaultEventFormData
  });
  const { getCookie } = useReactiveCookiesNext();

  const token = getCookie("token");
  
  register("labels", {
    validate: (value) =>
      value && value.length > 0 ? true : "Debes seleccionar al menos una etiqueta",
  });

  register("images", {
    validate: (value) =>
      value && value.length > 0 ? true : "Debes subir al menos una imagen",
  });
  
  const type = ['free', 'paid'];
  
  const { data: categories } = useQuery<IEventCategories[]>({
    queryKey: ["roles"],
    queryFn: () => getAllCategories({ token }),
    enabled: !!token, // solo se ejecuta si hay token
  });
    
  const { data: labelsTypes } = useQuery<IEventLabel[]>({
    queryKey: ["labelsTypes"],
    queryFn: () => getAllLabels({ token }),
    enabled: !!token, // solo se ejecuta si hay token
  });



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

    setValue("title", eventFormData.title);
    setValue("place", eventFormData.place);
    setValue("date", eventFormData.date);
    setValue("geo", eventFormData.geo);
    setValue("editPlace", eventFormData.editPlace);
    setValue("description", eventFormData.description);
    setValue("type", eventFormData.type);

    // Aseguramos que si vienen labels e imágenes, se setean correctamente
    setValue(
      "labels",
      (eventFormData.labels ?? [])
        .filter((label: any) => label?.labelId !== undefined)
        .map((label: any) => label.labelId)
    );    
    setValue("images", eventFormData.images ?? []);
  }, [eventFormData, setValue]);
  
  useEffect(() => {
  }, [eventFormData]);
    
  const watchedLabels = useWatch({ name: "labels", control });
  const watchedImages = useWatch({ name: "images", control });

  // creamos el evento 
  const onSubmit = (data: any) => {
    const parsedCategories = data.categories.map((category: any) => JSON.parse(category))
    
    const formattedData = {
      ...data,
      eventCategoryValues: parsedCategories.map((category: any) => ({
        valueId: category.valueId,
        categoryId: category.categoryId,
        value: category.value,
      })),
    }

    delete formattedData.categories;

    console.log(formattedData)
    updateEventFormData({
      ...eventFormData,
      ...formattedData,
    })

    setHasLoadedEvent(true)

    router.push(
      watch("type") === "free" ? 
      "/admin/events/create-event/free-ticket-config" 
      : "/admin/events/create-event/ticket-config"
    )
  };

  const onInvalid = (errors: FieldErrors<IEventFormData>) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      notifyError(firstError.message);
    } else {
      notifyError("Por favor completá todos los campos requeridos.");
    }
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit, onInvalid)} title="Nuevo evento">
      <FormInput
        title="Título del evento*"
        inputName="title"
        register={register("title", { required: "El titulo es obligatorio"  })}
      />
      <FormInput
        title="Fecha y hora*"
        inputName="date"
        register={register("date", { 
          required: "La fecha es obligatoria", 
          validate: validateDateYyyyMmDd
        })}
      />
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

       { 
        categories?.map((category) => (
            <FormDropDown
              key={category.categoryId}
              title={category.name}
              register={register(`categories.${category.categoryId}` as any, { required: true })}
            >
              {
                category.values.map((value) => (
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

    {labelsTypes && (
      <FilterTagButton
        setValue={setValue}
        labels={watchedLabels}
        values={labelsTypes}
        title="Etiquetas"
      />
    )}
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
