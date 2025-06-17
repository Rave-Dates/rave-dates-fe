"use client";

import { users } from "@/template-data";
import UsersList from "@/components/containers/users-list/UsersList";
import { useState } from "react";
import DefaultButton from "@/components/ui/buttons/DefaultButton";

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <UsersList
      filteredUsers={filteredUsers}
      createHref="promoters/create-promoter"
      setSearchQuery={setSearchQuery}
      searchQuery={searchQuery}
    >
      <div className="rounded-md overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-divider text-text-inactive gap-x-2 text-sm py-2 px-3">
          <div className="text-start">Nombre</div>
          <div className="text-center">Apellido</div>
          <div className="text-end">Acciones</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-divider w-full">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1fr_1fr_1fr] items-center py-3 px-3 gap-x-2 text-sm"
            >
              <div className="text-start">{user.name.split(" ")[0]}</div>
              <div className="text-center">
                {user.name.split(" ").slice(1).join(" ")}
              </div>
              <div className="flex justify-end">
                <DefaultButton href={`promoters/edit-promoter/${user.id}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </UsersList>
  );
}
