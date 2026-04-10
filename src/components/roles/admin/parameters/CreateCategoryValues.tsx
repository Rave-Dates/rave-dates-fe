"use client";

import ArrowDownSvg from "@/components/svg/ArrowDown";
import TrashSvg from "@/components/svg/TrashSvg";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useAdminAllCategories } from "@/hooks/admin/queries/useAdminData";
import { createCategoryValue } from "@/services/admin-parameters";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function CreateCategoryValues() {
  const { register, handleSubmit, setValue } = useForm<{value: string, categoryId: number}>({
    defaultValues: {
      value: "",
      categoryId: 1,
    },
  });
  const { getCookie } = useReactiveCookiesNext();
  const [selectedPreviewCategory, setSelectedPreviewCategory] = useState<number>(1);

  const token = getCookie("token");

  const { categories } = useAdminAllCategories({ token });

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

  const deleteCategoryValue = (valueId: number) => {
    notifySuccess("Valor de categoría eliminado correctamente " + valueId);
  }

  const onSubmit = ({value, categoryId}: {value: string, categoryId: number}) => {
    const trimmedValue = value.trim();
    mutate({
      token,
      value: trimmedValue,
      categoryId,
    });
  };

  const currentPreviewCategory = categories?.find(c => c.categoryId === selectedPreviewCategory);

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-semibold mb-4">Crear valor de categoría</h1>

      <div className="flex flex-col items-start my-3">
        <p className="w-34 mb-3 text-sm font-medium">Valores de categorías activos:</p>
        
        <div className="relative w-full">
          <label htmlFor="preview-category-select" className="block mb-2 text-xs text-primary-white/60">
            Vista previa por categoría
          </label>
          <div className="relative">
            <select
              id="preview-category-select"
              onChange={(e) => setSelectedPreviewCategory(Number(e.target.value))}
              value={selectedPreviewCategory}
              className="w-full appearance-none mt-1 bg-main-container outline-none rounded-lg py-3 px-4 text-white relative transition-colors focus:border-primary/50"
            >
              {
                categories?.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))
              }
            </select>
            <ArrowDownSvg className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-gray-500" />
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 mt-4 ms-2">
          {
            currentPreviewCategory && currentPreviewCategory.values.length > 0 ? (
              currentPreviewCategory.values.map((val) => (
                <div className="bg-primary rounded-md flex items-center gap-2 animate-fade-in" key={val.valueId}>
                  <h1 className="text-sm px-2 text-primary-black font-semibold">{val.value}</h1>
                  <button 
                    type="button" 
                    onClick={() => deleteCategoryValue(val.valueId)} 
                    className="text-primary-black h-8 w-10 flex items-center justify-center rounded-r-md bg-system-error hover:bg-system-error/80 transition-colors"
                  >
                    <TrashSvg />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-text-inactive italic">No hay valores para esta categoría</p>
            )
          }
        </div>
      </div>

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
