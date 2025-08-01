"use client";

import EyeSvg from "@/components/svg/EyeSvg";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sampleData = [
  {
    id: 1,
    lastDate: "10/05",
    concept: "Evento 1",
    amount: 10000,
    balance: 10000,
  },
  {
    id: 2,
    lastDate: "10/05",
    concept: "Evento 1",
    amount: 20000,
    balance: 20000,
  },
  {
    id: 3,
    lastDate: "10/05",
    concept: "Evento 1",
    amount: 30000,
    balance: 30000,
  },
  {
    id: 4,
    lastDate: "10/05",
    concept: "Evento 1",
    amount: 40000,
    balance: 40000,
  },
  {
    id: 5,
    lastDate: "10/05",
    concept: "Evento 1",
    amount: 50000,  
    balance: 50000,
  }
]

export default function MoneyWithdrawn() {
  const pathname = usePathname();

  return (
    <div className="w-full flex flex-col justify-between bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <div>
        <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
        <div className="max-w-xl pt-24 mx-auto animate-fade-in">
          {/* Search and Add User Section */}

          <h1 className="text-title font-semibold">Dinero retirado</h1>
          <h2 className="text-xl text-primary">COP $10.000,00</h2>

          {/* Users Table/List */}
          <div className="rounded-md overflow-hidden mt-5">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_0.6fr] border-b border-divider text-text-inactive gap-x-2 text-xs py-2 px-3">
            <div className="text-start">Últ. fecha</div>
            <div className="text-center">Concepto</div>
            <div className="text-end">Saldo</div>
            <div className="text-end"></div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-divider w-full">
            {sampleData.map((data) => (
              <div
                key={data.id}
                className="grid grid-cols-[1fr_1fr_1fr_0.6fr] items-center py-3 px-3 gap-x-2 text-xs"
              >
                <div className="text-start">{data.lastDate}</div>
                <div className="text-center">Evento 1</div>
                <div className="text-end tabular-nums">${data.amount.toLocaleString("es-ES")}</div>
                <Link href={`${pathname}/withdraw-info`} className="justify-self-end tabular-nums bg-primary text-black text-xl p-1.5 rounded-lg w-fit">
                  <EyeSvg />
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
    </div>
  );
}
