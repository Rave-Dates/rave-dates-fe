"use client";

import TrashSvg from "@/components/svg/TrashSvg";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useAdminAllCategories } from "@/hooks/admin/queries/useAdminData";
import { createCategory } from "@/services/admin-parameters";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import React from "react";
import { useForm } from "react-hook-form";

export default function CreateCategory() {
  const { register, handleSubmit, setValue } = useForm<{ name: string }>();
  const { getCookie } = useReactiveCookiesNext();

  const token = getCookie("token");
  const { categories } = useAdminAllCategories({ token });

  // creamos el usuario 
  const { mutate } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      notifySuccess('Categoría creada correctamente');
      setValue("name", "");
    },
    onError: (error) => {
      notifyError("Error al crear categoría.");
      console.log(error)
    },
  });

  const deleteCategory = (categoryId: number) => {
    notifySuccess("Categoría eliminada correctamente " + categoryId);
  }

  // creamos el usuario 
  const onSubmit = ({ name }: { name: string }) => {
    const trimmedName = name.trim();
    mutate({
      token,
      name: trimmedName,
    });
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-semibold mb-4">Crear categoría</h1>

      <div className="flex flex-col items-start my-3">
        <p className="w-34 mb-3 text-sm font-medium">Categorías activas:</p>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 ms-2">
          {
            categories?.map((category) => (
              <div className="bg-primary rounded-md flex items-center gap-2 animate-fade-in" key={category.categoryId}>
                <h1 className="text-sm px-2 text-primary-black font-semibold">{category.name}</h1>
                <button 
                  type="button" 
                  onClick={() => deleteCategory(category.categoryId)} 
                  className="text-primary-black h-8 w-10 flex items-center justify-center rounded-r-md bg-system-error hover:bg-system-error/80 transition-colors"
                >
                  <TrashSvg />
                </button>
              </div>
            ))
          }
        </div>
      </div>

      <FormInput
        title="Nombre*"
        inputName="name"
        register={register("name", { required: true })}
      />

      <button
        type="submit"
        className="text-primary border border-primary input-button"
      >
        Crear categoría
      </button>
    </form>
  );
}
