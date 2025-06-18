"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import CheckFormInput from "@/components/ui/inputs/CheckFormInput";
import FormInput from "@/components/ui/inputs/FormInput";
import { redirect } from "next/navigation";
import type React from "react";
import { useState } from "react";

export default function DataForm() {
  const [formData, setFormData] = useState({
    name: "",
    idNumber: "",
    email: "",
    whatsapp: "",
    receiveInfo: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, receiveInfo: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    redirect("/checkout")
  };

  return (
    <DefaultForm handleSubmit={handleSubmit} title="Ingresa tus datos">
      <FormInput
        handleFunc={handleChange}
        title="Nombre y apellido*"
        formName={formData.name}
        inputName="name"
      />
      <FormInput
        handleFunc={handleChange}
        title="Cédula o Pasaporte*"
        formName={formData.idNumber}
        inputName="idNumber"
      />
      <FormInput
        type="email"
        handleFunc={handleChange}
        title="Email*"
        formName={formData.email}
        inputName="email"
      />
      <FormInput
        type="tel"
        handleFunc={handleChange}
        title="Celular con WhatsApp*"
        formName={formData.whatsapp}
        inputName="whatsapp"
      />

      <p className="text-sm">
        Te enviaremos los tickets vía email y/o WhatsApp
      </p>

      <CheckFormInput
        handleFunc={handleCheckboxChange}
        inputData={formData.receiveInfo}
      />

      <button
        type="submit"
        className="bg-primary text-black input-button"
      >
        Continuar
      </button>
    </DefaultForm>
  );
}
