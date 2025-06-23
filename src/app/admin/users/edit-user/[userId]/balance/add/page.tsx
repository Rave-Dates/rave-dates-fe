"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import React, { useState } from "react";

export default function AddBalance() {
  const [formData, setFormData] = useState({
    concept: "",
    moveDate: "",
    amount: "",
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
    <div className="min-h-screen px-4 bg-primary-black pb-40 sm:pb-32 flex flex-col justify-between">
      <DefaultForm className="h-full pb-10 sm:pb-20" handleSubmit={handleSubmit} title="Ingresar movimiento">
        <FormDropDown
          title="Concepto*"
          handleFunc={handleChange}
        >
          <option value="event1">Evento 1</option>
          <option value="retire">Retiro</option>
          <option value="retire2">Retiro 2</option>
        </FormDropDown>
        <FormInput
          handleFunc={handleChange}
          title="Fecha de movimiento*"
          formName={formData.moveDate}
          inputName="moveDate"
        />
        <FormInput
          type="number"
          handleFunc={handleChange}
          title="Monto*"
          formName={formData.amount}
          inputName="amount"
        />

      </DefaultForm>
      <button
        type="submit"
        className="bg-primary max-w-xl self-center text-black input-button"
      >
        Ingresar movimiento
      </button>
    </div>
  );
}
