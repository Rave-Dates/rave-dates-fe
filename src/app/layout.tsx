import Navbar from "@/components/containers/navbar/Navbar";
import "@/styles/globals.css";
import { mainFont } from '@/fonts/index';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mainFont.className} bg-main-container`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
