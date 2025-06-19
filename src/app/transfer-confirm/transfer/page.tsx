"use client"

import EventDetails from "@/components/containers/checkout/EventDetails"
import TitleCard from "@/components/containers/common/TitleCard"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import Link from "next/link"
import type React from "react"

export default function Verification() {
  return (
    <div className="min-h-screen pb-40 pt-28 sm:pb-24 sm:pt-36 bg-primary-black sm:justify-center sm:items-center text-white flex px-6">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="flex w-xl animate-fade-in mx-auto flex-col gap-y-2 items-center sm:justify-center">
        <TitleCard className="sm:flex hidden w-full mb-2 px-3 py-2 rounded-md" title="DYEN" description="Extended set" />
        
        <div className="sm:flex hidden bg-cards-container w-full rounded-md px-5 py-3 gap-x-4 mb-3">
          <h2 className="font-light text-sm">Viernes, 11 de junio - 08:00 PM</h2>
        </div>

        <EventDetails className="sm:hidden mb-3 block w-full" />

        <h2 className="text-start w-full">Entradas</h2>

        <div className="flex w-full">
          <div
            className="w-full flex justify-center flex-col items-start text-sm bg-cards-container outline-none rounded-l-lg ps-4"
            >
            <h2>GENERAL</h2>
            <h3 className="text-text-inactive">Juan Gómez</h3>
          </div>
          <div className="bg-cards-container pe-4 py-5 rounded-r-lg">
            <Link href="transfer/receiver-data" className="block text-center bg-primary hover:opacity-80 text-black rounded px-4 py-2 text-sm transition-opacity">Transferir</Link>
          </div>
        </div>

        <div className="flex w-full">
          <div
            className="w-full flex justify-center flex-col items-start text-sm bg-cards-container outline-none rounded-l-lg ps-4"
            >
            <h2>VIP</h2>
            <h3 className="text-text-inactive">Juan Gómez</h3>
          </div>
          <div className="bg-cards-container pe-4 py-5 rounded-r-lg">
            <Link href="transfer/receiver-data" className="block text-center bg-primary hover:opacity-80 text-black rounded px-4 py-2 text-sm transition-opacity">Transferir</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
