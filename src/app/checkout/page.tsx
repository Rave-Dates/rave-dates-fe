"use client";

import EventDetails from "@/components/containers/checkout/EventDetails";
import PaymentMethodSelector from "@/components/containers/checkout/PaymentMethodSelector";
import PaymentTypeSelector from "@/components/containers/checkout/PaymentTypeSelector";
import PricingDetails from "@/components/containers/checkout/PricingDetails";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { useReactiveCookiesNext } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { initTicketPurchase } from "@/services/clients-tickets";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTicketStore } from "@/store/useTicketStore";
import { jwtDecode } from "jwt-decode";
import { notifyError, notifyPending, notifySuccess } from "@/components/ui/toast-notifications";
import { getClientEventById } from "@/services/clients-events";

export default function Checkout() {
  const [selectedPayment, setSelectedPayment] = useState("Pago total");
  const [selectedMethod, setSelectedMethod] = useState<"Nequi" | "Bold">("Bold");
  const { selected, eventId } = useTicketStore();
  const [check, setCheck] = useState(false);
  const router = useRouter();

  const { getCookie } = useReactiveCookiesNext();
  const clientToken = getCookie("clientToken");
  const tempToken = getCookie("tempToken");

  // const searchParams = useSearchParams();
  // const transactionId = searchParams.get("transactionId");
  // const status = searchParams.get("status");

  useEffect(() => {
    if (!eventId) {
      notifyError("Por favor vuelva a seleccionar los tickets")
      router.replace('/')
    }
  }, [selectedMethod, eventId]);

  const { data: selectedEvent } = useQuery<IEvent>({
    queryKey: [`selectedEvent-${eventId}`],
    queryFn: () => getClientEventById(eventId),
    enabled: !!eventId,
  });
    
  const handleContinue = () => {
    if (!clientToken && !tempToken) return
    if (selectedMethod === "Nequi") {
      notifyError("Método no creado")
      return
    }
    const decoded: {id: number} | null = clientToken && jwtDecode(clientToken?.toString()) || null;
    const decodedTemp: {id: number} | null = tempToken && jwtDecode(tempToken?.toString()) || null;

    const formattedTicketData: IClientPurchaseTicket = {
      method: selectedMethod.toUpperCase() as "NEQUI" | "BOLD",
      eventId,
      tickets: Object.keys(selected).map((ticketTypeId) => ({
        quantity: selected[ticketTypeId].quantity,
        ticketTypeId: Number(ticketTypeId),
      })),
      isPartial: false,
      clientId: (decoded && decoded.id ) || (decodedTemp && decodedTemp.id) || 0,
      returnUrl: "https://ravedates.proxising.com/checkout",
      boldMethod: "CREDIT_CARD"
    };

    notifyPending(
      new Promise((resolve, reject) => {
        mutate({
            ticketData: formattedTicketData,
            clientToken: clientToken || tempToken
          }, {
          onSuccess: (data) => {
            resolve("");
            router.push(data)
          },
          onError: (err) => {
            reject(err);
          },
        });
      }),
      {
        loading: "Iniciando compra...",
        success: "Transacción iniciada correctamente",
        error: "Error al iniciar transacción",
      }
    );
  };

  const { mutate } = useMutation({
    mutationFn: initTicketPurchase,
    onSuccess: (data) => {
      notifySuccess("Transacción iniciada correctamente");
      router.push(data)
    },
    onError: (error) => {
      notifyError("Error al iniciar transacción");
      console.log(error)
    },
  });

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
          {selectedEvent && <EventDetails selectedEvent={selectedEvent} eventId={eventId} />}
          <PricingDetails />
          <button onClick={() => handleContinue()} className="w-full order-last bg-primary text-black font-medium py-3 rounded-lg text-lg">
            Continuar
          </button>
        </div>
      </div>
    </div>
  );
}
