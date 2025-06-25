"use client"

import GoBackButton from "@/components/ui/buttons/GoBackButton"
import FormInput from "@/components/ui/inputs/FormInput";
import { useState } from "react"

export default function FreeTicketConfiguration() {
  const [formData, setFormData] = useState({
    ticketName: "",
    amount: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-primary-black text-primary-white flex flex-col justify-between min-h-screen px-6 pt-28 pb-32">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />

      {/* Configuration Options */}
      <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-x-5">
        <h1 className="text-title font-bold mb-6">Configura los tickets</h1>
        
        <FormInput
          handleFunc={handleChange}
          title="Ticket"
          formName={formData.ticketName}
          inputName="ticketName"
        />
        <FormInput
          type="number"
          handleFunc={handleChange}
          title="Cantidad"
          formName={formData.amount}
          inputName="amount"
        />
      </form>

      <button
        className="w-full bg-primary text-black font-medium py-4 text-lg rounded-lg mt-10 flex items-center justify-center gap-2"
      >
        Crear evento
      </button>
    </div>
  )
}
