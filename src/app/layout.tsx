import NavbarWeb from "@/components/containers/navbar/NavbarWeb";
import "@/styles/globals.css";
import { mainFont } from '@/fonts/index';
import NavbarMobile from "@/components/containers/navbar/NavbarMobile";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mainFont.className} bg-main-container`}>
        <NavbarWeb />
        {children}
        <NavbarMobile />
      </body>
    </html>
  );
}
