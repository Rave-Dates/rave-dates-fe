"use client"

import React from 'react';
import EventHero from './EventHero';
import EventInfo from './EventInfo';
import EventLocation from './EventLocation';
import TicketSelector from './TicketSelector';
import GoBackButton from '@/components/ui/buttons/GoBackButton';
import { useQuery } from '@tanstack/react-query';
import { getClientEventById, getClientEventImagesById, getClientImageById, getEventClientTickets } from '@/services/clients-events';
import HeaderSkeleton from '@/utils/skeletons/event-skeletons/HeaderSkeleton';

const EventDetails = ({ eventId, isTicketList = false } : { eventId: number, isTicketList?: boolean }) => {
  const { data: selectedEvent, isLoading: isEventLoading } = useQuery<IEvent>({
    queryKey: [`selectedEvent-${eventId}`],
    queryFn: () => getClientEventById(eventId),
  });
  
  const { data: eventTickets, isLoading: isTicketsLoading } = useQuery<IEventTicket[]>({
    queryKey: ["eventTickets"],
    queryFn: () => getEventClientTickets(eventId),
  });

  const { data: eventImages } = useQuery<IEventImages[]>({
    queryKey: [`eventImages-${eventId}`],
    queryFn: () => getClientEventImagesById(eventId),
  });

  const { data: servedImages, isLoading: isImagesLoading } = useQuery<{ id: string, url: string }[]>({
    queryKey: [`servedImages-${eventId}`, eventImages?.map(img => img.imageId)],
    enabled: !!eventImages,
    queryFn: async () => {
      if (!eventImages) return [];
      const processedImages = await Promise.all(
        eventImages?.map(async (img) => {
          const blob = await getClientImageById(img.imageId);
          const url = URL.createObjectURL(blob);
          
          return {
            id: String(img.imageId),
            url,
          };
        })
      );

      return processedImages;
    },
  });
  
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
              <p className="text-text-inactive">Extended set</p>
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
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {
              selectedEvent && <EventLocation isLoading={isEventLoading} event={selectedEvent} />
            }
            <TicketSelector isLoading={isTicketsLoading} tickets={eventTickets} isTicketList={isTicketList} />
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
                {selectedEvent?.date}
              </p>
            </div>

            {
              !isTicketList && <TicketSelector isLoading={isTicketsLoading} tickets={eventTickets} isTicketList={isTicketList} />
            }

            {
              selectedEvent && <EventLocation isLoading={isEventLoading} event={selectedEvent} />
            }
            
            {selectedEvent && selectedEvent.eventCategoryValues.length > 0 && (
              <EventInfo
                description={selectedEvent?.description || ""}
                isLoading={isEventLoading}
                labels={selectedEvent?.labels}
                eventCategoryValues={selectedEvent?.eventCategoryValues}
              />
            )}            
            {
              isTicketList && <TicketSelector isLoading={isTicketsLoading} ticketStatus="paid" isTicketList={isTicketList} />
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;