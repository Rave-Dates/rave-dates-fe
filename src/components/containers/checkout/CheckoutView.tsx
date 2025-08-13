"use client";

import EventDetails from "@/components/containers/checkout/EventDetails";
import PaymentMethodSelector from "@/components/containers/checkout/PaymentMethodSelector";
import PaymentTypeSelector from "@/components/containers/checkout/PaymentTypeSelector";
import PricingDetails from "@/components/containers/checkout/PricingDetails";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { useReactiveCookiesNext } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { changeTicketPurchase, initTicketPurchase } from "@/services/clients-tickets";
import { useMutation } from "@tanstack/react-query";
import { useTicketStore } from "@/store/useTicketStore";
import { jwtDecode } from "jwt-decode";
import { notifyError, notifyPending, notifySuccess } from "@/components/ui/toast-notifications";
import { useClientEvent, useClientEventTickets, useClientGetById } from "@/hooks/client/queries/useClientData";
import PartialAmount from "@/components/containers/checkout/PartialAmount";
import { useForm } from "react-hook-form";
import { useChangeTicketStore } from "@/store/useChangeTicketStore";

export default function Checkout() {
  const [selectedPayment, setSelectedPayment] = useState<"Pago total" | "Abonar a la alcancía">("Pago total");
  const [selectedMethod, setSelectedMethod] = useState<"Nequi" | "Bold">("Bold");
  const [hasDiscountFlag, setHasDiscountFlag] = useState<boolean>(false);
  const { selected, eventId } = useTicketStore();
  const { eventTickets } = useClientEventTickets(eventId);
  const { 
    oldTickets,
    oldSubtracted,
    getTotalOldTickets,
    storePurchaseId
  } = useChangeTicketStore();
  const totalRestados = getTotalOldTickets()

  const [check, setCheck] = useState(false);
  const router = useRouter();
  
  const { register, watch } = useForm<{ partialAmount: number, discountCode: string }>({
    defaultValues: { partialAmount: 0, discountCode: "" }
  });

  const watchedPartialAmount = watch("partialAmount") || 0;
  const watchedDiscountCode = watch("discountCode") || "";

  const { getCookie } = useReactiveCookiesNext();
  const searchParams = useSearchParams();
  const isChangeTickets = searchParams.get("change-tickets");
  const promoterAffiliate = getCookie("promoterAffiliate");
  const clientToken = getCookie("clientToken");
  const tempToken = getCookie("tempToken");
  const isPromoter = getCookie("isPromoter");

  const decoded: {id: number} | null = clientToken && jwtDecode(clientToken?.toString()) || null;
  const decodedTemp: {id: number} | null = tempToken && jwtDecode(tempToken?.toString()) || null;
  const decodedPromoterAffiliate: {promoterId: number} | null = promoterAffiliate && jwtDecode(promoterAffiliate?.toString()) || null;

  const { clientData } = useClientGetById({clientId: decoded?.id, clientToken: clientToken});
  const { selectedEvent } = useClientEvent(eventId);

  if (selectedEvent?.type === "free") {
    router.push("/tickets")
  }

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

  const handleContinue = async () => {
    if (!clientToken && !tempToken) return

    if (isChangeTickets && decoded) {
      const formattedOldTickets = []
    
      for (const [key, value] of Object.entries(oldTickets)) {
        if (value.actualQuantity === 0) continue;
        formattedOldTickets.push({
          ticketTypeId: Number(key),
          quantity: value.actualQuantity,
          price: value.price,
        });
      }

      const formattedNewTickets = []

      for (const [key, value] of Object.entries(selected)) {
        console.log("oldTickets", oldTickets)
        console.log("oldSubtracted", oldSubtracted)
        formattedNewTickets.push({
          ticketTypeId: Number(key),
          quantity: value.quantity,
          price: value.stage.price,
        });
      }

      console.log("formattedOldTickets", formattedOldTickets)
      console.log("formattedNewTickets", formattedNewTickets)
    
      const data = await changeTicketPurchase({
        ticketData: {
          clientId: decoded.id,
          oldTickets: totalRestados > 0 ? formattedOldTickets : [],
          newTickets: formattedNewTickets,
          payWithBalance: check,
          eventId: eventId,
          method: "BOLD",
          boldMethod: selectedMethod.toUpperCase() === "BOLD" ? ["CREDIT_CARD"] : ["NEQUI"],
          returnUrl: "https://ravedates.proxising.com/tickets",
        },
        purchaseId: storePurchaseId ?? 0,
        clientToken: clientToken,
      });

      if (data === "PAY NOT NEEDED") {
        notifySuccess("No se necesita pagar")
        router.push("https://ravedates.proxising.com/tickets")
        return
      }
      router.push(data)
      return
    }

    const formattedTicketData: IClientPurchaseTicket = {
      method: "BOLD",
      eventId,
      tickets: Object.keys(selected).map((ticketTypeId) => ({
        quantity: selected[ticketTypeId].quantity,
        ticketTypeId: Number(ticketTypeId),
      })),
      promoterId: decodedPromoterAffiliate && decodedPromoterAffiliate.promoterId || undefined,
      isPartial: selectedPayment === "Abonar a la alcancía",
      amount: selectedPayment === "Abonar a la alcancía" ? watchedPartialAmount : 0,
      clientId: (decoded && decoded.id ) || (decodedTemp && decodedTemp.id) || 0,
      returnUrl: urlToReturn,
      boldMethod: selectedMethod.toUpperCase() === "BOLD" ? ["CREDIT_CARD"] : ["NEQUI"],
      payWithBalance: check,
      discountCode: watchedDiscountCode,
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
          <PaymentTypeSelector 
            havePiggyBank={selectedEvent?.piggyBank} 
            isPromoter={Boolean(isPromoter)} 
            selected={selectedPayment} 
            setSelected={setSelectedPayment} 
            isChangeTickets={isChangeTickets}
          />
          <PaymentMethodSelector
            selected={selectedMethod}
            setSelected={setSelectedMethod}
            check={check}
            setCheck={setCheck}
            clientData={clientData}
            isPromoter={Boolean(isPromoter)}
          /> 
          {
          selectedPayment === "Abonar a la alcancía" && selectedEvent && selectedEvent.piggyBank && !isChangeTickets &&
            <PartialAmount 
              eventPBComission={selectedEvent.feePB}
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
            register={register}
            eventDiscountCode={selectedEvent?.discountCode}
            eventDiscountAmount={selectedEvent?.discount}
            watchedDiscountCode={watchedDiscountCode}
            setHasDiscountFlag={setHasDiscountFlag}
            hasDiscountFlag={hasDiscountFlag}
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
