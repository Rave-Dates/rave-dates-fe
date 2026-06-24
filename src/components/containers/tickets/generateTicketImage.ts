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
  purchaseTicketId,
  clientName,
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
  purchaseTicketId: string | number
  clientName: string
  fileName: string
  mode?: "download" | "return"
}) => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const canvasWidth = 900
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
  const bgRatio = bg.width / bg.height
  const canvasRatio = canvasWidth / canvasHeight
  let renderWidth = canvasWidth
  let renderHeight = canvasHeight
  let bgX = 0
  let bgY = 0

  if (bgRatio > canvasRatio) {
    renderHeight = canvasHeight
    renderWidth = bg.width * (canvasHeight / bg.height)
    bgX = (canvasWidth - renderWidth) / 2
  } else {
    renderWidth = canvasWidth
    renderHeight = bg.height * (canvasWidth / bg.width)
    bgY = (canvasHeight - renderHeight) / 2
  }

  ctx.drawImage(bg, bgX, bgY, renderWidth, renderHeight)
  ctx.fillStyle = "#fff"
  ctx.textAlign = "center"

  let y = 150
  ctx.font = "bold 48px GoodTimes";
  const maxWidthTitle = 800; // Aumentado para evitar saltos innecesarios
  y = wrapTextIfNeeded(ctx, name, canvasWidth / 2, y, maxWidthTitle, 55);

  ctx.font = "40px InterCustom"
  ctx.fillText(time, canvasWidth / 2, y)
  y += 60

  const qrSize = 400
  ctx.drawImage(qrImg, (canvasWidth - qrSize) / 2, y, qrSize, qrSize)
  
  // Dibujar ID y Nombre del cliente debajo del QR
  ctx.font = "bold 28px InterCustom"
  ctx.fillStyle = "rgba(255, 255, 255, 0.9)" // Un poco más opaco también
  ctx.fillText(`ID: ${purchaseTicketId}`, canvasWidth / 2, y + qrSize + 35)
  
  ctx.font = "32px InterCustom"
  ctx.fillText(clientName, canvasWidth / 2, y + qrSize + 75)

  y += qrSize + 110

  const ticketHeight = 60
  const ticketWidth = 600

  ctx.font = "bold 40px GoodTimes"
  y = drawTicketTextWithBackground(
    ctx,
    `Ticket: ${ticketType}`,
    canvasWidth / 2,
    y,
    ticketWidth,
    ticketHeight, // altura mínima
    10,
    "#050505",
    "#DB0913"
  )

  const eventImgSize = 400
  const imgX = (canvasWidth - eventImgSize) / 2
  const imgRatio = eventImg.width / eventImg.height;
  const drawWidth = eventImgSize;
  const drawHeight = eventImgSize / imgRatio;

  const radius = 40
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(imgX + radius, y)
  ctx.lineTo(imgX + drawWidth - radius, y)
  ctx.quadraticCurveTo(imgX + drawWidth, y, imgX + drawWidth, y + radius)
  ctx.lineTo(imgX + drawWidth, y + drawHeight - radius)
  ctx.quadraticCurveTo(imgX + drawWidth, y + drawHeight, imgX + drawWidth - radius, y + drawHeight)
  ctx.lineTo(imgX + radius, y + drawHeight)
  ctx.quadraticCurveTo(imgX, y + drawHeight, imgX, y + drawHeight - radius)
  ctx.lineTo(imgX, y + radius)
  ctx.quadraticCurveTo(imgX, y, imgX + radius, y)
  ctx.closePath()
  ctx.clip()

  ctx.drawImage(eventImg, imgX, y, drawWidth, drawHeight)
  ctx.restore()

  y += drawHeight + 60

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
