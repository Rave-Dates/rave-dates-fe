"use client"

import { TicketRow } from "./TicketRow"
import Link from "next/link"
import { useParams, usePathname, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useReactiveCookiesNext } from "cookies-next";
import { getClientEventImagesById, getClientImageById } from "@/services/clients-events";
import { formatDateToColombiaTime } from "@/utils/formatDate";
import { generateTicketImage } from "./generateTicketImage";
import { useClientPurchasedTickets } from "@/hooks/client/queries/useClientData";
import { useTicketStore } from "@/store/useTicketStore";
import { partialPurchase } from "@/services/clients-tickets";
import { notifyPending } from "@/components/ui/toast-notifications";

type Props = {
  eventInfo: { date: string, title: string };
};

interface PendingPurchases {
  tickets: IPurchaseTicket[];
  partialAmount: number;
  totalAmount: number;
  remainingAmount: number;
  purchaseId: number;
}

export default function TicketsChanger({ eventInfo } : Props) {
  const { getCookie } = useReactiveCookiesNext();
  const pathname = usePathname();
  const token = getCookie("clientToken");
  const decoded: {id: number} = (token && jwtDecode(token.toString())) || {id: 0};
  const clientId = Number(decoded?.id);
  const { purchasedTickets } = useClientPurchasedTickets({clientId, clientToken: token});
  const { setEventId, setSelected } = useTicketStore();
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.eventId);

  const transferredTickets = purchasedTickets?.filter(ticket =>
    ticket.isTransferred &&
    ticket.transferredClientId !== null &&
    ticket.transferredClientId !== clientId &&
    ticket.purchase.paymentStatus !== "PARTIAL" &&
    ticket.ticketType.eventId === eventId
  );

  const nonTransferredTickets = purchasedTickets?.filter(ticket =>
    (
      !ticket.isTransferred ||
      ticket.transferredClientId === null ||
      ticket.purchase.paymentStatus !== "PARTIAL" ||
      ticket.transferredClientId === clientId
      
    ) &&
    ticket.ticketType.eventId === eventId
  );

  const pendingTickets = purchasedTickets?.map(t => t).filter(t => t.purchase.paymentStatus === "PARTIAL")

  const groupedPendingPurchases: {
    [purchaseId: number]: {
      tickets: IPurchaseTicket[];
      partialAmount: number;
      totalAmount: number;
      remainingAmount: number;
    }
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

  const totalPendingAmount = pendingPurchases.reduce(
    (sum, purchase) => sum + purchase.remainingAmount,
    0
  );

  const handleCompletePiggyBank = async (purchase: PendingPurchases) => {
    // const tickets: TicketStage[] = [];

    // purchase.tickets.map((ticket) => {
    //   tickets.push({
    //     ticketTypeId: ticket.ticketTypeId,
    //     price: purchase.remainingAmount / purchase.tickets.length,
    //     quantity: 1,
    //   });
    // })

    // console.log(purchase)
    // console.log("tickets", tickets)

    // setEventId(eventId);
    // setSelected(tickets);

    const purchaseId = purchase.purchaseId;
    const ticketData = {
      method: "BOLD",
      boldMethod: "CREDIT_CARD",
      returnUrl: "https://ravedates.proxising.com/tickets",
    };

    notifyPending( 
      new Promise((resolve, reject) => {
        partialPurchase({ ticketData, clientToken: token, purchaseId })
          .then((data) => {
            resolve(data);
            router.push(data)
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
    )
  };


  const handleDownloadAll = async () => {
    if (!nonTransferredTickets?.length) return;

    for (const [i, ticket] of nonTransferredTickets.entries()) {
      const eventId = ticket.ticketType.eventId;
      
      const images = await getClientEventImagesById(eventId);
      const blob = await getClientImageById(Number(images[0].imageId));
      const servedImageUrl = URL.createObjectURL(blob);

      if (!eventInfo) return
      await generateTicketImage({
        bgImage: "/images/ticket-bg-ravedates.jpg",
        qrData: ticket.qr, 
        name: eventInfo.title,
        time: `${formatDateToColombiaTime(eventInfo.date).date}, ${formatDateToColombiaTime(eventInfo.date).time}hs`,
        ticketType: ticket.ticketType.name,
        eventImage: servedImageUrl,
        logoRD: "/logo.svg",
        fileName: `ticket-${ticket.ticketType.name}-${i + 1}.jpg`,
      });
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="space-y-6">
        {/* My Tickets Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Mis tickets</h2>
            <button onClick={handleDownloadAll} className="text-primary text-sm hover:underline">
              Descargar todos
            </button>
          </div>
          <div className="space-y-3">
            {nonTransferredTickets?.map((ticket) => (
              <TicketRow
                ticket={ticket}
                eventInfo={eventInfo}
                href="transfer"
                key={ticket.purchaseTicketId}
              />
            ))}
            {
              nonTransferredTickets?.length === 0 &&
              <div className="text-center pb-4 text-neutral-400">
                No se encontraron tickets
              </div>
            }
          </div>
        </div>

        {/* Transferred Tickets Section */}
        <div>
          {
            transferredTickets?.length !== 0 &&
            <h2 className="text-lg font-medium mb-4">Tickets transferidos</h2>
          }
          <div className="space-y-3">
            {transferredTickets?.map((ticket) => (
              <TicketRow
                isTransferred={true}
                ticket={ticket}
                eventInfo={eventInfo}
                href="transferred"
                key={ticket.purchaseTicketId}
              />
            ))}
          </div>
        </div>

        {
          pendingTickets?.length && pendingTickets?.length > 0 ?
          <div>
            <h2 className="text-lg font-medium mb-4">Tickets pendientes</h2>
            <div className="space-y-3">
              {pendingTickets?.map((ticket) => (
                <TicketRow
                  ticket={ticket}
                  eventInfo={eventInfo}
                  href="transferred"
                  key={ticket.purchaseTicketId}
                />
              ))}
            </div>
          </div>
          :
          null
        }

        {/* Change Tickets Button */}
        {pendingTickets?.length && pendingTickets?.length > 0 ? (
          <>
            <h2 className="text-lg font-medium mb-4">
              Saldo pendiente
            </h2>
            <div className="bg-cards-container rounded-lg p-4 mb-3 gap-x-5 text-sm flex items-center justify-between">
              Tienes hasta el {formatDateToColombiaTime(eventInfo.date).date} para pagar el saldo pendiente
            </div>
            <>
              {
                pendingPurchases?.map((purchase) => (
                <button
                  key={purchase.purchaseId}
                  onClick={() => handleCompletePiggyBank(purchase)}
                  className="block text-center w-full text-red-400 border border-system-error font-medium py-3 rounded-lg mb-3 hover:opacity-80 transition-opacity"
                >
                  Completar pago de compra N°{purchase.purchaseId} (${purchase.remainingAmount.toLocaleString()} COP)
                </button>
                ))
              }
            </>
          </>
        )
        :
        null
      }
        <Link
          href={`${pathname}/change-tickets`}
          className="block text-center w-full bg-primary text-black font-medium py-3 rounded-lg mb-3 mt-14 hover:opacity-80 transition-opacity"
          >
          Cambiar tickets
        </Link>
      </div>
    </div>
  )
}
