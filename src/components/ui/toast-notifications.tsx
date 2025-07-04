// lib/notify.tsx
"use client";

import { toast } from "sonner";
import AddSvg from "@/components/svg/AddSvg";
import CheckSvg from "@/components/svg/CheckSvg";

export const notifySuccess = (message: string) => {
  toast(message, {
    className: "bg-primary-black",
    style: {
      backgroundColor: "#151515",
      color: "#FFFFFF",
      borderColor: "#b3ff0020"
    },
    duration: 5000,
    icon: <CheckSvg className="text-primary text-xl" />,
  });
};

export const notifyError = (message: string) => {
  toast(message, {
    className: "bg-primary-black",
    style: {
      backgroundColor: "#151515",
      color: "#FFFFFF",
      borderColor: "#ff2e2e40"
    },
    duration: 5000,
    icon: <AddSvg className="text-red-500 text-xl rotate-45" />, // mismo ícono pero en rojo
  });
};