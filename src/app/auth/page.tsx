"use client";

import VerificationTypeSelector from "@/components/containers/otp/VerificationTypeSelector";
import DefaultForm from "@/components/ui/forms/DefaultForm";
import CheckFormInput from "@/components/ui/inputs/CheckFormInput";
import FormInput from "@/components/ui/inputs/FormInput";
import { useClientAuthStore } from "@/store/useClientAuthStore";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type ClientForm = {
  emailOrWhatsapp: string;
  receiveInfo?: boolean;
};

export default function ClientAuth() {
  const { getCookie } = useReactiveCookiesNext();
  const { setClientAuthData, setIsEmailOrWhatsapp, isEmailOrWhatsapp, emailOrWhatsapp } = useClientAuthStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const tempToken = getCookie("tempToken");
  const clientToken = getCookie("clientToken");
  const whereRedirect = searchParams.get('redirect')
  const eventId = searchParams.get('eid')

  
  useEffect(() => {
    if (clientToken) {
      redirect('/my-data');
    }
  }, [tempToken, clientToken, router]);
  
  const {
    watch,
    register,
    handleSubmit,
    setValue
  } = useForm<ClientForm>();

  useEffect(() => {
    if (!isEmailOrWhatsapp) {
      setIsEmailOrWhatsapp("Email")
    }
  }, [isEmailOrWhatsapp, setIsEmailOrWhatsapp]);
  
  useEffect(() => {
    if (tempToken) {
      const decoded: { id: number; email: string, whatsapp: string; exp: number; iat: number } = jwtDecode(tempToken.toString());
      setClientAuthData({emailOrWhatsapp: isEmailOrWhatsapp === "Email" ? decoded.email : decoded.whatsapp})
      setValue("emailOrWhatsapp", isEmailOrWhatsapp === "Email" ? decoded.email : decoded.whatsapp)
    }
  }, [tempToken, isEmailOrWhatsapp, setValue]);
  
  const receiveInfo = watch("receiveInfo", false);

  const onSubmit = (data: ClientForm) => {
    if (!data.emailOrWhatsapp || !emailOrWhatsapp) (
      setClientAuthData({emailOrWhatsapp: data.emailOrWhatsapp})
    )

    if (whereRedirect === "transfer") {
      router.push('/otp?redirect=transfer&eid=' + eventId);
      return;
    }

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
          disabled={!!tempToken}
          title="Email*"
          type="email"
          inputName="emailOrWhatsapp"
          register={register("emailOrWhatsapp", { required: "El email es obligatorio"  })}
        />
        :
        <FormInput
          disabled={!!tempToken}
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
