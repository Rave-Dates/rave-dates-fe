"use client";

import { UserStageInfo } from "@/components/roles/admin/UserStageInfo";
import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import React, { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    idNumber: "",
    role: "",
    commission: "",
  });
  
  const tickets = [
    { id: 1, ticketName: "General", price: 50000 },
    { id: 2, ticketName: "VIP", price: 70000 },
    { id: 3, ticketName: "Backstage", price: 90000 },
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <DefaultForm handleSubmit={handleSubmit} title="Crear promotor">
      <FormInput
        handleFunc={handleChange}
        title="Nombre completo*"
        formName={formData.name}
        inputName="name"
      />
      <FormInput
        handleFunc={handleChange}
        title="Número de cédula*"
        formName={formData.idNumber}
        inputName="idNumber"
      />
      <FormInput
        type="email"
        handleFunc={handleChange}
        title="Mail*"
        formName={formData.email}
        inputName="email"
      />
      <FormDropDown
        title="Rol*"
        handleFunc={handleChange}
      >
        <option value="organizador">Organizador</option>
        <option value="promotor">Promotor</option>
        <option value="controlador">Controlador</option>
      </FormDropDown>
      <h4 className="text-xs pt-4">Comisión (%)*</h4>

      {
        tickets.map((ticket) => (
          <UserStageInfo
            key={ticket.id}
            stageNumber={ticket.id}
            stageName={ticket.ticketName}
            stagePrice={ticket.price}
          />
        ))
      }
      <button
        type="submit"
        className="bg-primary text-black input-button"
      >
        Crear usuario
      </button>
    </DefaultForm>
  );
}
