"use client";

import { toast } from "sonner";
import AddSvg from "@/components/svg/AddSvg";
import CheckSvg from "@/components/svg/CheckSvg";
import SpinnerSvg from "../svg/SpinnerSvg";

export const notifySuccess = (message: string) => {
  toast(message, {
    className: "bg-primary-black",
    style: {
      backgroundColor: "#151515",
      color: "#FFFFFF",
      borderColor: "#b3ff0020"
    },
    duration: 2500,
    icon: <CheckSvg className="text-primary text-xl" />,
  });
};

export const notifyError = (message: string | React.ReactNode) => {
  toast(message, {
    className: "bg-primary-black",
    style: {
      backgroundColor: "#151515",
      color: "#FFFFFF",
      borderColor: "#ff2e2e40"
    },
    duration: 5000,
    icon: <AddSvg className="text-red-500 text-xl rotate-45" />,
  });
};

export const notifyPending = (promise: Promise<string>, options?: {  loading?: string, success?: string, error?: string }) => {
  toast.promise(promise, {
    loading: (
      <div className="flex items-center gap-2">
        <SpinnerSvg className="text-primary fill-inactive w-5" />
        {options?.loading || "Cargando..."}
      </div>
    ),
    success: () => (
      <div className="flex items-center gap-2">
        <CheckSvg className="text-primary text-xl" />
        {options?.success || "Operación completada correctamente"}
      </div>
    ),
    error: () => (
      <div className="flex items-center gap-2">
        <AddSvg className="text-system-error text-xl rotate-45" />
        {options?.error || "Ocurrió un error"}
      </div>
    ),
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