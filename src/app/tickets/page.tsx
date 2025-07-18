"use client"

import React, { useEffect, useMemo, useState } from 'react';
import EventCard from '@/components/containers/home/EventCard';
import { useReactiveCookiesNext } from 'cookies-next';
import { useQuery } from '@tanstack/react-query';
import { getTicketsFromClient } from '@/services/clients-tickets';
import { jwtDecode } from 'jwt-decode';
import EventCardSkeleton from '@/utils/skeletons/event-skeletons/EventCardSkeleton';

const TicketsEventList: React.FC = () => {
  const [isUpcoming, setIsUpcoming] = useState(true);
  const [currentView, setCurrentView] = useState("upcoming");
  const [fade, setFade] = useState(false);

  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("clientToken");
  const decoded = token && jwtDecode(token.toString());
  const clientId = Number(decoded?.id);
  
  const { data: purchasedTickets, isLoading, isError } = useQuery<IPurchaseTicket[]>({
    queryKey: ["purchasedTickets", clientId], // agregamos clientId por seguridad
    queryFn: async () => {
      if (!token) throw new Error("Token missing");
      return await getTicketsFromClient(clientId, token);
    },
    enabled: !!token && !!clientId,
  });

  const activeTickets = useMemo(
    () => purchasedTickets?.filter(ticket => ticket.status === "PENDING") || [],
    [purchasedTickets]
  );

  const pendingTickets = useMemo(
    () => purchasedTickets?.filter(ticket => ticket.status === "READ" || ticket.status === "DEFEATED") || [],
    [purchasedTickets]
  );


  useEffect(() => {
    setFade(false);
    const timer = setTimeout(() => {
      setCurrentView(isUpcoming ? "upcoming" : "finished");
      setFade(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [isUpcoming]);

  useEffect(() => {
    console.log("cargando",isLoading)
  }, [isLoading]);

  console.log(purchasedTickets)

  return (
    <div className="py-8 pb-32 min-h-screen flex flex-col sm:pb-8 sm:pt-[7.5rem] text-primary-white bg-primary-black px-6">
        <div className="w-full sm:w-xl flex items-center justify-center mt-4 gap-1 relative bg-main-container mx-auto rounded-md px-2 py-1">
          <div
            className={`absolute bg-primary z-10 w-[47%] sm:w-1/2 h-10 pointer-events-auto rounded-md transition-all duration-300 ${
              isUpcoming 
              ? "transform sm:translate-x-[-138px] translate-x-[-50%]" 
              : "transform sm:translate-x-[140px] translate-x-[50%]"
              }`}
          ></div>
          <button
            onClick={() => setIsUpcoming(true)}
            className={`${isUpcoming && "text-primary-black"} w-1/2 py-2 sm:px-3 z-10`}
          >
            Próximos
          </button>
          <button
            onClick={() => setIsUpcoming(false)}
            className={`${!isUpcoming && "text-primary-black"} w-1/2 py-2 sm:px-3 z-10`}
          >
            Finalizados
          </button>
        </div>
        <div className={`transition-opacity duration-200 mt-5 ${fade ? "opacity-100" : "opacity-0"}`}>
          {
            isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <EventCardSkeleton key={i} />
              ))
          }
          {
            isError && !isLoading &&
            <div className="text-center h-screen py-8 text-system-error">
              Error cargando tickets
            </div>
          }
          {!isLoading && !isError && currentView === "upcoming" ? (
            <div className="space-y-4 animate-fade-in">
              {activeTickets?.map((event) => (
                <div key={event.purchaseId} className="flex justify-center">
                  <EventCard isTicketList={true} text="Detalles" href="/tickets/event-ticket" {...event.ticketType.event} />
                </div>
              ))}
              { 
                activeTickets?.length === 0 && 
                <div className="text-center py-8 text-neutral-400">
                  No se encontraron tickets
                </div>
              }
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {pendingTickets?.map((event) => (
                <div key={event.purchaseId || 0} className="flex justify-center">
                  <EventCard isTicketList={true} text="Detalles" href="/tickets/event-ticket" {...event.ticketType.event} />
                </div>
              ))}
              { 
                pendingTickets?.length === 0 && 
                <div className="text-center py-8 text-neutral-400">
                  No se encontraron tickets
                </div>
              }
            </div>
          )}
        </div>
    </div>
  );
};

export default TicketsEventList;
