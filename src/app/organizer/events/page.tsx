"use client"

import EditSvg from "@/components/svg/EditSvg";
import InfoSvg from "@/components/svg/InfoSvg";
import UserSvg from "@/components/svg/UserSvg";
import { defaultEventFormData } from "@/constants/defaultEventFormData";
import { getAllEvents } from "@/services/admin-events";
import { useCreateEventStore } from "@/store/createEventStore";
import { formatDateToColombiaTime } from "@/utils/formatDate";
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
  
  // const { data: events, isLoading, isError } = useQuery<IEvent[]>({
  //   queryKey: ["events"],
  //   queryFn: () => getAllEvents({ token }),
  //   enabled: !!token, // solo se ejecuta si hay token
  // });

  const isLoading = false;
  const isError = false;

  const events =  [
    {
      "eventId": 1,
      "title": "Summer Festival 2025",
      "subtitle": "Extended set",
      "date": "2025-08-15T20:00:00.000Z",
      "piggyBank": true,
      "geo": "4.649408704755897;-74.07725663267983;Movistar Arena",
      "description": "Join us for the biggest summer festival of 2025!",
      "type": "paid",
      "feeRD": 5,
      "feeRDInPromoter": 100,
      "transferCost": 100,
      "feePB": 200,
      "discountCode": "SUMMER2025",
      "discountType": "percentage",
      "discount": 10,
      "maxPurchase": 5,
      "timeOut": 10,
      "isActive": true,
      "createdAt": "2025-07-23T22:26:23.800Z",
      "updatedAt": "2025-07-23T22:26:23.800Z",
      "eventCategoryValues": [
        {
          "id": 1,
          "eventId": 1,
          "valueId": 1,
          "categoryId": 1,
          "createdAt": "2025-07-23T22:26:24.005Z",
          "updatedAt": "2025-07-23T22:26:24.005Z",
          "value": {
            "valueId": 1,
            "value": "Bogotá",
            "categoryId": 1,
            "createdAt": "2025-07-23T22:26:23.589Z",
            "updatedAt": "2025-07-23T22:26:23.589Z"
          },
          "category": {
            "categoryId": 1,
            "name": "Ubicación",
            "createdAt": "2025-07-23T22:26:23.172Z",
            "updatedAt": "2025-07-23T22:26:23.172Z"
          }
        },
        {
          "id": 2,
          "eventId": 1,
          "valueId": 2,
          "categoryId": 1,
          "createdAt": "2025-07-23T22:26:24.090Z",
          "updatedAt": "2025-07-23T22:26:24.090Z",
          "value": {
            "valueId": 2,
            "value": "Medellín",
            "categoryId": 1,
            "createdAt": "2025-07-23T22:26:23.610Z",
            "updatedAt": "2025-07-23T22:26:23.610Z"
          },
          "category": {
            "categoryId": 1,
            "name": "Ubicación",
            "createdAt": "2025-07-23T22:26:23.172Z",
            "updatedAt": "2025-07-23T22:26:23.172Z"
          }
        },
        {
          "id": 3,
          "eventId": 1,
          "valueId": 3,
          "categoryId": 2,
          "createdAt": "2025-07-23T22:26:24.181Z",
          "updatedAt": "2025-07-23T22:26:24.181Z",
          "value": {
            "valueId": 3,
            "value": "Rave",
            "categoryId": 2,
            "createdAt": "2025-07-23T22:26:23.621Z",
            "updatedAt": "2025-07-23T22:26:23.621Z"
          },
          "category": {
            "categoryId": 2,
            "name": "Tipo de evento",
            "createdAt": "2025-07-23T22:26:23.274Z",
            "updatedAt": "2025-07-23T22:26:23.274Z"
          }
        },
        {
          "id": 4,
          "eventId": 1,
          "valueId": 6,
          "categoryId": 3,
          "createdAt": "2025-07-23T22:26:24.269Z",
          "updatedAt": "2025-07-23T22:26:24.269Z",
          "value": {
            "valueId": 6,
            "value": "HaMelodic Techno",
            "categoryId": 3,
            "createdAt": "2025-07-23T22:26:23.664Z",
            "updatedAt": "2025-07-23T22:26:23.664Z"
          },
          "category": {
            "categoryId": 3,
            "name": "Género",
            "createdAt": "2025-07-23T22:26:23.472Z",
            "updatedAt": "2025-07-23T22:26:23.472Z"
          }
        }
      ],
      "organizer": [
        {
          "organizerId": 1,
          "userId": 2,
          "createdAt": "2025-07-23T22:26:22.621Z",
          "updatedAt": "2025-07-23T22:26:22.621Z",
          "OrganizerEvent": {
            "organizerId": 1,
            "eventId": 1,
            "createdAt": "2025-07-23T22:26:24.635Z",
            "updatedAt": "2025-07-23T22:26:24.635Z"
          }
        }
      ],
      "labels": [
        {
          "labelId": 1,
          "name": "Estacionamiento",
          "icon": null,
          "createdAt": "2025-07-23T22:26:23.717Z",
          "updatedAt": "2025-07-23T22:26:23.717Z"
        },
        {
          "labelId": 2,
          "name": "Baños",
          "icon": null,
          "createdAt": "2025-07-23T22:26:23.736Z",
          "updatedAt": "2025-07-23T22:26:23.736Z"
        }
      ] 
    } 
  ]

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
            {events?.map((data) => (
              <div
                key={data.eventId}
                className="grid grid-cols-[1fr_1fr_1fr] items-center py-3 px-3 gap-x-2 text-xs"
              >
                <div className="text-start flex flex-col">
                  <h3>{formatDateToColombiaTime(data.date).date} {formatDateToColombiaTime(data.date).time}hs</h3>
                </div>
                <div className="text-center tabular-nums">{data.title}</div>
                <div className="flex justify-end gap-x-2">
                  <Link
                    href={`/admin/events/edit-event/${data.eventId}`}
                    className="w-8 h-8 rounded-lg flex items-center justify-center justify-self-end bg-primary  text-primary-black"
                  >
                    <EditSvg className="text-xl" />
                  </Link>
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
