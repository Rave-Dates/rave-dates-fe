"use client"

import ArrowSvg from "@/components/svg/ArrowSvg"
import Link from "next/link"
import type React from "react"

export default function Verification() {
  return (
    <div className="min-h-screen pb-40 pt-20 sm:pb-24 sm:pt-36 bg-primary-black sm:justify-center sm:items-center text-white flex px-6">
      <div className="flex animate-fade-in w-xl mx-auto flex-col items-center sm:justify-center">        
        <h1 className="font-semibold text-start w-full text-title">¿Deseas transferir tus tickets?</h1>
        <h2 className="text-start w-full text-sm mb-5">
          Podrás realizar esta acción más adelante en caso de que no quieras hacerlo ahora.
        </h2> 

        <div className="flex w-full border-b border-divider">
          <div
            className="w-full flex font-light justify-center flex-col items-start bg-cards-container outline-none rounded-t-lg ps-4"
            >
            <h2>No, quiero recibirlos yo</h2>
          </div>
          <div className="bg-cards-container pe-4 py-3 rounded-b-lg">
            <ArrowSvg className="rotate-180" />
          </div>
        </div>

        <Link href="/transfer-confirm/transfer" className="flex w-full">
          <div
            className="w-full flex font-light justify-center flex-col items-start bg-cards-container outline-none rounded-b-lg ps-4"
            >
            <h2>Sí, quiero transferirlos</h2>
          </div>
          <div className="bg-cards-container pe-4 py-3 rounded-b-lg">
            <ArrowSvg className="rotate-180" />
          </div>
        </Link>
      </div>
    </div>
  )
}
