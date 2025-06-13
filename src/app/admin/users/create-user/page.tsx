"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import React, { useState } from "react";

export default function CreateUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    idNumber: "",
    role: "",
    commission: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <DefaultForm handleSubmit={handleSubmit} title="Crear usuario">
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
      <FormInput
        type="number"
        handleFunc={handleChange}
        title="Comisión (%)*"
        formName={formData.commission}
        inputName="commission"
      />

      <button
        type="submit"
        className="bg-primary text-black input-button"
      >
        Crear usuario
      </button>
    </DefaultForm>
  );
}
