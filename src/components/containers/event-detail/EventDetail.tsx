"use client"

import React from 'react';
import EventHero from './EventHero';
import EventInfo from './EventInfo';
import EventLocation from './EventLocation';
import TicketSelector from './TicketSelector';
import { events } from '@/template-data';
import { redirect } from 'next/navigation';
import GoBackButton from '@/components/ui/buttons/GoBackButton';
import { useQuery } from '@tanstack/react-query';
import { getClientEventById, getEventClientTickets } from '@/services/clients-events';

const EventDetails = ({ eventId, isTicketList = false } : { eventId: number, isTicketList?: boolean }) => {
  const images = ["/images/flyer-1.png", "/images/flyer-2.png", "/images/flyer-3.png"]
  
  const { data: selectedEvent, isLoading, isError } = useQuery({
    queryKey: ["selectedEvent"],
    queryFn: () => getClientEventById(eventId),
  });
  
  const { data: eventTickets } = useQuery({
    queryKey: ["eventTickets"],
    queryFn: () => getEventClientTickets(eventId),
  });
  
  console.log("selectedEvent",selectedEvent)

  return (
    <div className="min-h-screen bg-primary-black text-white pb-20 md:pt-[6.7rem]">
      <div className="max-w-7xl mx-auto pt-0 pb-20 md:px-6 md:py-8 animate-fade-in">
        {/* Web view */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-x-8">
          {/* Title */}
          <div className="mb-4 col-span-2">
            <h1 className="text-4xl font-semibold text-white mb-0.5 uppercase">{selectedEvent?.title}</h1>
            <p className="text-text-inactive">Extended set</p>
          </div>
          {/* Left Column */}
          <div className="space-y-8">
            <EventHero eventImages={images} />
            {selectedEvent?.eventCategoryValues?.length > 0 && (
              <EventInfo
                labels={selectedEvent?.labels}
                eventCategoryValues={selectedEvent?.eventCategoryValues}
              />
            )}          
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <EventLocation event={selectedEvent} />
            <TicketSelector tickets={eventTickets} isTicketList={isTicketList} />
          </div>
        </div>

        {/* Mobile view */}
        <div className="grid md:hidden grid-cols-1 gap-x-8 relative">
          <GoBackButton className="absolute z-30 top-20 left-5 px-2 py-2" />
          <EventHero eventImages={images} />

          {/* Title */}
          <div className='px-6'>
            <div className="mb-4 text-center">
              <h1 className="text-4xl font-semibold text-white mb-0.5 uppercase">{selectedEvent?.title}</h1>
              <p className="text-text-inactive">Extended set</p>
            </div>
            
            {/* Date */}
            <div className='mb-8'>
              <h3 className="text-lg mb-2">Fecha</h3>
              <p className="text-body bg-cards-container px-4 py-3 rounded-lg">
                {selectedEvent?.date}
              </p>
            </div>

            {
              !isTicketList && <TicketSelector tickets={eventTickets} isTicketList={isTicketList} />
            }

            <EventLocation event={selectedEvent} />

            {selectedEvent?.eventCategoryValues?.length > 0 && (
              <EventInfo
                labels={selectedEvent?.labels}
                eventCategoryValues={selectedEvent?.eventCategoryValues}
              />
            )}            
            {
              isTicketList && <TicketSelector ticketStatus={selectedEvent?.status} isTicketList={isTicketList} />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;