"use client";

import EventDetails from "@/components/containers/checkout/EventDetails";
import PaymentMethodSelector from "@/components/containers/checkout/PaymentMethodSelector";
import PaymentTypeSelector from "@/components/containers/checkout/PaymentTypeSelector";
import PricingDetails from "@/components/containers/checkout/PricingDetails";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
// import { verifyBoldTransaction } from "@/services/clients-tickets";
// import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
// import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
// import BoldButton from "./BoldButton";
// import BoldPaymentButton from "./BoldButton";
import BoldCheckoutProvider from "./BoldButton";

export default function Checkout() {
  const [selectedPayment, setSelectedPayment] = useState("Pago total");
  const [selectedMethod, setSelectedMethod] = useState<"Nequi" | "Bold">("Nequi");
  const [check, setCheck] = useState(false);

  const { getCookie } = useReactiveCookiesNext();
  // const token = getCookie("clientToken");

  const searchParams = useSearchParams();
  // const transactionId = searchParams.get("transactionId");
  // const status = searchParams.get("status");

  const boldCheckoutRef = useRef<{ open: () => void }>(null);

  const handleContinue = () => {
    selectedMethod === "Bold" && boldCheckoutRef.current?.open(); // esto abre el checkout
    // redirect to otp
  };

  // const { mutate: verifyTransaction, isSuccess, isError, isPending } = useMutation({
  //   mutationFn: async () => {
  //     if (!transactionId) return
  //     const res = await verifyBoldTransaction(transactionId, token);
  //     if (!res.ok) throw new Error("No se pudo verificar");
  //     return res.json();
  //   },
  // });

  // useEffect(() => {
  //   if (transactionId && status === "approved") {
  //     verifyTransaction();
  //   }
  // }, [transactionId, status]);

  return (
    <div className="bg-primary-black flex items-center justify-center text-primary-white min-h-screen p-4">
      {
        selectedMethod === "Bold" &&
          <BoldCheckoutProvider
            ref={boldCheckoutRef}
            orderId="TEST-8"
            integritySignature="d8e71ae8a7b857b53fc454b13f42ab9c071e4b02789460a6b5516845057de65a"
            amount={25000}
          />
      }

      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="w-full animate-fade-in pt-24 pb-36 sm:pt-32 lg:pt-32 lg:pb-20 sm:mx-20 lg:mx-20 xl:mx-64 grid lg:grid-cols-2 gap-6">
        {/* Left Side */}

        <div className="space-y-4 order-last lg:order-first">
          <PaymentTypeSelector selected={selectedPayment} setSelected={setSelectedPayment} />
          <PaymentMethodSelector
            selected={selectedMethod}
            setSelected={setSelectedMethod}
            check={check}
            setCheck={setCheck}
          />
        </div>

        {/* Right Side */}
        <div className="space-y-4 order-first">
          <EventDetails />
          <PricingDetails />
          <button onClick={() => handleContinue()} className="w-full order-last bg-primary text-black font-medium py-3 rounded-lg text-lg">
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
