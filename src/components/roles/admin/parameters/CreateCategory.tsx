"use client";

import EditableItem from "@/components/ui/EditableItem";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useAdminAllCategories } from "@/hooks/admin/queries/useAdminData";
import { createCategory, deleteCategory, updateCategory } from "@/services/admin-parameters";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import React from "react";
import { useForm } from "react-hook-form";

export default function CreateCategory() {
  const { register, handleSubmit, setValue } = useForm<{ name: string }>();
  const { getCookie } = useReactiveCookiesNext();
  const queryClient = useQueryClient();

  const token = getCookie("token");
  const { categories } = useAdminAllCategories({ token });

  // mutation to create
  const { mutate: createMutate } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      notifySuccess('Categoría creada correctamente');
      setValue("name", "");
      queryClient.invalidateQueries({ queryKey: ["oldCategories"] });
    },
    onError: (error) => {
      notifyError("Error al crear categoría.");
      console.log(error)
    },
  });

  // mutation to update
  const { mutate: updateMutate } = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      notifySuccess('Categoría actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ["oldCategories"] });
    },
    onError: (error) => {
      notifyError("Error al actualizar categoría.");
      console.log(error)
    },
  });

  // mutation to delete
  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      notifySuccess("Categoría eliminada correctamente");
      queryClient.invalidateQueries({ queryKey: ["oldCategories"] });
    },
    onError: (error) => {
      notifyError("Error al eliminar categoría.");
      console.log(error)
    },
  });

  const handleDelete = (categoryId: number) => {
    deleteMutate({ token, categoryId });
  }

  const handleUpdate = (categoryId: number, newName: string) => {
    updateMutate({ token, categoryId, name: newName });
  }

  // creamos el usuario 
  const onSubmit = ({ name }: { name: string }) => {
    const trimmedName = name.trim();
    createMutate({
      token,
      name: trimmedName,
    });
  };

  return (
    <form autoComplete="off" className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-semibold mb-4">Crear categoría</h1>

      <div className="flex flex-col items-start my-3">
        <p className="w-34 mb-3 text-sm font-medium">Categorías activas:</p>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 ms-2">
          {
            categories?.map((category) => (
              <EditableItem
                key={category.categoryId}
                initialValue={category.name}
                onSave={(newName) => handleUpdate(category.categoryId, newName)}
                onDelete={() => handleDelete(category.categoryId)}
              />
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
