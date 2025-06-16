"use client";

import { users } from "@/template-data";
import UsersList from "@/components/containers/users-list/UsersList";
import { useState } from "react";
import EyeButton from "@/components/ui/buttons/EyeButton";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UsersList
      filteredUsers={filteredUsers}
      createHref="users/create-user"
      setSearchQuery={setSearchQuery}
      searchQuery={searchQuery}
    >
      <div className="rounded-md overflow-hidden">
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
              <div className="text-center">{user.role}</div>
              <div className="flex justify-end">
                <EyeButton userId={user.id} href="users/edit-user" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </UsersList>
  );
}
