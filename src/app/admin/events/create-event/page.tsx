"use client";

import EventImageSwiper from "@/components/roles/admin/events/EventImagesSwiper";
import FilterTagButton from "@/components/ui/buttons/FilterTagButton";
import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { getAllCategories } from "@/services/admin-categories";
import { getAllLabels } from "@/services/admin-labels";
import { useCreateEventStore } from "@/store/createEventStore";
import { useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { useRouter } from "next/navigation";
import type React from "react";

import { useForm } from "react-hook-form";

export default function Page() {
  const state = useCreateEventStore((state) => state)
  const router = useRouter()
  const { register, handleSubmit, watch, setValue } = useForm();
  const { getCookie } = useReactiveCookiesNext();

  const token = getCookie("token");
  
  const labels = watch("labels", [1]);
  const images = watch("images", []);
  const type = ['free', 'paid'];
  
  const { data: categories, isLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getAllCategories({ token }),
    enabled: !!token, // solo se ejecuta si hay token
  });
    
  const { data: labelsTypes } = useQuery({
    queryKey: ["labelsTypes"],
    queryFn: () => getAllLabels({ token }),
    enabled: !!token, // solo se ejecuta si hay token
  });
    
  // TODO: agregar el input de lugar para poner la ubicacion

  // creamos el usuario 
  const onSubmit = (data: any) => {
    state.updateEventFormData({
      ...state.eventFormData,
      ...data,
    })

    router.push(
      watch("type") === "free" ? 
      "/admin/events/create-event/free-ticket-config" 
      : "/admin/events/create-event/ticket-config"
    )
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit)} title="Nuevo evento">
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

      <EventImageSwiper setImages={setValue} images={images} />

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
