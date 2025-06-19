"use client"

import VerificationTypeSelector from "@/components/containers/otp/VerificationTypeSelector"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import Link from "next/link"
import type React from "react"

import { useState, useRef } from "react"

export default function Verification() {
  const [code, setCode] = useState(["", "", "", ""])
  const [selectedVerification, setSelectedVerification] = useState("Email");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleInputChange = (index: number, value: string) => {
    // Only allow single digits
    if (value.length > 1) return

    const newCode = [...code]
    newCode[index] = value

    setCode(newCode)

    // Auto-advance to next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").slice(0, 4)
    const newCode = pastedData.split("").slice(0, 4)

    // Fill remaining slots with empty strings
    while (newCode.length < 4) {
      newCode.push("")
    }

    setCode(newCode)

    // Focus on the next empty input or the last one
    const nextEmptyIndex = newCode.findIndex((digit) => digit === "")
    const focusIndex = nextEmptyIndex === -1 ? 3 : nextEmptyIndex
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSendCode = () => {
    console.log("Sending validation code...")
    // Implement send code logic
  }

  const handleContinue = () => {
    const fullCode = code.join("")
    console.log("Verification code:", fullCode)
    // Implement continue logic
  }

  const isCodeComplete = code.every((digit) => digit !== "")

  return (
    <div className="min-h-screen pb-40 pt-28 sm:pb-24 sm:pt-36 bg-primary-black sm:justify-center sm:items-center text-white flex px-6">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="max-w-md mx-auto space-y-3">
        <h1 className="text-3xl font-bold">Valida tus datos</h1>

        {/* Verification Status */}
        <div className="space-y-3">
          <VerificationTypeSelector 
            selected={selectedVerification} 
            setSelected={setSelectedVerification} 
          />
        </div>

        {/* Send Code Button */}
        <button
          onClick={handleSendCode}
          className="w-full mb-8 bg-primary text-black font-medium py-3 rounded-lg hover:bg-[#b8f000] transition-colors"
        >
          Enviar código de validación
        </button>

        {/* Code Input Section */}
        <div className="space-y-4">
          <p className="text-sm">Ingresa el código de 4 dígitos que te enviamos</p>

          <div className="flex w-full gap-2 sm:gap-4 justify-center">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="number"
                inputMode="numeric"
                pattern="[0-9]"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-1/2 h-20 sm:h-28 bg-cards-container border border-cards-container rounded-lg text-center text-2xl font-bold text-white focus:border-primary focus:outline-none"
              />
            ))}
          </div>
        </div>

        {/* Continue Button */}
        <Link
          href="/transfer-confirm"
          onClick={handleContinue}
          className={`${!isCodeComplete && "opacity-80 pointer-events-none"} block text-center w-full bg-primary text-black font-medium py-3 rounded-lg hover:bg-[#b8f000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          Continuar
        </Link>

        {/* Disclaimer */}
        <p className="text-xs text-neutral-400 text-center">
          Te enviaremos los tickets vía email o Whatsapp. En tu email revisa las
          carpetas de Spam, No deseados, Promociones y otras carpetas ocultas.
        </p>
      </div>
    </div>
  )
}
