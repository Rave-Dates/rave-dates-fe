"use client";

import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { createLabel } from "@/services/admin-parameters";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import React from "react";
import { useForm } from "react-hook-form";

export default function CreateLabel() {
  const { register, handleSubmit, setValue } = useForm<{ name: string }>();
  const { getCookie } = useReactiveCookiesNext();

  const token = getCookie("token");

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
      <h1 className="text-xl font-semibold mb-4">Crear etiqueta</h1>
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
