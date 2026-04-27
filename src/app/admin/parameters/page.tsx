"use client";

import CreateCategory from "@/components/roles/admin/parameters/CreateCategory";
import CreateCategoryValues from "@/components/roles/admin/parameters/CreateCategoryValues";
import CreateLabel from "@/components/roles/admin/parameters/CreateLabel";
import ErrorStrings from "@/components/roles/admin/parameters/ErrorStrings";
import BoldFeePorcentage from "@/components/roles/admin/parameters/BoldFeePorcentage";
import React from "react";

export default function Parameters() {
  return (
    <div className="pt-14 md:pt-32 pb-44 px-4 bg-primary-black text-white">
      <h1 className="text-title font-semibold mb-10 text-center">Parámetros</h1>
      <div className="max-w-xl flex flex-col justify-center items-center mx-auto gap-y-20">
        <CreateLabel />
        {/* <CreateTicketType /> */}
        <CreateCategory />
        <CreateCategoryValues />
        <BoldFeePorcentage />
        <ErrorStrings />
      </div>
    </div>
  );
}
