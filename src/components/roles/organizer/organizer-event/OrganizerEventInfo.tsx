"use client"

import { DropdownItem } from "@/components/roles/admin/events/DropDownItem"
import { StageItem } from "@/components/roles/admin/events/StageItem"
import EditSvg from "@/components/svg/EditSvg"
import EyeSvg from "@/components/svg/EyeSvg"
import { useAdminBinnacles } from "@/hooks/admin/queries/useAdminData"
import { useClientEventTickets } from "@/hooks/client/queries/useClientData"
import { CookieValueTypes } from "cookies-next"
import { jwtDecode } from "jwt-decode"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function OrganizerEventInfo({ eventId, token, isPromoter }: { eventId: number, token: CookieValueTypes, isPromoter?: boolean }) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [globalExpandedSections, setGlobalExpandedSections] = useState<string[]>([])
  const decoded: IUserLogin | null = token ? jwtDecode(token.toString()) : null;

  const { eventTickets: ticketTypes } = useClientEventTickets(eventId);

  const { organizerBinnacles } = useAdminBinnacles({
    organizerId: decoded?.organizerId ?? 0,
    token: token?.toString() ?? "",
  });

  const selectedBinnacle = organizerBinnacles?.find(b => b.eventId === eventId);

  useEffect(() => {
    setGlobalExpandedSections(["Vendidas y dinero generado"]);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const toggleGlobalSection = (section: string) => {
    setGlobalExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const types = ["Vendidas y dinero generado", "Dinero", "Promotores"]

  return (
    <div className="rounded-lg text-white w-full flex items-start justify-center mb-44 h-full">
      <div className="w-full">
        {
          !isPromoter && types.map((type) => (
            <DropdownItem
              key={type}
              title={type}
              className="!bg-input mt-2"
              isExpanded={globalExpandedSections.includes(type)}
              onToggle={() => toggleGlobalSection(type)}
            >
              <div className="bg-input px-2 py-1 rounded-b-lg">
                {
                  type === "Vendidas y dinero generado" && 
                  <div className="mb-2">
                    <div className="flex bg-main-container justify-between p-3 rounded-lg items-center">
                      <h1>Total vendido:</h1>
                      <span className="text-primary">
                        3.333
                        <span className="text-xs">($150.000)</span>
                      </span>
                    </div>
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
                }
                {
                  type === "Dinero" && 
                  <div className="border-t-2 flex flex-col gap-y-3 pt-5 mt-3 px-2 pb-2 text-text-inactive border-dashed border-inactive">
                    <div className="flex text-sm justify-between items-center">
                      <h2>Total</h2>
                      <h2 className="text-primary text-base text-end tabular-nums">COP ${Number(selectedBinnacle?.total).toLocaleString()}</h2>
                    </div>

                    <div className="flex text-sm justify-between items-center">
                      <h2>Dinero entregado</h2>
                      <h2 className="text-primary text-base text-end tabular-nums">COP ${selectedBinnacle?.alreadyPaid.toLocaleString()}</h2>
                    </div>

                    <div className="flex text-sm justify-between items-center">
                      <h2>Dinero disponible</h2>
                      <h2 className="text-primary text-base text-end tabular-nums">COP ${selectedBinnacle?.pendingPayment.toLocaleString()}</h2>
                    </div>

                    <Link href={`/organizer/event/${eventId}/money-withdrawn`} className="input-button block text-center text-sm py-3 text-primary-black bg-primary">
                      Ver dinero entregado
                    </Link>
                  </div>
                }
                {
                  type === "Promotores" && 
                  <div className="space-y-2 rounded-lg px-2 pb-2">

                    <div className="flex justify-between items-center">
                      <h2>Juan Gomez</h2>
                      <div className="flex items-center gap-x-2">
                        <button className="border border-primary rounded-lg text-primary p-1 text-xl"><EditSvg /></button>
                        <button className="bg-primary p-1 text-xl text-primary-black rounded-lg"><EyeSvg /></button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <h2>Juan Gomez</h2>
                      <div className="flex items-center gap-x-2">
                        <button className="border border-primary rounded-lg text-primary p-1 text-xl"><EditSvg /></button>
                        <button className="bg-primary p-1 text-xl text-primary-black rounded-lg"><EyeSvg /></button>
                      </div>
                    </div>

                  </div>
                }
              </div>
            </DropdownItem>
          ))
        }

        {
          isPromoter &&
          <div className="bg-input mt-2 rounded-lg px-3 py-2">
            <h1 className="font-medium px-2 my-2">Dinero</h1>
            <div className="border-t-2 flex flex-col gap-y-3 pt-5 mt-3 px-2 pb-2 text-text-inactive border-dashed border-inactive">
              <div className="flex text-sm justify-between items-center">
                <h2>Total</h2>
                <h2 className="text-primary text-base text-end tabular-nums">COP ${Number(selectedBinnacle?.total).toLocaleString()}</h2>
              </div>

              <div className="flex text-sm justify-between items-center">
                <h2>Dinero entregado</h2>
                <h2 className="text-primary text-base text-end tabular-nums">COP ${selectedBinnacle?.alreadyPaid.toLocaleString()}</h2>
              </div>

              <div className="flex text-sm justify-between items-center">
                <h2>Dinero disponible</h2>
                <h2 className="text-primary text-base text-end tabular-nums">COP ${selectedBinnacle?.pendingPayment.toLocaleString()}</h2>
              </div>

              <Link href={`/promoter/event/${eventId}/money-withdrawn`} className="input-button block text-center text-sm py-3 text-primary-black bg-primary">
                Ver dinero entregado
              </Link>
            </div> 
          </div>
        }


        {/* Dropdown Sections */}
        <div className="overflow-hidden">
          {/* General Section */}
        </div>
      </div>
    </div>
  )
}
