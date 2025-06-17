"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormInput from "@/components/ui/inputs/FormInput";
import type React from "react";
import { redirect } from 'next/navigation';
import { useState } from "react";
import { myTickets } from "@/template-data";
import Image from "next/image";

const TicketTransferForm = ({ ticketId } : { ticketId: number }) => {
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
    <>
      <h1>{selectedTicket.userName}</h1>
      <DefaultForm ticketButtons={true} handleSubmit={handleSubmit} title="Tickets propios">
        <div className="flex flex-col w-full gap-y-2">
          <div className="bg-cards-container flex gap-x-4 px-4 py-3 rounded-xl">
            <Image className="w-14 h-14" src="/logo.svg" width={1000} height={1000} alt="logo" />
            <div className="flex flex-col items-start justify-center">
              <h2 className="text-xl font-medium">DYEN</h2>
              <h3 className="text-text-inactive">Extended set</h3>
            </div>
          </div>
          <h3 className="bg-cards-container px-4 py-3 font-light rounded-xl">Entrada general</h3>
        </div>
        
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

        <button
          type="submit"
          className="bg-primary text-black input-button"
        >
          Transferir
        </button>
      </DefaultForm>
    </>
  );
}

export default TicketTransferForm;
