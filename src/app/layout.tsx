import NavbarWeb from "@/components/containers/navbar/NavbarWeb";
import "@/styles/globals.css";
import { mainFont } from '@/fonts/index';
import NavbarMobile from "@/components/containers/navbar/NavbarMobile";
import { CookiesNextProvider } from "cookies-next";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "sonner";
import 'leaflet/dist/leaflet.css';
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://checkout.bold.co/library/boldPaymentButton.js"
        />        
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />
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
