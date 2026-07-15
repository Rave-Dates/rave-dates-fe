"use client";

import EventDetails from "@/components/containers/checkout/EventDetails";
import PaymentMethodSelector from "@/components/containers/checkout/PaymentMethodSelector";
import PaymentTypeSelector from "@/components/containers/checkout/PaymentTypeSelector";
import PricingDetails from "@/components/containers/checkout/PricingDetails";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { useReactiveCookiesNext } from "cookies-next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { changeTicketPurchase, initTicketPurchase, partialPurchase, transferTickets } from "@/services/clients-tickets";
import { useMutation } from "@tanstack/react-query";
import { useTicketStore } from "@/store/useTicketStore";
import { useTransferStore } from "@/store/useTransferStore";
import { jwtDecode } from "jwt-decode";
import { notifyError, notifyPending, notifySuccess } from "@/components/ui/toast-notifications";
import { useClientEvent, useClientEventTickets, useClientGetById } from "@/hooks/client/queries/useClientData";
import PartialAmount from "@/components/containers/checkout/PartialAmount";
import { useForm } from "react-hook-form";
import { useChangeTicketStore } from "@/store/useChangeTicketStore";
import { useQuery } from "@tanstack/react-query";
import { getAdminConfig } from "@/services/admin-parameters";
import { initPromoterTicketPurchase } from "@/services/admin-payments";
import { useAdminUserById } from "@/hooks/admin/queries/useAdminData";

export default function Checkout() {
  const [selectedPayment, setSelectedPayment] = useState<"Pago total" | "Abrir alcancía">("Pago total");
  const [selectedMethod, setSelectedMethod] = useState<"Nequi" | "Bold" | "Ninguno">("Nequi");
  const [hasDiscountFlag, setHasDiscountFlag] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const isTransfer = searchParams.get("transfer");
  const { selected, eventId: ticketStoreEventId, promoterClientId, pendingPaymentAmount } = useTicketStore();
  const transferStoreEventId = useTransferStore((state) => state.eventId);
  const eventId = isTransfer ? (transferStoreEventId ?? 0) : ticketStoreEventId;
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
  const { register, watch, setValue } = useForm<{ partialAmount: number, discountCode: string }>({
    defaultValues: { partialAmount: 0, discountCode: "" }
  });

  const watchedPartialAmount = watch("partialAmount") || 0;
  const watchedDiscountCode = watch("discountCode") || "";

  const { getCookie, deleteCookie } = useReactiveCookiesNext();
  const isChangeTickets = searchParams.get("change-tickets");
  const pendingPaymentPurchaseId = searchParams.get("pp");
  const promoterAffiliate = getCookie("promoterAffiliate");
  const clientToken = getCookie("clientToken");
  const token = getCookie("token");
  const tempToken = getCookie("tempToken");
  const isPromoter = getCookie("isPromoter");

  const decoded: {id: number, promoterId: number} | null = clientToken && jwtDecode(clientToken?.toString()) || null;
  const decodedTemp: {id: number} | null = tempToken && jwtDecode(tempToken?.toString()) || null;
  const decodedPromoterAffiliate: {promoterId: number} | null = promoterAffiliate && jwtDecode(promoterAffiliate?.toString()) || null;
  const decodedToken: {id: number, promoterId: number} | null = token && jwtDecode(token.toString()) || null;

  const { data: promoterUser } = useAdminUserById({
    token: isPromoter ? token : undefined,
    userId: isPromoter && decodedToken ? decodedToken.id : undefined,
  });
  const promoterBalance = promoterUser?.promoter?.balance;

  const { clientData } = useClientGetById({clientId: decoded?.id, clientToken: clientToken});
  const { selectedEvent } = useClientEvent(eventId);

  console.log("EVENT ID : ", eventId)

  console.log("selectedevent", selectedEvent)

  const { data: adminConfig } = useQuery({
    queryKey: ["adminConfig"],
    queryFn: () => getAdminConfig({ token: clientToken || tempToken }),
    enabled: !!(clientToken || tempToken),
  });

  const effectiveFeePercentage = selectedEvent?.feeBoldPorcentage ?? adminConfig?.feeBoldPorcentage ?? 0;
  
  const effectiveBalance = isPromoter ? (promoterBalance ?? 0) : (clientData?.balance ?? 0);
  
  const totalAmount = searchParams.get("transfer") ? (selectedEvent?.transferCost || 0) : pendingPaymentPurchaseId ? pendingPaymentAmount : Object.entries(selected).reduce((acc, [ticketTypeIdStr, selectedData]) => {
    const ticketTypeId = Number(ticketTypeIdStr);
    const ticketInfo = eventTickets?.find(t => t.ticketTypeId === ticketTypeId);
    const price = selectedData.stage?.price || ticketInfo?.stages[0].price || 0;

    return acc + selectedData.quantity * price;
  }, 0);
  
  const actualDiscountValue = hasDiscountFlag ? totalAmount * ((selectedEvent?.discount || 0) / 100) : 0;
  const subtotalWithDiscount = totalAmount - actualDiscountValue;

  useEffect(() => {
    if (check && effectiveBalance && effectiveBalance >= subtotalWithDiscount) {
      if (selectedMethod !== "Ninguno") {
        setSelectedMethod("Ninguno");
      }
    } else if (selectedMethod === "Ninguno") {
      setSelectedMethod("Nequi");
    }
  }, [check, effectiveBalance, subtotalWithDiscount, selectedMethod]);

  const isBalanceSufficient = Boolean(check && effectiveBalance && effectiveBalance >= subtotalWithDiscount);

  if (selectedEvent?.type === "free") {
    router.push("/tickets")
  }
  
  useEffect(() => {
    if (!eventId) {
      notifyError("Por favor vuelva a seleccionar los tickets")
      router.replace('/')
    }
  }, [selectedMethod, eventId, router]);


  let urlToReturn = ""

  if (tempToken && !clientToken) {
    urlToReturn = `${process.env.NEXT_PUBLIC_ENVIRONMENT === "dev" ? process.env.NEXT_PUBLIC_FRONT_URL_DEV : process.env.NEXT_PUBLIC_FRONT_URL_PROD}/auth?redirect=transfer&eid=${eventId}`
  } else if (!tempToken && clientToken) {
    urlToReturn = `${process.env.NEXT_PUBLIC_ENVIRONMENT === "dev" ? process.env.NEXT_PUBLIC_FRONT_URL_DEV : process.env.NEXT_PUBLIC_FRONT_URL_PROD}/tickets`
  } else if (isPromoter) {
    urlToReturn = `${process.env.NEXT_PUBLIC_ENVIRONMENT === "dev" ? process.env.NEXT_PUBLIC_FRONT_URL_DEV : process.env.NEXT_PUBLIC_FRONT_URL_PROD}/promoter`
  } else {
    urlToReturn = `${process.env.NEXT_PUBLIC_ENVIRONMENT === "dev" ? process.env.NEXT_PUBLIC_FRONT_URL_DEV : process.env.NEXT_PUBLIC_FRONT_URL_PROD}/`
  }

  const handleContinue = async () => {

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
          method: selectedMethod ? selectedMethod === "Bold" ? "BOLD" : selectedMethod === "Nequi" ? "NEQUI" : "BOLD" : "BOLD",
          boldMethod: selectedMethod.toUpperCase() === "BOLD" ? ["CREDIT_CARD"] : ["NEQUI"],
          returnUrl: `${process.env.NEXT_PUBLIC_FRONT_URL_PROD}/tickets`,
        },
        purchaseId: storePurchaseId ?? 0,
        clientToken: clientToken,
      });

      if (data === "PAY NOT NEEDED") {
        notifySuccess("No se necesita pagar")
        router.push(`${process.env.NEXT_PUBLIC_FRONT_URL_PROD}/tickets`)
        return
      }
      router.push(data)
      return
    }

    if (pendingPaymentPurchaseId && (clientToken || tempToken)) {
      const ticketData = {
        method: selectedMethod ? selectedMethod === "Bold" ? "BOLD" : selectedMethod === "Nequi" ? "NEQUI" : "BOLD" : "BOLD",
        boldMethod: "CREDIT_CARD",
        returnUrl: `${process.env.NEXT_PUBLIC_FRONT_URL_PROD}/tickets/event-ticket/${eventId}`,
        ...(selectedPayment === "Abrir alcancía" ? { amount: watchedPartialAmount } : {}),
      };

      notifyPending(
        new Promise((resolve, reject) => {
          partialPurchase({ ticketData, clientToken: (clientToken || tempToken), purchaseId: Number(pendingPaymentPurchaseId) })
            .then((data) => {
              resolve(data);
              const decoded = typeof data === "string" ? decodeURIComponent(data) : data;
              if (decoded === "PAY NOT NEEDED") {
                router.push(`/tickets/event-ticket/${eventId}`);
              } else {
                router.push(data);
              }
            })
            .catch((err) => {
              reject(err);
            });
        }),
        {
          loading: "Iniciando pago...",
          success: "Redirigiendo al checkout",
          error: "Error al realizar el pago",
        }
      ); 
      return
    }

    const { transferData, purchaseTicketId: transferPurchaseTicketId } = useTransferStore.getState();

    if (isTransfer && transferData && transferPurchaseTicketId && (clientToken || tempToken)) {
      const dataToSubmit = {
        ...transferData,
        // boldMethod: selectedMethod.toUpperCase() === "BOLD" ? ["CREDIT_CARD"] : ["NEQUI"],
        boldMethod: "",
        method: selectedMethod ? selectedMethod === "Bold" ? "BOLD" : selectedMethod === "Nequi" ? "NEQUI" : "BOLD" : "BOLD",
        returnUrl: `${process.env.NEXT_PUBLIC_ENVIRONMENT === "dev" ? process.env.NEXT_PUBLIC_FRONT_URL_DEV : process.env.NEXT_PUBLIC_FRONT_URL_PROD}/tickets/event-ticket/${eventId}`,
      };

      notifyPending(
        new Promise((resolve, reject) => {
          transferTickets({ 
            ticketData: dataToSubmit, 
            purchaseTicketId: transferPurchaseTicketId, 
            clientToken: (clientToken || tempToken) 
          })
            .then((data) => {
              resolve(data);
              if (data && typeof data === 'string' && data.includes('http')) {
                router.push(data);
              } else {
                router.push(`${process.env.NEXT_PUBLIC_FRONT_URL_PROD}/tickets`);
              }
            })
            .catch((err: any) => {
              const errorMessage = err?.response?.data?.message || err?.response?.data || err.message || "Error desconocido";
              console.error("====== TRANSFER ERROR ======");
              console.error(errorMessage);
              console.error("Payload:", dataToSubmit);
              console.error("Full error:", err);
              reject(errorMessage);
            });
        }),
        {
          loading: "Procesando transferencia...",
          success: "Transferencia iniciada correctamente",
          error: "Error al procesar transferencia",
        }
      );
      return;
    }

    const formattedTicketData: IClientPurchaseTicket = {
      method: selectedMethod ? selectedMethod === "Bold" ? "BOLD" : selectedMethod === "Nequi" ? "NEQUI" : "BOLD" : "BOLD",
      eventId,
      tickets: Object.keys(selected).map((ticketTypeId) => ({
        quantity: selected[ticketTypeId].quantity,
        ticketTypeId: Number(ticketTypeId),
      })),
      promoterId: decodedPromoterAffiliate ? decodedPromoterAffiliate.promoterId : isPromoter ? decodedToken?.promoterId : promoterClientId ? decoded?.promoterId : undefined,
      isPartial: selectedPayment === "Abrir alcancía",
      amount: selectedPayment === "Abrir alcancía" ? watchedPartialAmount : 0,
      // If a promoter selected a client, use that client's ID; otherwise use the logged-in client's ID
      clientId: promoterClientId || (decoded && decoded.id) || (decodedTemp && decodedTemp.id) || 0,
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
            clientToken: clientToken || tempToken,
            token: isPromoter ? token : undefined,
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
    mutationFn: (args: { ticketData: IClientPurchaseTicket, clientToken: string | undefined, token?: string | undefined }) => {
      if (isPromoter) {
        return initPromoterTicketPurchase({
            ticketData: args.ticketData,
            token: args.token
          });
      }
      return initTicketPurchase(args);
    },
    onSuccess: (data) => {
      notifySuccess("Transacción iniciada correctamente");
      console.log("data", data);

      if (promoterAffiliate) {
        deleteCookie("promoterAffiliate", { path: "/" });
      }

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
            isTransfer={isTransfer}
            isPendingPayment={pendingPaymentPurchaseId}
          />
          <PaymentMethodSelector 
            selected={selectedMethod}
            setSelected={setSelectedMethod}
            check={check}
            setCheck={setCheck}
            clientData={clientData}
            isPromoter={Boolean(isPromoter)}
            promoterBalance={promoterBalance}
            isBalanceSufficient={isBalanceSufficient}
          /> 
          {
          selectedPayment === "Abrir alcancía" && selectedEvent && selectedEvent.piggyBank && !isChangeTickets &&
            <PartialAmount 
              eventPBComission={selectedEvent.feePB}
              register={register}
              setValue={setValue}
              totalAmount={totalAmount}
              partialAmount={watchedPartialAmount}
              hasDiscountFlag={hasDiscountFlag}
              watchedDiscountCode={selectedEvent?.discount}
              effectiveFeePercentage={effectiveFeePercentage}
              selectedMethod={selectedMethod}
              minPartialPercentage={selectedEvent?.minPartialPercentage}
              isPendingPayment={!!pendingPaymentPurchaseId}
            />
          }
            </div>

        {/* Right Side */}
        <div className="space-y-4 order-first">
          {selectedEvent && <EventDetails selectedEvent={selectedEvent} eventId={eventId} />}
          <PricingDetails 
            check={check} 
            clientData={clientData} 
            isPromoter={Boolean(isPromoter)}
            promoterBalance={promoterBalance}
            selectedPayment={selectedPayment} 
            partialAmount={watchedPartialAmount} 
            totalAmount={totalAmount}
            register={register}
            eventDiscountCode={selectedEvent?.discountCode}
            eventDiscountAmount={selectedEvent?.discount}
            watchedDiscountCode={watchedDiscountCode}
            setHasDiscountFlag={setHasDiscountFlag}
            hasDiscountFlag={hasDiscountFlag}
            effectiveFeePercentage={effectiveFeePercentage}
            selectedMethod={selectedMethod}
          />
          <button onClick={() => handleContinue()} className="lg:block hidden w-full order-last bg-primary text-primary-white font-medium py-3 rounded-lg text-lg">
            Continuar
          </button>
        </div>
        <button onClick={() => handleContinue()} className="lg:hidden block mt-5 w-full order-last bg-primary text-primary-white font-medium py-3 rounded-lg text-lg">
          Continuar
        </button>
      </div>
    </div>
  );
}
