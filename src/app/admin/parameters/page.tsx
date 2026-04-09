"use client";

import CreateCategory from "@/components/roles/admin/parameters/CreateCategory";
import CreateCategoryValues from "@/components/roles/admin/parameters/CreateCategoryValues";
import CreateLabel from "@/components/roles/admin/parameters/CreateLabel";
import CreateTicketType from "@/components/roles/admin/parameters/CreateTicketType";
import ErrorStrings from "@/components/roles/admin/parameters/ErrorStrings";
import React from "react";

export default function Parameters() {
  return (
    <div className="pt-14 md:pt-32 pb-44 px-4 bg-primary-black text-white">
      <div className="max-w-xl flex flex-col justify-center items-center mx-auto gap-y-10">
        <h1 className="text-title font-semibold">Parámetros</h1>
        <CreateLabel />
        <CreateTicketType />
        <CreateCategory />
        <CreateCategoryValues />
        <ErrorStrings />
      </div>
    </div>
  );
}
