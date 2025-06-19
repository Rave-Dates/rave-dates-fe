import SuccessView from "@/components/common/SuccessView"
import type React from "react"

export default function Page() {
  return (
    <SuccessView
      gap="gap-8 sm:gap-5"
      title="Ticket adquirido con éxito"
      link2={{ href: "/tickets", text: "Ir a mis tickets" }}
    />
  )
}
