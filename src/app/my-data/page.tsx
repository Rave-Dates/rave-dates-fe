"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { editClient, getClientById } from "@/services/clients-login";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export type ClientForm = {
  clientId: number;
  name: string;
  idCard: string;
  email: string;
  whatsapp: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function DataForm() {
  const { getCookie } = useReactiveCookiesNext();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const router = useRouter()
  const clientToken = getCookie("clientToken");
  const {
    register,
    handleSubmit,
    setValue
  } = useForm<ClientForm>();
  
  useEffect(() => {
    if (isHydrated && !clientToken) {
      router.replace("/");
    }
  }, [isHydrated, clientToken]);

  
  const { data: client } = useQuery<ClientForm>({
    queryKey: ["client", clientToken],
    queryFn: async () => {
      if (!clientToken) throw new Error("Token missing");
      const decoded: { id: number, email: string, whatsapp: string, iat: number, exp: number } = jwtDecode(clientToken.toString());
      return await getClientById({id: decoded.id, token: clientToken});
    },
    enabled: !!clientToken,
  });

  useEffect(() => {
    if (client) {
      setValue("name", client.name);
      setValue("email", client.email);
      setValue("whatsapp", client.whatsapp);
      setValue("idCard", client.idCard);
    }
  }, [client]);
  
  const { mutate, isPending } = useMutation({
    mutationFn: editClient,
    onSuccess: () => {
      notifySuccess("Datos editados correctamente");
      router.replace('/');
    },
    onError: () => {
      notifyError("Error al editar datos");
    },
  });
  
  const onSubmit = (data: ClientForm) => {
    if (!client) {
      notifyError("Datos no encontrados");
      return;
    }
    mutate({id: client.clientId, formData: data, token: clientToken});
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit, onInvalid)} title="Mis datos">
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

      <button
        type="submit"
        className="bg-primary text-black input-button"
        disabled={isPending}
      >
         {isPending ? "Cargando..." : "Editar"}
      </button>
    </DefaultForm>
  );
}
