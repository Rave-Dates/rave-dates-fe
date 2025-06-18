"use client"

import React, { useEffect, useState } from 'react';
import EventCard from '@/components/containers/home/EventCard';
import { events } from '@/template-data';

const TicketsEventList: React.FC = () => {
  const [isUpcoming, setIsUpcoming] = useState(true);
  const [currentView, setCurrentView] = useState("upcoming");
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setFade(false);
    const timer = setTimeout(() => {
      setCurrentView(isUpcoming ? "upcoming" : "finished");
      setFade(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [isUpcoming]);

  return (
    <div className="py-8 pb-32 sm:pb-8 sm:pt-[7.5rem] text-primary-white bg-primary-black px-6">
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
          {currentView === "upcoming" ? (
            <div className="space-y-4 animate-fade-in">
              {events.map((event) => (
                <div key={event.id} className="flex justify-center">
                  <EventCard isTicketList={true} text="Detalles" href="/tickets/event-ticket" {...event} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {events.map((event) => (
                <div key={event.id} className="flex justify-center">
                  <EventCard isTicketList={true} text="Finalizado" href="/tickets/event-ticket" {...event} />
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
};

export default TicketsEventList;