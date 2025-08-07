"use client";

import TitleCard from "@/components/common/TitleCard";
import SpinnerSvg from "@/components/svg/SpinnerSvg";
import GoBackButton from "@/components/ui/buttons/GoBackButton";
import { useClientEvent, useClientEventServedOneImage, useClientPurchasedTickets } from "@/hooks/client/queries/useClientData";
import { useTicketStore } from "@/store/useTicketStore";
import { formatDateToColombiaTime } from "@/utils/formatDate";
import { useReactiveCookiesNext } from "cookies-next";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useEffect } from "react";

export default function Verification() {
  const { getCookie } = useReactiveCookiesNext();
  const { eventId } = useTicketStore();
  const token = getCookie("clientToken");
  const decoded: { id: number } = (token && jwtDecode(token.toString())) || {id: 0};
  const clientId = Number(decoded?.id);
  const router = useRouter();

  const { purchasedTickets, isTicketsLoading } = useClientPurchasedTickets({clientId, clientToken: token});
  const { selectedEvent, isEventLoading } = useClientEvent(eventId);
  const { servedImageUrl, isImageLoading } = useClientEventServedOneImage(eventId);

  useEffect(() => {
    if (!eventId) {
      router.replace("/")
    }
  }, [eventId]);

  const nonTransferredTickets = purchasedTickets?.filter(
    (ticket) => !ticket.isTransferred && ticket.ticketType.eventId === eventId
  );

  return (
    <div className="min-h-screen pb-40 pt-28 sm:pb-24 sm:pt-36 bg-primary-black sm:justify-center sm:items-center text-white flex px-6">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="flex w-xl animate-fade-in mx-auto flex-col gap-y-2 items-center sm:justify-center">
        {isEventLoading || !selectedEvent ? (
          <div className="w-full bg-cards-container h-18 rounded-xl gap-x-5 px-4 py-3 flex items-center justify-start">
            <div className="w-14 h-14 animate-pulse bg-inactive rounded-lg"></div>
            <div className="flex flex-col gap-y-2 items-start justify-center">
              <div className="w-44 h-6 animate-pulse bg-inactive rounded-lg"></div>
              <div className="w-28 h-4 animate-pulse bg-inactive rounded-lg"></div>
            </div>
          </div>
        ) : (
          selectedEvent && (
            <TitleCard
              className="w-full px-3 py-2 rounded-md"
              title={selectedEvent.title}
              description={selectedEvent.subtitle}
            >
              {isImageLoading ? (
                <div className="w-14 h-14 flex items-center justify-center">
                  <SpinnerSvg className="fill-primary text-inactive w-5" />
                </div>
              ) : (
                <Image
                  className="w-14 h-14 rounded-full"
                  src={servedImageUrl ?? "/images/event-placeholder.png"}
                  width={1000}
                  height={1000}
                  alt="logo"
                />
              )}
            </TitleCard>
          )
        )}

        {selectedEvent?.date ? (
          <div className="sm:flex hidden bg-cards-container w-full rounded-md px-5 py-3 gap-x-4 mb-3">
            <h2 className="font-light text-sm">
              {formatDateToColombiaTime(selectedEvent.date).date} -{" "}
              {formatDateToColombiaTime(selectedEvent.date).time}hs
            </h2>
          </div>
        ) : (
          <div className="w-full bg-cards-container h-11 rounded-md gap-x-5 px-4 py-3 flex items-center justify-start mb-3">
            <div className="w-1/3 h-4 animate-pulse bg-inactive rounded-md"></div>
          </div>
        )}

        <h2 className="text-start w-full">Entradas</h2>

        {isTicketsLoading || !nonTransferredTickets ? (
          <div className="w-full bg-cards-container h-19 rounded-xl gap-x-5 px-4 py-3 flex items-center justify-between">
            <div className="w-[100px] sm:w-[170px]">
              <div className="bg-inactive animate-pulse h-6 mb-1 w-20 rounded"></div>
              <div className="bg-inactive animate-pulse h-4 w-28 rounded"></div>
            </div>

            <div className="flex flex-col gap-y-2 items-start justify-center">
              <div className="w-24 h-9 animate-pulse bg-inactive rounded"></div>
            </div>
          </div>
        ) : (
          <>
            {nonTransferredTickets?.map((ticket) => (
              <div key={ticket.purchaseTicketId} className="flex w-full">
                <div className="w-full flex justify-center flex-col items-start bg-cards-container outline-none rounded-l-lg ps-4">
                  <h2>{ticket.ticketType.name}</h2>
                </div>
                <div className="bg-cards-container pe-4 py-5 rounded-r-lg">
                  <Link
                    href={`transfer/${ticket.purchaseTicketId}/receiver-data`}
                    className="block text-center bg-primary hover:opacity-80 text-black rounded px-4 py-2 text-sm transition-opacity"
                  >
                    Transferir
                  </Link>
                </div>
              </div>
            ))}
          </>
        )}

        {nonTransferredTickets?.length === 0 && (
          <div className="text-center pb-4 text-neutral-400">
            No se encontraron tickets
          </div>
        )}
      </div>
    </div>
  );
}
