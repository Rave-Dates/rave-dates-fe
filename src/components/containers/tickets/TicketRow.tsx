"use client";

import EyeSvg from "@/components/svg/EyeSvg";
import SendSvg from "@/components/svg/SendSvg";
import UserSvg from "@/components/svg/UserSvg";
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
  eventInfo: { date?: string, title?: string, piggyBank?: boolean };
  isTransferred?: boolean;
  isPendingToPay?: boolean;
  loggedInClientName?: string;
  className?: string;
}

export function TicketRow({
  href,
  ticket,
  eventInfo,
  isTransferred = false,
  isPendingToPay = false,
  loggedInClientName = "",
  className,
}: TicketRowProps) {
  const [showQR, setShowQR] = useState(false);
  const [showTransferredModal, setShowTransferredModal] = useState(false);

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
            bgImage: "/images/Fondo-RV.jpeg",
            fileName: "ticket.jpg",
            qrData: ticket.qr,
            name: eventInfo.title || "",
            time: `${formatDateToColombiaTime(eventInfo.date || "").formatted} ${formatDateToColombiaTime(eventInfo.date || "").time}hs`,
            ticketType: ticket.ticketType.name,
            eventImage: servedImageUrl ?? "/images/event-placeholder.png",
            logoRD: "/logo.svg",
            purchaseTicketId: ticket.purchaseTicketId,
            clientName: isTransferred ? (clientData?.name || "Cliente") : loggedInClientName,
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
      case "info":
        return <UserSvg className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const actions = isTransferred ? ["resend", "info"] : ["send", "download", "view"];

  return (
    <div className={`${className} bg-cards-container w-fit min-w-36 sm:w-full rounded-lg py-3 pb-4 sm:pb-3 px-4 gap-y-3 sm:gap-y-0 gap-x-5 flex flex-col sm:flex-row items-center justify-center sm:justify-between`}>
      <div className="flex flex-wrap items-center justify-center sm:justify-start font-medium gap-x-2 gap-y-1 sm:gap-y-0 text-center sm:text-left">
        <div>
          {ticket.ticketType.name}  
          <span className="text-[#bc5d5e] text-xs">
            {" "} #
          </span>
          <span className="text-sm font-thin text-primary-white/70">
            {isPendingToPay ? ticket.purchaseId : ticket.purchaseTicketId}
          </span>
        </div>
        {
          ticket.isTransferred && !isTransferred &&
          <div className="text-xs text-primary/70 mt-1 sm:mt-0 italic">
            Recibido
          </div>
        }
      </div>
      <div className="flex flex-row flex-wrap gap-2 items-center justify-center w-full sm:w-auto">
        {
          ticket.status === "READ" &&
          <div className="flex sm:h-[47px] items-center text-primary justify-center text-sm gap-x-2">
            <h2>Ticket usado</h2>
            <CheckSvg className="text-primary" />
          </div>
        }
        {
          ticket.status === "DEFEATED" &&
          <div className="flex sm:h-[47px] items-center text-primary justify-center text-sm gap-x-2">
            <h2>Ticket vencido</h2>
          </div>
        }
        {
          isPendingToPay &&
          <div className="flex sm:h-[47px] items-center text-primary justify-center text-sm gap-x-2">
            <h2>Ticket pendiente</h2>
          </div>
        }
        {ticket.status === "PENDING" && !isPendingToPay &&
          actions.map((action) => {
            if (action === "download") {
              return (
                <div key={action}>
                  <GenerateJPGButton
                    bgImage="/images/Fondo-RV.jpeg"
                    qrData={ticket.qr}
                    name={eventInfo.title || ""}
                    eventImage={servedImageUrl ?? "/images/event-placeholder.png"}
                    time={`${formatDateToColombiaTime(eventInfo.date || "").date}, ${formatDateToColombiaTime(eventInfo.date || "").time}hs`}
                    ticketType={ticket.ticketType.name}
                    logoRD="/logo.svg"
                    purchaseTicketId={ticket.purchaseTicketId}
                    clientName={loggedInClientName}
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
              return null;
            }

            if (action === "info") {
              if (isTransferred && clientData && clientData.firstLogin) {
                return (
                  <div key={action}>
                    <DefaultTitledButton
                      className="block"
                      handleOnClick={() => setShowTransferredModal(true)}
                    >
                      {getActionIcon(action)}
                      <h2 className="text-[10px]">Ver</h2>
                    </DefaultTitledButton>
                  </div>
                );
              }
              return null;
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
          className="fixed inset-0 bg-black/70 text-primary-white backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowQR(false)}
        >
          <div
            className="bg-cards-container mx-2 rounded-lg relative w-fit p-2 md:p-4 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-3xl font-bold z-10 bg-black/50 rounded-full p-1"
              onClick={() => setShowQR(false)}
              aria-label="Cerrar"
            >
              <AddSvg className="rotate-45 text-primary-white" />
            </button>

            <div className="rounded-lg overflow-y-auto max-h-[90vh] custom-scrollbar">
              {loading ? (
                <div className="flex flex-col h-[70vh] min-h-[400px] w-[80vw] max-w-[400px] items-center justify-center text-center mx-auto">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent mb-4"></div>
                  <p className="text-sm text-primary">Generando ticket...</p>
                </div>
              ) : (
                <img 
                  src={ticketCanvas} 
                  alt="Ticket" 
                  className="w-[calc(85vh*9/16)] min-w-[280px] sm:min-w-[320px] max-w-[85vw] md:max-w-[450px] lg:max-w-[500px] h-auto rounded-lg mx-auto block" 
                />
              )}
            </div>
          </div>
        </div>
      )}
      {showTransferredModal && clientData && (
        <div
          className="fixed inset-0 bg-black/70 text-primary-white backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowTransferredModal(false)}
        >
          <div
            className="bg-cards-container mx-4 rounded-lg relative w-full max-w-sm p-6 py-10 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-3xl font-bold z-10"
              onClick={() => setShowTransferredModal(false)}
              aria-label="Cerrar"
            >
              <AddSvg className="rotate-45 text-primary-white" />
            </button>

            <h2 className="text-xl text-center font-semibold mb-6 text-primary">Detalles de la transferencia</h2>
            
            <div className="w-full space-y-4">
              <div className="flex flex-col">
                <span className="text-xs text-primary-white/60">Nombre</span>
                <span className="text-lg font-medium">{clientData.name}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-primary-white/60">Correo Electrónico</span>
                <span className="text-lg font-medium">{clientData.email}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-xs text-primary-white/60">WhatsApp</span>
                <span className="text-lg font-medium">{clientData.whatsapp}</span>
              </div>

              {clientData.firstLogin && (
                <div className="pt-2">
                  <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                    Ticket ya reclamado
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowTransferredModal(false)}
              className="mt-8 w-full bg-primary text-primary-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
