"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import FormInput from "@/components/ui/inputs/FormInput";
import type React from "react";

import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    idNumber: "",
    date: "",
    time: "",
    buyId: "",
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
    <DefaultForm handleSubmit={handleSubmit} title="Comprador">
      <FormInput
        handleFunc={handleChange}
        title="Nombre completo"
        formName={formData.name}
        inputName="name"
      />
      <FormInput
        type="email"
        handleFunc={handleChange}
        title="Email"
        formName={formData.email}
        inputName="email"
      />
      <FormInput
        type="number"
        handleFunc={handleChange}
        title="Número de celular"
        formName={formData.phone}
        inputName="phone"
      />
      <FormInput
        type="number"
        handleFunc={handleChange}
        title="Cédula"
        formName={formData.idNumber}
        inputName="idNumber"
      />

      <FormDropDown
        title="Tipo ticket"
        handleFunc={handleChange}
      >
        <option value="VIP">VIP</option>
        <option value="GENERAL">GENERAL</option>
        <option value="BACKSTAGE">BACKSTAGE</option>
      </FormDropDown>

      <div className="flex w-full gap-x-4">
        <FormInput
          handleFunc={handleChange}
          title="Fecha"
          formName={formData.date}
          inputName="date"
        />
        <FormInput
          handleFunc={handleChange}
          title="Hora"
          formName={formData.time}
          inputName="time"
        />
      </div>
      <FormInput
        type="number"
        handleFunc={handleChange}
        title="ID de compra"
        formName={formData.buyId}
        inputName="buyId"
      />

      <div className="flex flex-col gap-y-4">
        <div>
          <h3 className="text-text-inactive text-sm font-medium mb-1">
            Ticket escaneado por:
          </h3>
          <h2>
            Pedro Hernández
          </h2>
        </div>
        <div>
          <h3 className="text-text-inactive text-sm font-medium mb-1">
            Pasarela de pago utilizada
          </h3>
          <h2>
            Mastercard
          </h2>
        </div>
        <div>
          <h3 className="text-text-inactive text-sm font-medium mb-1">
            ID de la compra en pasarela
          </h3>
          <h2>
            12742189472198
          </h2>
        </div>
        <div>
          <h3 className="text-text-inactive text-sm font-medium mb-1">
            Venta
          </h3>
          <h2>
            Promotor (Daniela Leila)
          </h2>
        </div>
      </div>

      <div>
        <button
          // type="submit"
          className="!mb-0 input-button mt-10"
        >
          Rehabilitar
        </button>
        <button
          // type="submit"
          className="bg-primary text-black mt-1 input-button"
        >
          Guardar
        </button>
      </div>
    </DefaultForm>
  );
}
