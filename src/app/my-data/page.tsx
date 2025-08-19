"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { editClient, getClientById } from "@/services/clients-login";
import { useClientAuthStore } from "@/store/useClientAuthStore";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function DataForm() {
  const { getCookie, deleteCookie } = useReactiveCookiesNext();
  const { setClientAuthData, setIsEmailOrWhatsapp } = useClientAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const router = useRouter()
  const clientToken = getCookie("clientToken");
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch
  } = useForm<IClient>();

  const watchedEmail = watch("email");
  const watchedWhatsapp = watch("whatsapp");
  
  useEffect(() => {
    if (isHydrated && !clientToken) {
      router.replace("/");
    }
  }, [isHydrated, clientToken]);

  const { data: client } = useQuery<IClient>({
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
    },
    onError: () => {
      router.replace('/my-data');
      notifyError("Error al editar datos");
    },
  });
  
  const onSubmit = (data: IClient) => {
    if (!client) {
      notifyError("Datos no encontrados");
      return;
    }
    if (!client.clientId) return

    // hacemos una copia mutable
    const formattedData: Partial<IClient> = { ...data };

    // si el email no cambió => lo eliminamos
    if (data.email === client.email) {
      console.log("email igual")
      delete formattedData.email;
    }

    // si el whatsapp no cambió => lo eliminamos
    if (data.whatsapp === client.whatsapp) {
      delete formattedData.whatsapp;
    }

    mutate({id: client.clientId, formData: formattedData, token: clientToken});
    router.push('/');
  };

  const onEmailSubmit = (data: IClient) => {
    if (!client) {
      notifyError("Datos no encontrados");
      return;
    }

    if (!client.clientId) return

    setIsEmailOrWhatsapp("Email");
    setClientAuthData({emailOrWhatsapp: getValues("email")})

    // si el email cambió => lo cambiamos y redirigimos
    if (data.email !== client.email) {
      mutate({id: client.clientId, formData: { email: data.email }, token: clientToken});
      router.push('/otp');
      return
    }

    router.push('/otp');
    return
  };

  const onWhatsappSubmit = (data: IClient) => {
    if (!client) {
      notifyError("Datos no encontrados");
      return;
    }

    if (!client.clientId) return

    setIsEmailOrWhatsapp("Whatsapp");
    setClientAuthData({emailOrWhatsapp: getValues("whatsapp")})

    // si el email cambió => lo cambiamos y redirigimos
    if (data.whatsapp !== client.whatsapp) {
      mutate({id: client.clientId, formData: { whatsapp: data.whatsapp }, token: clientToken});
      router.push('/otp');
      return
    }

    router.push('/otp');
    return
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          deleteCookie("tempToken")
          deleteCookie("clientToken")
          router.push('/')
        }}
        className="border z-20 absolute w-36 top-10 md:top-32 right-5 lg:right-52 border-system-error text-system-error py-2.5 rounded-lg"
        disabled={isPending}
      >
         Cerrar sesión
      </button>
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
        <div className="flex gap-x-3">
          <FormInput
            type="email"
            title="Email*"
            inputName="email"
            className={`${!(client?.isEmailVerified && watchedEmail === client?.email) ? "border-b border-b-system-error/50 text-red-400" : "border-b border-b-primary/50 text-primary"}`}
            register={register("email", { required: "El email es obligatorio"  })}
          />
          <button
            disabled={client?.isEmailVerified && watchedEmail === client?.email}
            type="button"
            onClick={handleSubmit(onEmailSubmit, onInvalid)}
            className={`${!(client?.isEmailVerified && watchedEmail === client?.email) && "border-system-error text-red-400"} border min-w-[100px] text-sm border-primary text-primary py-2 rounded-lg h-[50px] self-end px-2 disabled:opacity-80 disabled:pointer-events-none`}
          >
            {
              client?.isEmailVerified && watchedEmail === client?.email ?
              "Verificado"
              :
              "Verificar"
            }
          </button>
        </div>
        <div className="flex gap-x-3">
          <FormInput
            type="tel"
            title="Celular con WhatsApp*"
            inputName="whatsapp"
            className={`${!(client?.isWhatsappVerified && watchedWhatsapp === client?.whatsapp) ? "border-b border-b-system-error/50 text-red-400" : "border-b border-b-primary/50 text-primary"}`}
            register={register("whatsapp", { required: "El WhatsApp es obligatorio"  })}
          />
          <button
            disabled={client?.isWhatsappVerified && watchedWhatsapp === client?.whatsapp}
            type="button"
            onClick={handleSubmit(onWhatsappSubmit, onInvalid)}
            className={`${!(client?.isWhatsappVerified && watchedWhatsapp === client?.whatsapp) && "border-system-error text-red-400"} border min-w-[100px] text-sm border-primary text-primary py-2 rounded-lg h-[50px] self-end px-2 disabled:opacity-80 disabled:pointer-events-none`}
          >
            {
              client?.isWhatsappVerified && watchedWhatsapp === client?.whatsapp ?
              "Verificado"
              :
              "Verificar"
            }
          </button>
        </div>

        <button
          type="submit"
          className="bg-primary mt-10 text-black input-button"
          disabled={isPending}
        >
          {isPending ? "Cargando..." : "Guardar cambios"}
        </button>
      </DefaultForm>
    </>
  );
}
