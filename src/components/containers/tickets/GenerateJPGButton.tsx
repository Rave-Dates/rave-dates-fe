"use client";
import DownloadSvg from "@/components/svg/DownloadSvg";
import { generateTicketImage } from "./generateTicketImage";

interface Props {
  bgImage: string;
  qrData: string;
  name: string;
  time: string;
  ticketType: string;
  eventImage: string;
  logoRD: string;
}

export const GenerateJPGButton = ({
  bgImage,
  qrData,
  name,
  time,
  ticketType,
  eventImage,
  logoRD,
}: Props) => {
  const handleDownload = async () => {
    await generateTicketImage({
      bgImage,
      qrData,
      name,
      time,
      ticketType,
      eventImage,
      logoRD,
      fileName: `ticket-${ticketType}.jpg`,
    });
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-primary text-black px-2 py-1 min-w-[65px] justify-items-center rounded-md flex flex-col items-center justify-center hover:opacity-80 transition-opacity"
    >
      <DownloadSvg className="w-6 h-6" />
      <h2 className="text-[10px]">Descargar</h2>
    </button>
  );
};
