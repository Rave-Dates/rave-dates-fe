// components/BoldCheckoutProvider.tsx
import { useEffect, useState, useImperativeHandle, forwardRef } from "react";

type BoldCheckoutRef = {
  open: () => void;
};

type Props = {
  orderId: string;
  integritySignature: string;
  amount: number;
};

const BoldCheckoutProvider = forwardRef<BoldCheckoutRef, Props>(({ orderId, integritySignature, amount }, ref) => {
    const [checkout, setCheckout] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function onLoad() {
      if ((window as any).BoldCheckout) {
        const instance = new (window as any).BoldCheckout({
          currency: "COP",
          orderId,
          integritySignature,
          amount: amount.toString(),
          apiKey: process.env.NEXT_PUBLIC_BOLD_API_KEY || "",
          renderMode: "embedded",
        });

        setCheckout(instance);
      } else {
        window.addEventListener("boldCheckoutLoaded", onLoad);
      }
    }

    onLoad();

    return () => {
      window.removeEventListener("boldCheckoutLoaded", onLoad);
    };
  }, [orderId, integritySignature, amount]);

  // expone la instancia al padre usando ref
  useImperativeHandle(ref, () => ({
    open: () => {
      if (checkout) {
        checkout.open();
      } else {
        alert("El sistema de pagos aún no está listo, por favor intenta de nuevo.");
      }
    },
  }));

  return null; // no renderiza nada, sólo inicializa el checkout
});

export default BoldCheckoutProvider;
