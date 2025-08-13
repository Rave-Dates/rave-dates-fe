"use client";

import EditSvg from "@/components/svg/EditSvg";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { useAdminUserById } from "@/hooks/admin/queries/useAdminData";
import { parseISODate } from "@/utils/formatDate";
import { useReactiveCookiesNext } from "cookies-next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrganizerPromoterEvents({ userId }: {userId: number}) {
  const [assignedEvents, setAssignedEvents] = useState<IOrganizerEvent[] | IPromoterEvent[]>([]);
  const { getCookie } = useReactiveCookiesNext();
  const pathname = usePathname();
  
  const token = getCookie("token");

  const { data } = useAdminUserById({ token, userId });

  useEffect(() => {
    if (data?.role.name === "ORGANIZER" && data.organizer) {
      setAssignedEvents(data.organizer.events);
    } else if (data?.role.name === "PROMOTER" && data.promoter) {
      setAssignedEvents(data.promoter.events);
    }
  }, [data]);

  useEffect(() => {
    console.log(assignedEvents)
  }, [assignedEvents]);
  
  return (
    <div className="w-full flex flex-col justify-between bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <div>
        <div className="flex justify-start items-center gap-x-3 mt-6 ps-1">
          <GoBackButton className="px-3 py-3 animate-fade-in" />
          <h1 className="font-medium text-lg">{data?.name}</h1> 
        </div>
        <div className="max-w-xl pt-5 mx-auto animate-fade-in">
          <h1 className="text-title font-semibold">Eventos asignados</h1>

          {/* Users Table/List */}
          <div className="rounded-md overflow-hidden mt-5">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_0.5fr] border-b border-divider text-text-inactive gap-x-2 text-xs py-2 px-3">
            <div className="text-start">Evento</div>
            <div className="text-center">Fecha</div>
            <div className="text-end">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-divider w-full">
            {assignedEvents?.map((event) => (
              <div
                key={event.eventId}
                className="grid grid-cols-[1fr_1fr_0.5fr] items-center py-3 px-3 gap-x-2 text-xs"
              >
                <div className="text-start">{event.title}</div>
                <div className="text-center tabular-nums flex flex-col">
                  <h2>{event.date && parseISODate(event.date).date}</h2>
                  <h2>{event.date && parseISODate(event.date).time}hs</h2>
                </div>
                <Link
                  href={`promoter-events//${event.eventId}/edit-assign-event`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center justify-self-end bg-primary  text-primary-black"
                >
                  <EditSvg className="text-xl" />
                </Link>
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
      <Link
        href={`${pathname}/assign-event`}
        className="bg-primary block text-center max-w-xl self-center text-black input-button"
      >
        Asignar nuevo evento
      </Link>
    </div>
  );
}
