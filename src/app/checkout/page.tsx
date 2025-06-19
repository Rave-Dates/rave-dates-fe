"use client";

import EventDetails from "@/components/containers/checkout/EventDetails";
import PaymentMethodSelector from "@/components/containers/checkout/PaymentMethodSelector";
import PaymentTypeSelector from "@/components/containers/checkout/PaymentTypeSelector";
import PricingDetails from "@/components/containers/checkout/PricingDetails";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import Link from "next/link";
import { useState } from "react";

export default function Checkout() {
  const [selectedPayment, setSelectedPayment] = useState("Pago total");
  const [selectedMethod, setSelectedMethod] = useState("Nequi");
  const [check, setCheck] = useState(false);

  return (
    <div className="bg-primary-black flex items-center justify-center text-primary-white min-h-screen p-4">
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
          <Link href="/otp" className="w-full lg:block hidden text-center bg-primary text-black font-medium py-3 rounded-lg text-lg">
            Continuar
          </Link>
        </div>

        <Link href="/otp" className="w-full lg:hidden block text-center order-last bg-primary text-black font-medium py-3 rounded-lg text-lg">
          Continuar
        </Link>
      </div>
    </div>
  );
}
