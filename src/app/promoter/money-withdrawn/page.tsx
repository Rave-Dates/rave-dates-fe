"use client";

import EyeSvg from "@/components/svg/EyeSvg";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { useAdminPromoterBinnacles } from "@/hooks/admin/queries/useAdminData";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MoneyWithdrawn() {
  const pathname = usePathname();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const decoded: IUserLogin | null = token ? jwtDecode(token.toString()) : null;

  const { promoterBinnacles } = useAdminPromoterBinnacles({
    promoterId: decoded?.promoterId ?? 0,
    token: token?.toString() ?? "",
  });

  return (
    <div className="w-full flex flex-col justify-between bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <div>
        <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
        <div className="max-w-xl pt-24 mx-auto animate-fade-in">
          {/* Search and Add User Section */}

          <h1 className="text-title font-semibold">Dinero retirado</h1>
          <h2 className="text-xl text-primary">COP ${promoterBinnacles?.alreadyPaid.toLocaleString() ?? 0}</h2>

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
            {promoterBinnacles?.movements.map((movement) => (
              <div
                key={movement.paymentId}
                className="grid grid-cols-[1fr_1fr_1fr_0.6fr] items-center py-3 px-3 gap-x-2 text-xs"
              >
                <div className="text-start">
                  {new Date(movement.createdAt).toLocaleDateString("es-ES")}
                </div>
                <div className="text-center">{movement?.reference ?? "Concepto"}</div>
                <div className="text-end tabular-nums">${movement.paymentAmount.toLocaleString("es-ES")}</div>
                <Link href={`${pathname}/${movement.paymentId}/withdraw-info`} className="justify-self-end tabular-nums bg-primary text-black text-xl p-1.5 rounded-lg w-fit">
                  <EyeSvg />
                </Link>
              </div>
            ))}
          </div>
        </div>

          {/* Empty State */}
          {promoterBinnacles?.movements.length === 0 && (
            <div className="text-center py-8 text-neutral-400">
              No se encontraron movimientos
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
