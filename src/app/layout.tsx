import NavbarWeb from "@/components/containers/navbar/NavbarWeb";
import "@/styles/globals.css";
import { mainFont } from '@/fonts/index';
import NavbarMobile from "@/components/containers/navbar/NavbarMobile";
import { CookiesNextProvider } from "cookies-next";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "sonner";
import 'leaflet/dist/leaflet.css';
import Script from "next/script";

export const metadata = {
  title: "Rave Dates",
  description:
    "Plataforma para descubrir, reservar y comprar entradas para los mejores eventos en Colombia.",
  keywords: [
    "eventos",
    "entradas",
    "tickets",
    "comprar entradas",
    "rave dates",
    "rave",
    "plataforma de eventos",
    "colombia"
  ],
  authors: [{ name: "Rave Dates" }],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://tusitio.com",
    siteName: "Rave Dates",
    title: "Rave Dates",
    description:
      "Plataforma para descubrir, reservar y comprar entradas para los mejores eventos en Colombia.",
    images: [
      {
        url: "https://tusitio.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Tu Marca - Plataforma de Eventos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tumarca",
    title: "Tu Marca | Eventos y Experiencias Inolvidables",
    description:
      "Plataforma para descubrir, reservar y comprar entradas para los mejores eventos en Colombia.",
    images: ["https://tusitio.com/og-image.jpg"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="index, follow" />
        <meta name="theme-color" content="#050505" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className={`${mainFont.className} bg-main-container`}>
        <CookiesNextProvider pollingOptions={{ enabled: true, intervalMs: 1000 }}>
          <ReactQueryProvider>
            <NavbarWeb />
            {children}
          </ReactQueryProvider>
        </CookiesNextProvider>
        <NavbarMobile />
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
