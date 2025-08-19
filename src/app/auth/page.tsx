"use client";

import VerificationTypeSelector from "@/components/containers/otp/VerificationTypeSelector";
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
  const { setClientAuthData, setIsEmailOrWhatsapp, isEmailOrWhatsapp } = useClientAuthStore()
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
    router.push('/otp');
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit, onInvalid)} title="Iniciar sesión">
      <h2 className="text-sm">
        Selecciona el tipo de verificación que vas a utilizar
      </h2>

      <VerificationTypeSelector
        selected={isEmailOrWhatsapp}
        setSelected={setIsEmailOrWhatsapp}
      />

      {
        isEmailOrWhatsapp === "Email" ?
        <FormInput
          title="Email*"
          type="email"
          inputName="emailOrWhatsapp"
          register={register("emailOrWhatsapp", { required: "El email es obligatorio"  })}
        />
        :
        <FormInput
          title="WhatsApp*"
          type="tel"
          inputName="emailOrWhatsapp"
          register={register("emailOrWhatsapp", { required: "El WhatsApp es obligatorio"  })}
        />
      }

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
