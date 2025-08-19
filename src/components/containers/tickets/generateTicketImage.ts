import QRCode from "qrcode"

function wrapTextIfNeeded(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  // Medimos de nuevo para seguridad
  const textWidth = ctx.measureText(text).width;

  console.log(textWidth, maxWidth)

  // Si cabe, dibujamos en una línea
  if (textWidth <= maxWidth) {
    ctx.fillText(text, x, y);
    return y + lineHeight;
  }

  // Si no cabe, hacemos wrap palabra por palabra
  const words = text.split(" ");
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > maxWidth && line !== "") {
      ctx.fillText(line.trim(), x, y);
      line = words[i] + " ";
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, y);
  return y + lineHeight;
}

function drawTicketTextWithBackground(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  rectWidth: number,
  baseRectHeight: number, // altura mínima
  padding = 10,
  bgColor = "#050505",
  textColor = "#ff7a00"
) {
  ctx.textAlign = "center";
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = ctx.measureText(testLine).width;
    if (testWidth > rectWidth - padding * 2 && line !== "") {
      lines.push(line.trim());
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line.trim());

  const lineHeight = 45; // altura de línea
  const rectHeight = Math.max(baseRectHeight, lines.length * lineHeight + padding * 2);

  // dibujar fondo
  ctx.fillStyle = bgColor;
  ctx.fillRect(x - rectWidth / 2, y - 13, rectWidth, rectHeight);

  // dibujar texto
  ctx.fillStyle = textColor;
  const startY = y + (rectHeight - lines.length * lineHeight) / 2 + lineHeight / 2;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, startY + i * lineHeight);
  }

  return y + rectHeight + 20; // Y actualizado para el siguiente elemento
}

export const generateTicketImage = async ({
  bgImage,
  qrData,
  name,
  time,
  ticketType,
  eventImage,
  logoRD,
  fileName,
  mode = "download", // 👈 nuevo parámetro opcional
}: {
  bgImage: string
  qrData: string
  name: string
  time: string
  ticketType: string
  eventImage: string
  logoRD: string
  fileName: string
  mode?: "download" | "return"
}) => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const canvasWidth = 738
  const canvasHeight = 1600
  canvas.width = canvasWidth
  canvas.height = canvasHeight

  const font = new FontFace("InterCustom", "url(/fonts/Inter_28pt-Regular.ttf)");
  const fontTitle = new FontFace("GoodTimes", "url(/fonts/Good-Times-Rg.otf)");
  await Promise.all([font.load(), fontTitle.load()]);

  // 👇 Registrarlas en document.fonts, pero como tienen NOMBRE ÚNICO
  // no pisan a las globales
  document.fonts.add(font);
  document.fonts.add(fontTitle);

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })

  // ⚠️ Crear QR como DataURL
  const qrDataUrl = await QRCode.toDataURL(qrData)

  const [bg, qrImg, eventImg, logo] = await Promise.all([
    loadImage(bgImage),
    loadImage(qrDataUrl),
    loadImage(eventImage),
    loadImage(logoRD),
  ])

  // === Dibujar contenido ===
  ctx.drawImage(bg, 0, 0, canvasWidth, canvasHeight)
  ctx.fillStyle = "#fff"
  ctx.textAlign = "center"

  let y = 150
  ctx.font = "bold 48px GoodTimes";
  const maxWidthTitle = 600 - 40; // ticketWidth - padding
  y = wrapTextIfNeeded(ctx, name, canvasWidth / 2, y, maxWidthTitle, 55);

  ctx.font = "40px InterCustom"
  ctx.fillText(time, canvasWidth / 2, y)
  y += 80

  const qrSize = 400
  ctx.drawImage(qrImg, (canvasWidth - qrSize) / 2, y, qrSize, qrSize)
  y += qrSize + 40

  const ticketHeight = 60
  const ticketWidth = 600

  ctx.font = "bold 40px GoodTimes"
  y = drawTicketTextWithBackground(
    ctx,
    `Ticket: ${ticketType}`,
    canvasWidth / 2,
    y,
    ticketWidth,
    ticketHeight // altura mínima
  )

  const eventImgSize = 400
  const imgX = (canvasWidth - eventImgSize) / 2
  const radius = 40
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(imgX + radius, y)
  ctx.lineTo(imgX + eventImgSize - radius, y)
  ctx.quadraticCurveTo(imgX + eventImgSize, y, imgX + eventImgSize, y + radius)
  ctx.lineTo(imgX + eventImgSize, y + eventImgSize - radius)
  ctx.quadraticCurveTo(imgX + eventImgSize, y + eventImgSize, imgX + eventImgSize - radius, y + eventImgSize)
  ctx.lineTo(imgX + radius, y + eventImgSize)
  ctx.quadraticCurveTo(imgX, y + eventImgSize, imgX, y + eventImgSize - radius)
  ctx.lineTo(imgX, y + radius)
  ctx.quadraticCurveTo(imgX, y, imgX + radius, y)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(eventImg, imgX, y, eventImgSize, eventImgSize)
  ctx.restore()

  y += eventImgSize + 60

  const logoWidth = 140
  const logoHeight = (logo.height / logo.width) * logoWidth
  ctx.drawImage(logo, (canvasWidth - logoWidth) / 2, y, logoWidth, logoHeight)

  // === Dependiendo del modo ===
  if (mode === "download") {
    const link = document.createElement("a")
    link.download = fileName
    link.href = canvas.toDataURL("image/jpeg", 0.95)
    link.click()
  } else {
    // return canvas o dataURL para usarlo en otro lado
    return canvas.toDataURL("image/jpeg", 0.95)
  }
}
