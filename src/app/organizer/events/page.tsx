"use client"

import EditSvg from "@/components/svg/EditSvg";
import UserSvg from "@/components/svg/UserSvg";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { useAdminUserById } from "@/hooks/admin/queries/useAdminData";
import { getAllClientEvents } from "@/services/clients-events";
import { useCreateEventStore } from "@/store/createEventStore";
import { formatDateToColombiaTime } from "@/utils/formatDate";
import { useQuery } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import { useEffect } from "react";

export default function Page() {
  const { updateEventFormData } = useCreateEventStore();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
  const decoded: { id: number } = (token && jwtDecode(token.toString())) || {id: 0};
  
  // obtenemos user por id
  const { data: user } = useAdminUserById({ token, userId: decoded.id }); 


  useEffect(() => {
    updateEventFormData(defaultEventFormData);
  }, []);
  
  const { data: events, isLoading, isError } = useQuery<IEvent[]>({
    queryKey: ["events"],
    queryFn: () => getAllClientEvents(1, 1000),
  });

  return (
    <div className="w-full flex flex-col gap-y-5 bg-primary-black text-primary-white min-h-screen p-4 pb-40 sm:pt-32">
      <Link
        href="events/create-event"
        className="bg-primary block text-center max-w-xl self-center text-black input-button"
      >
        Nuevo evento gratuito
      </Link>
      <div>
        <div className="max-w-xl mx-auto animate-fade-in">
          {/* Users Table/List */}
          <div className="rounded-md overflow-hidden mt-5">
          {/* Table Header */}
          <div className="grid grid-cols-[1fr_1fr_1fr] border-b border-divider text-text-inactive gap-x-2 text-xs py-2 px-3">
            <div className="text-start">Fecha</div>
            <div className="text-center">Título</div>
            <div className="text-end">Acciones</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-divider w-full">
            {user?.organizer?.events && user.organizer.events.map((data) => (
              <div
                key={data.eventId}
                className="grid grid-cols-[1fr_1fr_1fr] items-center py-3 px-3 gap-x-2 text-xs"
              >
                <div className="text-start flex flex-col">
                  <h3>{data.date && formatDateToColombiaTime(data.date).date} {data.date && formatDateToColombiaTime(data.date).time}hs</h3>
                </div>
                <div className="text-center tabular-nums">{data.title}</div>
                <div className="flex justify-end gap-x-2">
                  {
                    data.type === "free" &&
                    <Link
                      href={`/organizer/events/${data.eventId}/edit-event`}
                      className="w-8 h-8 rounded-lg flex items-center justify-center justify-self-end bg-primary  text-primary-black"
                    >
                      <EditSvg className="text-xl" />
                    </Link>
                  }
                  <Link
                    href={`events/${data.eventId}/attendees`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center justify-self-end border border-primary text-primary"
                  >
                    <UserSvg stroke={1.5} className="text-xl" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

          {!events &&!isError && (
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
              No se encontraron eventos
            </div>
          )}

          {isError &&  (
            <div className="text-center text-sm py-8 text-system-error">
              Error cargando eventos
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
