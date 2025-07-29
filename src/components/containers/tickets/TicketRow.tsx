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
  purchaseTicketId: number;
  href: string;
  ticketType: IPurchaseTicket["ticketType"];
  eventInfo: IEvent;
}

export function TicketRow({
  purchaseTicketId,
  href,
  ticketType,
  eventInfo,
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
        return <EyeSvg />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-cards-container rounded-lg p-4 gap-x-5 flex items-center justify-between">
      <div>
        <div className="font-medium mb-1">{ticketType.name}</div>
      </div>
      <div className="flex gap-2">
        {["send", "download", "view"].map((action) => (
          <DefaultTitledButton
            key={action}
            className={`${action === "view" ? "block" : "hidden sm:block"} ${action === "download" ? "!p-0" : ""}`}
            href={action === "view" ? `${pathname}/${href}/${purchaseTicketId}` : undefined}
          >
            {getActionIcon(action)}
            <h2 className="text-[10px]">
              {action === "download" && 
                <GenerateJPGButton
                  bgImage="/images/ticket-bg-ravedates.jpg"
                  qrUrl="/images/testQR.png"
                  name={eventInfo.title}
                  eventImage={servedImageUrl ?? "/images/event-placeholder.png"}
                  time={`${formatDateToColombiaTime(eventInfo.date).date}, ${formatDateToColombiaTime(eventInfo.date).time}hs`}
                  ticketType={ticketType.name}
                  logoRD="/logo.svg"
                />
              }
              {action === "send" && "Enviar"}
              {action === "view" && "Ver"}
            </h2>
          </DefaultTitledButton>
        ))}
      </div>
    </div>
  );
}
