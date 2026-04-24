"use client"

import EditSvg from "@/components/svg/EditSvg";
import InfoSvg from "@/components/svg/InfoSvg";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { useAdminAllEvents } from "@/hooks/admin/queries/useAdminData";
import { useCreateEventStore } from "@/store/createEventStore";
import { formatDateToColombiaTime } from "@/utils/formatDate";
import { extractPlaceFromGeo } from "@/utils/formatGeo";
import { useReactiveCookiesNext } from "cookies-next";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function Page() {
  const { getCookie } = useReactiveCookiesNext();
  const { updateEventFormData } = useCreateEventStore();

  const token = getCookie("token");
  
  const { allEvents, isErrorEvent, isEventLoading } = useAdminAllEvents({ token });

  const [filters, setFilters] = useState<string[]>(["Activo", "Inactivo"]);

  const isEventFuture = (date: string) => {
    return new Date(date).getTime() > new Date().getTime();
  };

  const getEventStatus = (event: IEvent) => {
    if (!isEventFuture(event.date)) return "Finalizado";
    return event.isActive ? "Activo" : "Inactivo";
  };

  const toggleFilter = (statusName: string) => {
    setFilters((prev) =>
      prev.includes(statusName)
        ? prev.filter((s) => s !== statusName)
        : [...prev, statusName]
    );
  };

  useEffect(() => {
    console.log("campos resetados")
    updateEventFormData(defaultEventFormData);
  }, []);

  const eventStatus = [
    {
      name: "Activo",
      className: "bg-green-500"
    },
    {
      name: "Inactivo",
      className: "bg-orange-400"
    },
    {
      name: "Finalizado",
      className: "bg-gray-400"
    }
  ];

  const filteredEvents = allEvents?.filter((event) =>
    filters.includes(getEventStatus(event))
  );

  return (
    <div className="w-full flex flex-col gap-y-5 bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <Link
        href="/admin/events/create-event"
        className="bg-primary block text-center max-w-xl self-center text-primary-white input-button"
      >
        Nuevo evento
      </Link>

      <div className="flex gap-x-2 mx-auto">
        {eventStatus.map((status) => {
          const isSelected = filters.includes(status.name);
          return (
            <button
              key={status.name}
              onClick={() => toggleFilter(status.name)}
              className={`px-3 text-sm py-1.5 rounded-full flex items-center gap-x-2 transition-all duration-300 border ${
                isSelected
                  ? "bg-white/10 border-white/20 text-white"
                  : "bg-transparent border-transparent text-white/40 grayscale"
              }`}
            >
              <div
                className={`h-2 w-2 ${status.className} rounded-full ${
                  isSelected ? "animate-pulse" : ""
                }`}
              ></div>
              {status.name}
            </button>
          );
        })}
      </div>
      <div>
        <div className="max-w-xl mx-auto animate-fade-in">
          {/* Users Table/List */}
          <div className="rounded-md overflow-hidden mt-2">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr] border-b border-divider text-text-inactive gap-x-2 text-xs py-2 px-3">
            <div className="text-start">Fecha</div>
            <div className="text-center">Título</div>
            <div className="text-center">Lugar</div>
            <div className="text-end">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-divider w-full">
            {filteredEvents?.map((data) => (
              <div
                key={data.eventId}
                className={`grid grid-cols-[1fr_1fr_1fr_0.1fr_1.2fr] items-center py-3 px-3 gap-x-2 text-xs ${isEventFuture(data.date) ? "text-white" : "text-white/60"}`}
              >
                <div className="text-start flex flex-col">
                  <h3>{formatDateToColombiaTime(data.date).date} {formatDateToColombiaTime(data.date).time}hs</h3>
                </div>
                <div className="text-center tabular-nums">{data.title}</div>
                <div className="text-center tabular-nums">{extractPlaceFromGeo(data.geo) || data.geo}</div>
                <div className="text-center tabular-nums">
                  {
                    isEventFuture(data.date) ?
                    data.isActive ? 
                    <div className="h-2 w-2 bg-green-500 rounded-full"></div> 
                    :
                    <div className="h-2 w-2 bg-orange-400 rounded-full"></div>
                    :
                    <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                  }
                </div>
                <div className="flex justify-end gap-x-2">
                  {
                    isEventFuture(data.date) &&
                    <Link
                      href={`/admin/events/edit-event/${data.eventId}`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center justify-self-end bg-primary  text-primary-white"
                    >
                      <EditSvg className="text-xl" />
                    </Link>
                  }
                  <Link
                    href={`/admin/events/${data.eventId}/event-info`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center justify-self-end border border-primary text-primary"
                  >
                    <InfoSvg className="text-xl" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

          {!allEvents &&!isErrorEvent && (
            Array.from(Array(6).keys()).map((user) => (
            <div
              key={user}
              className="grid grid-cols-[1fr_1fr_1fr_1.5fr] items-center py-3 px-3 gap-x-2 text-sm"
            >
              <div className="text-start w-20 h-4 rounded animate-pulse bg-inactive"></div>
              <div className="justify-self-center w-14 h-4 rounded animate-pulse bg-inactive"></div>
              <div className="justify-self-center w-14 h-4 rounded animate-pulse bg-inactive"></div>
              <div className="justify-self-end flex gap-x-2">
                <div className="w-8 h-8 rounded animate-pulse bg-inactive"></div>
                <div className="w-8 h-8 rounded animate-pulse bg-inactive"></div>
              </div>
            </div>
            ))
          )}

          {!isEventLoading && Array.isArray(allEvents) && allEvents?.length === 0 &&  (
            <div className="text-center py-8 text-text-inactive">
              No se encontraron eventos
            </div>
          )}

          {isErrorEvent &&  (
            <div className="text-center text-sm py-8 text-system-error">
              Error cargando eventos
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
