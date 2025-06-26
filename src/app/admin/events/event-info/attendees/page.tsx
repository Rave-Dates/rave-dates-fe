"use client";

import SearchInput from "@/components/ui/inputs/SearchInput";
import AddSvg from "@/components/svg/AddSvg";
import Link from "next/link";
import { useState } from "react";
import DefaultButton from "@/components/ui/buttons/DefaultButton";
import UserSvg from "@/components/svg/UserSvg";
import SendSvg from "@/components/svg/SendSvg";
import ArrowSvg from "@/components/svg/ArrowSvg";

export default function UsersList() {
  const users = [
    { id: 1, name: "Juan Gimenez", ticketType: "XXXX" },
    { id: 2, name: "Ana Martínez", ticketType: "XXXX" },
    { id: 3, name: "Carlos Ruiz", ticketType: "XXXX" },
    { id: 4, name: "Pedro López", ticketType: "XXXX" },
    { id: 5, name: "Roman Ruiz", ticketType: "XXXX" },
    { id: 6, name: "Diego Martínez", ticketType: "XXXX" },
    { id: 7, name: "Axel Gómez", ticketType: "XXXX" },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="w-full flex flex-col justify-between bg-primary-black text-primary-white min-h-screen pt-0 pb-40 sm:pt-32">
      <div className="max-w-xl w-full mx-auto animate-fade-in">
        {/* Search and Add User Section */}
        <div className="flex items-center bg-main-container gap-2 pt-10 pb-4 px-4 mb-4">
          <Link
            href="/"
            className="bg-primary text-primary-black text-2xl p-2.5 rounded-lg flex items-center justify-center text-center"
            aria-label="Añadir usuario"
          >
            <ArrowSvg />
          </Link>
          <SearchInput
            placeholder="Busca un invitado"
            value={searchQuery}
            handleFunc={(e) => setSearchQuery(e.target.value)}
          />
          <Link
            href="/admin/events/event-info/attendees/attendee-data"
            className="border border-primary text-primary text-2xl p-2.5 rounded-lg flex items-center justify-center text-center"
            aria-label="Añadir usuario"
          >
            <AddSvg />
          </Link>
        </div>

        {/* Users Table/List */}
        <div className="rounded-md overflow-hidden px-4">
          {/* Table Header */}
          <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-divider text-text-inactive gap-x-2 text-sm py-2 px-3">
            <div className="text-start">Nombre y apellido</div>
            <div className="text-center">Rol</div>
            <div className="text-end">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-divider w-full">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-[2fr_1fr_1fr] items-center py-3 px-3 gap-x-2 text-sm"
              >
                <div className="text-start">{user.name}</div>
                <div className="text-center">{user.ticketType}</div>
                <div className="flex gap-x-2 justify-end">
                  <DefaultButton className="text-xl !bg-transparent border border-primary !text-primary" icon={<UserSvg stroke={1.5} />} href={`/admin/events/event-info/attendees/attendee-data`} /> 
                  <DefaultButton className="!px-1 !py-1" icon={<SendSvg className="text-2xl" />} href={`/admin/events/event-info/attendees/success`} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-neutral-400">
            No se encontraron usuarios
          </div>
        )}
      </div>
      <div className="mx-5">
        <button
          className="bg-primary mt-20 text-black input-button" 
        >
          Descargar
        </button>
      </div>
    </div>
  );
}
