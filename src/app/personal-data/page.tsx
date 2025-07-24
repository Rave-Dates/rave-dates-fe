"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import CheckFormInput from "@/components/ui/inputs/CheckFormInput";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { createClient } from "@/services/clients-login";
import { useClientAuthStore } from "@/store/useClientAuthStore";
import { useTicketStore } from "@/store/useTicketStore";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export type ClientForm = {
  name: string;
  idCard: string;
  email: string;
  whatsapp: string;
  receiveInfo?: boolean;
};

export default function DataForm() {
  const { setCookie, getCookie } = useReactiveCookiesNext();
  const { selected } = useTicketStore()
  const { setRedirectToCheckout } = useClientAuthStore()
  const router = useRouter()
  const tempToken = getCookie("tempToken");
  const clientToken = getCookie("clientToken");
  
  useEffect(() => {
    const withoutTickets = Object.keys(selected).length < 1
    if ((!tempToken || !clientToken) && withoutTickets) {
      notifyError("Debes seleccionar un ticket para continuar")
      router.push('/');
    } else if ((tempToken || clientToken) && !withoutTickets) {
      notifySuccess("Tenes cuenta y seleccionaste tickets");
      router.replace("/");
    } else if ((!tempToken || !clientToken) && !withoutTickets) {
      return
    }
  }, [selected, tempToken, clientToken]);
  
  const {
    watch,
    register,
    handleSubmit,
  } = useForm<ClientForm>();
  
  const receiveInfo = watch("receiveInfo", false);
  
  const { mutate, isPending } = useMutation({
    mutationFn: createClient,
    onSuccess: (data) => {
      const decoded: {id: number, email: string, iat: number, exp: number} = jwtDecode(data);
      const expirationDate = new Date(decoded.exp * 1000);
      
      setCookie("tempToken", data, {
        path: "/",
        expires: expirationDate,
        maxAge: decoded.exp - Math.floor(Date.now() / 1000),
      });

      notifySuccess("Logueado correctamente");
      router.push('/checkout');
    },
    onError: (error: { response: { data: { message: string } } }) => {
      if (error.response.data.message === "Client already exists") {
        notifyError(
          <span>
            El cliente ya existe, inicie sesión <Link onClick={() => setRedirectToCheckout(true)} href="/auth" className="underline decoration-primary underline-offset-2">AQUI</Link>.
          </span>
        );      
      } else {
        notifyError("Error al crear cliente.");
      }
    },
  });
  
  const onSubmit = (data: ClientForm) => {
    mutate({
      name: data.name,
      email: data.email,
      idCard: data.idCard,
      whatsapp: data.whatsapp,
    });
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit, onInvalid)} title="Ingresa tus datos">
      <FormInput
        title="Nombre y apellido*"
        inputName="name"
        register={register("name", { required: "El nombre es obligatorio"  })}
      />
      <FormInput
        type="number"
        title="Cédula o Pasaporte*"
        inputName="idCard"
        register={register("idCard", { required: "La cédula es obligatoria"  })}
      />
      <FormInput
        type="email"
        title="Email*"
        inputName="email"
        register={register("email", { required: "El email es obligatorio"  })}
      />
      <FormInput
        type="tel"
        title="Celular con WhatsApp*"
        inputName="whatsapp"
        register={register("whatsapp", { required: "El WhatsApp es obligatorio"  })}
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
        disabled={isPending}
      >
         {isPending ? "Cargando..." : "Continuar"}
      </button>
    </DefaultForm>
  );
}
