"use client"

import React from 'react';
import EventHero from './EventHero';
import EventInfo from './EventInfo';
import EventLocation from './EventLocation';
import TicketSelector from './TicketSelector';
import GoBackButton from '@/components/ui/buttons/GoBackButton';
import HeaderSkeleton from '@/utils/skeletons/event-skeletons/HeaderSkeleton';
import { formatDateToColombiaTime } from '@/utils/formatDate';
import { useClientEvent, useClientEventServedImages, useClientEventTickets } from '@/hooks/client/queries/useClientData';

const EventDetails = ({ eventId } : { eventId: number }) => {
  const { selectedEvent, isEventLoading } = useClientEvent(eventId);
  const { servedImages, isImagesLoading } = useClientEventServedImages(eventId);
  const { eventTickets, isTicketsLoading } = useClientEventTickets(eventId);
  
  return (
    <div className="min-h-screen bg-primary-black text-white pb-20 md:pt-[6.7rem]">
      <div className="max-w-7xl mx-auto pt-0 pb-20 md:px-6 md:py-8 animate-fade-in">
        {/* Web view */}
        <div className="hidden md:grid grid-cols-2 gap-x-8">
          {/* Title */}
          {
            isEventLoading ? <HeaderSkeleton />
            :
            <div className="mb-4 col-span-2">
              <h1 className="text-4xl font-semibold text-white mb-0.5 uppercase">
                {selectedEvent?.title}
              </h1>
              <p className="text-text-inactive">{selectedEvent?.subtitle}</p>
            </div>
          }
          {/* Left Column */}
          <div className="space-y-8">
            <EventHero isImagesLoading={isImagesLoading} eventImages={servedImages} />
            <EventInfo
              description={selectedEvent?.description || ""}
              isLoading={isEventLoading}
              labels={selectedEvent?.labels}
              eventCategoryValues={selectedEvent?.eventCategoryValues}
              organizerName={selectedEvent?.organizer?.[0]?.user?.name}
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {
              selectedEvent && <EventLocation isLoading={isEventLoading} event={selectedEvent} />
            }
            <TicketSelector maxPurchase={selectedEvent?.maxPurchase} isLoading={isTicketsLoading} tickets={eventTickets} />
          </div>
        </div>

        {/* Mobile view */}
        <div className="grid md:hidden grid-cols-1 gap-x-8 relative">
          <GoBackButton className="absolute z-30 top-20 left-5 px-2 py-2" />
          <EventHero isImagesLoading={isImagesLoading} eventImages={servedImages} />

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
                {
                  selectedEvent?.date &&
                  <>{formatDateToColombiaTime(selectedEvent.date).date} {formatDateToColombiaTime(selectedEvent.date).time}hs (COL)</>
                }
              </p>
            </div>

            <TicketSelector maxPurchase={selectedEvent?.maxPurchase} isLoading={isTicketsLoading} tickets={eventTickets} />

            {
              selectedEvent && <EventLocation isLoading={isEventLoading} event={selectedEvent} />
            }
            
            {selectedEvent && selectedEvent.eventCategoryValues.length > 0 && (
              <EventInfo
                description={selectedEvent?.description || ""}
                isLoading={isEventLoading}
                labels={selectedEvent?.labels}
                eventCategoryValues={selectedEvent?.eventCategoryValues}
                organizerName={selectedEvent?.organizer?.[0]?.user?.name}
              />
            )}            
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;