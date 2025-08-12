"use client";

import UsersList from "@/components/containers/users-list/UsersList";
import { useState } from "react";
import DefaultButton from "@/components/ui/buttons/DefaultButton";
import { useReactiveCookiesNext } from "cookies-next";
import { useAdminAllUsers } from "@/hooks/admin/queries/useAdminData";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IUser[]>([]);

  const { getCookie } = useReactiveCookiesNext();

  const token = getCookie("token");

  const { data, isLoading, isError } = useAdminAllUsers({ token });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length === 0) {
      setResults([]);
      return;
    }

    const filtered = data?.filter((user) =>
      user.name.toLowerCase().includes(term.toLowerCase())
    ) || [];

    setResults(filtered);
  };

  return (
    <UsersList
      createHref="users/create-user"
      hasSearch={true}
      searchTerm={searchTerm}
      handleSearch={handleSearch}
      results={results}
      setSearchTerm={setSearchTerm}
    >
      <div className="rounded-md overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-divider text-text-inactive gap-x-2 text-sm py-2 px-3">
          <div className="text-start">Nombre y apellido</div>
          <div className="text-center">Rol</div>
          <div className="text-end">Acciones</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-divider w-full">
          {data?.map((user) => (
            <div
              key={user?.userId}
              className="grid grid-cols-[2fr_1fr_1fr] items-center py-3 px-3 gap-x-2 text-sm"
            >
              <div className="text-start">{user?.name}</div>
              <div className="text-center">{user?.role?.name}</div>
              <div className="flex justify-end">
                <DefaultButton href={`users/edit-user/${user?.userId}`} />
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
              <div className="justify-self-center w-14 h-4 rounded animate-pulse bg-inactive"></div>
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
