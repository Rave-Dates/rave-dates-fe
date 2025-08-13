"use client";

import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useAdminGetErrorStrings } from "@/hooks/admin/queries/useAdminData";
import { updateErrorStrings } from "@/services/admin-parameters";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function ErrorStrings() {
  const { register, handleSubmit, setValue, reset } = useForm<{ email: string }>();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");

  const { errorStrings } = useAdminGetErrorStrings({ token });

  useEffect(() => {
    if (errorStrings){
      reset({
        email: errorStrings.email
      })
    }
  }, [errorStrings])

  // creamos el usuario 
  const { mutate } = useMutation({
    mutationFn: updateErrorStrings,
    onSuccess: () => {
      notifySuccess('String de error actualizado correctamente');
    },
    onError: (error) => {
      notifyError("Error al actualizar string de error.");
      console.log(error)
    },
  });

  // creamos el usuario 
  const onSubmit = ({ email }: { email: string }) => {
    const trimmedEmail = email.trim();

    mutate({
      token,
      data: {
        email: trimmedEmail,
      },
    });
  };

  return (
    <form className="w-full mt-5" onSubmit={handleSubmit(onSubmit)}>

      <h2 className="text-system-error text-lg font-medium">
        ¡Precaución!
      </h2>
      <p className="text-primary-white/60 text-sm mb-2">Modificar este campo puede causar problemas en la aplicación.</p>
      <h1 className="text-xl font-semibold mb-3">Crear string de error</h1>

      <FormInput
        title="Input de email*"
        inputName="name"
        register={register("email", { required: true })}
      />

      <button
        type="submit"
        className="text-primary border border-primary input-button"
      >
        Actualizar string de error
      </button>
    </form>
  );
}
