"use client";

import UsersList from "@/components/containers/users-list/UsersList";
import DefaultButton from "@/components/ui/buttons/DefaultButton";
import { getAllUsers } from "@/services/admin-users";
import { useQuery } from "@tanstack/react-query";
import EditSvg from "@/components/svg/EditSvg";
import GoBackButton from "@/components/ui/buttons/GoBackButton";

export default function OrganizerPromoterEvents({promoterId}: {promoterId: number}) {
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ["users"],
  //   queryFn: () => getAllUsers({ token }),
  //   enabled: !!token, // solo se ejecuta si hay token
  // });

  console.log(promoterId)

  const isLoading = false;
  const isError = false;

  const data = [
    {
      userId: 1,
      name: "Juan Gomez",
      roleId: 1,
      role: {
        roleId: 1,
        name: "Promotor",
        icon: "🏆",
      }
    }
  ]

  return (
    <>
      <div className="flex justify-start text-primary-white items-center gap-x-3 px-4 pt-8">
        <GoBackButton className="z-30 top-10 left-5 px-3 py-3" />
        <h1 className="text-3xl font-medium">Nombre</h1>
      </div>
      <UsersList
        createHref={`promoter-events/assign-events`}
        hasSearch={false}
        searchQuery="Asignar nuevo evento"
      >
        <div className="rounded-md overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr] border-b border-divider text-text-inactive gap-x-2 text-sm py-2 px-3">
            <div className="text-start">Fecha</div>
            <div className="text-center">Promotor</div>
            <div className="text-center">Título</div>
            <div className="text-end">Lugar</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-divider w-full">
            {data?.map((user) => (
              <div
                key={user?.userId}
                className="grid grid-cols-[1fr_1fr_1fr_1fr] items-center py-3 px-3 gap-x-2 text-sm"
              >
                <div className="text-start">{user?.name}</div>
                <div className="text-center">{user?.name}</div>
                <div className="text-center">{user?.name}</div>
                <div className="text-end">{user?.name}</div>
              </div>
            ))}
            {!data && (
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
            {!isLoading && Array.isArray(data) && data?.length === 0 &&  (
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
    </>
  );
}
