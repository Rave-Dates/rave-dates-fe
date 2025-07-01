"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import CheckFormInput from "@/components/ui/inputs/CheckFormInput";
import FormInput from "@/components/ui/inputs/FormInput";
import { loginAdmin } from "@/services/admin-services";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from 'cookies-next';
import { jwtDecode } from "jwt-decode";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

type LoginForm = {
  email: string;
  password: string;
  receiveInfo: boolean;
};

export default function Page() {
  const { setCookie, getCookie } = useReactiveCookiesNext();
  const [loginError, setLoginError] = useState("");

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

      if (decoded.role !== 'ADMIN') {
        setLoginError("No tienes permiso para acceder.");
        return
      }
      setCookie("token", data, {
        path: "/",
        expires: expirationDate,
        maxAge: decoded.exp - Math.floor(Date.now() / 1000), // en segundos
      });
      redirect('/admin/users');
    },
    onError: () => {
      setLoginError("Credenciales incorrectas.");
    },
  });

  const onSubmit = (data: LoginForm) => {
    setLoginError("");
    mutate({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit)} title="Iniciar sesión - Admin">
      <FormInput
        type="email"
        title="Usuario*"
        inputName="email"
        register={register("email", { required: true })}
      />
      <FormInput
        type="password"
        title="Contraseña*"
        inputName="password"
        register={register("password", { required: true })}
      />

      <CheckFormInput
        register={register}
        value={receiveInfo}
      />

      <div className="h-5 mb-0">
        {loginError && (
          <p className="text-system-error text-sm">{loginError}</p>
        )}
      </div>

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
