"use client";

import TrashSvg from "@/components/svg/TrashSvg";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useAdminLabelsTypes } from "@/hooks/admin/queries/useAdminData";
import { createLabel } from "@/services/admin-parameters";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import React from "react";
import { useForm } from "react-hook-form";

export default function CreateLabel() {
  const { register, handleSubmit, setValue } = useForm<{ name: string }>();
  const { getCookie } = useReactiveCookiesNext();

  const token = getCookie("token");
  const { labelsTypes } = useAdminLabelsTypes({token});

  // creamos el usuario 
  const { mutate } = useMutation({
    mutationFn: createLabel,
    onSuccess: () => {
      notifySuccess('Etiqueta creada correctamente');
      setValue("name", "");
    },
    onError: (error) => {
      notifyError("Error al crear etiqueta.");
      console.log(error)
    },
  });


  const deleteLabel = (labelId: number) => {
    notifySuccess("Etiqueta eliminada correctamente " + labelId);
  }

  // creamos el usuario 
  const onSubmit = ({ name }: { name: string }) => {
    const trimmedName = name.trim();

    mutate({
      token,
      name: trimmedName,
      icon: null,
    });
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-2xl font-semibold mb-4">Crear etiqueta</h1>
      
      <div className="flex flex-col items-start my-3">
        <p className="w-34 mb-3">Etiquetas activas:</p>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-2 ms-2">
          {
            labelsTypes?.map((labelType) => (
              <div className="bg-primary rounded-md flex items-center gap-2" key={labelType.labelId}>
                <h1 className="text-sm px-2 text-primary-black font-semibold">{labelType.name}</h1>
                <button type="button" onClick={() => deleteLabel(labelType.labelId)} className="text-primary-black h-8 w-10 flex items-center justify-center rounded-r-md bg-system-error">
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
        Crear etiqueta
      </button>
    </form>
  );
}
