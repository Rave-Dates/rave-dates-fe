"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useAdminAllRoles } from "@/hooks/admin/queries/useAdminData";
import { createUser } from "@/services/admin-users";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

export default function CreateUser() {
  const { register, handleSubmit } = useForm();
  const { getCookie } = useReactiveCookiesNext();
  const router = useRouter();

  const token = getCookie("token");

  // obtenemos todos los roles
  const { roles } = useAdminAllRoles({ token });

  // creamos el usuario 
  const { mutate } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      const decoded: IUserLogin = jwtDecode(`${token}`);

      if (decoded.role !== 'ORGANIZER') {
        notifyError("No tienes permiso para crear un usuario.");
        return
      }
      notifySuccess('Usuario creado correctamente');
      router.back();
    },
    onError: (error) => {
      notifyError("Campos invalidos o error al crear usuario.");
      console.log(error)
    },
  });

  // creamos el usuario 
  const onSubmit = (data: Partial<ICreateUser>) => {
    const promoterRole = roles?.find((role) => role.name === 'PROMOTER');
    mutate({
      token,
      formData: {
        name: data.name,
        password: data.password,
        email: data.email,
        phone: data.phone,
        roleId: promoterRole?.roleId,
        isActive: true,
      },
    });
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit, onInvalid)}  title="Nuevo promotor">
      <FormInput
        title="Nombre completo*"
        inputName="name"
        register={register("name", { required: true })}
      />
      <FormInput
        title="Contraseña*"
        inputName="password"
        register={register("password", { required: true })}
      />
      <FormInput
        type="email"
        title="Email*"
        inputName="email"
        register={register("email", { required: true })}
      />
      <FormInput
        type="number"
        title="Celular*"
        inputName="phone"
        register={register("phone", { required: true })}
      />

      <button
        type="submit"
        className="bg-primary text-black input-button"
      >
        Agregar
      </button>
    </DefaultForm>
  );
}
