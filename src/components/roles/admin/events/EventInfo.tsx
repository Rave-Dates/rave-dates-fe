"use client";

import { CircularProgress } from "@/components/roles/organizer/create-event/ProgressCircular";
import { DropdownItem } from "@/components/roles/admin/events/DropDownItem";
import { StageItem } from "@/components/roles/admin/events/StageItem";
import AttendeeList from "@/components/roles/controller/AttendeeList";
import { ProgressBar } from "@/components/roles/organizer/create-event/ProgressBar";
import UserSvg from "@/components/svg/UserSvg";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import FormDropDown from "@/components/ui/inputs/FormDropDown";
import {
  notifyError,
  notifySuccess,
} from "@/components/ui/toast-notifications";
import {
  useAdminBinnacles,
  useAdminCheckerTicketMetrics,
  useAdminEvent,
  useAdminEventBinnacles,
  useAdminGetCheckers,
  useAdminGetGuests,
  useAdminGetOrganizerFromEvent,
  useAdminPromoterBinnacles,
  useAdminPromoterTicketMetrics,
  useAdminTicketMetrics,
  useAdminTicketTypes,
  useAdminUserById,
} from "@/hooks/admin/queries/useAdminData";
import {
  generateCheckerLink,
  updateCheckerTicketTypes,
} from "@/services/admin-qr";
import { onInvalid } from "@/utils/onInvalidFunc";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function EventInfo() {
  const { getCookie } = useReactiveCookiesNext();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const token = getCookie("token");
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = Number(params.userId);
  const eventId = parseInt(params.eventId as string, 10);
  const organizerId = Number(searchParams.get("organizerId"));

  const [checkerLink, setCheckerLink] = useState<string>();
  const { register, handleSubmit, setValue, watch } = useForm<{
    checkerData: string;
    eventId: number;
    ticketTypeMap: Record<number, string>;
  }>();

  const selectedTickets = watch("ticketTypeMap");

  const { selectedEvent } = useAdminEvent({ token, eventId });
  const { data: user } = useAdminUserById({ token, userId: userId });
  const { ticketTypes } = useAdminTicketTypes({ token, eventId });
  const { organizerFromEvent } = useAdminGetOrganizerFromEvent({
    token,
    eventId: eventId,
  });
  const { eventBinnacles } = useAdminEventBinnacles({ token, eventId });

  const { organizerBinnacles } = useAdminBinnacles({
    organizerId: organizerId
      ? organizerFromEvent?.organizerId
      : (user?.organizer?.organizerId ?? 0),
    token: token?.toString() ?? "",
  });

  const { promoterBinnacles } = useAdminPromoterBinnacles({
    promoterId: user?.promoter?.promoterId ?? 0,
    token: token?.toString() ?? "",
  });

  const { ticketMetrics } = useAdminTicketMetrics({ token, eventId });
  const { promoterTicketMetrics } = useAdminPromoterTicketMetrics({
    token,
    eventId,
    promoterId: user?.promoter?.promoterId,
  });
  const { allCheckers } = useAdminGetCheckers({ token });

  const selectedBinnacle = organizerBinnacles?.find(
    (b) => b.eventId === eventId,
  );
  const selectedPromoterBinnacle = promoterBinnacles?.events.find(
    (b) => b.eventId === eventId,
  );
  const selectedEventBinnacle = eventBinnacles?.find(
    (b) => b.eventId === eventId,
  );

  const { guests } = useAdminGetGuests({ token, eventId });
  const { checkerTicketMetrics } = useAdminCheckerTicketMetrics({ token, eventId });

  const binnacleToUse =
    user?.role.name === "ORGANIZER" ? selectedBinnacle : selectedEventBinnacle;

  const ticketMetricsToUse =
    user?.role.name === "PROMOTER" ? promoterTicketMetrics : ticketMetrics;

  useEffect(() => {
    if (ticketTypes && ticketTypes.length > 0) {
      setExpandedSections([ticketTypes[0].name || ""]);
    }
  }, [ticketTypes]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const { mutate } = useMutation({
    mutationFn: generateCheckerLink,
    onSuccess: (data) => {
      setCheckerLink(data);
      notifySuccess("Link creado correctamente");
    },
    onError: (error) => {
      console.log(error);
      notifyError("Error al creado link");
    },
  });

  const { mutate: updateTicketTypes } = useMutation({
    mutationFn: updateCheckerTicketTypes,
    onError: (error) => {
      console.log(error);
      notifyError("Error al asignar tickets");
    },
  });

  const onSubmit = (data: { checkerData: string }) => {
    if (!selectedTickets || Object.keys(selectedTickets).length === 0) {
      notifyError("Debes seleccionar al menos un ticket");
      return;
    }

    const parsedData: { email: string; id: number } = JSON.parse(
      data.checkerData,
    );

    updateTicketTypes({
      checkerId: parsedData.id,
      ticketTypeIds: Object.keys(selectedTickets).map((id) => Number(id)),
      token,
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

    const newMap = { ...selectedTickets, ...selectedObj };
    setValue("ticketTypeMap", newMap, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleRemoveTicketType = (idToRemove: string) => {
    if (!selectedTickets) return;
    const updatedMap = { ...selectedTickets };
    delete updatedMap[Number(idToRemove)];
    setValue("ticketTypeMap", updatedMap, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="bg-primary-black text-white w-full flex items-start justify-center lg:pt-24 pb-44 min-h-screen p-4">
      <GoBackButton className="absolute z-30 top-10 lg:top-32 left-5 lg:left-10 p-3 animate-fade-in" />
      <Link
        href="event-info/attendees"
        className="absolute block text-center z-30 top-10 right-5 lg:top-32 lg:right-10 p-3 animate-fade-in bg-primary text-primary-white rounded-xl"
      >
        <UserSvg stroke={1.7} className="text-2xl" />
      </Link>
      <div className="w-full pt-24 max-w-xl">
        {/* Header */}
        <h1 className="text-2xl mb-7 text-center font-semibold">
          {selectedEvent?.title}
        </h1>

        <div className="flex justify-between text-xl font-medium items-center mb-4">
          <h1>Asistentes totales</h1>
          <span>{ticketMetricsToUse?.ticketsPurchased.toLocaleString()}</span>
        </div>

        {/* Asistentes / Aforo Stats */}
        <div className="space-y-6 mb-6">
          <div className="flex items-center justify-between bg-cards-container rounded-lg py-2 px-4">
            <div>
              <div className="text-text-inactive text-sm">
                Asistentes / Aforo
              </div>
              <div className="text-primary-white text-xl font-medium">
                {ticketMetricsToUse?.ticketsPurchased}/
                {ticketMetricsToUse?.totalTickets}
              </div>
            </div>
            {ticketMetricsToUse?.totalTickets &&
            ticketMetricsToUse?.ticketsPurchased ? (
              <CircularProgress
                current={ticketMetricsToUse?.ticketsPurchased}
                total={ticketMetricsToUse?.totalTickets}
              />
            ) : (
              <CircularProgress current={0} total={100} />
            )}
          </div>
        </div>

        {/* Dropdown Sections */}
        <div className="overflow-hidden">
          {/* General Section */}
          {binnacleToUse && binnacleToUse?.stages ? (
            <>
              {user?.role.name !== "PROMOTER"
                ? binnacleToUse?.stages?.map((stageGroup, groupIndex) => (
                  
                    <DropdownItem
                      key={`${groupIndex}-${groupIndex}`}
                      title={stageGroup[0].ticketType}
                      isExpanded={expandedSections.includes(
                        stageGroup[0].ticketType,
                      )}
                      onToggle={() => toggleSection(stageGroup[0].ticketType)}
                    >
                      <div className="space-y-2 bg-main-container px-4 pb-3 rounded-b-lg">
                        <div className="flex justify-between px-2 text-primary-white">
                          <h2 className="text-sm pb-2">Invitados</h2>
                          <h2 className="text-sm pb-2">
                            {guests?.flatMap((g) => g.purchaseTickets ?? []).filter(
                              (pt) => pt?.ticketType?.name === stageGroup[0].ticketType
                            ).length ?? 0}
                          </h2>
                        </div>
                        {stageGroup.map((stage, stageIndex) => (
                          <StageItem
                            key={stageIndex}
                            stage={stage}
                            quantity={stage.quantity}
                            index={stageIndex}
                          />
                        ))}
                      </div>
                    </DropdownItem>
                  ))
                : selectedPromoterBinnacle?.stages?.stages?.map(
                    (stageGroup, groupIndex) => (
                      <DropdownItem
                        key={`${groupIndex}-${groupIndex}`}
                        title={stageGroup[0].ticketType}
                        isExpanded={expandedSections.includes(
                          stageGroup[0].ticketType,
                        )}
                        onToggle={() => toggleSection(stageGroup[0].ticketType)}
                      >
                        <div className="space-y-2 bg-main-container px-4 pb-3 rounded-b-lg">
                          {stageGroup.map((stage, stageIndex) => (
                            <StageItem
                              key={stageIndex}
                              stage={stage}
                              quantity={stage.quantity}
                              index={stageIndex}
                            />
                          ))}
                        </div>
                      </DropdownItem>
                    ),
                  )}
            </>
          ) : (
            <div className="text-center pt-2 pb-6 text-text-inactive">
              No se encontró información para mostrar
            </div>
          )}
          <DropdownItem
            title="Link Escáner QRs"
            className="mt-2"
            isExpanded={expandedSections.includes("Link Escáner QRs")}
            onToggle={() => toggleSection("Link Escáner QRs")}
          >
            <div className="bg-main-container px-5 py-2 rounded-b-lg">
              <form
                onSubmit={handleSubmit(onSubmit, onInvalid)}
                className="flex flex-col gap-y-3 justify-between items-center"
              >
                <div className="flex w-full gap-x-3 items-center justify-between">
                  <FormDropDown
                    labelClassname="!mb-0"
                    title="Elegir controlador*"
                    selectClassname="bg-input!"
                    register={register("checkerData")}
                  >
                    <option value="" disabled selected>
                      Controlador
                    </option>
                    {allCheckers?.map((checker) => (
                      <option
                        key={checker.userId}
                        value={JSON.stringify({
                          email: checker.email,
                          id: checker.checker?.checkerId,
                        })}
                      >
                        {checker.name}
                      </option>
                    ))}
                  </FormDropDown>
                  <FormDropDown
                    labelClassname="!mb-0"
                    title="Tipos de tickets*"
                    selectClassname="bg-input!"
                    register={register("ticketTypeMap")}
                    onChange={handleTicketTypeChange}
                  >
                    <option value="" disabled selected>
                      Selecciona un tipo de ticket
                    </option>
                    {ticketTypes?.map((ticket) => (
                      <option
                        key={ticket.ticketTypeId}
                        value={ticket.ticketTypeId}
                      >
                        {ticket.name}
                      </option>
                    ))}
                  </FormDropDown>
                </div>
                <div className="text-sm flex flex-wrap justify-start w-full min-h-7 items-center gap-x-1 gap-y-1">
                  <h2>Tickets seleccionados:</h2>
                  {selectedTickets &&
                    Object.entries(selectedTickets).map(([id, name]) => (
                      <span
                        key={id}
                        className="bg-inactive flex items-center gap-x-1 px-2 py-1 rounded"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() => handleRemoveTicketType(id)}
                          className="text-primary-white hover:text-red-400 font-bold ml-1"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                </div>
                <button
                  type="submit"
                  className="bg-primary rounded-lg py-2.5 mt-3 w-3/4 sm:w-1/2 font-medium text-sm"
                >
                  Generar link
                </button>
              </form>
              <div className="flex w-full gap-x-1 mt-3 justify-between py-2 items-center">
                <h2 className="truncate max-w-2/3 text-primary-white/75 underline underline-offset-4 decoration-primary/50">
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
                  className="border border-primary disabled:opacity-60 disabled:pointer-events-none hover:opacity-75 transition-opacity px-4 py-1.5 font-medium text-primary-white rounded-lg text-sm"
                >
                  Copiar
                </button>
              </div>
            </div>
          </DropdownItem>
          <DropdownItem
            title="Tickets escaneados"
            className="mt-2"
            isExpanded={expandedSections.includes("Tickets escaneados")}
            onToggle={() => toggleSection("Tickets escaneados")}
          >
            <div className="bg-main-container px-5 py-3 rounded-b-lg space-y-3">
              <div className="bg-black/20 h-[80px] flex px-5 justify-between items-center py-1 rounded-lg">
                <div>
                  <h3 className="text-sm text-primary-white/50">Total leídos</h3>
                  <h3 className="text-lg">{checkerTicketMetrics?.totalRead}/{checkerTicketMetrics?.ticketsPurchased}</h3>
                </div>
                {
                  checkerTicketMetrics &&
                  <CircularProgress current={checkerTicketMetrics.totalRead ?? 0} total={checkerTicketMetrics.ticketsPurchased ?? 0} />
                }
              </div>
              <div className="bg-black/20 rounded-lg pt-3 pb-5 px-4 space-y-4">
                {
                  checkerTicketMetrics?.ticketsTypesMetrics.map((ticketType) => {
                    const percentage = ticketType.quantity > 0 ? Math.round((ticketType.read / ticketType.quantity) * 100) : 0;
                    return (
                      <div key={ticketType.name} className="flex items-end justify-between gap-x-4">
                        <div className="flex-1">
                          <h2 className="text-text-inactive mb-1">{ticketType.name}</h2>
                          <ProgressBar current={ticketType.read} total={ticketType.quantity} />
                        </div>
                        <div className="flex-shrink-0 mt-6 text-primary-white font-bold">
                          {percentage}%
                        </div>
                      </div>
                    );
                  })
                }
                {
                  checkerTicketMetrics?.ticketsTypesMetrics.length === 0 &&
                  <div className="text-center pt-2 text-text-inactive">
                    No hay compras
                  </div>
                }
              </div>
            </div>
          </DropdownItem>
          <DropdownItem
            title="Lista del evento"
            className="mt-2"
            isExpanded={expandedSections.includes("Lista del evento")}
            onToggle={() => toggleSection("Lista del evento")}
          >
            <div className="bg-main-container rounded-b-lg overflow-hidden">
              <AttendeeList eventId={eventId} isEmbedded={true} />
            </div>
          </DropdownItem>
        </div>
      </div>
    </div>
  );
}
