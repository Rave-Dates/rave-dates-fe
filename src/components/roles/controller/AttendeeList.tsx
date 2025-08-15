"use client";

import { useEffect, useState } from "react";
import { deleteCookie, getCookie } from "cookies-next";
import { useAdminAllCheckerUsers } from "@/hooks/admin/queries/useAdminData";
import SearchInput from "@/components/ui/inputs/search-input/SearchInput";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { notifyError } from "@/components/ui/toast-notifications";

export default function AttendeeList({ eventId }: { eventId: number }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IGuest[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // cantidad de usuarios por página

  const router = useRouter();
  const token = getCookie("token");

  const decoded: IUserLogin | null = token ? jwtDecode(token.toString()) : null;

  useEffect(() => {
    if (!token) {
      notifyError('No se pudo leer el token de autenticación');
      router.replace('/');
    }
  }, [token, router]);

  const { checkerUsers, isLoading, isError } = useAdminAllCheckerUsers({
    token,
    eventId,
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length === 0) {
      setResults([]);
      return;
    }

    const filtered =
      checkerUsers?.filter((user) =>
        user.name.toLowerCase().includes(term.toLowerCase())
      ) || [];

    setResults(filtered);
  };

  const handleClick = () => {
    deleteCookie("token");
    router.push("/");
  };

  useEffect(() => {
    if (router && decoded && (decoded.eventId !== eventId || decoded.role !== "CHECKER")) {
      notifyError("No tienes permisos para acceder a esta página");
      router.push("/");
      return
    } else if (!token) {
      notifyError("No se encontró un token en las cookies");
      router.push("/");
      return
    } else return
  }, [router, decoded, eventId]);

  // Calcular índices de paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = checkerUsers?.slice(indexOfFirstItem, indexOfLastItem);

  console.log(checkerUsers)

  const totalPages = checkerUsers && Math.ceil(checkerUsers.length / itemsPerPage);

  return (
    <div className="w-full bg-primary-black flex flex-col justify-between text-primary-white min-h-screen p-4 pb-20 md:pt-32">
      <div className="max-w-xl w-full mx-auto animate-fade-in">
        {/* Search and Add User Section */}
        <div className="flex items-center gap-2 mb-4">
          {results && (
            <SearchInput
              placeholder="Busca un usuario"
              value={searchTerm}
              handleFunc={handleSearch}
              results={results}
              type="guest"
              isLink={false}
              setSearchTerm={setSearchTerm}
            />
          )}
        </div>

        {/* Users Table/List */}
        <div className="rounded-md overflow-hidden min-h-[615px]">
          {/* Table Body */}
          <div className="divide-y bg-input divide-divider w-full">
            {currentItems?.map((user) => (
              <div
                key={user?.clientId}
                className="flex flex-col text-start items-start py-4 px-4 gap-x-2"
              >
                <div className="text-base">{user?.name}</div>
                <div className="text-sm text-primary-white/50">
                  {Object.entries(
                    user?.purchaseTickets.reduce((acc, ticket) => {
                      const name = ticket?.ticketType?.name;
                      if (!name) return acc;
                      acc[name] = (acc[name] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .map(([name, count]) => `${name} x${count}`)
                    .join(", ")}
                </div>
              </div>
            ))}

            {/* Loading skeleton */}
            {!checkerUsers &&
              Array.from(Array(10).keys()).map((user) => (
                <div
                  key={user}
                  className="flex flex-col items-start py-3 px-3 gap-y-1 text-sm"
                >
                  <div className="text-start w-32 h-5 rounded animate-pulse bg-inactive"></div>
                  <div className="text-start w-20 h-4 rounded animate-pulse bg-inactive"></div>
                </div>
              ))}

            {/* No results */}
            {!isLoading &&
              Array.isArray(checkerUsers) &&
              checkerUsers?.length === 0 && (
                <div className="text-center py-8 text-text-inactive">
                  No se encontraron usuarios
                </div>
              )}
            {isError && (
              <div className="text-center text-sm py-8 text-system-error">
                Error cargando usuarios
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
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
        <button onClick={handleClick} className="bg-primary hover:opacity-80 transition-opacity mt-5 text-primary-black font-medium py-3 w-full rounded-lg flex items-center justify-center text-center">
          Salir
        </button>
      </div>
    </div>
  );
}
