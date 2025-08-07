"use client"

import TicketButtons from "@/components/ui/buttons/TicketButtons";
import React, { useEffect, useState } from "react";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  getClientTicketTypesByEventId,
  getTicketsByPurchaseId,
} from "@/services/clients-tickets";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";
import { useTicketStore } from "@/store/useTicketStore";
import { useClientPurchasedTickets } from "@/hooks/client/queries/useClientData";

const ChangeTicketsView = () => {
  const { getCookie } = useReactiveCookiesNext();
  const { selected } = useTicketStore();
  const params = useParams();
  const clientToken = getCookie("clientToken");
  const decoded: { id: number } = (clientToken && jwtDecode(clientToken.toString())) || { id: 0 };
  const clientId = Number(decoded?.id);
  const eventId = Number(params.eventId);
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const { purchasedTickets } = useClientPurchasedTickets({clientId, clientToken: clientToken});

  const { data: ticketTypes } = useQuery({
    queryKey: ["ticketTypes"],
    queryFn: async () => {
      if (!clientToken) throw new Error("clientToken missing");
      return await getClientTicketTypesByEventId({ eventId, clientToken });
    },
    enabled: !!clientToken,
  });

  const purchaseIds = React.useMemo(() => {
    const ids = new Set<number>();
    purchasedTickets?.forEach((ticket) => {
      if (ticket.ticketType.eventId === eventId && (ticket.transferredClientId === null || ticket.transferredClientId === clientId)) {
        ids.add(ticket.purchaseId);
      }
    });
    return Array.from(ids).sort((a, b) => a - b);
  }, [purchasedTickets, eventId]);

  const oldTicketsQueries = useQueries({
    queries:
      purchaseIds.map((purchaseId) => ({
        queryKey: ["oldTickets", purchaseId],
        queryFn: async () => {
          const data = await getTicketsByPurchaseId({ pruchaseId: purchaseId, clientId, clientToken });
          return data.map((ticket) => ({ ...ticket, purchaseId }));
        },
        enabled: !!clientToken && !!clientId,
      })) ?? [],
  });


  const oldTickets = oldTicketsQueries
    .filter((query) => query.data)
    .flatMap((query) => query.data);

  console.log("oldTickets", oldTickets)
  console.log("purchaseIds", purchaseIds)
  console.log("purchasedTickets", purchasedTickets)


  useEffect(() => {
    if (purchaseIds.length > 0 && activeTab === null) {
      setActiveTab(purchaseIds[0]);
    }
  }, [purchaseIds, activeTab]);


  const handleConfirm = async () => {
    console.log(selected)
    console.log(oldTickets)
    // al checkout cuando el ticket nuevo es mas caro

    // se suma al balance cuando los tickets nuevos son mas baratos que los antiguos
  };

  const totalPrice = Object.values(selected).reduce(
    (acc, curr) => acc + curr.quantity * curr.stage.price,
    0
  );

  const totalQuantity = Object.values(selected).reduce(
    (acc, curr) => acc + curr.quantity,
    0
  );

  // const maxPurchase = oldTickets
  //   .filter((ticket) => ticket?.purchaseId === activeTab)
  //   .reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <div className="min-h-screen bg-primary-black flex sm:justify-center sm:items-center text-primary-white">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="w-full sm:h-full px-6 sm:pt-32 pt-28 pb-20 flex flex-col items-center justify-between sm:justify-center max-w-2xl relative animate-fade-in overflow-y-scroll">
        <div className="w-full pb-5">
          <h3 className="text-subtitle font-semibold mb-4">
            Entradas por compra
          </h3>

          <div className="flex space-x-2 overflow-x-auto mb-6">
            {
              purchaseIds?.map((purchaseId) => (
                <button
                  key={purchaseId}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === Number(purchaseId)
                      ? "bg-primary text-black"
                      : "bg-secondary text-white"
                  }`}
                  onClick={() => setActiveTab(Number(purchaseId))}
                >
                  Compra #{purchaseId}
                </button>
              ))}
          </div>

          <h1 className="mb-2">Tus entradas</h1>
          
          {activeTab !== null && (
            <div className="space-y-4 mb-10">
              {oldTickets
                ?.filter((ticket) => ticket?.purchaseId === activeTab)
                .map((ticket, index) => {                
                  if (!ticket) return;
                  const futureDate = new Date();
                  futureDate.setDate(futureDate.getDate() + 1);

                  const newTicket = {
                    name: ticket.ticketType,
                    ticketTypeId: index,
                    maxDate: futureDate.toISOString(),
                    stages: [
                      {
                        stageId: 1,
                        price: ticket.price,
                        quantity: ticket.quantity,
                        dateMax: futureDate.toISOString(),
                        date: futureDate.toISOString(),
                        promoterFee: 0,
                      },
                    ],
                  };
                  
                  return (
                    <TicketButtons
                      key={index}
                      totalQuantity={ticket.quantity}
                      ticket={newTicket}
                      overrideMaxTotalSelectable={ticket.quantity}
                      fixedQuantity={ticket.quantity} 
                    />
                  );
              })}
            </div>
          )}
          
          <h1 className="text-sm text-text-inactive mb-2">Tus nuevos tickets no pueden superar la cantidad de los antiguos.</h1>
          {activeTab !== null && (
            <div className="space-y-4">
              {ticketTypes?.map((ticket) => {
                return (
                  <TicketButtons
                    key={ticket.ticketTypeId}
                    totalQuantity={totalQuantity}
                    ticket={ticket}
                    // overrideMaxTotalSelectable={maxPurchase}
                  />
                );
              })}
            </div>
          )}

          <h1 className="sm:hidden block text-start w-full text-primary mt-6">
            Crédito disponible $1000 COP
          </h1>
        </div>

        <div className="w-full flex flex-col items-end mb-7 md:mb-0">
          <div className="w-full mb-3">
            <div className="flex justify-end items-center font-light tabular-nums">
              <span>${totalPrice ? totalPrice.toLocaleString() : "0"} COP</span>
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={
              !(
                activeTab &&
                purchaseIds &&
                totalPrice !== 0 
                // && totalQuantity === maxPurchase
              )
            }
            className="w-full text-center py-3 rounded-lg transition-colors text-black bg-primary hover:bg-primary/70 disabled:bg-primary/60 disabled:pointer-events-none"
          >
            Confirmar pedido
          </button>

          <h1 className="sm:block hidden text-start w-full text-primary mt-6">
            Crédito disponible $1000 COP
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ChangeTicketsView;
