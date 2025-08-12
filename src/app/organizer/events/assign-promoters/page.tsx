"use client";

import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { useAdminAllPromoters } from "@/hooks/admin/queries/useAdminData";
import { useCreateEventStore } from "@/store/createEventStore";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

export default function UserManagement() {
  const { getCookie } = useReactiveCookiesNext();
  const { eventFormData, updateEventFormData } = useCreateEventStore();

  const token = getCookie("token");
  const decoded: IUserLogin | null = token ? jwtDecode(token.toString()) : null;
  
  const { promoters, isLoading, isError } = useAdminAllPromoters({ token, organizerId: decoded?.organizerId });

  useEffect(() => {
    console.log("promoters", promoters)
  }, [promoters]);

  const promoterAlreadyIn = (promoterId: number | undefined) => {
    const isIn = eventFormData.formPromoters?.find((promoter) => promoter.promoterId === promoterId);
    return isIn;
  }

  const handlePromoterAdd = async (promoterId: number | undefined) => {
    if (!promoterId) return;

    const isIn = promoterAlreadyIn(promoterId)  
    if (isIn) return;

    const prevPromoters = eventFormData.formPromoters?.map((promoter) => ({
      promoterId: promoter.promoterId,
    })) || [];

    updateEventFormData({
      formPromoters: [
        ...prevPromoters,
        {
          promoterId: promoterId,
        },
      ],
    });
  }

  const handlePromoterDelete = async (promoterId: number | undefined) => {
    if (!promoterId) return;

    const newPromoters = eventFormData.formPromoters?.filter((promoter) => promoter.promoterId !== promoterId) || [];

    updateEventFormData({
      formPromoters: [
        ...newPromoters,
      ],
    });
  }

  return (
    <div className="rounded-md bg-primary-black min-h-screen overflow-hidden text-primary-white px-4">
      <div className="flex justify-start items-center gap-x-3 pt-8">
        <GoBackButton className="z-30 top-10 left-5 px-3 py-3" />
        <h1 className="text-3xl font-medium">Nombre de evento</h1>
      </div>
      {/* Table Header */}

      <h1 className="font-semibold text-3xl mt-8">Asignar promotores</h1>
      <div className="grid grid-cols-[1fr_1fr] border-b border-divider text-text-inactive gap-x-2 text-sm py-2 mt-4 px-3">
        <div className="text-start">Nombre completo</div>
        <div className="text-end">Acciones</div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-divider w-full">
        {promoters?.map((user) => {
          const isIn = promoterAlreadyIn(user.promoter?.promoterId);
          console.log("esta?", isIn)
          return (
            <div
              key={user?.userId}
              className="grid grid-cols-[1fr_1fr] items-center py-3 px-3 gap-x-2 text-sm"
            >
              <div className="text-start">{user?.name}</div>
              <div className="flex justify-end gap-x-2">
                {
                  !isIn ?
                  <button onClick={() => handlePromoterAdd(user.promoter?.promoterId)} className="w-40 font-medium border border-primary bg-primary rounded-lg text-primary-black py-2">
                    Asignar al evento
                  </button>
                  :
                  <button onClick={() => handlePromoterDelete(user.promoter?.promoterId)} className="w-40 font-medium border border-primary/70 text-center text-primary rounded-lg bg-primary-black py-2">
                    Asignado
                  </button>
                }
              </div>
            </div>
        )})}
        {!promoters && (
          Array.from(Array(10).keys()).map((user) => (
          <div
            key={user}
            className="grid grid-cols-[2fr_1fr_1fr] items-center py-3 px-3 gap-x-2 text-sm"
          >
            <div className="text-start w-20 h-4 rounded animate-pulse bg-inactive"></div>
            <div className="justify-self-end w-8 h-8 rounded animate-pulse bg-inactive"></div>
          </div>
          ))
        )}
        {!isLoading && Array.isArray(promoters) && promoters?.length === 0 &&  (
          <div className="text-center py-8 text-text-inactive">
            No se encontraron promoters
          </div>
        )}
        {isError &&  (
          <div className="text-center text-sm py-8 text-system-error">
            Error cargando promoters
          </div>
        )}
      </div>
    </div>
  );
}
