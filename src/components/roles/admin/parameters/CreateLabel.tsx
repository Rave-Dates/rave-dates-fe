"use client";

import EditableItem from "@/components/ui/EditableItem";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useAdminLabelsTypes } from "@/hooks/admin/queries/useAdminData";
import { createLabel, deleteLabel, updateLabel } from "@/services/admin-parameters";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { useForm } from "react-hook-form";

export default function CreateLabel() {
  const { register, handleSubmit, setValue } = useForm<{ name: string }>();
  const { getCookie } = useReactiveCookiesNext();
  const queryClient = useQueryClient();

  const token = getCookie("token");
  const { labelsTypes } = useAdminLabelsTypes({token});

  // mutation to create
  const { mutate: createMutate } = useMutation({
    mutationFn: createLabel,
    onSuccess: () => {
      notifySuccess('Etiqueta creada correctamente');
      setValue("name", "");
      queryClient.invalidateQueries({ queryKey: ["labelsTypes"] });
    },
    onError: (error) => {
      notifyError("Error al crear etiqueta.");
      console.log(error)
    },
  });

  // mutation to update
  const { mutate: updateMutate } = useMutation({
    mutationFn: updateLabel,
    onSuccess: () => {
      notifySuccess('Etiqueta actualizada correctamente');
      queryClient.invalidateQueries({ queryKey: ["labelsTypes"] });
    },
    onError: (error) => {
      notifyError("Error al actualizar etiqueta.");
      return error
    },
  });

  // mutation to delete
  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteLabel,
    onSuccess: () => {
      notifySuccess("Etiqueta eliminada correctamente");
      queryClient.invalidateQueries({ queryKey: ["labelsTypes"] });
    },
    onError: (error) => {
      notifyError("Error al eliminar etiqueta.");
      console.log(error)
    },
  });


  const handleDelete = (labelId: number) => {
    deleteMutate({ token, labelId });
  }

  const handleUpdate = (labelId: number, newName: string) => {
    updateMutate({ token, labelId, name: newName, icon: null });
  }

  // creamos el usuario 
  const onSubmit = ({ name }: { name: string }) => {
    const trimmedName = name.trim();

    createMutate({
      token,
      name: trimmedName,
      icon: null,
    });
  };

  return (
    <form autoComplete="off" className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-semibold mb-4">Crear etiqueta</h1>
      
      <div className="flex flex-col items-start my-3">
        <p className="w-34 mb-3">Etiquetas activas:</p>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 ms-2">
          {
            labelsTypes?.map((labelType) => (
              <EditableItem
                key={labelType.labelId}
                initialValue={labelType.name || ""}
                onSave={(newName) => handleUpdate(labelType.labelId, newName)}
                onDelete={() => handleDelete(labelType.labelId)}
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
        Crear etiqueta
      </button>
    </form>
  );
}
