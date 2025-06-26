import SuccessView from "@/components/common/SuccessView"
import type React from "react"

export default function Page() {
  return (
    <SuccessView
      gap="gap-8 sm:gap-5"
      title="Los tickets se han enviado correctamente"
      link2={{ href: "/admin/events/event-info/attendees", text: "Aceptar" }}
    />
  )
}
