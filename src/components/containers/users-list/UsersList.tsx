"use client";

// import SearchInput from "@/components/ui/inputs/search-input/SearchInput";
import AddSvg from "@/components/svg/AddSvg";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  createHref: string;
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
  hasSearch?: boolean;
};

export default function UsersList({
  children,
  createHref,
  // setSearchQuery,
  searchQuery,
  hasSearch = true,
}: Props) {
  return (
    <div className="w-full bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <div className="max-w-xl mx-auto animate-fade-in">
        {/* Search and Add User Section */}
        <div className="flex items-center gap-2 mb-4">
          {/* {hasSearch && setSearchQuery && (
            <SearchInput
              placeholder="Busca un usuario"
              value={searchQuery}
              handleFunc={(e) => setSearchQuery(e.target.value)}
            />
          )} */}
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
