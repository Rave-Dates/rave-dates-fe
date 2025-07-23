"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import CheckFormInput from "@/components/ui/inputs/CheckFormInput";
import FormInput from "@/components/ui/inputs/FormInput";
import { useClientAuthStore } from "@/store/useClientAuthStore";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useReactiveCookiesNext } from "cookies-next";
import { redirect, useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type ClientForm = {
  emailOrWhatsapp: string;
  receiveInfo?: boolean;
};

export default function ClientAuth() {
  const { getCookie } = useReactiveCookiesNext();
  const { setClientAuthData } = useClientAuthStore()
  const router = useRouter()
  const tempToken = getCookie("tempToken");
  const clientToken = getCookie("clientToken");
  
  useEffect(() => {
    if (tempToken) {
      router.push('/otp');
    }
    if (clientToken) {
      redirect('/my-data');
    }
  }, [tempToken, clientToken, router]);
  
  const {
    watch,
    register,
    handleSubmit,
  } = useForm<ClientForm>();
  
  const receiveInfo = watch("receiveInfo", false);

  const onSubmit = (data: ClientForm) => {
    if(!data.emailOrWhatsapp) return
    setClientAuthData({emailOrWhatsapp: data.emailOrWhatsapp})
    redirect('/otp');
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit, onInvalid)} title="Ingresa tus datos">
      <FormInput
        title="Email o WhatsApp*"
        inputName="emailOrWhatsapp"
        register={register("emailOrWhatsapp", { required: "El email o el WhatsApp es obligatorio"  })}
      />

      <p className="text-sm">
        Te enviaremos los tickets vía email y/o WhatsApp
      </p>

       <CheckFormInput
        name="receiveInfo"
        register={register("receiveInfo")}
        value={receiveInfo}
      />

      <button
        type="submit"
        className="bg-primary text-black input-button"
      >
         Iniciar sesión
      </button>
    </DefaultForm>
  );
}
