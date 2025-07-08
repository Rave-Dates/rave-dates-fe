"use client"

import { DropdownItem } from "@/components/roles/admin/events/DropDownItem"
import { StageItem } from "@/components/roles/admin/events/StageItem"
import UserSvg from "@/components/svg/UserSvg"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import { getTicketTypesById } from "@/services/admin-events"
import { useQuery } from "@tanstack/react-query"
import { useReactiveCookiesNext } from "cookies-next"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function EventInfo({ eventId }: { eventId: number }) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");

  const { data: ticketTypes } = useQuery({
    queryKey: ["ticketTypes"],
    queryFn: () => getTicketTypesById(token, eventId),
    enabled: !!token, // solo se ejecuta si hay token
  });

  useEffect(() => {
    if (ticketTypes && ticketTypes.length > 0) {
      setExpandedSections([ticketTypes[0].name]);
    }
  }, [ticketTypes]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  return (
    <div className="bg-primary-black text-white w-full flex items-start justify-center lg:pt-44 pb-44 min-h-screen p-4">
      <GoBackButton className="absolute z-30 top-10 left-5 p-3 animate-fade-in" />
      <Link
        href="/admin/events/event-info/attendees"
        className="absolute block text-center z-30 top-10 right-5 p-3 animate-fade-in bg-primary text-primary-black rounded-xl"
      >
        <UserSvg stroke={1.7} className="text-2xl" />
      </Link>
      <div className="w-full pt-24">
        {/* Header */}
        <div className="flex justify-between text-xl font-medium items-center mb-4">
          <h1>Asistentes totales</h1>
          <span>9.999</span>
        </div>

        {/* Dropdown Sections */}
        <div className="overflow-hidden">
          {/* General Section */}
          {
            ticketTypes?.map((stage) => (
              <DropdownItem
                key={stage.name}
                title={stage.name}
                isExpanded={expandedSections.includes(stage.name)}
                onToggle={() => toggleSection(stage.name)}
              >
                <div className="space-y-2 bg-main-container rounded-b-lg p-4">
                  <StageItem
                    key={stage.ticketTypeId}
                    items={stage.stages}
                  />
                </div>
              </DropdownItem>
              ))
          }
        </div>
      </div>
    </div>
  )
}
