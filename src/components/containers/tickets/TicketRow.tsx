"use client";

import EyeSvg from "@/components/svg/EyeSvg";
import SendSvg from "@/components/svg/SendSvg";
import DefaultTitledButton from "@/components/ui/buttons/DefaultTitledButton";
import { useParams, usePathname } from 'next/navigation';
import { useQuery } from "@tanstack/react-query";
import { getClientEventImagesById, getClientImageById } from "@/services/clients-events";
import { formatDateToColombiaTime } from "@/utils/formatDate";
import { GenerateJPGButton } from "./GenerateJPGButton";

interface TicketRowProps {
  href: string;
  ticket: IPurchaseTicket;
  eventInfo: { date: string, title: string };
  isTransferred?: boolean;
}

export function TicketRow({
  href,
  ticket,
  eventInfo,
  isTransferred = false,
}: TicketRowProps) {
  const pathname = usePathname();
  const params = useParams();
  const eventId = Number(params.eventId);

  const { data: eventImages } = useQuery<IEventImages[]>({
    queryKey: [`eventImages-${eventId}`],
    queryFn: async () => {
      const images = await getClientEventImagesById(eventId);
      return images
    },
    enabled: !!eventId,
  });

  const { data: servedImageUrl, isLoading: isImageLoading } = useQuery<string | null>({
    queryKey: [`servedImageUrl-${eventId}`],
    queryFn: async () => {
      if (!eventImages) return null;
      const blob = await getClientImageById(Number(eventImages[0].imageId));
      return URL.createObjectURL(blob);
    },
    enabled: !!eventImages,
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case "send":
        return <SendSvg className="w-6 h-6" />;
      case "download":
        return null;
      case "view":
        return <EyeSvg className="w-6 h-6" />;
      default:
        return null;
    }
  };

  const actions = isTransferred ? ["view"] : ["send", "download", "view"];

  return (
    <div className="bg-cards-container rounded-lg p-4 gap-x-5 flex items-center justify-between">
      <div className="flex items-center justify-center font-medium mb-1 gap-x-2">
        <div>{ticket.ticketType.name}</div>
      </div>
      <div className="flex gap-2">
        {actions.map((action) => (
          <div key={action}>
            {action === "download" ? 
              <GenerateJPGButton
                bgImage="/images/ticket-bg-ravedates.jpg"
                qrData={ticket.qr}
                name={eventInfo.title}
                eventImage={servedImageUrl ?? "/images/event-placeholder.png"}
                time={`${formatDateToColombiaTime(eventInfo.date).date}, ${formatDateToColombiaTime(eventInfo.date).time}hs`}
                ticketType={ticket.ticketType.name}
                logoRD="/logo.svg"
              />
              :
              <DefaultTitledButton
                className={`${action === "view" ? "block" : "hidden sm:block"} ${action === "download" ? "!p-0" : ""}`}
                href={action === "view" ? `${pathname}/${href}/${ticket.purchaseTicketId}` : undefined}
              >
                {getActionIcon(action)}
                <h2 className="text-[10px]">
                  {action === "send" && "Enviar"}
                  {action === "view" && "Ver"}
                </h2>
              </DefaultTitledButton>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
