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
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { editClient } from "@/services/clients-login";
import { notifyError, notifyPending } from "@/components/ui/toast-notifications";

type ClientForm = {
  emailOrWhatsapp: string;
  receiveInfo?: boolean;
};

export default function ClientAuthPage() {
  return (
    <Suspense>
      <ClientAuth />
    </Suspense>
  );
}

function ClientAuth() {
  const { getCookie } = useReactiveCookiesNext();
  const { setClientAuthData, setIsEmailOrWhatsapp, isEmailOrWhatsapp, emailOrWhatsapp } = useClientAuthStore()
  const searchParams = useSearchParams()
  const router = useRouter()
  const tempToken = getCookie("tempToken");
  const clientToken = getCookie("clientToken");
  const whereRedirect = searchParams.get('redirect')
  const eventId = searchParams.get('eid')

  const [isEditing, setIsEditing] = useState(false);
  const [originalValue, setOriginalValue] = useState("");

  
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
      const value = isEmailOrWhatsapp === "Email" ? decoded.email : decoded.whatsapp;
      setClientAuthData({emailOrWhatsapp: value})
      setValue("emailOrWhatsapp", value)
      setOriginalValue(value);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  }, [tempToken, isEmailOrWhatsapp, setValue, setClientAuthData]);
  
  const receiveInfo = watch("receiveInfo", false);
  const currentInput = watch("emailOrWhatsapp");

  const handleSaveEdit = async () => {
    if (!tempToken) return;
    const decoded: { id: number } = jwtDecode(tempToken.toString());
    const data = isEmailOrWhatsapp === "Email" ? { email: currentInput } : { whatsapp: currentInput };
    
    notifyPending(
      editClient({ id: decoded.id, formData: data, token: tempToken }).then(() => {
        setOriginalValue(currentInput);
        setIsEditing(false);
        setClientAuthData({ emailOrWhatsapp: currentInput });
      }).catch((error: any) => {
        if (error?.response?.status === 500) {
          throw new Error("Datos ya en uso u ocurrió un error");
        }
        throw error;
      }),
      { loading: "Guardando...", success: "Actualizado correctamente", error: "Error al actualizar" }
    );
  };

  const onSubmit = (data: ClientForm) => {
    if (tempToken && isEditing && data.emailOrWhatsapp !== originalValue) {
      notifyError("Debes guardar el cambio de tu contacto antes de continuar.");
      return;
    }

    setClientAuthData({emailOrWhatsapp: data.emailOrWhatsapp});

    if (whereRedirect === "transfer") {
      router.push('/otp?redirect=transfer&eid=' + eventId);
      return;
    }

    if (whereRedirect === "checkout") {
      router.push('/otp?redirect=checkout');
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

      <div className="w-full relative">
      {
        isEmailOrWhatsapp === "Email" ?
        <FormInput
          title="Email*"
          type="email"
          inputName="emailOrWhatsapp"
          disabled={!isEditing}
          register={register("emailOrWhatsapp", { required: "El email es obligatorio"  })}
        />
        :
        <FormInput
          title="WhatsApp*"
          type="tel"
          inputName="emailOrWhatsapp"
          disabled={!isEditing}
          register={register("emailOrWhatsapp", { required: "El WhatsApp es obligatorio"  })}
        />
      }
      {tempToken && (
        <div className="absolute right-2 bottom-2 flex items-center justify-end">
          {!isEditing ? (
            <button type="button" onClick={() => setIsEditing(true)} className="bg-primary/10 text-primary-white/80 px-3 py-2.5 text-xs rounded-md font-semibold hover:bg-primary/20 transition-colors">
              Editar
            </button>
          ) : (
            currentInput !== originalValue ? (
              <button type="button" onClick={handleSaveEdit} className="bg-primary text-primary-white px-3 py-2.5 text-xs rounded-md font-semibold hover:bg-primary/90 transition-colors">
                Guardar
              </button>
            ) : (
              <button type="button" onClick={() => setIsEditing(false)} className="bg-white/10 text-white/80 px-3 py-2.5 text-xs rounded-md font-semibold hover:bg-white/20 transition-colors">
                Cancelar
              </button>
            )
          )}
        </div>
      )}
      </div>

       <CheckFormInput
        name="receiveInfo"
        register={register("receiveInfo")}
        value={receiveInfo}
      />

      <button
        type="submit"
        className="bg-primary text-primary-white input-button"
      >
         Iniciar sesión
      </button>
    </DefaultForm>
  );
}
