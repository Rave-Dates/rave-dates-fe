import NavbarWeb from "@/components/containers/navbar/NavbarWeb";
import "@/styles/globals.css";
import { mainFont } from '@/fonts/index';
import NavbarMobile from "@/components/containers/navbar/NavbarMobile";
import { CookiesNextProvider } from "cookies-next";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mainFont.className} bg-main-container`}>
        <NavbarWeb />
        <CookiesNextProvider pollingOptions={{ enabled: true, intervalMs: 1000 }}>
          <ReactQueryProvider>
            {children}
          </ReactQueryProvider>
        </CookiesNextProvider>
        <NavbarMobile />
        <Toaster />
      </body>
    </html>
  );
}
