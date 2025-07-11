"use client"

import EditSvg from "@/components/svg/EditSvg";
import InfoSvg from "@/components/svg/InfoSvg";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { getAllEvents } from "@/services/admin-events";
import { useCreateEventStore } from "@/store/createEventStore";
import { extractPlaceFromGeo } from "@/utils/formatGeo";
import { useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  const { getCookie } = useReactiveCookiesNext();
  const { updateEventFormData } = useCreateEventStore();

  useEffect(() => {
    updateEventFormData(defaultEventFormData);
  }, []);

  const token = getCookie("token");
  
  const { data: events, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: () => getAllEvents({ token }),
    enabled: !!token, // solo se ejecuta si hay token
  });

  return (
    <div className="w-full flex flex-col gap-y-5 bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <Link
        href="/admin/events/create-event"
        className="bg-primary block text-center max-w-xl self-center text-black input-button"
      >
        Nuevo evento
      </Link>
      <div>
        <div className="max-w-xl mx-auto animate-fade-in">
          {/* Users Table/List */}
          <div className="rounded-md overflow-hidden mt-5">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr_1.5fr] border-b border-divider text-text-inactive gap-x-2 text-xs py-2 px-3">
            <div className="text-start">Fecha</div>
            <div className="text-center">Título</div>
            <div className="text-center">Lugar</div>
            <div className="text-end">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-divider w-full">
            {events?.map((data) => (
              <div
                key={data.eventId}
                className="grid grid-cols-[1fr_1fr_1fr_1.5fr] items-center py-3 px-3 gap-x-2 text-xs"
              >
                <div className="text-start">{data.date}</div>
                <div className="text-center tabular-nums">{data.title}</div>
                <div className="text-center tabular-nums">{extractPlaceFromGeo(data.geo) || data.geo}</div>
                <div className="flex justify-end gap-x-2">
                  <Link
                    href={`/admin/events/edit-event/${data.eventId}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center justify-self-end bg-primary  text-primary-black"
                  >
                    <EditSvg className="text-xl" />
                  </Link>
                  <Link
                    href={`/admin/events/event-info/${data.eventId}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center justify-self-end border border-primary text-primary"
                  >
                    <InfoSvg className="text-xl" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

          {!events && (
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

          {!isLoading && Array.isArray(events) && events?.length === 0 &&  (
            <div className="text-center py-8 text-text-inactive">
              No se encontraron usuarios
            </div>
          )}

          {isError &&  (
            <div className="text-center text-sm py-8 text-system-error">
              Error cargando usuarios
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
