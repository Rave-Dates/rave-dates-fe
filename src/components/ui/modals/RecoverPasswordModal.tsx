"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import SpinnerSvg from "@/components/svg/SpinnerSvg";
import { notifyError, notifySuccess } from "../toast-notifications";
import { forgotPasswordAdmin, recoverPasswordAdmin } from "@/services/clients-login";
import AddSvg from "@/components/svg/AddSvg";

interface Props {
  trigger: React.ReactNode;
  defaultEmail?: string;
}

type VerificationForm = {
  email: string;
  code: [string, string, string, string];
  newPassword: string;
};

export default function RecoverPasswordModal({ trigger, defaultEmail = "" }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingValidate, setLoadingValidate] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm<VerificationForm>({
    defaultValues: {
      email: defaultEmail,
      code: ["", "", "", ""],
      newPassword: "",
    },
  });

  const code = watch("code");
  const isCodeComplete = code.every((d) => d !== "");

  useEffect(() => {
    if (defaultEmail) {
      setValue("email", defaultEmail);
    }
  }, [defaultEmail, setValue]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setValue("code", newCode as [string, string, string, string]);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").slice(0, 4).split("");
    const newCode = [...pasted, "", "", "", ""].slice(0, 4);
    setValue("code", newCode as [string, string, string, string]);
    const focusIndex = newCode.findIndex((d) => d === "") ?? 3;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSendCode = async (data: { email: string }) => {
    setLoadingSend(true);
    try {
      await forgotPasswordAdmin(data.email);
      notifySuccess("Código enviado a tu correo");
      setStep(2);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      notifyError(err.response?.data?.message || "Error al enviar el código");
    } finally {
      setLoadingSend(false);
    }
  };

  const handleRecover = async (data: VerificationForm) => {
    const pin = data.code.join("");
    setLoadingValidate(true);
    try {
      await recoverPasswordAdmin({
        email: data.email,
        pin,
        newPassword: data.newPassword,
      });
      notifySuccess("Contraseña recuperada exitosamente");
      setIsModalOpen(false);
      reset();
      setStep(1);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      notifyError(err.response?.data?.message || "Error al recuperar la contraseña");
    } finally {
      setLoadingValidate(false);
    }
  };

  const codeFieldNames = ["code.0", "code.1", "code.2", "code.3"] as const;

  return (
    <>
      <div onClick={() => setIsModalOpen(true)} className="cursor-pointer inline-block w-full">
        {trigger}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-main-container w-full max-w-md mx-4 rounded-2xl border border-divider shadow-2xl p-10 relative">
            <button
              onClick={() => {
                setIsModalOpen(false);
                reset();
                setStep(1);
              }}
              className="absolute top-6 right-6 text-neutral-400 hover:text-white"
            >
              <AddSvg className="w-7 h-7 rotate-45" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-white">Recuperar Contraseña</h2>
            
            {step === 1 ? (
              <div className="space-y-4">
                <p className="text-sm text-neutral-400 mb-4">Ingresa tu correo para recibir un código de recuperación.</p>
                <div>
                  <label className="text-sm text-neutral-300 block mb-1">Email <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    className="w-full bg-cards-container border border-divider/50 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                    {...register("email", { required: "Requerido" })}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit(handleSendCode)}
                  disabled={loadingSend}
                  className="w-full bg-primary text-white font-bold py-3 rounded-lg mt-6 flex justify-center items-center disabled:opacity-70 transition-opacity"
                >
                  {loadingSend ? <SpinnerSvg className="text-primary-white fill-inactive w-6" /> : "Enviar código"}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-center mt-6 mb-4">Ingresa el código de 4 dígitos</p>

                <div className="flex gap-3 justify-center mb-6">
                  {code.map((digit, index) => {
                    const name = codeFieldNames[index];
                    return (
                      <input
                        key={index}
                        {...register(name, {
                          required: "Requerido",
                          pattern: /^[0-9]$/,
                        })}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="number"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-14 h-16 sm:w-16 sm:h-20 bg-cards-container border border-divider/50 rounded-lg text-center text-2xl font-bold text-white focus:border-primary focus:outline-none"
                        value={digit}
                        onChange={(e) => handleInputChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                      />
                    );
                  })}
                </div>

                <div>
                  <label className="text-sm text-neutral-300 block mb-1">Nueva Contraseña</label>
                  <input
                    type="password"
                    className="w-full bg-cards-container border border-divider/50 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                    {...register("newPassword", { required: "Requerido", minLength: { value: 6, message: "Mínimo 6 caracteres" } })}
                  />
                  {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message as string}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit(handleRecover)}
                  disabled={!isCodeComplete || loadingValidate}
                  className="w-full bg-primary text-white font-bold py-3 rounded-lg mt-6 flex justify-center items-center disabled:opacity-70 transition-opacity"
                >
                  {loadingValidate ? <SpinnerSvg className="text-primary-white fill-inactive w-6" /> : "Recuperar Contraseña"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
