"use client";

import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import AddSvg from "@/components/svg/AddSvg";
import CheckSvg from "@/components/svg/CheckSvg";
import SpinnerSvg from "../svg/SpinnerSvg";

import { translateError } from "@/utils/translateError";

export const notifySuccess = (message: string) => {
  toast(message, {
    className: "bg-primary-black",
    style: {
      backgroundColor: "#151515",
      color: "#FFFFFF",
      borderColor: "#b3ff0020"
    },
    duration: 2500,
    icon: <CheckSvg className="text-system-success text-xl" />,
  });
};

export const notifyError = (message: string | React.ReactNode, duration?: number) => {
  toast(message, {
    className: "bg-primary-black",
    style: {
      backgroundColor: "#151515",
      color: "#FFFFFF",
      borderColor: "#ff2e2e40"
    },
    duration: duration || 5000,
    icon: <AddSvg className="text-red-500 text-xl rotate-45" />,
  });
};

export const notifyPending = (promise: Promise<unknown>, options?: {  loading?: string, success?: string, error?: string }) => {
  toast.promise(promise, {
    loading: (
      <div className="flex items-center gap-2">
        <SpinnerSvg className="text-primary fill-inactive w-5" />
        {options?.loading || "Cargando..."}
      </div>
    ),
    success: () => (
      <div className="flex items-center gap-2">
        <CheckSvg className="text-system-success text-xl" />
        {options?.success || "Operación completada correctamente"}
      </div>
    ),
    error: (err: unknown) => {
      let rawMessage = "";

      if (typeof err === "string") {
        rawMessage = err;
      } else if (axios.isAxiosError(err)) {
        const dataMessage = (err as AxiosError<{ message: string | string[] }>).response?.data?.message;
        if (typeof dataMessage === "string") {
          rawMessage = dataMessage;
        } else if (Array.isArray(dataMessage)) {
          rawMessage = dataMessage.join(", ");
        } else {
          rawMessage = err.message;
        }
      } else if (err instanceof Error) {
        rawMessage = err.message;
      }

      const translated = translateError(rawMessage);
      
      // Si hay traducción → la mostramos.
      // Si no hay traducción pero sí hay mensaje del backend → lo mostramos tal cual.
      // Si no hay nada → usamos el fallback de options.error.
      const displayMessage = (rawMessage && translated !== rawMessage ? translated : rawMessage) || options?.error || "Ocurrió un error";

      return (
        <div className="flex items-center gap-2">
          <AddSvg className="text-primary text-xl rotate-45" />
          {displayMessage}
        </div>
      )
    },
    className: "bg-primary-black",
    style: {
      backgroundColor: "#151515",
      color: "#FFFFFF",
      borderColor: "#3B3B3B"
    },
    duration: 3500,
    icon: null,
  });
};