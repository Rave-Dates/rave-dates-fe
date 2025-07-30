"use client";

import { getCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { notifyError } from "@/components/ui/toast-notifications";

interface Props {
  emailOrWhatsapp?: string;
  loadingValidate?: boolean;
}

export default function TokenGuard({ emailOrWhatsapp, loadingValidate }: Props) {
  const router = useRouter();

  const tempToken = getCookie("tempToken");
  const clientToken = getCookie("clientToken");

  useEffect(() => {
    if (loadingValidate) return;
    const hasTemp = !!tempToken;
    const hasClient = !!clientToken;

    if (hasClient && !hasTemp && !emailOrWhatsapp) {
      notifyError("Solo tenés clientToken, redirigiendo a /my-data");
      router.push("/my-data");
    } else if (!hasTemp && !hasClient && !emailOrWhatsapp) {
      notifyError("No tenés token, redirigiendo a inicio");
      router.push("/");
    }
  }, [tempToken, clientToken, emailOrWhatsapp]);

  return null;
}
