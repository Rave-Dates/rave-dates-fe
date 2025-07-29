"use client";
import DownloadSvg from "@/components/svg/DownloadSvg";
import React from "react";

interface Props {
  bgImage: string;
  qrUrl: string;
  name: string;
  time: string;
  ticketType: string;
  eventImage: string;
  logoRD: string;
}

const canvasWidth = 738;
const canvasHeight = 1600;

export const GenerateJPGButton = ({
  bgImage,
  qrUrl,
  name,
  time,
  ticketType,
  eventImage,
  logoRD,
}: Props) => {
  const handleDownload = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Cargar tipografía personalizada
    const font = new FontFace("Inter", "url(/fonts/Inter_28pt-Regular.ttf)");
    await font.load();
    (document as any).fonts.add(font);
    ctx.font = "bold 40px Inter";

    const loadImage = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
      });

    const [bg, qr, eventImg, logo] = await Promise.all([
      loadImage(bgImage),
      loadImage(qrUrl),
      loadImage(eventImage),
      loadImage(logoRD),
    ]);

    // Dibujar fondo
    ctx.drawImage(bg, 0, 0, canvasWidth, canvasHeight);

    // Estilos generales
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";

    let y = 200;

    // Nombre
    ctx.font = "bold 48px Inter";
    ctx.fillText(name, canvasWidth / 2, y);
    y += 80;

    // Hora
    ctx.font = "30px Inter";
    ctx.fillText(time, canvasWidth / 2, y);
    y += 80;

    // QR
    const qrSize = 400;
    ctx.drawImage(qr, (canvasWidth - qrSize) / 2, y, qrSize, qrSize);
    y += qrSize + 40;

    // Ticket type con fondo negro (#050505) y texto naranja, más corto
    const ticketHeight = 50; // Reducido
    const ticketWidth = 400;
    const ticketX = (canvasWidth - ticketWidth) / 2;
    
    ctx.fillStyle = "#050505";
    ctx.fillRect(ticketX, y, ticketWidth, ticketHeight);

    ctx.fillStyle = "#ff7a00";
    ctx.font = "bold 28px Inter"; // Más grande también
    ctx.fillText(`Ticket: ${ticketType}`, canvasWidth / 2, y + 35); // Centrado verticalmente
    y += ticketHeight + 40;

    // Imagen del evento con bordes redondeados
    const eventImgSize = 400;
    const imgX = (canvasWidth - eventImgSize) / 2;
    const imgY = y;
    const radius = 40;

    // Dibuja imagen con bordes redondeados
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(imgX + radius, imgY);
    ctx.lineTo(imgX + eventImgSize - radius, imgY);
    ctx.quadraticCurveTo(imgX + eventImgSize, imgY, imgX + eventImgSize, imgY + radius);
    ctx.lineTo(imgX + eventImgSize, imgY + eventImgSize - radius);
    ctx.quadraticCurveTo(imgX + eventImgSize, imgY + eventImgSize, imgX + eventImgSize - radius, imgY + eventImgSize);
    ctx.lineTo(imgX + radius, imgY + eventImgSize);
    ctx.quadraticCurveTo(imgX, imgY + eventImgSize, imgX, imgY + eventImgSize - radius);
    ctx.lineTo(imgX, imgY + radius);
    ctx.quadraticCurveTo(imgX, imgY, imgX + radius, imgY);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(eventImg, imgX, imgY, eventImgSize, eventImgSize);
    ctx.restore();

    y += eventImgSize + 60;
    // Logo
    const logoWidth = 140;
    const logoHeight = (logo.height / logo.width) * logoWidth;
    ctx.drawImage(logo, (canvasWidth - logoWidth) / 2, y, logoWidth, logoHeight);

    // Descargar
    const link = document.createElement("a");
    link.download = `ticket-${ticketType}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  return (
    <button onClick={handleDownload} className="flex px-2 flex-col items-center justify-center">
      <DownloadSvg className="w-5 h-5" />
      <h2>Descargar</h2>
    </button>
  );
};
