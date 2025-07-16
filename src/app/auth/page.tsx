"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import CheckFormInput from "@/components/ui/inputs/CheckFormInput";
import FormInput from "@/components/ui/inputs/FormInput";
import type React from "react";

import { useState } from "react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
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
  };

  return (
    <DefaultForm handleSubmit={handleSubmit} title="Iniciar sesión">
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
        disabled={!formData.receiveInfo}
        type="submit"
        className={`${
          formData.receiveInfo
            ? "bg-primary text-black"
            : "bg-inactive text-text-inactive pointer-events-none"
        } input-button`}
      >
        Iniciar sesión
      </button>
    </DefaultForm>
  );
}
