"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import SearchInput from "@/components/ui/inputs/search-input/SearchInput";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { notifyError } from "@/components/ui/toast-notifications";
import { searchCheckerUser } from "@/services/admin-users";
import { useDebounce } from "@/hooks/useDebounce";
import GuestDetailModal from "@/components/ui/modals/GuestDetailModal";

export default function AttendeeList({ eventId, isEmbedded }: { eventId: number, isEmbedded?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IGuest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<IGuest | null>(null);

  const router = useRouter();
  const token = getCookie("token");

  const decoded: IUserLogin | null = token ? jwtDecode(token.toString()) : null;

  useEffect(() => {
    if (!token) {
      notifyError('No se pudo leer el token de autenticación');
      router.replace('/');
    }
  }, [token, router]);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchSearch = async () => {
      if (debouncedSearchTerm.length === 0) {
        setResults([]);
        return;
      }

      try {
        const user = await searchCheckerUser({ token, eventId, search: debouncedSearchTerm });
        if (user) {
          setResults([user]);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      }
    };

    fetchSearch();
  }, [debouncedSearchTerm, token, eventId]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClick = () => {
    router.back();
  };

  useEffect(() => {
    if (!isEmbedded && router && decoded && (decoded.eventId !== eventId || decoded.role !== "CHECKER")) {
      notifyError("No tienes permisos para acceder a esta página");
      router.push("/");
      return
    } else if (!token) {
      notifyError("No tienes permisos para acceder a esta página");
      router.push("/");
      return
    } else return
  }, [router, decoded, eventId, isEmbedded]);

  return (
    <>
    <div className={`w-full flex flex-col justify-between text-primary-white ${isEmbedded ? 'pb-8 bg-main-container p-2 min-h-[350px]' : 'bg-primary-black min-h-screen p-4 pb-20 lg:pt-32'}`}>
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
              onGuestSelect={(guest) => setSelectedGuest(guest)}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        {!isEmbedded && (
          <button onClick={handleClick} className="bg-primary max-w-xl self-center hover:opacity-80 transition-opacity mt-5 text-primary-white font-medium py-3 w-full rounded-lg flex items-center justify-center text-center">
            Atrás
          </button>
        )}
      </div>
    </div>

      <GuestDetailModal
        guest={selectedGuest}
        onClose={() => setSelectedGuest(null)}
      />
    </>
  );
}
