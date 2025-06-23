"use client";

import EditSvg from "@/components/svg/EditSvg";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sampleData = [
  {
    id: 1,
    eventName: "Evento 1 - 10/05",
    commission: 5,
  },
  {
    id: 2,
    eventName: "Evento 2 - 10/08",
    commission: 10,
  }
]

export default function Balance() {
  const pathname = usePathname();

  return (
    <div className="w-full flex flex-col justify-between bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <div>
        <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
        <div className="absolute z-30 top-7 right-5 ps-3 py-3 animate-fade-in">
          <Link
            href={`${pathname}/event-balance`}
            className="bg-primary text-primary-black p-3 px-10 rounded-xl flex items-center justify-center text-center"
            aria-label="Añadir usuario"
          >
            Cuenta
          </Link>
        </div>
        <div className="max-w-xl pt-24 mx-auto animate-fade-in">
          <h1 className="text-title font-semibold">Eventos asignados</h1>

          {/* Users Table/List */}
          <div className="rounded-md overflow-hidden mt-5">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-divider text-text-inactive gap-x-2 text-xs py-2 px-3">
            <div className="text-start">Evento</div>
            <div className="text-end">% (Com.)</div>
            <div className="text-end">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-divider w-full">
            {sampleData.map((data) => (
              <div
                key={data.id}
                className="grid grid-cols-[2fr_1fr_1fr] items-center py-3 px-3 gap-x-2 text-xs"
              >
                <div className="text-start">{data.eventName}</div>
                <div className="text-end tabular-nums">%{data.commission.toLocaleString("es-ES")}</div>
                <Link
                  href={`${pathname}/edit-event`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center justify-self-end bg-primary  text-primary-black"
                >
                  <EditSvg className="text-xl" />
                </Link>
              </div>
            ))}
          </div>
        </div>

          {/* Empty State */}
          {sampleData.length === 0 && (
            <div className="text-center py-8 text-neutral-400">
              No se encontraron usuarios
            </div>
          )}
        </div>
      </div>
      <div className="w-full justify-items-center">
        <Link
          href={`${pathname}/assign-event`}
          className="block text-center pb-2 max-w-xl self-center text-primary-white input-button mt-10"
        >
          Asignar nuevo evento +
        </Link>
        <Link
          href={`${pathname}/add`}
          className="bg-primary block text-center max-w-xl self-center text-black input-button"
        >
          Guardar
        </Link>
      </div>
    </div>
  );
}
