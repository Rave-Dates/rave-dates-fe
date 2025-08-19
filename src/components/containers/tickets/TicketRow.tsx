"use client";

import EyeSvg from "@/components/svg/EyeSvg";
import SendSvg from "@/components/svg/SendSvg";
import DefaultTitledButton from "@/components/ui/buttons/DefaultTitledButton";
import { useParams, usePathname } from 'next/navigation';
import { formatDateToColombiaTime } from "@/utils/formatDate";
import { GenerateJPGButton } from "./GenerateJPGButton";
import CheckSvg from "@/components/svg/CheckSvg";
import { useReactiveCookiesNext } from "cookies-next";
import { useEffect, useState } from "react";
import AddSvg from "@/components/svg/AddSvg";
import { useClientEventServedOneImage, useClientGetById } from "@/hooks/client/queries/useClientData";
import { generateTicketImage } from "./generateTicketImage";

interface TicketRowProps {
  href: string;
  ticket: IPurchaseTicket;
  eventInfo: { date: string, title: string };
  isTransferred?: boolean;
  isPendingToPay?: boolean;
}

export function TicketRow({
  href,
  ticket,
  eventInfo,
  isTransferred = false,
  isPendingToPay = false,
}: TicketRowProps) {
  const [showQR, setShowQR] = useState(false);

  const { getCookie } = useReactiveCookiesNext();
  const pathname = usePathname();
  const params = useParams();
  const eventId = Number(params.eventId);
  const clientToken = getCookie("clientToken");
  const { servedImageUrl } = useClientEventServedOneImage(eventId);
  const { clientData } = useClientGetById({clientId: ticket.transferredClientId, clientToken});

  const [ticketCanvas, setTicketCanvas] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showQR) {
      (async () => {
        try {
          setLoading(true); // empieza el loading
          const dataUrl = await generateTicketImage({
            bgImage: "/images/ticket-bg-ravedates.jpg",
            fileName: "ticket.jpg",
            qrData: ticket.qr,
            name: eventInfo.title,
            time: `${formatDateToColombiaTime(eventInfo.date).formatted} ${formatDateToColombiaTime(eventInfo.date).time}hs`,
            ticketType: ticket.ticketType.name,
            eventImage: servedImageUrl ?? "/images/event-placeholder.png",
            logoRD: "/logo.svg",
            mode: "return",
          });
          setTicketCanvas(dataUrl);
        } finally {
          setLoading(false); // termina el loading
        }
      })();
    }
  }, [showQR]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "send":
        return <SendSvg className="w-6 h-6" />;
      case "download":
        return null;
      case "view":
        return <EyeSvg className="w-6 h-6" />;
      case "resend":
        return <SendSvg className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const actions = isTransferred ? ["resend"] : ["send", "download", "view"];

  return (
    <div className="bg-cards-container flex-wrap rounded-lg py-3 px-4 gap-x-2 sm:gap-x-5 flex items-center justify-between">
      <div className="flex flex-wrap items-center justify-start font-medium mb-1 gap-x-2">
        <div>{ticket.ticketType.name}</div>
        {
          ticket.isTransferred && !isTransferred &&
          <div className="text-xs text-primary/70 mt-1 italic">
            Recibido
          </div>
        }
      </div>
      <div className="flex gap-2">
        {
          ticket.status === "READ" &&
          <div className="flex h-[47px] items-center text-primary justify-center text-sm gap-x-2">
            <h2>Ticket usado</h2>
            <CheckSvg className="text-primary" />
          </div>
        }
        {
          ticket.status === "DEFEATED" &&
          <div className="flex h-[47px] items-center text-system-error justify-center text-sm gap-x-2">
            <h2>Ticket vencido</h2>
          </div>
        }
        {
          isPendingToPay &&
          <div className="flex h-[47px] items-center text-system-error justify-center text-sm gap-x-2">
            <h2>Ticket pendiente</h2>
          </div>
        }
        {ticket.status === "PENDING" && !isPendingToPay &&
          actions.map((action) => {
            if (action === "download") {
              return (
                <div key={action}>
                  <GenerateJPGButton
                    bgImage="/images/ticket-bg-ravedates.jpg"
                    qrData={ticket.qr}
                    name={eventInfo.title}
                    eventImage={servedImageUrl ?? "/images/event-placeholder.png"}
                    time={`${formatDateToColombiaTime(eventInfo.date).date}, ${formatDateToColombiaTime(eventInfo.date).time}hs`}
                    ticketType={ticket.ticketType.name}
                    logoRD="/logo.svg"
                  />
                </div>
              );
            }

            if (action === "view") {
              return (
                <div key={action}>
                  {isTransferred && clientData?.firstLogin ? (
                    <div className="text-xs text-primary/80 italic">
                      Ticket ya leído por el destinatario
                    </div>
                  ) : (
                    <DefaultTitledButton handleOnClick={() => setShowQR((prev) => !prev)} className="block">
                      {getActionIcon(action)}
                      <h2 className="text-[10px]">Ver</h2>
                    </DefaultTitledButton>
                  )}
                </div>
              );
            }

            if (action === "resend") {
              if (isTransferred && clientData && !clientData.firstLogin) {
                return (
                  <div key={action}>
                    <DefaultTitledButton
                      className="block"
                      href={`${pathname}/${href}/${ticket.purchaseTicketId}`}
                    >
                      {getActionIcon(action)}
                      <h2 className="text-[10px]">Reenviar</h2>
                    </DefaultTitledButton>
                  </div>
                );
              }
              return (
                <div key={action} className="text-xs py-3 px-4 text-primary/80 italic">
                  Ticket ya leído por el destinatario
                </div>
                );
            }

            // default: "send"
            if (action === "send") {
              if (ticket.isTransferred) return null;
              return (
                <div key={action}>
                  <DefaultTitledButton
                    href={`${pathname}/${href}/${ticket.purchaseTicketId}`}
                  >
                    {getActionIcon(action)}
                    <h2 className="text-[10px]">Transferir</h2>
                  </DefaultTitledButton>
                </div>
              );
            }
          })}
      </div>
      {showQR && (
        <div
          className="fixed inset-0 bg-black/70 text-primary-black backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-cards-container mx-2 rounded-lg relative w-fit p-2 max-w-sm flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-3xl font-bold"
              onClick={() => setShowQR(false)}
              aria-label="Cerrar"
            >
              <AddSvg className="rotate-45 text-primary-white" />
            </button>

            <div className="max-w-80 overflow-y-scroll h-auto">
              {loading ? (
                <div className="flex flex-col h-[694px] w-80 items-center justify-center text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-4"></div>
                  <p className="text-sm text-primary">Generando ticket...</p>
                </div>
              ) : (
                <img src={ticketCanvas} alt="Ticket" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
