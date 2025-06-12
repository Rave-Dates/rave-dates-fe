"use client"

import GoBackButton from "@/components/buttons/GoBackButton"
import FormInput from "@/components/inputs/FormInput"
import CheckSvg from "@/components/svg/CheckSvg"
import type React from "react"

import { useState } from "react"

export default function DataForm() {
  const [formData, setFormData] = useState({
    name: "",
    idNumber: "",
    email: "",
    whatsapp: "",
    receiveInfo: true,
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

          <div className="flex items-center w-fit space-x-2 select-none">
            {/* Invisible real checkbox (for accessibility if needed) */}
            <input
              type="checkbox"
              id="receiveInfo"
              name="receiveInfo"
              checked={formData.receiveInfo}
              onChange={() => handleCheckboxChange(!formData.receiveInfo)}
              className="hidden cursor-pointer"
            />

            {/* Visual representation */}
            <div
              onClick={() => handleCheckboxChange(!formData.receiveInfo)}
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors cursor-pointer border
              ${formData.receiveInfo ? "bg-primary text-black border-primary" : "border-inactive text-transparent"}`}
            >
              <CheckSvg />
            </div>

            <label htmlFor="receiveInfo" className="text-xs h-full text-text-inactive select-none cursor-pointer">
              Recordarme en este dispositivo
            </label>
          </div>

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
