"use client"

import { DropdownItem } from "@/components/roles/admin/events/DropDownItem"
import { StageItem } from "@/components/roles/admin/events/StageItem"
import UserSvg from "@/components/svg/UserSvg"
import GoBackButton from "@/components/ui/buttons/GoBackButton"
import { useAdminBinnacles, useAdminEvent, useAdminEventBinnacles, useAdminGetOrganizerFromEvent, useAdminPromoterBinnacles, useAdminPromoterTicketMetrics, useAdminTicketMetrics, useAdminTicketTypes, useAdminUserById } from "@/hooks/admin/queries/useAdminData"
import { useReactiveCookiesNext } from "cookies-next"
import Link from "next/link"
import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function EventInfo() {
  const { getCookie } = useReactiveCookiesNext();
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const token = getCookie("token");
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = Number(params.userId);
  const eventId = Number(params.eventId);
  const organizerId = Number(searchParams.get("organizerId"));


  const { selectedEvent } = useAdminEvent({ token, eventId });
  const { data: user } = useAdminUserById({ token, userId: userId });
  const { ticketTypes } = useAdminTicketTypes({ token, eventId });
  const { organizerFromEvent } = useAdminGetOrganizerFromEvent({ token, eventId: eventId });
  const { eventBinnacles } = useAdminEventBinnacles({ token, eventId });
  
  const { organizerBinnacles } = useAdminBinnacles({
    organizerId: organizerId ? organizerFromEvent?.organizerId : user?.organizer?.organizerId ?? 0,
    token: token?.toString() ?? "",
  });
  
  const { promoterBinnacles } = useAdminPromoterBinnacles({
    promoterId: user?.promoter?.promoterId ?? 0,
    token: token?.toString() ?? "",
  });
  
  const { ticketMetrics } = useAdminTicketMetrics({ token, eventId });
  const { promoterTicketMetrics } = useAdminPromoterTicketMetrics({ token, eventId, promoterId: user?.promoter?.promoterId });
  
  const selectedBinnacle = organizerBinnacles?.find(b => b.eventId === eventId);
  const selectedPromoterBinnacle = promoterBinnacles?.events.find(b => b.eventId === eventId);
  const selectedEventBinnacle = eventBinnacles?.find(b => b.eventId === eventId);
  
  const binnacleToUse =
    user?.role.name === "ORGANIZER" ? selectedBinnacle  :
    selectedEventBinnacle;

  const ticketMetricsToUse = user?.role.name === "PROMOTER" ? promoterTicketMetrics : ticketMetrics;
  
  console.log(ticketMetricsToUse)

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
        href="event-info/attendees"
        className="absolute block text-center z-30 top-10 right-5 p-3 animate-fade-in bg-primary text-primary-white rounded-xl"
      >
        <UserSvg stroke={1.7} className="text-2xl" />
      </Link>
      <div className="w-full pt-24">
        {/* Header */}
        <h1 className="text-2xl mb-7 text-center font-semibold">{selectedEvent?.title}</h1>

        <div className="flex justify-between text-xl font-medium items-center mb-4">
          <h1>Asistentes totales</h1>
          <span>{ticketMetricsToUse?.ticketsPurchased.toLocaleString()}</span>
        </div>

        {/* Dropdown Sections */}
        <div className="overflow-hidden">
          {/* General Section */}
            {
              binnacleToUse && binnacleToUse?.stages ?
              <>
                {
                  user?.role.name !== "PROMOTER" ?
                    binnacleToUse?.stages?.map((stageGroup, groupIndex) => (
                    <DropdownItem
                      key={`${groupIndex}-${groupIndex}`}
                      title={stageGroup[0].ticketType}
                      isExpanded={expandedSections.includes(stageGroup[0].ticketType)}
                      onToggle={() => toggleSection(stageGroup[0].ticketType)}
                    >
                      <div className="space-y-2 bg-main-container px-4 pb-3 rounded-b-lg">
                        {
                          stageGroup.map((stage, stageIndex) => (
                            <StageItem
                              key={stageIndex}
                              stage={stage}
                              quantity={stage.quantity}
                              index={stageIndex}
                            />
                          ))
                        }
                      </div>
                    </DropdownItem>
                  ))
                  :
                  selectedPromoterBinnacle?.stages?.stages?.map((stageGroup, groupIndex) => (
                    <DropdownItem
                      key={`${groupIndex}-${groupIndex}`}
                      title={stageGroup[0].ticketType}
                      isExpanded={expandedSections.includes(stageGroup[0].ticketType)}
                      onToggle={() => toggleSection(stageGroup[0].ticketType)}
                    >
                      <div className="space-y-2 bg-main-container px-4 pb-3 rounded-b-lg">
                        {
                          stageGroup.map((stage, stageIndex) => (
                            <StageItem
                              key={stageIndex}
                              stage={stage}
                              quantity={stage.quantity}
                              index={stageIndex}
                            />
                          ))
                        }
                      </div>
                    </DropdownItem>
                  ))
                }
              </>
              :
                <div className="text-center pt-2 pb-6 text-text-inactive">
                No se encontró información para mostrar
              </div>
            }
        </div>
      </div>
    </div>
  )
}
