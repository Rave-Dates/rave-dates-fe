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
      className="flex px-2 flex-col items-center justify-center"
    >
      <DownloadSvg className="w-5 h-5" />
      <h2>Descargar</h2>
    </button>
  );
};
