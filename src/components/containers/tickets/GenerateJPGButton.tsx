"use client";
import { useState } from "react";
import DownloadSvg from "@/components/svg/DownloadSvg";
import SpinnerSvg from "@/components/svg/SpinnerSvg";
import { generateTicketImage } from "./generateTicketImage";

interface Props {
  bgImage: string;
  qrData: string;
  name: string;
  time: string;
  ticketType: string;
  eventImage: string;
  logoRD: string;
  purchaseTicketId: string | number;
  clientName: string;
}

export const GenerateJPGButton = ({
  bgImage,
  qrData,
  name,
  time,
  ticketType,
  eventImage,
  logoRD,
  purchaseTicketId,
  clientName,
}: Props) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      await generateTicketImage({
        bgImage,
        qrData,
        name,
        time,
        ticketType,
        eventImage,
        logoRD,
        purchaseTicketId,
        clientName,
        fileName: `ticket-${ticketType}.jpg`,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="bg-primary text-primary-white px-2 py-1 min-w-[65px] justify-items-center rounded-md flex flex-col items-center justify-center hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDownloading ? (
        <SpinnerSvg className="w-6 h-6 fill-primary-white" />
      ) : (
        <DownloadSvg className="w-6 h-6" />
      )}
      <h2 className="text-[10px]">{isDownloading ? "Descargando" : "Descargar"}</h2>
    </button>
  );
};
