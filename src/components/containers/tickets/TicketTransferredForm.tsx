"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
// import FormInput from "@/components/ui/inputs/FormInput";
import type React from "react";
import { redirect } from 'next/navigation';
// import { useState } from "react";
import { myTickets } from "@/template-data";
import Link from "next/link";

const TicketTransferredForm = ({ ticketId } : { ticketId: number }) => {
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
      <DefaultForm handleSubmit={handleSubmit} title="Transferidos">
        {/* <FormInput
          title="Nombre y apellido*"
          inputName="name"
          register={console.log()}
        />
        <FormInput
          title="Cédula o Pasaporte*"
          inputName="idNumber"
        />
        <FormInput
          type="email"
          title="Email*"
          inputName="email"
        />
        <FormInput
          type="tel"
          title="Celular con WhatsApp*"
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
