"use client";

import SearchInput from "@/components/ui/inputs/SearchInput";
import AddSvg from "@/components/svg/AddSvg";
import Link from "next/link";

export default function UsersList({
  children,
  filteredUsers,
  createHref,
  setSearchQuery,
  searchQuery,
}: {
  children: React.ReactNode;
  filteredUsers: IUser[];
  createHref: string;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="w-full bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <div className="max-w-xl mx-auto animate-fade-in">
        {/* Search and Add User Section */}
        <div className="flex items-center gap-2 mb-4">
          <SearchInput
            placeholder="Busca un usuario"
            value={searchQuery}
            handleFunc={(e) => setSearchQuery(e.target.value)}
          />
          <Link
            href={createHref}
            className="bg-primary text-primary-black p-2 rounded-lg flex items-center justify-center text-center"
            aria-label="Añadir usuario"
          >
            <AddSvg />
          </Link>
        </div>

        {/* Users Table/List */}
        {children}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-neutral-400">
            No se encontraron usuarios
          </div>
        )}
      </div>
    </div>
  );
}
