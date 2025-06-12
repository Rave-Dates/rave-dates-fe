"use client"

import SearchInput from "@/components/inputs/SearchInput"
import AddSvg from "@/components/svg/AddSvg"
import EyeSvg from "@/components/svg/EyeSvg"
import { useState } from "react"

interface User {
  id: number
  name: string
  role: string
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample user data
  const users: User[] = [
    { id: 1, name: "Juan Gimenez", role: "Org." },
    { id: 2, name: "Juan Gimenez", role: "Prom." },
    { id: 3, name: "Juan Gimenez", role: "Prom." },
    { id: 4, name: "Juan Gimenez", role: "Prom." },
    { id: 5, name: "Juan Gimenez", role: "Prom." },
    { id: 6, name: "Juan Gimenez", role: "Prom." },
    { id: 7, name: "Juan Gimenez", role: "Prom." },
    { id: 8, name: "Juan Gimenez", role: "Prom." },
    { id: 9, name: "Juan Gimenez", role: "Prom." },
    { id: 10, name: "Juan Gimenez", role: "Prom." },
    { id: 11, name: "Juan Gimenez", role: "Prom." },
    { id: 12, name: "Juan Gimenez", role: "Prom." },
    { id: 13, name: "Juan Gimenez", role: "Prom." },
  ]

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleViewUser = (id: number) => {
    console.log(`View user with ID: ${id}`)
    // Implement view user functionality
  }

  const handleAddUser = () => {
    console.log("Add new user")
    // Implement add user functionality
  }

  return (
    <div className="w-full bg-black text-white min-h-screen p-4 sm:pt-32">
      <div className="max-w-md mx-auto animate-fade-in">
        {/* Search and Add User Section */}
        <div className="flex items-center gap-2 mb-4">
          <SearchInput 
            placeholder="Busca un usuario"
            value={searchQuery} 
            handleFunc={(e) => setSearchQuery(e.target.value)} 
          />
          <button
            onClick={handleAddUser}
            className="bg-[#c1ff00] text-black p-2 rounded-lg flex items-center justify-center"
            aria-label="Añadir usuario"
          >
            <AddSvg />
          </button>
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
                  <button
                    onClick={() => handleViewUser(user.id)}
                    className="bg-[#c1ff00] text-black p-1.5 rounded-md flex items-center justify-center"
                    aria-label={`Ver ${user.name}`}
                  >
                    <EyeSvg />
                  </button>
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
