"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import PhoneInput from "@/components/ui/inputs/PhoneInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useAdminAllRoles } from "@/hooks/admin/queries/useAdminData";
import { createUser } from "@/services/admin-users";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

const generateRandomPassword = (length = 8): string => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export default function CreateUser() {
  const { register, handleSubmit, control, setValue } = useForm<ICreateUser>();
  const router = useRouter();
  const { getCookie } = useReactiveCookiesNext();

  const token = getCookie("token");

  // obtenemos todos los roles
  const { roles } = useAdminAllRoles({ token });

  React.useEffect(() => {
    setValue("password", generateRandomPassword());
  }, [setValue]);

  // creamos el usuario 
  const { mutate } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      const decoded: IUserLogin = jwtDecode(`${token}`);

      if (decoded.role !== 'ADMIN') {
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

  const onSubmit = (data: Partial<ICreateUser>) => {
    const password = data.password && data.password.trim() !== ""
      ? data.password
      : generateRandomPassword();

    mutate({
      token,
      formData: {
        name: data.name,
        password,
        email: data.email,
        phone: data.phone,
        roleId: data.roleId,
        isActive: true,
      },
    });
  };

  return (
    <DefaultForm autocomplete="off" handleSubmit={handleSubmit(onSubmit)} title="Crear usuario">
      <FormInput
        title="Nombre completo*"
        inputName="name"
        register={register("name", { required: true })}
      />
      <FormInput
        title="Contraseña"
        inputName="password"
        register={register("password", { required: false })}
      />
      <PhoneInput
        title="Número de celular*"
        name="phone"
        control={control}
        rules={{ required: true }}
        />
      <FormInput
        type="email"
        title="Email*"
        inputName="email"
        register={register("email", { required: true })}
      />

      <FormDropDown
        title="Rol*"
        register={register("roleId", { 
          required: true, 
          setValueAs: (v) => v === "" ? undefined : Number(v) 
        })}
      >
        {
          roles?.map((role: IRole) => (
            <option key={role.roleId} value={role.roleId}>
              {role.name}
            </option>
          ))
        }
      </FormDropDown>
      {/* <FormInput
        type="number"
        title="Comisión (%)*"
        inputName="commission"
        register={register("commission", { required: true })}
      /> */}

      <button
        type="submit"
        className="bg-primary text-primary-white input-button"
      >
        Crear usuario
      </button>
    </DefaultForm>
  );
}
