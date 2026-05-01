"use client";

import { notifyError } from "@/components/ui/toast-notifications";
import { exportClientsAsCSV } from "@/services/admin-users";
import { CookieValueTypes } from "cookies-next";

interface DownloadAttendeesCSVButtonProps {
  eventId: number;
  token: CookieValueTypes | string | undefined;
  className?: string;
  eventName?: string;
}

export default function DownloadAttendeesCSVButton({
  eventId,
  token,
  className = "bg-transparent border border-primary text-primary-white input-button",
  eventName,
}: DownloadAttendeesCSVButtonProps) {
  return (
    <button
      onClick={async () => {
        try {
          const csvData = await exportClientsAsCSV({ token, eventId });
          if (csvData) {
            const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            
            const fileName = eventName 
              ? `asistentes-${eventName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv` 
              : "asistentes.csv";
            
            link.setAttribute("download", fileName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            notifyError("No hay clientes para exportar.");
          }
        } catch (error) {
          notifyError("Error al exportar clientes.");
        }
      }}
      className={className}
    >
      Descargar asistentes
    </button>
  );
}
