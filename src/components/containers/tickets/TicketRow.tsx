"use client";

import DownloadSvg from "@/components/svg/DownloadSvg";
import EyeSvg from "@/components/svg/EyeSvg";
import SendSvg from "@/components/svg/SendSvg";
import DefaultTitledButton from "@/components/ui/buttons/DefaultTitledButton";
import { usePathname } from 'next/navigation';

interface TicketRowProps {
  purchaseTicketId: number;
  href: string;
  ticketType: string;
  onAction: (action: string, ticketType: string) => void;
}

export function TicketRow({
  purchaseTicketId,
  href,
  ticketType,
  onAction,
}: TicketRowProps) {
  const pathname = usePathname();

  const getActionIcon = (action: string) => {
    switch (action) {
      case "send":
        return <SendSvg />;
      case "download":
        return <DownloadSvg />;
      case "view":
        return <EyeSvg />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-cards-container rounded-lg p-4 gap-x-5 flex items-center justify-between">
      <div>
        <div className="font-medium text-sm mb-1">{ticketType}</div>
        <div className="text-sm">algo aca</div>
      </div>
      <div className="flex gap-2">
        {["send", "download", "view"].map((action) => (
          <DefaultTitledButton
            key={action}
            handleOnClick={() => onAction(action, ticketType)}
            className={action === "view" ? "block" : "hidden sm:block"}
            href={action === "view" ? `${pathname}/${href}/${purchaseTicketId}` : undefined}
          >
            {getActionIcon(action)}
            <h2 className="text-[10px]">
              {action === "download" && "Descargar"}
              {action === "send" && "Enviar"}
              {action === "view" && "Ver"}
            </h2>
          </DefaultTitledButton>
        ))}
      </div>
    </div>
  );
}
