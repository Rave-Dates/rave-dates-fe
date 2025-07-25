"use client";

import SearchInput from "@/components/ui/inputs/SearchInput";
import AddSvg from "@/components/svg/AddSvg";
import Link from "next/link";

export default function UsersList({
  children,
  createHref,
  setSearchQuery,
  searchQuery,
}: {
  children: React.ReactNode;
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
            className="bg-primary text-primary-black text-2xl p-2.5 rounded-lg flex items-center justify-center text-center"
            aria-label="Añadir usuario"
          >
            <AddSvg />
          </Link>
        </div>

        {/* Users Table/List */}
        {children}
      </div>
    </div>
  );
}
