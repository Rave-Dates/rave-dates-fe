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
import { useMutation } from "@tanstack/react-query";
import { useTicketStore } from "@/store/useTicketStore";
import { jwtDecode } from "jwt-decode";
import { notifyError, notifyPending, notifySuccess } from "@/components/ui/toast-notifications";
import { useClientEvent, useClientEventTickets, useClientGetById } from "@/hooks/client/queries/useClientData";
import PartialAmount from "@/components/containers/checkout/PartialAmount";
import { useForm } from "react-hook-form";

export default function Checkout() {
  const [selectedPayment, setSelectedPayment] = useState<"Pago total" | "Abonar a la alcancía">("Pago total");
  const [selectedMethod, setSelectedMethod] = useState<"Nequi" | "Bold">("Bold");
  const { selected, eventId } = useTicketStore();
  const { eventTickets } = useClientEventTickets(eventId);

  const [check, setCheck] = useState(false);
  const router = useRouter();
  
  const { register, watch, setValue } = useForm<{ partialAmount: number }>({
    defaultValues: { partialAmount: 0 }
  });

  const watchedPartialAmount = watch("partialAmount") || 0;

  const { getCookie } = useReactiveCookiesNext();
  const clientToken = getCookie("clientToken");
  const tempToken = getCookie("tempToken");

  const decoded: {id: number} | null = clientToken && jwtDecode(clientToken?.toString()) || null;
  const decodedTemp: {id: number} | null = tempToken && jwtDecode(tempToken?.toString()) || null;

  const { clientData } = useClientGetById({clientId: decoded?.id, clientToken});
  const { selectedEvent } = useClientEvent(eventId);

  const totalAmount = Object.entries(selected).reduce((acc, [ticketTypeIdStr, selectedData]) => {
    const ticketTypeId = Number(ticketTypeIdStr);
    const ticketInfo = eventTickets?.find(t => t.ticketTypeId === ticketTypeId);
    const price = selectedData.stage?.price || ticketInfo?.stages[0].price || 0;

    return acc + selectedData.quantity * price;
  }, 0);
  
  useEffect(() => {
    if (!eventId) {
      notifyError("Por favor vuelva a seleccionar los tickets")
      router.replace('/')
    }
  }, [selectedMethod, eventId]);


  let urlToReturn = ""

  if (tempToken && !clientToken) {
    urlToReturn = `https://ravedates.proxising.com/otp?redirect=transfer?eid=${eventId}`
  } else if (!tempToken && clientToken) {
    urlToReturn = `https://ravedates.proxising.com/transfer-confirm?eid=${eventId}`
  }

  const handleContinue = () => {
    if (!clientToken && !tempToken) return
    if (selectedMethod === "Nequi") {
      notifyError("Método no creado")
      return
    }

    const formattedTicketData: IClientPurchaseTicket = {
      method: selectedMethod.toUpperCase() as "NEQUI" | "BOLD",
      eventId,
      tickets: Object.keys(selected).map((ticketTypeId) => ({
        quantity: selected[ticketTypeId].quantity,
        ticketTypeId: Number(ticketTypeId),
      })),
      isPartial: selectedPayment === "Abonar a la alcancía",
      amount: selectedPayment === "Abonar a la alcancía" ? watchedPartialAmount : 0,
      clientId: (decoded && decoded.id ) || (decodedTemp && decodedTemp.id) || 0,
      returnUrl: urlToReturn,
      boldMethod: ["CREDIT_CARD", "PSE"],
      payWithBalance: check,
    };

    console.log(formattedTicketData)
    console.log("check",check)

    notifyPending(
      new Promise((resolve, reject) => {
        mutate({
            ticketData: formattedTicketData,
            clientToken: clientToken || tempToken
          }, {
          onSuccess: () => {
            resolve("");
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
      console.log("data", data);
      if (data === "PAY NOT NEEDED") {
        notifySuccess("No se necesita pagar")
        router.push(urlToReturn)
        return
      }
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
      <div className="w-full animate-fade-in pt-24 pb-36 sm:pt-32 lg:pt-32 lg:pb-20 sm:mx-20 lg:mx-20 xl:mx-64 grid lg:grid-cols-2 gap-x-4">
        {/* Left Side */}

        <div className="space-y-4 order-last lg:order-first">
          <PaymentTypeSelector selected={selectedPayment} setSelected={setSelectedPayment} />
          {
            selectedPayment === "Pago total" ?
            <PaymentMethodSelector
              selected={selectedMethod}
              setSelected={setSelectedMethod}
              check={check}
              setCheck={setCheck}
              clientData={clientData}
            /> :
            <PartialAmount 
              register={register}
              totalAmount={totalAmount}
              partialAmount={watchedPartialAmount}
            />
          }
        </div>

        {/* Right Side */}
        <div className="space-y-4 order-first">
          {selectedEvent && <EventDetails selectedEvent={selectedEvent} eventId={eventId} />}
          <PricingDetails 
            check={check} 
            clientData={clientData} 
            selectedPayment={selectedPayment} 
            partialAmount={watchedPartialAmount} 
            totalAmount={totalAmount}
          />
          <button onClick={() => handleContinue()} className="lg:block hidden w-full order-last bg-primary text-black font-medium py-3 rounded-lg text-lg">
            Continuar
          </button>
        </div>
        <button onClick={() => handleContinue()} className="lg:hidden block mt-5 w-full order-last bg-primary text-black font-medium py-3 rounded-lg text-lg">
          Continuar
        </button>
      </div>
    </div>
  );
}
