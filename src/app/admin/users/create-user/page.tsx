"use client";

import CheckSvg from "@/components/svg/CheckSvg";
import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import { getAllRoles } from "@/services/admin-roles";
import { createUser } from "@/services/admin-users";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateUser() {
  const { register, handleSubmit} = useForm<ICreateUser>();
  const { getCookie } = useReactiveCookiesNext();

  const token = getCookie("token");

  // obtenemos todos los roles
  const { data } = useQuery({
    queryKey: ["roles"],
    queryFn: () => getAllRoles({ token }),
    enabled: !!token, // solo se ejecuta si hay token
  });


  // creamos el usuario 
  const { mutate } = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      const decoded: IUserLogin = jwtDecode(`${token}`);

      if (decoded.role !== 'ADMIN') {
        alert("No tienes permiso para crear un usuario.");
        // setLoginError("No tienes permiso para acceder.");
        return
      }
      toast('Usuario creado correctamente', {
        className: 'bg-primary-black',
        style: {backgroundColor: '#151515', color: '#FFFFFF', borderColor: "#b3ff0020"},
        duration: 5000,
        icon: <CheckSvg className="text-primary text-xl" />,
      });
      redirect('/admin/users');
    },
    onError: () => {
      alert("Campos invalidos o error al crear usuario.");
    },
  });

  // creamos el usuario 
  const onSubmit = (data: Partial<ICreateUser>) => {
    mutate({
      token,
      formData: {
        name: data.name,
        password: data.password,
        email: data.email,
        roleId: Number(data.roleId),
        isActive: false,
      },
    });
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit)} title="Crear usuario">
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
        type="number"
        title="Número de celular*"
        inputName="phone"
        register={register("phone")}
        />
      <FormInput
        type="email"
        title="Mail*"
        inputName="email"
        register={register("email", { required: true })}
      />

      <FormDropDown
        title="Rol*"
        register={register("roleId", { required: true })}
      >
        {
          data?.map((role: IRole) => (
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
        className="bg-primary text-black input-button"
      >
        Crear usuario
      </button>
    </DefaultForm>
  );
}
