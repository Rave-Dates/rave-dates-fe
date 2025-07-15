"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import CheckFormInput from "@/components/ui/inputs/CheckFormInput";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { loginAdmin } from "@/services/admin-users";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from 'cookies-next';
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type LoginForm = {
  email: string;
  password: string;
  receiveInfo: boolean;
};

export default function Page() {
  const { setCookie, getCookie } = useReactiveCookiesNext();

  const {
    watch,
    register,
    handleSubmit,
  } = useForm<LoginForm>();

  const receiveInfo = watch("receiveInfo", false);

  const token = getCookie('token');

  useEffect(() => {
    if (token) {
      redirect('/admin/users');
    }
  }, [token])
  
  const { mutate, isPending } = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (data) => {
      const decoded: IUserLogin = jwtDecode(data);
      const expirationDate = new Date(decoded.exp * 1000);

      setCookie("token", data, {
        path: "/",
        expires: expirationDate,
        maxAge: decoded.exp - Math.floor(Date.now() / 1000), // en segundos
      });
      notifySuccess("Logueado correctamente");
      redirect('/admin/users');
    },
    onError: () => {
      notifyError("Error al loguear");
    },
  });
  
  const onSubmit = (data: LoginForm) => {
    mutate({
      email: data.email,
      password: data.password,
    });
  };
  
  const onInvalid = (errors: { [key: string]: any }) => {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      notifyError(firstError.message);
    } else {
      notifyError("Por favor completá todos los campos requeridos.");
    }
  };
  

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit, onInvalid)} title="Iniciar sesión - Admin">
      <FormInput
        type="email"
        title="Usuario*"
        inputName="email"
        register={register("email", { required: "El email es obligatorio" })}
      />
      <FormInput
        type="password"
        title="Contraseña*"
        inputName="password"
        register={register("password", { required: "La contraseña es obligatoria" })}
      />

      <CheckFormInput
        register={register}
        value={receiveInfo}
      />

      <button
        type="submit"
        className="bg-primary text-black input-button"
        disabled={isPending}
      >
         {isPending ? "Cargando..." : "Iniciar sesión"}
      </button>
    </DefaultForm>
  );
}
