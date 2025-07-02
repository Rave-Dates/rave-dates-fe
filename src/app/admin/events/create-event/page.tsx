"use client";

import EventImageSwiper from "@/components/roles/admin/events/EventImagesSwiper";
import FilterTagButton from "@/components/ui/buttons/FilterTagButton";
import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import Link from "next/link";
import type React from "react";

import { useForm } from "react-hook-form";

export default function Page() {
  const { register, handleSubmit, watch, setValue } = useForm();
  const { getCookie } = useReactiveCookiesNext();
  
  const tags = watch("tags", ['Alcancía']);
  const tagsTypes = ['Estacionamiento', 'Baños', 'Alcancía', '+21', 'Al aire libre'];
  const images = watch("images", []);
  const eventTypes = ['Gratuito', 'Pago'];
  
  const token = getCookie("token");
 
  // TODO: hacer get de categorías
  // const { data: categories } = useQuery({
  //   queryKey: ["roles"],
  //   queryFn: () => getAllRoles({ token }),
  //   enabled: !!token, // solo se ejecuta si hay token
  // });
  
  // TODO: hacer get de organizadores
  // const { data } = useQuery({
  //   queryKey: ["roles"],
  //   queryFn: () => getAllRoles({ token }),
  //   enabled: !!token, // solo se ejecuta si hay token
  // });


  // TODO: logica para avanzar y guradar los datos sin crear el evento, 
  //  o con RHF o con localStorage o en contexto

  // TODO: agregar el input de lugar para poner la ubicacion

  // creamos el usuario 
  const onSubmit = (data: any) => {
    console.log(data)
    // guardar datos
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
        register={register("date", { required: true })}
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

      {/* <FormDropDown
        title="Organizador*"
        register={register("organizer", { required: true })}
      >
        <option value="organizador">Organizador</option>
        <option value="promotor">Promotor</option>
        <option value="controlador">Controlador</option>
      </FormDropDown>
      <FormDropDown
        title="Categoría 1*"
        register={register("category1", { required: true })}
      >
        <option value="subcategoria1">Subcategoría 1</option>
        <option value="subcategoria2">Subcategoría 2</option>
        <option value="subcategoria3">Subcategoría 3</option>
      </FormDropDown>
      <FormDropDown
        title="Categoría 2*"
        register={register("category2", { required: true })}
      >
        <option value="subcategoria1">Subcategoría 1</option>
        <option value="subcategoria2">Subcategoría 2</option>
        <option value="subcategoria3">Subcategoría 3</option>
      </FormDropDown>
      <FormDropDown
        title="Categoría 3*"
        register={register("category3", { required: true })}
      >
        <option value="subcategoria1">Subcategoría 1</option>
        <option value="subcategoria2">Subcategoría 2</option>
        <option value="subcategoria3">Subcategoría 3</option>
      </FormDropDown> */}

      <br />

      <FilterTagButton setValue={setValue} organizers={tags} values={tagsTypes} type="organizers" title="Etiquetas" />

      <br />

      <div>
        <h3 className="text-white text-sm font-medium mb-1">
          Tipo de evento
        </h3>
        <div className="px-4 flex rounded-xl gap-x-5">
          {eventTypes.map((item) => (
            <label
              key={item}
              className="flex gap-x-3 items-center py-3 justify-between cursor-pointer group"
            >
              <div className="relative">
                <input
                  type="radio"
                  value={item}
                  {...register("eventType", { required: true })}
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 rounded-full border-1 flex items-center justify-center transition-colors ${
                    watch("eventType") === item
                      ? "border-inactive bg-primary-black"
                      : "border-inactive group-hover:border-primary/20"
                  }`}
                >
                  {watch("eventType") === item && (
                    <div className="w-3.5 h-3.5 bg-primary rounded-full"></div>
                  )}
                </div>
              </div>
              <span className="text-primary-white group-hover:text-lime-200 transition-colors">
                {item}
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
      {/* <Link
        href={`${watch("eventType") === "Gratuito" ? "/admin/events/create-event/free-ticket-config" : "/admin/events/create-event/ticket-config"}`}
        // type="submit"
        className="bg-primary block text-center text-black input-button"
      >
        Continuar
      </Link> */}
    </DefaultForm>
  );
}
