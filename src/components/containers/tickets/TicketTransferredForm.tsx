"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormInput from "@/components/ui/inputs/FormInput";
import type React from "react";
import { redirect } from 'next/navigation';
import { useState } from "react";
import { myTickets } from "@/template-data";
import Link from "next/link";

const TicketTransferredForm = ({ ticketId } : { ticketId: number }) => {
  const selectedTicket = myTickets.find(event => event.id === ticketId);
  
  const [formData, setFormData] = useState({
    name: "",
    idNumber: "",
    email: "",
    whatsapp: "",
  });
  
  if (!selectedTicket) return redirect("/")
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
      <DefaultForm handleSubmit={handleSubmit} title="Transferidos">
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


        <Link
          href="/"
          className="text-system-error mb-0 pb-3 pt-5 text-center w-full block"
        >
          Enlace no validado
        </Link>
        <button
          type="submit"
          className="bg-primary text-black input-button"
        >
          Transferir
        </button>
      </DefaultForm>
  );
}

export default TicketTransferredForm;
