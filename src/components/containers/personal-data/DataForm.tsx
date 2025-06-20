"use client"

import GoBackButton from "@/components/buttons/GoBackButton"
import CheckFormInput from "@/components/inputs/CheckFormInput"
import FormInput from "@/components/inputs/FormInput"
import type React from "react"

import { useState } from "react"

export default function DataForm() {
  const [formData, setFormData] = useState({
    name: "",
    idNumber: "",
    email: "",
    whatsapp: "",
    receiveInfo: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, receiveInfo: checked }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission logic here
  }

  return (
    <div className="min-h-screen pt-24 bg-primary-black text-white flex items-center justify-center px-6 pb-32 sm:pb-5">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="w-full max-w-2xl animate-fade-in">
        <h1 className="text-title font-bold mb-6">Ingresa tus datos</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <p className="text-sm">Te enviaremos los tickets vía email y/o WhatsApp</p>

          <CheckFormInput 
            handleFunc={handleCheckboxChange} 
            inputData={formData.receiveInfo} 
          />

          <button
            disabled={!formData.receiveInfo}
            type="submit"
            className={`${formData.receiveInfo ? "bg-primary text-black" : "bg-inactive text-text-inactive pointer-events-none"} w-full font-medium hover:opacity-75 py-4 rounded-lg mt-4 transition-opacity select-none`}
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  )
}
