"use client"

import SearchInput from "@/components/ui/inputs/SearchInput"
import AddSvg from "@/components/svg/AddSvg"
import EyeSvg from "@/components/svg/EyeSvg"
import Link from "next/link"
import { useState } from "react"
import { users } from "@/template-data"

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="w-full bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <div className="max-w-md mx-auto animate-fade-in">
        {/* Search and Add User Section */}
        <div className="flex items-center gap-2 mb-4">
          <SearchInput 
            placeholder="Busca un usuario"
            value={searchQuery} 
            handleFunc={(e) => setSearchQuery(e.target.value)} 
          />
          <Link
            href="users/create-user"
            className="bg-primary text-primary-black p-2 rounded-lg flex items-center justify-center text-center"
            aria-label="Añadir usuario"
          >
            <AddSvg />
          </Link>
        </div>

        {/* Users Table/List */}
        <div className="rounded-md overflow-hidden">
          {/* Table Header */}
          <div className="flex justify-between border-b border-divider text-text-inactive text-sm py-2 px-3">
            <div>Nombre y apellido</div>
            <div>Rol</div>
            <div className="text-center">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-divider w-full">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex justify-between text-start items-center py-3 px-3">
                <h2 className="text-sm">{user.name}</h2>
                <h2 className="text-sm">{user.role}</h2>
                <div className="flex justify-center">
                  <Link
                    href={`users/edit-user/${user.id}`}
                    className="bg-primary text-primary-black p-1.5 rounded-md flex items-center justify-center"
                    aria-label={`Ver ${user.name}`}
                  >
                    <EyeSvg />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-neutral-400">No se encontraron usuarios</div>
        )}
      </div>
    </div>
  )
}
