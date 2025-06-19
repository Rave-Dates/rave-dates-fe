"use client"

import SuccessCheckSvg from "@/components/svg/SuccessCheckSvg"
import Link from "next/link"
import type React from "react"

export default function Verification() {
  return (
    <div className="min-h-screen pb-32 pt-28 sm:pb-24 sm:pt-40 bg-primary-black gap-20 sm:gap-14 flex flex-col justify-end sm:justify-center items-center text-white">
      <div className="flex flex-col w-full items-center justify-center">
        <SuccessCheckSvg className="text-primary" />
        <p className="w-52 text-center text-text-inactive">Has transferido el ticket correctamente</p>
      </div>

      <div className="flex flex-col w-full px-4 max-w-md">
        <Link
          href="/transfer-confirm/transfer"
          className="text-primary-white mb-0 py-4 text-center w-full block"
        >
          Transferir otro ticket
        </Link>
        <Link
          href="/tickets"
          className="bg-primary text-center text-black mt-1 input-button"
        >
          Ir a mis tickets
        </Link>
      </div>
    </div>
  )
}
