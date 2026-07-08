"use client"

import React, { useEffect, useState } from "react";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { useQuery } from "@tanstack/react-query";
import {
  changeTicketPurchase,
  getClientTicketTypesByEventId,
} from "@/services/clients-tickets";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useParams, useRouter } from "next/navigation";
import { useTicketStore } from "@/store/useTicketStore";
import { useClientGetById, useClientPurchasedTickets } from "@/hooks/client/queries/useClientData";
import { useChangeTicketStore } from "@/store/useChangeTicketStore";
import ChangeTicketButtons from "@/components/ui/buttons/ChangeTicketButtons";
import { notifySuccess } from "@/components/ui/toast-notifications";

const ChangeTicketsView = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // cantidad de usuarios por página
  const { getCookie } = useReactiveCookiesNext();
  const { selected, resetSelected } = useTicketStore();
  const params = useParams();
  const router = useRouter();
  const clientToken = getCookie("clientToken");
  const decoded: { id: number } = (clientToken && jwtDecode(clientToken.toString())) || { id: 0 };
  const clientId = Number(decoded?.id);
  const eventId = parseInt(params.eventId as string, 10);
  const [activeTab, setActiveTab] = useState<number | null>(null);
  const { purchasedTickets } = useClientPurchasedTickets({clientId, clientToken: clientToken});
  const { clientData } = useClientGetById({clientId, clientToken: clientToken});

  const { 
    getTotalOldTickets, 
    oldTickets, 
    resetStore, 
    setOldQuantity, 
    setOldTicketsTotal, 
    resetOldTicketsTotal, 
    oldTicketsTotal, 
    setOldTicketsPriceTotal,
    setStorePurchaseId,
    resetOldTicketsPriceTotal,
    oldSubtracted,
    resetSubtracted
  } = useChangeTicketStore();
  const totalOldTickets = getTotalOldTickets();

  const { data: ticketTypes } = useQuery({
    queryKey: ["ticketTypes"],
    queryFn: async () => {
      if (!clientToken) throw new Error("clientToken missing");
      return await getClientTicketTypesByEventId({ eventId, clientToken });
    },
    enabled: !!clientToken,
  });

  // Guard: redirect back if there is only one ticket type (no upgrade options)
  useEffect(() => {
    if (ticketTypes === undefined) return; // still loading
    if (ticketTypes.length <= 1) {
      router.back();
    }
  }, [ticketTypes]);


  // Lista memorizada de IDs de compra que contienen tickets elegibles para mejora
  const purchaseIds = React.useMemo(() => {
    const ids = new Set<number>();
    purchasedTickets?.forEach((ticket) => {
      // Lógica para determinar si el ticket está actualmente en posesión del usuario
      const isMine =
        ((!ticket.isTransferred && ticket.purchase?.paymentStatus === "PAID") &&
          ticket.transferredClientId === null) ||
        ticket.transferredClientId === clientId;

      if (
        ticket.ticketType.eventId === eventId &&
        isMine &&
        !ticket.purchase?.meta?.changeTickets && // Excluye tickets que ya han sido mejorados
        ticket.status === "PENDING" // Solo los tickets pendientes (sin usar) pueden ser mejorados
      ) {
        ids.add(ticket.purchaseId);
      }
    });
    return Array.from(ids).sort((a, b) => a - b);
  }, [purchasedTickets, eventId, clientId]);

  // Agrupa los tickets poseídos por el usuario por tipo para la pestaña de compra activa
  const oldTicketsGrouped = React.useMemo(() => {
    if (!activeTab || !purchasedTickets) return [];

    const grouped: Record<
      number,
      { ticketType: string; ticketTypeId: number; price: number; quantity: number }
    > = {};

    purchasedTickets
      .filter((ticket) => {
        const isMine =
          ((!ticket.isTransferred && ticket.purchase?.paymentStatus === "PAID") &&
            ticket.transferredClientId === null) ||
          ticket.transferredClientId === clientId;
        return (
          ticket.ticketType.eventId === eventId &&
          ticket.purchaseId === activeTab &&
          isMine &&
          !ticket.purchase?.meta?.changeTickets &&
          ticket.status === "PENDING"
        );
      })
      .forEach((t) => {
        if (!grouped[t.ticketTypeId]) {
          grouped[t.ticketTypeId] = {
            ticketType: t.ticketType.name,
            ticketTypeId: t.ticketTypeId,
            price: Number(t.ticketType.stages[0].price),
            quantity: 0,
          };
        }
        grouped[t.ticketTypeId].quantity += 1;
      });

    return Object.values(grouped);
  }, [purchasedTickets, activeTab, eventId, clientId]);



  // Selecciona automáticamente la primera pestaña de compra al montar
  useEffect(() => {
    if (purchaseIds.length > 0 && activeTab === null) {
      setActiveTab(purchaseIds[0]);
      setStorePurchaseId(purchaseIds[0]);
    }
  }, [purchaseIds, activeTab]);

  // Sincroniza el estado local de los tickets antiguos con el store global cuando cambia la pestaña
  useEffect(() => {
    if (activeTab === null) return;

    oldTicketsGrouped.forEach((ticket) => {
      if (!oldTickets[ticket.ticketTypeId]) {
        setOldQuantity(ticket.ticketTypeId, ticket.quantity, ticket.price);
        setOldTicketsTotal(ticket.quantity);
        setOldTicketsPriceTotal(ticket.price * ticket.quantity);
      }
    });
  }, [oldTicketsGrouped, activeTab]);

  // Maneja la confirmación final de la mejora de tickets
  const handleConfirm = async () => {
    let totalNew = 0;
    let totalOld = 0;
    
    // Calcula el valor total de los nuevos tickets seleccionados
    for (const [key, value] of Object.entries(selected)) {
      totalNew += value.quantity * value.stage.price;
    }
    
    // Calcula el valor total de los tickets antiguos que están siendo reemplazados
    oldTicketsGrouped.forEach((ticket) => {
      totalOld += ticket.quantity * ticket.price;
    });

    
    if (!activeTab) return
    
    const formattedOldTickets = []
    
    // Construye el array de tickets antiguos para la API
    for (const [key, value] of Object.entries(oldTickets)) {
      if (value.actualQuantity === 0) continue;
      formattedOldTickets.push({
        ticketTypeId: Number(key),
        quantity: value.actualQuantity,
        price: value.price,
      });
    }
    
    const total = (totalPrice - totalSubtracted)

    // Si hay un saldo positivo a pagar, redirige al checkout
    if (total > 0) {
      setOldTicketsPriceTotal(totalOld);
      router.push("/checkout?change-tickets=true");
      return
    }

    const formattedNewTickets = []

    // Construye el array de nuevos tickets para la API
    for (const [key, value] of Object.entries(selected)) {
      formattedNewTickets.push({
        ticketTypeId: Number(key),
        quantity: value.quantity,
        price: value.stage.price,
      });
    }

    const res = await changeTicketPurchase({
      ticketData: {
        clientId,
        oldTickets: totalOldTickets > 0 ? formattedOldTickets : [],
        newTickets: formattedNewTickets,
        payWithBalance: false,
        eventId: eventId,
        method: "BOLD",
        boldMethod: ["CREDIT_CARD"],
        returnUrl: "",
      },
      purchaseId: activeTab,
      clientToken: clientToken,
    });

    if (decodeURIComponent(res) === "PAY NOT NEEDED") {
      notifySuccess("Cambio realizado correctamente");
      router.push("/tickets");
      return
    }
  };

  const totalPrice = Object.values(selected).reduce(
    (acc, curr) => acc + curr.quantity * curr.stage.price,
    0
  );

  const totalQuantity = Object.values(selected).reduce(
    (acc, curr) => acc + curr.quantity,
    0
  );

  const isUpgradingToSameType = React.useMemo(() => {
    return Object.entries(selected).some(([ticketTypeId, val]) => {
      const isGivingUp = oldSubtracted[Number(ticketTypeId)]?.currentSubtracted > 0;
      return val.quantity > 0 && isGivingUp;
    });
  }, [selected, oldSubtracted]);

  // Verifica si hay al menos un ticket disponible (con stock) al cual se pueda mejorar
  const hasAvailableTicketsToUpgrade = React.useMemo(() => {
    if (!ticketTypes || oldTicketsGrouped.length === 0) return true; 

    return ticketTypes.some((ticket) => {
      const isAlreadyOwned = oldTicketsGrouped.some(old => old.ticketTypeId === ticket.ticketTypeId);
      if (isAlreadyOwned) return false;

      return ticket.stages.some((stage) => {
        const now = Date.now();
        return new Date(stage.dateMax).getTime() > now && (stage.quantity ?? 0) > 0;
      });
    });
  }, [ticketTypes, oldTicketsGrouped]);

  // Verifica si la nueva selección es exactamente igual a los tickets originales
  const isSameAsOriginal = React.useMemo(() => {
    const selectedEntries = Object.entries(selected);
    if (selectedEntries.length !== oldTicketsGrouped.length) return false;

    return selectedEntries.every(([ticketTypeId, val]) => {
      const original = oldTicketsGrouped.find(
        (t) => t.ticketTypeId === Number(ticketTypeId)
      );
      return original && original.quantity === val.quantity;
    });
  }, [selected, oldTicketsGrouped]);

  const handleSetActiveTab = (purchaseId: number) => {
    if (purchaseId === activeTab) return;
    setStorePurchaseId(purchaseId);
    setActiveTab(purchaseId);
    resetStore();
    resetSelected();
    resetOldTicketsTotal();
    resetOldTicketsPriceTotal();
    resetSubtracted();
  }

  let totalSubtracted = 0;
  for (const [key, value] of Object.entries(oldSubtracted)) {
    totalSubtracted += value.currentSubtracted * value.price;
  }

  const handleReset = () => {
    resetStore();
    resetSelected();
    resetOldTicketsTotal();
    resetOldTicketsPriceTotal();
    resetSubtracted();
    
    // Re-populate old tickets for the current active tab
    if (activeTab !== null) {
      oldTicketsGrouped.forEach((ticket) => {
        setOldQuantity(ticket.ticketTypeId, ticket.quantity, ticket.price);
        setOldTicketsTotal(ticket.quantity);
        setOldTicketsPriceTotal(ticket.price * ticket.quantity);
      });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = purchaseIds?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = purchaseIds && Math.ceil(purchaseIds.length / itemsPerPage);

  const getTotalPrice = (totalSelectedPrice: number, totalSubstractedPrice: number) => {
    const total = (totalSelectedPrice - totalSubstractedPrice)
    if (total < 0) return (
      <div> 
        <span className="text-sm text-primary-white/50">Este monto se te acreditará en el balance </span>
        <span className="text-primary">+ </span>
        <span>${Math.abs(total).toLocaleString()} COP</span>
      </div>
    )
    return `$${total.toLocaleString()} COP`
  }

  return (
    <div className="min-h-screen bg-primary-black flex sm:justify-center sm:items-center text-primary-white">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="w-full sm:h-full px-6 sm:pt-32 pt-28 pb-20 flex flex-col items-center justify-between sm:justify-center max-w-2xl relative animate-fade-in overflow-y-scroll">
        <div className="w-full pb-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-subtitle font-semibold">
              Entradas por compra
            </h3>
            <button 
              onClick={handleReset}
              className="text-primary text-sm hover:underline"
            >
              Reiniciar
            </button>
          </div>

          <div className="flex justify-between gap-x-5 items-center mb-4">
            {totalPages && totalPages > 1 ? (
              <div className="flex justify-center items-center text-primary-white gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-1.5 text-sm rounded-lg bg-primary disabled:opacity-50 disabled:pointer-events-none"
                >
                  Anterior
                </button>
              </div>
              ) : null
            }
            <div className="flex space-x-2 overflow-x-auto">
              {
                currentItems?.map((purchaseId) => (
                  <button
                    key={purchaseId}
                    className={`px-4 py-2 rounded-lg tabular-nums text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === Number(purchaseId)
                        ? "bg-primary text-primary-white"
                        : "bg-secondary text-white"
                    }`}
                    onClick={() => handleSetActiveTab(Number(purchaseId))}
                  >
                    Compra #{purchaseId}
                  </button>
                ))}
            </div>
            {totalPages && totalPages > 1 ? (
              <div className="flex justify-center items-center text-primary-white gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-1.5 text-sm rounded-lg bg-primary disabled:opacity-50 disabled:pointer-events-none"
                >
                  Siguiente
                </button>
              </div>
              ) : null
            }
          </div>

          <h1 className="mb-1">Tus entradas</h1>
          <h1 className="mb-2 text-sm text-[#838383]">Elimina la cantidad de boletas que deseas mejorar</h1>
          
          {activeTab !== null && (
            <div className="space-y-4 mb-10">
              {oldTicketsGrouped.map((ticket, index) => {
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + 1);

                const newTicket = {
                  name: ticket.ticketType,
                  ticketTypeId: ticket.ticketTypeId,
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
                  <ChangeTicketButtons
                    key={index}
                    isOldTicket={true}
                    totalQuantity={totalQuantity}
                    ticket={newTicket}
                    fixedQuantity={ticket.quantity}
                  />
                );
              })}
            </div>
          )}
          
          <h1 className="text-sm text-[#838383] mb-2">Agrega la misma cantidad de tickets en la nueva localidad deseada</h1>
          {activeTab !== null && (
            <div className="space-y-4">
              {ticketTypes?.map((ticket) => {
                return (
                  <ChangeTicketButtons
                    key={ticket.ticketTypeId}
                    totalQuantity={totalQuantity}
                    ticket={ticket}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="w-full flex flex-col items-end mb-7 md:mb-0">
          <div className="w-full mb-3">
            <div className="flex justify-end items-center font-light tabular-nums">
              {/* <span>${(totalPrice - totalSubtracted).toLocaleString()} COP</span> */}
              <span>{getTotalPrice(totalPrice, totalSubtracted)}</span>
            </div>
          </div>

          {hasAvailableTicketsToUpgrade ? (
            <>
              <button
                onClick={handleConfirm}
                disabled={
                  !(
                    activeTab &&
                    purchaseIds &&
                    totalPrice !== 0 &&
                    totalQuantity === oldTicketsTotal - totalOldTickets
                  ) || isSameAsOriginal || isUpgradingToSameType
                }
                className="w-full text-center py-3 rounded-lg transition-colors text-primary-white bg-primary hover:bg-primary/70 disabled:bg-primary/60 disabled:pointer-events-none"
              >
                Confirmar pedido
              </button>

              {isUpgradingToSameType && (
                <span className="text-primary text-sm text-center w-full mt-2">
                  No puedes cambiar un ticket por otro del mismo tipo.
                </span>
              )}
            </>
          ) : (
            <div className="w-full text-center py-3 rounded-lg text-primary-white bg-inactive">
              No hay tickets disponibles para mejorar
            </div>
          )}

          <h1 className="sm:block hidden text-start w-full text-primary mt-6">
            Crédito disponible ${clientData?.balance.toLocaleString()} COP
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ChangeTicketsView;
