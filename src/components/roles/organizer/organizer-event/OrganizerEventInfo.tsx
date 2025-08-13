"use client"

import { DropdownItem } from "@/components/roles/admin/events/DropDownItem"
import { StageItem } from "@/components/roles/admin/events/StageItem"
import EditSvg from "@/components/svg/EditSvg"
import EyeSvg from "@/components/svg/EyeSvg"
import FormDropDown from "@/components/ui/inputs/FormDropDown"
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications"
import { useAdminBinnacles, useAdminEvent, useAdminGetCheckers, useAdminGetPromoterLink, useAdminPromoterBinnacles, useAdminPromoterTicketMetrics, useAdminTicketMetrics, useAdminTicketTypes } from "@/hooks/admin/queries/useAdminData"
import { generateCheckerLink, updateCheckerTicketTypes } from "@/services/admin-qr"
import { onInvalid } from "@/utils/onInvalidFunc"
import { useMutation } from "@tanstack/react-query"
import { CookieValueTypes } from "cookies-next"
import { jwtDecode } from "jwt-decode"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

type Props = {
  eventId: number;
  token: CookieValueTypes;
  promoterId?: number;
  isPromoter?: boolean;
  isPromoterBinnacle?: boolean;
}

export default function OrganizerEventInfo({ eventId, token, isPromoter = false, isPromoterBinnacle, promoterId }: Props) {
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [checkerLink, setCheckerLink] = useState<string>()
  const [globalExpandedSections, setGlobalExpandedSections] = useState<string[]>([])
  const decoded: IUserLogin | null = token ? jwtDecode(token.toString()) : null;
  const { register, handleSubmit, setValue, watch } = useForm<{
    checkerData: string;
    eventId: number;
    ticketTypeMap: Record<number, string>;
  }>();

  const selectedTickets = watch("ticketTypeMap");

  const { ticketMetrics } = useAdminTicketMetrics({ token, eventId, isPromoter });
  const { promoterTicketMetrics } = useAdminPromoterTicketMetrics({ token, eventId, promoterId: decoded?.promoterId || promoterId });
  const { selectedEvent } = useAdminEvent({ eventId, token });
  const { promoterLink } = useAdminGetPromoterLink({ token, eventId, promoterId: decoded?.promoterId || promoterId });
  const { ticketTypes } = useAdminTicketTypes({ token, eventId });
  const { allCheckers } = useAdminGetCheckers({ token });

  const { organizerBinnacles } = useAdminBinnacles({
    organizerId: decoded?.organizerId ?? 0,
    token: token?.toString() ?? "",
  });

  const { promoterBinnacles } = useAdminPromoterBinnacles({
    promoterId: decoded?.promoterId || promoterId,
    token: token?.toString() ?? "",
  });
  
  const selectedBinnacle = organizerBinnacles?.find(b => b.eventId === eventId);
  const selectedPromoterBinnacle = promoterBinnacles?.find(b => b.eventId === eventId);

  console.log("selectedBinnacle", selectedBinnacle)

  useEffect(() => {
    setGlobalExpandedSections(["Vendidas y dinero generado"]);
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const toggleGlobalSection = (section: string) => {
    setGlobalExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const { mutate } = useMutation({
    mutationFn: generateCheckerLink,
    onSuccess: (data) => {
      setCheckerLink(data);
      notifySuccess('Link creado correctamente');
    },
    onError: (error) => {
      console.log(error)
      notifyError("Error al creado link");
    },
  });

  const { mutate: updateTicketTypes } = useMutation({
    mutationFn: updateCheckerTicketTypes,
    onError: (error) => {
      console.log(error)
      notifyError("Error al asignar tickets");
    },
  });

  console.log(allCheckers)

  const onSubmit = (data: { checkerData: string }) => {
    if (!selectedTickets || Object.keys(selectedTickets).length === 0) {
      notifyError("Debes seleccionar al menos un ticket");
      return;
    }

    const parsedData: { email: string, id: number } = JSON.parse(data.checkerData);
    
    updateTicketTypes({
      checkerId: parsedData.id,
      ticketTypeIds: Object.keys(selectedTickets).map(id => Number(id)),
      token
    });
    mutate({ 
      eventId,
      checkerEmail: parsedData.email,
    });
  };

  const handleTicketTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedObj: Record<number, string> = {};

    selectedOptions.forEach((option) => {
      selectedObj[Number(option.value)] = option.label;
    });

    // Merge con lo que ya estaba
    const newMap = { ...selectedTickets, ...selectedObj };

    setValue("ticketTypeMap", newMap, { shouldValidate: true, shouldDirty: true });
  };

  const types = ["Vendidas y dinero generado", "Dinero", "Promotores", "Link de controlador"]

  return (
    <div className="rounded-lg text-white w-full flex items-start justify-center mb-44 h-full">
      <div className="w-full">
        {
          !isPromoter && !isPromoterBinnacle && types.map((type) => (
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
                        {ticketMetrics?.ticketsPurchased}
                      </span>
                    </div>
                    {
                      selectedBinnacle?.stages?.map((stageGroup, groupIndex) => (
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
                    ))}
                  </div>
                }
                {
                  type === "Dinero" && 
                  <div className="border-t-2 flex flex-col gap-y-3 pt-5 mt-3 px-2 pb-2 text-text-inactive border-dashed border-inactive">
                    <div className="flex text-sm justify-between items-center">
                      <h2>Total</h2>
                      <h2 className="text-primary text-base text-end tabular-nums">COP ${Number(selectedBinnacle?.total?? "0").toLocaleString()}</h2>
                    </div>

                    <div className="flex text-sm justify-between items-center">
                      <h2>Dinero entregado</h2>
                      <h2 className="text-primary text-base text-end tabular-nums">COP ${selectedBinnacle?.alreadyPaid.toLocaleString()?? 0}</h2>
                    </div>
                        
                    <div className="flex text-sm justify-between items-center">
                      <h2>Comisión Rave Dates</h2>
                      <h2 className="text-red-400/80 text-base text-end tabular-nums">COP -${Number(selectedBinnacle?.feeRD?? "0").toLocaleString()}</h2>
                    </div>

                    <div className="flex text-sm justify-between items-center">
                      <h2>Comisión de promotor</h2>
                      <h2 className="text-red-400/80 text-base text-end tabular-nums">COP -${Number(selectedBinnacle?.feePromoter?? "0").toLocaleString()}</h2>
                    </div>

                    <div className="flex text-sm justify-between items-center">
                      <h2>Dinero disponible</h2>
                      <h2 className="text-primary text-base text-end tabular-nums">COP ${selectedBinnacle?.pendingPayment.toLocaleString()?? 0}</h2>
                    </div>

                    <Link href={`/organizer/event/${eventId}/money-withdrawn`} className="input-button block text-center text-sm py-3 text-primary-black bg-primary">
                      Ver dinero entregado
                    </Link>
                  </div>
                }
                {
                  type === "Promotores" && 
                  <div className="space-y-2 rounded-lg px-2 pb-2">

                    {
                       selectedEvent?.promoters?.map((promoter) => (
                        <div key={promoter.userId} className="flex justify-between items-center">
                          <h2 className="text-sm">{promoter.user.name}</h2>
                          <div className="flex items-center gap-x-2">
                            <Link href={`/organizer/promoters/edit-promoter/${promoter.userId}`} className="border border-primary rounded-lg text-primary p-1 text-xl"><EditSvg /></Link>
                            <Link href={`/organizer/events/${eventId}/promoter-binnacles/${promoter.promoterId}`} className="bg-primary p-1 text-xl text-primary-black rounded-lg"><EyeSvg /></Link>
                          </div>
                        </div>
                      ))
                    }
                    {
                      selectedEvent?.promoters?.length === 0 &&
                      <div className="text-center pt-2 pb-6 text-text-inactive">
                        No se encontraron promotores
                      </div>
                    }
                  </div>
                }
                {
                  type === "Link de controlador" && 
                    <div className="bg-input rounded-lg px-5 py-2">
                      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-y-3 justify-between items-center">
                        <div className="flex w-full gap-x-3 items-center justify-between">
                          <FormDropDown
                            labelClassname="!mb-0"
                            title="Elegir controlador*"
                            register={register("checkerData")}
                          >
                            <option value="" disabled selected>Controlador</option>
                            {allCheckers?.map((checker) => (
                              <option key={checker.userId} value={JSON.stringify({ email: checker.email, id: checker.checker?.checkerId })}>
                                {checker.name}
                              </option>
                            ))}
                          </FormDropDown>
                          <FormDropDown
                            labelClassname="!mb-0"
                            title="Tipos de tickets*"
                            register={register("ticketTypeMap")}
                            onChange={handleTicketTypeChange}
                          >
                            <option value="" disabled selected>Selecciona un tipo de ticket</option>
                            {ticketTypes?.map((ticket) => (
                              <option key={ticket.ticketTypeId} value={ticket.ticketTypeId}>
                                {ticket.name}
                              </option>
                            ))}
                          </FormDropDown>
                        </div>
                        <div className="text-sm flex justify-start w-full h-7 items-center gap-x-1">
                          <h2>Tickets seleccionados:</h2>
                          {selectedTickets &&
                            Object.entries(selectedTickets).map(([id, name]) => (
                              <span key={id} className="bg-inactive px-2 py-1 rounded">
                                {name}
                              </span>
                            ))}
                        </div>
                        <button type="submit" className="bg-primary rounded-lg py-2.5 w-3/4 sm:w-1/2 font-medium text-sm text-primary-black">
                          Generar link
                        </button>
                      </form>
                      <div className="flex w-full gap-x-1 mt-3 justify-between py-2 items-center">
                        <h2 className="truncate max-w-2/3 text-primary-white/75 underline underline-offset-4 decoration-primary/20">
                          {checkerLink ? checkerLink : "Aqui aparecerá el link ..."}
                        </h2>                  
                        <button
                          type="button"
                          disabled={!checkerLink}
                          onClick={() => {
                            if (checkerLink) {
                              navigator.clipboard.writeText(checkerLink);
                              notifySuccess("Link copiado al portapapeles");
                            }
                          }}
                          className="border border-primary disabled:opacity-60 disabled:pointer-events-none hover:opacity-75 transition-opacity px-4 py-1.5 font-medium text-primary rounded-lg text-sm"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>
                }
              </div>
            </DropdownItem>
          ))
        }

        {
          isPromoter &&
          <>
            <div className="bg-input mt-2 rounded-lg px-3 py-2">
              <h1 className="font-medium px-2 my-2">Dinero</h1>
              <div className="border-t-2 flex flex-col gap-y-3 pt-5 mt-3 px-2 pb-2 text-text-inactive border-dashed border-inactive">
                <div className="flex text-sm justify-between items-center">
                  <h2>Total</h2>
                  <h2 className="text-primary text-base text-end tabular-nums">COP ${Number(selectedPromoterBinnacle?.feePromoter ?? 0).toLocaleString() ?? 0}</h2>
                </div>

                <div className="flex text-sm justify-between items-center">
                  <h2>Dinero entregado</h2>
                  <h2 className="text-primary text-base text-end tabular-nums">COP ${selectedPromoterBinnacle?.alreadyPaid.toLocaleString()?? 0}</h2>
                </div>

                <div className="flex text-sm justify-between items-center">
                  <h2>Dinero disponible</h2>
                  <h2 className="text-primary text-base text-end tabular-nums">COP ${selectedPromoterBinnacle?.pendingPayment.toLocaleString()?? 0}</h2>
                </div>

                <Link href={`/promoter/event/${eventId}/money-withdrawn`} className="input-button block text-center text-sm py-3 text-primary-black bg-primary">
                  Ver dinero entregado
                </Link>
              </div> 
            </div>
            <div className="bg-input mt-2 rounded-lg px-3 py-2">
              <h1 className="font-medium px-2 mt-2">Link de afiliado</h1>
              <div className="border-t-2 flex flex-col gap-y-3 pt-3 mt-3 px-2 pb-2 border-dashed border-inactive">
                <div className="flex justify-between items-center">
                  <h2 className="truncate max-w-2/3 text-primary-white/75 underline underline-offset-4 decoration-primary/20">
                    { promoterLink }
                  </h2>                  
                  <button
                    onClick={() => {
                      if (promoterLink) {
                        navigator.clipboard.writeText(promoterLink);
                        notifySuccess("Link copiado al portapapeles");
                      }
                    }}
                    className="border border-primary hover:opacity-75 transition-opacity px-4 py-1.5 font-medium text-primary rounded-lg text-sm"
                  >
                    Copiar
                  </button>
                </div>
              </div> 
            </div>
          </>
        }

        {
          isPromoterBinnacle && ["Vendidas y dinero generado"].map((type) => (
            <div key={type} className="bg-input px-2 py-3 rounded-lg mt-2">
              {
                type === "Vendidas y dinero generado" && 
                <div>
                  <h1 className="p-3 pt-1 text-lg">Entradas vendidas</h1>
                  <div className="flex bg-main-container justify-between p-3 rounded-lg items-center">
                    <h1>Total vendido:</h1>
                    <span className="text-primary">
                      {promoterTicketMetrics?.ticketsPurchased}
                    </span>
                  </div>
                  <div className="space-y-2 mt-2">
                    {
                      promoterTicketMetrics?.ticketsTypesMetrics?.map((ticket) => {
                        return (
                          <div key={ticket.name} className="space-y-2  bg-main-container rounded-lg p-4 ps-3">
                            <div className="space-y-3 rounded-lg">
                              <div className="flex justify-between items-center">
                                <div className="">
                                  <span>{ticket.name}</span>
                                  <span> vendidas:</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-primary text-sm">{ticket.quantity} de {ticket.total} disponibles</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              }
            </div>
          ))
        }


        {/* Dropdown Sections */}
        <div className="overflow-hidden">
          {/* General Section */}
        </div>
      </div>
    </div>
  )
}
