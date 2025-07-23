"use client";

import CreateCategory from "@/components/roles/admin/parameters/CreateCategory";
import CreateCategoryValues from "@/components/roles/admin/parameters/CreateCategoryValues";
import CreateLabel from "@/components/roles/admin/parameters/CreateLabel";
import CreateTicketType from "@/components/roles/admin/parameters/CreateTicketType";
import React from "react";

export default function Parameters() {
  return (
    <div className="pt-14 pb-44 flex flex-col gap-y-10 px-4 bg-primary-black sm:justify-center sm:items-center text-white">
      <h1 className="text-title font-semibold">Parámetros</h1>
      <CreateLabel />
      <CreateTicketType />
      <CreateCategory />
      <CreateCategoryValues />
    </div>
  );
}
