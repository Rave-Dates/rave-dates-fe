"use client";

import UsersList from "@/components/containers/users-list/UsersList";
import DefaultButton from "@/components/ui/buttons/DefaultButton";
import EditSvg from "@/components/svg/EditSvg";
import { useReactiveCookiesNext } from "cookies-next";
import { useAdminAllPromoters } from "@/hooks/admin/queries/useAdminData";
import { jwtDecode } from "jwt-decode";

export default function UserManagement() {
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const decoded: IUserLogin = token && jwtDecode(token.toString()) || {id: 0, organizerId: 0, email: "", exp: 0, iat: 0, role: ""};

  const { promoters, isError, isLoading } = useAdminAllPromoters({ token: token, organizerId: decoded?.organizerId });

  return (
    <UsersList
      createHref="promoters/create-promoter"
      hasSearch={false}
      searchQuery="Nuevo promotor"
    >
      <div className="rounded-md overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr] border-b border-divider text-text-inactive gap-x-2 text-sm py-2 px-3">
          <div className="text-start">Nombre y apellido</div>
          <div className="text-end">Acciones</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-divider w-full">
          {promoters?.map((user) => (
            <div
              key={user?.userId}
              className="grid grid-cols-[2fr_1fr] items-center py-3 px-3 gap-x-2 text-sm"
            >
              <div className="text-start">{user?.name}</div>
              <div className="flex justify-end gap-x-2">
                <DefaultButton className="text-xl border bg-transparent border-primary" icon={<EditSvg className="text-primary" />} href={`promoters/edit-promoter/${user?.userId}`} />
                <DefaultButton href={`promoters/${user?.userId}/promoter-events`} />
              </div>
            </div>
          ))}
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
              No se encontraron usuarios
            </div>
          )}
          {isError &&  (
            <div className="text-center text-sm py-8 text-system-error">
              Error cargando usuarios
            </div>
          )}

        </div>
      </div>
    </UsersList>
  );
}
