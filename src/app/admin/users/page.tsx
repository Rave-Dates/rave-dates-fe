"use client";

import UsersList from "@/components/containers/users-list/UsersList";
import { useState } from "react";
import DefaultButton from "@/components/ui/buttons/DefaultButton";
import { useReactiveCookiesNext } from "cookies-next";
import { useAdminAllUsers } from "@/hooks/admin/queries/useAdminData";

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IUser[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // cantidad de usuarios por página

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = data && Math.ceil(data.length / itemsPerPage);

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
        <div className="flex flex-col items-center justify-between min-h-[75vh] w-full">
          <div className="w-full divide-divider divide-y">
            {currentItems?.map((user) => (
              <div
                key={user?.userId}
                className="grid grid-cols-[2fr_1fr_1fr] w-full items-center py-3 px-3 gap-x-2 text-sm"
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
          {/* Paginación */}
          {totalPages && totalPages > 1 ? (
            <div className="flex justify-center items-center text-primary-black gap-2 mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded bg-primary disabled:opacity-50 disabled:pointer-events-none"
              >
                Anterior
              </button>
              <span className="px-2 text-center text-primary-white">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded bg-primary disabled:opacity-50 disabled:pointer-events-none"
              >
                Siguiente
              </button>
            </div>
          )
        : null}
        </div>
      </div>
    </UsersList>
  );
}
