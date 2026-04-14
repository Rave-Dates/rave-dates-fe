"use client";

import ArrowDownSvg from "@/components/svg/ArrowDown";
import EditableItem from "@/components/ui/EditableItem";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useAdminAllCategories } from "@/hooks/admin/queries/useAdminData";
import { createCategoryValue, deleteCategoryValue, updateCategoryValue } from "@/services/admin-parameters";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const token = getCookie("token");

  const { categories } = useAdminAllCategories({ token });

  // mutation to create
  const { mutate: createMutate } = useMutation({
    mutationFn: createCategoryValue,
    onSuccess: () => {
      notifySuccess('Valor de categoría creado correctamente'); 
      setValue("value", "");
      queryClient.invalidateQueries({ queryKey: ["oldCategories"] });
    },
    onError: (error) => {
      notifyError("Error al crear valor de categoría.");
      console.log(error)
    },
  });

  // mutation to update
  const { mutate: updateMutate } = useMutation({
    mutationFn: updateCategoryValue,
    onSuccess: () => {
      notifySuccess('Valor de categoría actualizado correctamente');
      queryClient.invalidateQueries({ queryKey: ["oldCategories"] });
    },
    onError: (error) => {
      notifyError("Error al actualizar valor de categoría.");
      console.log(error)
    },
  });

  // mutation to delete
  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteCategoryValue,
    onSuccess: () => {
      notifySuccess("Valor de categoría eliminado correctamente");
      queryClient.invalidateQueries({ queryKey: ["oldCategories"] });
    },
    onError: (error) => {
      notifyError("Error al eliminar valor de categoría.");
      console.log(error)
    },
  });

  const handleDelete = (valueId: number) => {
    deleteMutate({ token, valueId });
  }

  const handleUpdate = (valueId: number, newValue: string) => {
    updateMutate({ token, valueId, value: newValue, categoryId: selectedPreviewCategory });
  }

  const onSubmit = ({value, categoryId}: {value: string, categoryId: number}) => {
    const trimmedValue = value.trim();
    createMutate({
      token,
      value: trimmedValue,
      categoryId,
    });
  };

  const currentPreviewCategory = categories?.find(c => c.categoryId === selectedPreviewCategory);

  return (
    <form autoComplete="off" className="w-full" onSubmit={handleSubmit(onSubmit)}>
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
                <EditableItem
                  key={val.valueId}
                  initialValue={val.value}
                  onSave={(newValue) => handleUpdate(val.valueId, newValue)}
                  onDelete={() => handleDelete(val.valueId)}
                />
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
          register={register(`categoryId`, { 
            required: true, 
            setValueAs: (v) => v === "" ? undefined : Number(v) 
          })}
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
