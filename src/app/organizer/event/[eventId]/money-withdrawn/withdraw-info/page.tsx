"use client";

import GoBackButton from "@/components/ui/buttons/GoBackButton";
import Image from "next/image";

export default function WithdrawInfo() {

  return (
    <div className="w-full flex flex-col justify-between bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <div>
        <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
        <div className="max-w-xl pt-24 mx-auto animate-fade-in space-y-2">
          <h2 className="text-title font-semibold">Información de retiro</h2>
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-sm text-text-inactive">Fecha</h3>
            <h2 className="text-lg font-medium">2025-09-24 08:00hs</h2>
          </div>
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-sm text-text-inactive">Cantidad</h3>
            <h2 className="text-lg font-medium">COP $10.000,00</h2>
          </div>
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-sm text-text-inactive">Datos</h3>
            <h2 className="text-lg font-medium">Mas datos</h2>
          </div>
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-sm text-text-inactive">Datos</h3>
            <h2 className="text-lg font-medium">Mas datos</h2>
          </div>
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-sm text-text-inactive">Datos</h3>
            <h2 className="text-lg font-medium">Mas datos</h2>
          </div>
          <div className="flex flex-col items-start justify-center">
            <h3 className="text-sm text-text-inactive pb-2">Imagen</h3>
            <div className="px-5" >
              <Image 
                src="/images/flyer-1.png" 
                className="rounded object-cover" 
                alt="Event Avatar" 
                width={400} 
                height={400}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
