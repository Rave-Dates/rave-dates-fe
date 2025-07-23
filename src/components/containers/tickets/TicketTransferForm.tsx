"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
// import FormInput from "@/components/ui/inputs/FormInput";
import type React from "react";
import { redirect } from 'next/navigation';
// import { useState } from "react";
import { myTickets } from "@/template-data";
import TitleCard from "../../common/TitleCard";

const TicketTransferForm = ({ ticketId } : { ticketId: number }) => {
  const selectedTicket = myTickets.find(event => event.id === ticketId);
  
  // const [formData, setFormData] = useState({
  //   name: "",
  //   idNumber: "",
  //   email: "",
  //   whatsapp: "",
  // });
  
  if (!selectedTicket) return redirect("/")
    
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // console.log("Form submitted:", formData);
  };

  return (
      <DefaultForm ticketButtons={true} handleSubmit={handleSubmit} title="Tickets propios">
        <div className="flex flex-col w-full gap-y-2">
          <TitleCard title="DYEN" description="Extended set" />
          <h3 className="bg-cards-container px-4 py-3 font-light rounded-xl">Entrada general</h3>
        </div>
        
        {/* <FormInput
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
        /> */}
                <h2 className="text-xs !mb-2">Nombre y apellido</h2>
        <input
          className={`w-full bg-main-container border outline-none border-main-container rounded-lg py-3 px-4 text-white`}
          title="Nombre y apellido*"
        />
        <h2 className="text-xs !mb-2">Cédula o Pasaporte</h2>
        <input
          className={`w-full bg-main-container border outline-none border-main-container rounded-lg py-3 px-4 text-white`}
          title="Cédula o Pasaporte*"
        />
        <h2 className="text-xs !mb-2">Email</h2>
        <input
          className={`w-full bg-main-container border outline-none border-main-container rounded-lg py-3 px-4 text-white`}
          type="email"
          title="Email*"
        />
        <h2 className="text-xs !mb-2">Celular con WhatsApp</h2>
        <input
          className={`w-full bg-main-container border outline-none border-main-container rounded-lg py-3 px-4 text-white`}
          type="tel"
          title="Celular con WhatsApp*"
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
  );
}

export default TicketTransferForm;
