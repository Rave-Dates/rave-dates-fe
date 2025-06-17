"use client";

import DownloadSvg from "@/components/svg/DownloadSvg";
import EyeSvg from "@/components/svg/EyeSvg";
import SendSvg from "@/components/svg/SendSvg";
import DefaultTitledButton from "@/components/ui/buttons/DefaultTitledButton";
import { usePathname } from 'next/navigation';

interface TicketRowProps {
  ticketId: number;
  href: string;
  ticketType: string;
  userName: string;
  actions: ("send" | "download" | "view")[];
  onAction: (action: string, ticketType: string, userName: string) => void;
}

export function TicketRow({
  ticketId,
  href,
  ticketType,
  userName,
  actions,
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
        <div className="text-sm">{userName}</div>
      </div>
      <div className="flex gap-2">
        {actions.map((action) => (
          <DefaultTitledButton
            key={action}
            handleOnClick={() => onAction(action, ticketType, userName)}
            className={action === "view" ? "block" : "hidden sm:block"}
            href={action === "view" ? `${pathname}/${href}/${ticketId}` : undefined}
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
