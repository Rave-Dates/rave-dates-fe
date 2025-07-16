import SuccessView from "@/components/common/SuccessView"
import type React from "react"

export default function Page() {
  return (
    <SuccessView
      title="Has transferido el ticket correctamente"
      link1={{ href: "/transfer-confirm/transfer", text: "Transferir otro ticket" }}
      link2={{ href: "/tickets", text: "Ir a mis tickets" }}
    />
  )
}
