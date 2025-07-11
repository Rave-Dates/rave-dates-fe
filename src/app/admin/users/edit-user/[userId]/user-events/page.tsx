"use client";

import EditSvg from "@/components/svg/EditSvg";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { getUserById } from "@/services/admin-users";
import { useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const sampleData = [
  {
    id: 1,
    eventName: "Evento 1",
    date: "Lun 14",
  },
  {
    id: 2,
    eventName: "Evento 2",
    date: "Mar 17",
  }
]

export default function Page() {
  const [assignedEvents, setAssignedEvents] = useState<any[]>([]);
  const { getCookie } = useReactiveCookiesNext();
  const pathname = usePathname();
  const params = useParams();
  const userId = Number(params.userId)
  
  const token = getCookie("token");
  
  // obtenemos user por id
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserById({ token, id: userId }),
    enabled: !!token, // solo se ejecuta si hay token
  });

  useEffect(() => {
    if (data?.role.name === "ORGANIZER") {
      setAssignedEvents(data?.organizer?.events);
    } else if (data?.role.name === "PROMOTER") {
      setAssignedEvents(data?.promoter?.events);
    }
  }, [data]);

  useEffect(() => {
    console.log(assignedEvents)
  }, [assignedEvents]);
  
  return (
    <div className="w-full flex flex-col justify-between bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <div>
        <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
        <div className="max-w-xl pt-24 mx-auto animate-fade-in">
          <h1 className="text-title font-semibold">Eventos asignados</h1>

          {/* Users Table/List */}
          <div className="rounded-md overflow-hidden mt-5">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_2fr] border-b border-divider text-text-inactive gap-x-2 text-xs py-2 px-3">
            <div className="text-start">Evento</div>
            <div className="text-end">Fecha</div>
            <div className="text-end">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-divider w-full">
            {assignedEvents?.map((event) => (
              <div
                key={event.eventId}
                className="grid grid-cols-[1fr_1fr_2fr] items-center py-3 px-3 gap-x-2 text-xs"
              >
                <div className="text-start">{event.title}</div>
                <div className="text-end tabular-nums">{event.date}</div>
                <div className="flex gap-x-2 justify-end">
                  <Link
                    href={`${pathname}/event-balance`}
                    className="border border-primary text-primary py-1 px-3 rounded-lg flex items-center justify-center text-center"
                    aria-label="Añadir usuario"
                  >
                    Cuenta
                  </Link>
                  <Link
                    href={`${pathname}/edit-event`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center justify-self-end bg-primary  text-primary-black"
                  >
                    <EditSvg className="text-xl" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

          {/* Empty State */}
          {assignedEvents.length === 0 && (
            <div className="text-center py-8 text-neutral-400">
              Sin eventos asignados
            </div>
          )}
        </div>
      </div>
      <div className="w-full justify-items-center">
        <Link
          href={`${pathname}/assign-event`}
          className="block text-center pb-2 max-w-xl self-center text-primary-white input-button mt-10"
        >
          Asignar nuevo evento +
        </Link>
        <Link
          href={`${pathname}/add`}
          className="bg-primary block text-center max-w-xl self-center text-black input-button"
        >
          Guardar
        </Link>
      </div>
    </div>
  );
}
