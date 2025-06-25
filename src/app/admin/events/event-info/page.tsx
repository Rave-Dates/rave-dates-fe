"use client"

import { DropdownItem } from "@/components/roles/admin/events/DropDownItem"
import { StageItem } from "@/components/roles/admin/events/StageItem"
import UserSvg from "@/components/svg/UserSvg"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import { useState } from "react"

export default function AttendeesDropdown() {
  const [expandedSections, setExpandedSections] = useState<string[]>(["general"])

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const stageData = [
    {
      title: "Etapa 1",
      value: "1.111",
      amount: "$750.000",
      items: [
        { label: "Ventas por página", value: "500", amount: "$750.000" },
        { label: "Ventas de promotores", value: "611", amount: "$750.000" },
        { label: "Entradas de cortesía", value: "100" },
      ],
    },
    {
      title: "Etapa 2",
      value: "1.111",
      amount: "$750.000",
      items: [
        { label: "Ventas por página", value: "500", amount: "$750.000" },
        { label: "Ventas de promotores", value: "611", amount: "$750.000" },
        { label: "Entradas de cortesía", value: "100" },
      ],
    },
    {
      title: "Etapa 3",
      value: "1.111",
      amount: "$750.000",
      items: [
        { label: "Ventas por página", value: "500", amount: "$750.000" },
        { label: "Ventas de promotores", value: "611", amount: "$750.000" },
        { label: "Entradas de cortesía", value: "100" },
      ],
    },
  ]

  return (
    <div className="bg-primary-black text-white w-full flex items-start justify-center lg:pt-44 pb-44 min-h-screen p-4">
      <GoBackButton className="absolute z-30 top-10 left-5 p-3 animate-fade-in" />
      <button
        className="absolute z-30 top-10 right-5 p-3 animate-fade-in bg-primary text-primary-black rounded-xl"
      >
        <UserSvg stroke={1.7} className="text-2xl" />
      </button>
      <div className="w-full pt-24">
        {/* Header */}
        <div className="flex justify-between text-xl font-medium items-center mb-4">
          <h1>Asistentes totales</h1>
          <span>9.999</span>
        </div>

        {/* Dropdown Sections */}
        <div className="overflow-hidden">
          {/* General Section */}
          <DropdownItem
            title="General:"
            value="3.333"
            amount="$150.000"
            isExpanded={expandedSections.includes("general")}
            onToggle={() => toggleSection("general")}
          >
            <div className="space-y-2 bg-main-container rounded-b-lg p-4">
              {stageData.map((stage, index) => (
                <StageItem
                  key={index}
                  title={stage.title}
                  value={stage.value}
                  amount={stage.amount}
                  items={stage.items}
                />
              ))}
            </div>
          </DropdownItem>

          {/* VIP Section */}
          <DropdownItem
            title="VIP:"
            value="3.333"
            isExpanded={expandedSections.includes("vip")}
            onToggle={() => toggleSection("vip")}
          >
            <div className="p-4 text-sm bg-main-container rounded-b-lg">
              <p>contendido de VIP</p>
            </div>
          </DropdownItem>

          {/* Backstage Section */}
          <DropdownItem
            title="Backstage:"
            value="3.333"
            isExpanded={expandedSections.includes("backstage")}
            onToggle={() => toggleSection("backstage")}
          >
            <div className="p-4 text-sm bg-main-container rounded-b-lg">
              <p>contendido de Backstage</p>
            </div>
          </DropdownItem>
        </div>
      </div>
    </div>
  )
}
