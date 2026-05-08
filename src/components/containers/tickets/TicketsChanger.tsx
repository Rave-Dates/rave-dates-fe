"use client";

import { useEffect, useState } from "react";
import { TicketRow } from "./TicketRow";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useReactiveCookiesNext } from "cookies-next";
import {
  getClientEventImagesById,
  getClientImageById,
} from "@/services/clients-events";
import { formatDateToColombiaTime } from "@/utils/formatDate";
import { generateTicketImage } from "./generateTicketImage";
import { useClientPurchasedTickets } from "@/hooks/client/queries/useClientData";
import { notifyError } from "@/components/ui/toast-notifications";
import { useTicketStore } from "@/store/useTicketStore";
import { useChangeTicketStore } from "@/store/useChangeTicketStore";

type Props = {
  eventInfo: { date: string; title: string };
};

interface PendingPurchases {
  tickets: IPurchaseTicket[];
  partialAmount: number;
  totalAmount: number;
  remainingAmount: number;
  purchaseId: number;
}

const ITEMS_PER_PAGE = 5;

export default function TicketsChanger({ eventInfo }: Props) {
  const { getCookie } = useReactiveCookiesNext();
  const pathname = usePathname();
  const token = getCookie("clientToken");
  const decoded: { id: number } =
    (token && jwtDecode(token.toString())) || { id: 0 };
  const clientId = Number(decoded?.id);
  const { purchasedTickets } = useClientPurchasedTickets({
    clientId,
    clientToken: token,
  });

  console.log("purchasedTickets", purchasedTickets)
  const { setEventId, setPendimPaymentAmount } = useTicketStore();
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.eventId);
  const { resetSelected } = useTicketStore();
  const {
    resetStore,
    resetOldTicketsTotal,
    resetOldTicketsPriceTotal,
    resetSubtracted,
  } = useChangeTicketStore();

  // Reinicia todos los stores de tickets al montar para asegurar un estado limpio al volver de los flujos de mejora
  useEffect(() => {
    resetStore();
    resetSelected();
    resetOldTicketsTotal();
    resetOldTicketsPriceTotal();
    resetSubtracted();
  }, []);

  // Estados de paginación para las diferentes categorías de tickets
  const [pageNonTransferred, setPageNonTransferred] = useState(1);
  const [pageTransferred, setPageTransferred] = useState(1);
  const [pagePending, setPagePending] = useState(1);

  // Filtro: Tickets que han sido transferidos A otra persona
  const transferredTickets = purchasedTickets?.filter(
    (ticket) =>
      ticket.isTransferred &&
      ticket.transferredClientId !== null &&
      ticket.transferredClientId !== clientId &&
      ticket.purchase.paymentStatus !== "PARTIAL" &&
      ticket.ticketType.eventId === eventId
  );

  // Filtro: Tickets que actualmente posee el usuario (originales o recibidos por transferencia)
  const nonTransferredTickets = purchasedTickets?.filter(
    (ticket) =>
      ((!ticket.isTransferred && ticket.purchase?.paymentStatus === "PAID") &&
        ticket.transferredClientId === null ||
        ticket.transferredClientId === clientId) &&
      ticket.ticketType.eventId === eventId
  );

  // Filtro: Tickets de compras con pagos pendientes (PiggyBank/Parcial)
  const pendingTickets = purchasedTickets
    ?.map((t) => t)
    .filter((t) => t.purchase?.paymentStatus === "PARTIAL" && t.ticketType.eventId === eventId);

  // Agrupa los tickets pendientes por ID de compra para mostrar los montos restantes totales
  const groupedPendingPurchases: {
    [purchaseId: number]: {
      tickets: IPurchaseTicket[];
      partialAmount: number;
      totalAmount: number;
      remainingAmount: number;
    };
  } = {};

  pendingTickets?.forEach((ticket) => {
    const purchaseId = ticket.purchase.purchaseId;
    if (!groupedPendingPurchases[purchaseId]) {
      const partialAmount = ticket.purchase.partialAmount ?? 0;
      const totalAmount = ticket.purchase.totalAmount;
      groupedPendingPurchases[purchaseId] = {
        tickets: [],
        partialAmount,
        totalAmount,
        remainingAmount: totalAmount - partialAmount,
      };
    }
    groupedPendingPurchases[purchaseId].tickets.push(ticket);
  });

  const pendingPurchases = Object.entries(groupedPendingPurchases).map(
    ([purchaseId, data]) => ({
      purchaseId: Number(purchaseId),
      ...data,
    })
  );

  if (pendingTickets?.length === 0 && nonTransferredTickets?.length === 0 && transferredTickets?.length === 0) {
    notifyError("No se encontraron tickets")
    router.replace("/")
    return
  }

  // Navega al checkout para completar un pago parcial (Piggy Bank)
  const handleCompletePiggyBank = async (purchase: PendingPurchases) => {
    setEventId(eventId);
    setPendimPaymentAmount(purchase.remainingAmount)
    router.push(`/checkout?pp=${purchase.purchaseId}`)
  };

  // Genera y descarga imágenes para todos los tickets válidos (excluyendo tickets ya usados/READ)
  const handleDownloadAll = async () => {
    const downloadableTickets = nonTransferredTickets?.filter(
      (ticket) => ticket.status !== "READ"
    );

    if (!downloadableTickets?.length) return;

    for (const [i, ticket] of downloadableTickets.entries()) {
      const eventId = ticket.ticketType.eventId;
      const images = await getClientEventImagesById(eventId);
      const blob = await getClientImageById(Number(images[0].imageId));
      const servedImageUrl = URL.createObjectURL(blob);

      if (!eventInfo) return;
      await generateTicketImage({
        bgImage: "/images/Fondo-RV.jpeg",
        qrData: ticket.qr,
        name: eventInfo.title,
        time: `${formatDateToColombiaTime(eventInfo.date).date}, ${
          formatDateToColombiaTime(eventInfo.date).time
        }hs`,
        purchaseTicketId: ticket.purchaseTicketId,
        ticketType: ticket.ticketType.name,
        eventImage: servedImageUrl,
        logoRD: "/logo.svg",
        fileName: `ticket-${ticket.ticketType.name}-${i + 1}.jpg`,
      });
    }
  };

  // Helpers de paginación
  const paginate = <T,>(items: T[] | undefined, page: number) =>
    items?.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const renderPagination = (
    total: number,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center tabular-nums gap-2 mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 border border-primary/80 rounded disabled:opacity-50 disabled:pointer-events-none"
        >
          Anterior
        </button>
        <span>
          {page} de {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 border border-primary/80 rounded disabled:opacity-50 disabled:pointer-events-none"
        >
          Siguiente
        </button>
      </div>
    );
  };

  console.log(nonTransferredTickets)

  return (
    <div className="w-full mb-6">
      <div className="space-y-6">
        {/* My Tickets Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Mis tickets</h2>
              <button
                onClick={handleDownloadAll}
                className="text-primary text-sm hover:underline"
              >
                Descargar todos
              </button>
            </div>
          <div className="space-y-3">
            {paginate(nonTransferredTickets, pageNonTransferred)?.map(
              (ticket) => (
                <TicketRow
                  ticket={ticket}
                  eventInfo={eventInfo}
                  href="transfer"
                  key={ticket.purchaseTicketId}
                />
              )
            )}
            {nonTransferredTickets?.length === 0 && (
              <div className="text-center pb-4 text-neutral-400">
                No se encontraron tickets
              </div>
            )}
          </div>
          {nonTransferredTickets &&
            renderPagination(
              nonTransferredTickets.length,
              pageNonTransferred,
              setPageNonTransferred
            )}
        </div>

        {/* Transferred Tickets Section */}
        <div>
          {transferredTickets?.length !== 0 && (
            <h2 className="text-lg font-medium mb-4">Tickets transferidos</h2>
          )}
          <div className="space-y-3">
            {paginate(transferredTickets, pageTransferred)?.map((ticket) => (
              <TicketRow
                isTransferred={true}
                ticket={ticket}
                eventInfo={eventInfo}
                href="transferred"
                key={ticket.purchaseTicketId}
              />
            ))}
          </div>
          {transferredTickets &&
            renderPagination(
              transferredTickets.length,
              pageTransferred,
              setPageTransferred
            )}
        </div>

        {/* Pending Tickets Section */}
        {pendingTickets?.length && pendingTickets?.length > 0 ? (
          <div>
            <h2 className="text-lg font-medium mb-4">Tickets pendientes</h2>
            <div className="space-y-3">
              {paginate(pendingTickets, pagePending)?.map((ticket) => (
                <TicketRow
                  ticket={ticket}
                  eventInfo={eventInfo}
                  href="transferred"
                  key={ticket.purchaseTicketId}
                  isPendingToPay={true}
                />
              ))}
            </div>
            {renderPagination(
              pendingTickets.length,
              pagePending,
              setPagePending
            )}
          </div>
        ) : null}

        {/* Change Tickets Button */}
        {pendingTickets?.length && pendingTickets?.length > 0 ? (
          <>
            <h2 className="text-lg font-medium mb-4">Saldo pendiente</h2>
            <div className="bg-cards-container rounded-lg p-4 mb-3 gap-x-5 text-sm flex items-center justify-between">
              Tienes hasta el {formatDateToColombiaTime(eventInfo.date).date}{" "}
              para pagar el saldo pendiente
            </div>
            <>
              {pendingPurchases?.map((purchase) => (
                <button
                  key={purchase.purchaseId}
                  onClick={() => handleCompletePiggyBank(purchase)}
                  className="block text-center w-full text-red-400 border border-primary font-medium py-3 rounded-lg mb-3 hover:opacity-80 transition-opacity"
                >
                  Completar pago de compra N°{purchase.purchaseId} ($
                  {purchase.remainingAmount.toLocaleString()} COP)
                </button>
              ))}
            </>
          </>
        ) : null}
        <Link
          href={`${pathname}/change-tickets`}
          className="block text-center w-full bg-primary text-primary-white font-medium py-3 rounded-lg mb-3 mt-10 hover:opacity-80 transition-opacity"
        >
          Mejorar tickets
        </Link>
      </div>
    </div>
  );
}
