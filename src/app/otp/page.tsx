"use client"

import VerificationTypeSelector from "@/components/containers/otp/VerificationTypeSelector";
import SpinnerSvg from "@/components/svg/SpinnerSvg";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { notifyError } from "@/components/ui/toast-notifications";
import { useVerification } from "@/hooks/useVerification";
import { useClientAuthStore } from "@/store/useClientAuthStore";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TokenGuard from "./TokenGuard";

type VerificationForm = {
  emailOrWhatsapp: string;
  code: [string, string, string, string];
};

export default function Verification() {
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingValidate, setLoadingValidate] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<"Email" | "Whatsapp">("Email");

  const { getCookie, setCookie, deleteCookie } = useReactiveCookiesNext();
  const { sendCode, validateCode } = useVerification();
  const { emailOrWhatsapp, redirectToCheckout } = useClientAuthStore()
  const router = useRouter();
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    setValue,
  } = useForm<VerificationForm>({
    defaultValues: {
      emailOrWhatsapp: "",
      code: ["", "", "", ""],
    },
  });
  
  const code = watch("code");
  const tempToken = getCookie("tempToken");
  
  useEffect(() => {
    if (tempToken) {
      const decoded: { id: number; email: string, whatsapp: string; exp: number; iat: number } = jwtDecode(tempToken.toString());
      setValue("emailOrWhatsapp", decoded.email);
    } else if (emailOrWhatsapp) {
      setValue("emailOrWhatsapp", emailOrWhatsapp);
    }
  }, [tempToken, emailOrWhatsapp]);


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

  const handleSendCode = () => {
    const emailOrWhatsapp = getValues("emailOrWhatsapp");
    const method: "EMAIL" | "WHATSAPP" = selectedVerification === "Email" ? "EMAIL" : "WHATSAPP";
    setLoadingSend(true);

    console.log("objeto de send code",{emailOrWhatsapp, method})

    sendCode({email: emailOrWhatsapp, method})
      .catch((err) => {
        if (err.response.data.message === "Client not found") {
          notifyError("Cliente no registrado, verifique su email o WhatsApp");
          return
        }
      })
      .finally(() => {
        setLoadingSend(false);
      });
  };

  const onSubmit = (data: { code: string[]; emailOrWhatsapp: string }) => {
    const pin = data.code.join("");
    setLoadingValidate(true);

    validateCode(data.emailOrWhatsapp, pin)
      .then((propToken) => {
        const decoded: IUserLogin = jwtDecode(propToken);
        const expirationDate = new Date(decoded.exp * 1000);

        setCookie("clientToken", propToken, {
          path: "/",
          expires: expirationDate,
          maxAge: decoded.exp - Math.floor(Date.now() / 1000), // en segundos
        });
        
        deleteCookie("tempToken")
        if (redirectToCheckout) {
          router.replace("/checkout");
        } else {
          router.replace("/tickets");
        }
      })
      .catch((err) => {
        if (err.response.data.message === "Client not found") {
          notifyError("Cliente no registrado, verifique su email o WhatsApp");
          return
        }
      })
      .finally(() => {
        setLoadingValidate(false);
      });
  };

  const isCodeComplete = code.every((d) => d !== "");
  const codeFieldNames = ["code.0", "code.1", "code.2", "code.3"] as const;

  return (
    <>
    <TokenGuard emailOrWhatsapp={emailOrWhatsapp} />
    <div className="min-h-screen pb-40 pt-28 sm:pb-24 sm:pt-36 bg-primary-black text-white flex px-6">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3" />
      <div className="max-w-md mx-auto space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold">Valida tus datos</h1>

        <VerificationTypeSelector
          selected={selectedVerification}
          setSelected={setSelectedVerification}
        />

        <input
          className="sr-only"
          {...register("emailOrWhatsapp", { required: "El email o el WhatsApp es obligatorio" })}
        />

        <button
          type="button"
          onClick={handleSendCode}
          disabled={loadingSend}
          className={`${loadingSend ? "opacity-70 pointer-events-none" : "opacity-100 pointer-events-auto"} w-full bg-primary text-center flex items-center justify-center text-black py-3 rounded-lg transition-all`}
        >
          {
            loadingSend ? <i><SpinnerSvg className="text-primary fill-inactive w-6" /></i> : <p>Enviar código de validación</p>
          }
        </button>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
          <p className="text-sm">Ingresa el código de 4 dígitos</p>

          <div className="flex gap-3 justify-center">
            {code.map((digit, index) => {
              const name = codeFieldNames[index];
              return (
                <input
                key={index}
                {...register(name, {
                  required: "Requerido",
                  pattern: /^[0-9]$/,
                })}
                ref={(el) => { inputRefs.current[index] = el }}
                type="number"
                inputMode="numeric"
                maxLength={1}
                className="w-1/2 h-20 sm:h-28 bg-cards-container border border-cards-container rounded-lg text-center text-2xl font-bold text-white focus:border-primary focus:outline-none"
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
              />
              )
            })}
          </div>

          <button
            type="submit"
            disabled={!isCodeComplete || loadingValidate}
            className={`${loadingValidate ? "opacity-70 pointer-events-none" : "opacity-100 pointer-events-auto"} w-full bg-primary text-black py-3 rounded-lg font-medium disabled:pointer-events-none disabled:opacity-60`}
          >
            {
              loadingValidate ? <i><SpinnerSvg className="text-primary fill-inactive w-6" /></i> : <p>Continuar</p>
            }
          </button>

          <p className="text-xs text-neutral-400 text-center">
            Revisa tu correo (spam, promociones, etc.)
          </p>
        </form>
      </div>
    </div>
    </>
  );
}
