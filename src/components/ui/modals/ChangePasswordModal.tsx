"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import SpinnerSvg from "@/components/svg/SpinnerSvg";
import { notifyError, notifySuccess } from "../toast-notifications";
import { changePasswordAdmin } from "@/services/clients-login";

interface Props {
  trigger: React.ReactNode;
  defaultEmail?: string;
}

export default function ChangePasswordModal({ trigger, defaultEmail = "" }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    defaultValues: {
      email: defaultEmail,
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });

  const onSubmit = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      notifyError("Las contraseñas no coinciden");
      return;
    }
    
    setIsLoading(true);
    try {
      await changePasswordAdmin({
        email: data.email,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      notifySuccess("Contraseña actualizada correctamente");
      setIsModalOpen(false);
      reset();
    } catch (err: any) {
      notifyError(err.response?.data?.message || "Error al cambiar la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div onClick={() => setIsModalOpen(true)} className="cursor-pointer inline-block w-full">
        {trigger}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-main-container w-full max-w-md mx-4 rounded-2xl border border-divider shadow-2xl p-10 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-2 text-white">Cambiar Contraseña</h2>
            
            <p className="mb-5 text-sm text-neutral-400">Si no recordas tu contraseña actual, haz click en el boton de “Recuperar contraseña”</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-neutral-300 block mb-1">Email <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  className="w-full bg-cards-container border border-divider/50 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                  {...register("email", { required: "Requerido" })}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
              </div>
              
              <div>
                <label className="text-sm text-neutral-300 block mb-1">Contraseña Actual <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  className="w-full bg-cards-container border border-divider/50 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                  {...register("oldPassword", { required: "Requerido" })}
                />
                {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message as string}</p>}
              </div>
              
              <div>
                <label className="text-sm text-neutral-300 block mb-1">Nueva Contraseña <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  className="w-full bg-cards-container border border-divider/50 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                  {...register("newPassword", { required: "Requerido", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
                />
                {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message as string}</p>}
              </div>

              <div>
                <label className="text-sm text-neutral-300 block mb-1">Confirmar Nueva Contraseña <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  className="w-full bg-cards-container border border-divider/50 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                  {...register("confirmPassword", { required: "Requerido" })}
                />
              </div>

              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg mt-12 flex justify-center items-center disabled:opacity-70 transition-opacity"
              >
                {isLoading ? <SpinnerSvg className="text-primary-white fill-inactive w-6" /> : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
