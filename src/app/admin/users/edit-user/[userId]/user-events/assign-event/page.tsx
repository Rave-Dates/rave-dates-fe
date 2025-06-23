"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import React, { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
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
    <div className="min-h-screen px-4 bg-primary-black pb-40 sm:pb-32 flex flex-col justify-between">
      <DefaultForm className="h-full pb-10 sm:pb-20" handleSubmit={handleSubmit} title="Asignar evento">
        <FormDropDown
          title="Evento*"
          handleFunc={handleChange}
        >
          <option value="event1">Evento 1</option>
          <option value="event2">Evento 2</option>
          <option value="event3">Evento 3</option>
        </FormDropDown>
        <FormInput
          type="number"
          handleFunc={handleChange}
          title="Comisión (%)*"
          formName={formData.commission}
          inputName="commission"
        />
      </DefaultForm>
      
      <button
        type="submit"
        className="bg-primary max-w-xl self-center text-black input-button"
      >
        Asignar evento
      </button>
    </div>
  );
}
