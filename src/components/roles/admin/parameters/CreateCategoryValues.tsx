"use client";

import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { getAllCategories } from "@/services/admin-categories";
import { createCategoryValue } from "@/services/admin-parameters";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import React from "react";
import { useForm } from "react-hook-form";

export default function CreateCategoryValues() {
  const { register, handleSubmit, setValue } = useForm<{value: string, categoryId: number}>({
    defaultValues: {
      value: "",
      categoryId: 1,
    },
  });
  const { getCookie } = useReactiveCookiesNext();

  const token = getCookie("token");

  const { data: categories } = useQuery<IEventCategories[]>({
    queryKey: ["categories"],
    queryFn: () => getAllCategories({ token }),
    enabled: !!token, // solo se ejecuta si hay token
  });

  const { mutate } = useMutation({
    mutationFn: createCategoryValue,
    onSuccess: () => {
      notifySuccess('Valor de categoría creado correctamente'); 
      setValue("value", "");
      setValue("categoryId", 1);
    },
    onError: (error) => {
      notifyError("Error al crear valor de categoría.");
      console.log(error)
    },
  });

  const onSubmit = ({value, categoryId}: {value: string, categoryId: number}) => {
    const trimmedValue = value.trim();
    console.log(value, categoryId)
    mutate({
      token,
      value: trimmedValue,
      categoryId,
    });
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold mb-4">Crear valor de categoría</h1>
      <div className="w-full flex gap-x-3">
        <FormInput
          title="Valor*"
          inputName="value"
          register={register("value", { required: true })}
        />

        <FormDropDown
          title="Categoría*"
          register={register(`categoryId`, { required: true, valueAsNumber: true })}
        >
          {
            categories?.map((category) => (
              <option 
                key={category.categoryId}   
                value={category.categoryId}
              >
                {category.name}
              </option>
            ))
          }
        </FormDropDown>
      </div>

      <button
        type="submit"
        className="text-primary border border-primary input-button"
      >
        Crear valor de categoría
      </button>
    </form>
  );
}
