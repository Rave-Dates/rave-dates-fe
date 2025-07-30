import QRCode from "qrcode"

export const generateTicketImage = async ({
  bgImage,
  qrData,
  name,
  time,
  ticketType,
  eventImage,
  logoRD,
  fileName,
}: {
  bgImage: string
  qrData: string // Esto ahora es el token o URL codificada
  name: string
  time: string
  ticketType: string
  eventImage: string
  logoRD: string
  fileName: string
}) => {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")
  if (!ctx) return

  const canvasWidth = 738
  const canvasHeight = 1600
  canvas.width = canvasWidth
  canvas.height = canvasHeight

  const font = new FontFace("Inter", "url(/fonts/Inter_28pt-Regular.ttf)")
  await font.load()
  ;(document as any).fonts.add(font)

  const loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })

  // ⚠️ Crear QR como DataURL desde el token
  const qrDataUrl = await QRCode.toDataURL(qrData)

  const [bg, qrImg, eventImg, logo] = await Promise.all([
    loadImage(bgImage),
    loadImage(qrDataUrl),
    loadImage(eventImage),
    loadImage(logoRD),
  ])

  // Dibujar todo como antes
  ctx.drawImage(bg, 0, 0, canvasWidth, canvasHeight)
  ctx.fillStyle = "#fff"
  ctx.textAlign = "center"

  let y = 200
  ctx.font = "bold 48px Inter"
  ctx.fillText(name, canvasWidth / 2, y)
  y += 80

  ctx.font = "30px Inter"
  ctx.fillText(time, canvasWidth / 2, y)
  y += 80

  const qrSize = 400
  ctx.drawImage(qrImg, (canvasWidth - qrSize) / 2, y, qrSize, qrSize)
  y += qrSize + 40

  const ticketHeight = 50
  const ticketWidth = 400
  const ticketX = (canvasWidth - ticketWidth) / 2

  ctx.fillStyle = "#050505"
  ctx.fillRect(ticketX, y, ticketWidth, ticketHeight)

  ctx.fillStyle = "#ff7a00"
  ctx.font = "bold 28px Inter"
  ctx.fillText(`Ticket: ${ticketType}`, canvasWidth / 2, y + 35)
  y += ticketHeight + 40

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

  const link = document.createElement("a")
  link.download = fileName
  link.href = canvas.toDataURL("image/jpeg", 0.95)
  link.click()
}
