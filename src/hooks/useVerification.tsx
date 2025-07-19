import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useReactiveCookiesNext } from "cookies-next";
import { notifyPending } from "@/components/ui/toast-notifications";
import { initLoginClient, verifyLoginClient } from "@/services/clients-login";

export function useVerification() {
  const router = useRouter();
  const { setCookie } = useReactiveCookiesNext();

  const sendCodeMutation = useMutation({
    mutationFn: ({email, method}: {email: string, method: "EMAIL" | "WHATSAPP"}) => initLoginClient({ email, method }),
  });

  const validateCodeMutation = useMutation({
    mutationFn: (payload: { email: string; pin: string }) => verifyLoginClient(payload),
  });

  // Función para enviar código que envuelve la mutación en notifyPending
  const sendCode = ({email, method}: {email: string, method: "EMAIL" | "WHATSAPP"}) => {
    const promise = sendCodeMutation.mutateAsync({email, method});
    notifyPending(promise, {
      loading: "Enviando código de validación...",
      success: "Código enviado correctamente",
      error: "Error al enviar el código",
    });
    return promise;
  };

  // Función para validar código que envuelve la mutación en notifyPending
  const validateCode = (email: string, pin: string) => {
    const promise = validateCodeMutation.mutateAsync({ email, pin }).then((data: string) => {
      // Guardar token y redirigir
      const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
      setCookie("clientToken", data, { path: "/", expires: expirationDate });
      router.push("/checkout");
      return data
    });
    notifyPending(promise, {
      loading: "Validando código...",
      success: "Código validado correctamente",
      error: "Código inválido o error al validar",
    });
    return promise;
  };

  return {
    sendCode,
    validateCode,
  };
}
