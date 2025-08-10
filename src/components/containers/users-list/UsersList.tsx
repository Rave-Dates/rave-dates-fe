"use client";

import AddSvg from "@/components/svg/AddSvg";
import SearchInput from "@/components/ui/inputs/search-input/SearchInput";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  createHref: string;
  searchQuery?: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchTerm?: string;
  hasSearch?: boolean;
  results?: IUser[];
};

export default function UsersList({
  children,
  createHref,
  setSearchTerm,
  handleSearch,
  searchTerm,
  searchQuery,
  hasSearch = true,
  results,
}: Props) {
  return (
    <div className="w-full bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <div className="max-w-xl mx-auto animate-fade-in">
        {/* Search and Add User Section */}
        <div className="flex items-center gap-2 mb-4">
          {hasSearch && results && (
            <SearchInput
              placeholder="Busca un usuario"
              value={searchTerm}
              handleFunc={handleSearch}
              results={results}
              type="user"
              setSearchTerm={setSearchTerm}
            />
          )}
          <Link
            href={createHref}
            className={`${!hasSearch && "w-full" } bg-primary text-primary-black text-2xl p-2.5 rounded-lg flex items-center justify-center text-center`} 
            aria-label="Añadir usuario"
          >
            {
              hasSearch ? <AddSvg />
              :
              <div className="flex items-center py-1 w-full justify-center">
                <span className="text-sm font-medium">{searchQuery}</span>
              </div>
            }
          </Link>
        </div>

        {/* Users Table/List */}
        {children}
      </div>
    </div>
  );
}
