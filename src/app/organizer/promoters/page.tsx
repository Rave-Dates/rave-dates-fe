"use client";

import UsersList from "@/components/containers/users-list/UsersList";
import DefaultButton from "@/components/ui/buttons/DefaultButton";
import { getAllUsers } from "@/services/admin-users";
import { useQuery } from "@tanstack/react-query";
import EditSvg from "@/components/svg/EditSvg";

export default function UserManagement() {
  // const { data, isLoading, isError } = useQuery({
  //   queryKey: ["users"],
  //   queryFn: () => getAllUsers({ token }),
  //   enabled: !!token, // solo se ejecuta si hay token
  // });

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
          {data?.map((user) => (
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
  );
}
