"use client"

import { OrganizerEventCard } from "@/components/roles/organizer/organizer-event/OrganizerEventCard"
import LogoutSvg from "@/components/svg/LogoutSvg"
import ConfirmationModal from "@/components/ui/modals/ConfirmationModal"
import { useAdminPromoterBinnacles, useAdminUserById } from "@/hooks/admin/queries/useAdminData"
import { useReactiveCookiesNext } from "cookies-next"
import { jwtDecode } from "jwt-decode"
import Link from "next/link"

export default function PromoterHome() {
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const decoded: { id: number } = (token && jwtDecode(token.toString())) || {id: 0};
  
  const { data: user, isPending: isUserLoading } = useAdminUserById({ token, userId: decoded.id }); 
  
  const promoterId = user?.promoter?.promoterId;

  const { promoterBinnacles } = useAdminPromoterBinnacles({ promoterId: promoterId ?? 0, token: token?.toString() });

  // const selectedPromoterBinnacle = promoterBinnacles?.find(b => b.eventId === eventId);

  return (
    <div className="bg-primary-black pt-14 md:pt-32 pb-40 text-primary-white min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-4">
        {/* Available Balance Header */}

        <div className="flex w-full justify-between items-center">
          <h1 className="text-3xl max-w-70 font-semibold">{user?.name}</h1>

          <ConfirmationModal
            isLogout
            title="Cerrar Sesión"
            description="¿Estás seguro de que quieres cerrar tu sesión actual?"
            confirmText="Cerrar Sesión"
            showModal={true}
            trigger={
              <button
                type="button"
                className="bg-system-error text-primary-white text-2xl p-2.5 rounded-lg flex items-center justify-center text-center transition-all active:scale-95"
                aria-label="Desloguearse"
              >
                <LogoutSvg />
              </button>
            }
          />
        </div>

        <div className="space-y-1">
          <h1 className="text-3xl font-semibold ">Disponible</h1>
          <p className="text-primary-white text-2xl"><span className="text-primary">COP $</span>{promoterBinnacles?.total?.toLocaleString() ?? 0}</p>
        </div>

        <div className="bg-input mt-2 rounded-lg px-3 py-2">
          <h1 className="font-medium px-2 my-2">Dinero</h1>
          <div className="border-t-2 flex flex-col gap-y-3 pt-5 mt-3 px-2 pb-2 text-text-inactive border-dashed border-inactive">
            <div className="flex text-sm justify-between items-center">
              <h2>Total comisiones</h2>
              <h2 className="text-primary-white text-base text-end tabular-nums">COP ${Number(promoterBinnacles?.total ?? 0).toLocaleString() ?? 0}</h2>
            </div>

            <div className="flex text-sm justify-between items-center">
              <h2>Dinero entregado</h2>
              <h2 className="text-primary-white text-base text-end tabular-nums">COP ${promoterBinnacles?.alreadyPaid.toLocaleString()?? 0}</h2>
            </div>

            <div className="flex text-sm justify-between items-center">
              <h2>Dinero disponible</h2>
              <h2 className="text-primary-white text-base text-end tabular-nums">COP ${promoterBinnacles?.pendingPayment.toLocaleString()?? 0}</h2>
            </div>

            <Link href={`/promoter/money-withdrawn`} className="input-button block text-center text-sm py-3 text-primary-white bg-primary">
              Ver dinero entregado
            </Link>
          </div> 
        </div>
      </div>
    </div>
  )
}