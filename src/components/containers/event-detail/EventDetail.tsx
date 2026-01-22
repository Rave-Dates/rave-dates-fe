"use client"

import React, { useEffect } from 'react';
import EventHero from './EventHero';
import EventInfo from './EventInfo';
import EventLocation from './EventLocation';
import TicketSelector from './TicketSelector';
import GoBackButton from '@/components/ui/buttons/GoBackButton';
import HeaderSkeleton from '@/utils/skeletons/event-skeletons/HeaderSkeleton';
import { formatDateToColombiaTime } from '@/utils/formatDate';
import { useClientEvent, useClientEventServedImages, useClientEventTickets } from '@/hooks/client/queries/useClientData';
import { useSearchParams } from 'next/navigation';
import { useReactiveCookiesNext } from 'cookies-next';
import { fakeDb } from '@/template-data/fakeDb';

const EventDetails = ({ eventId } : { eventId: number }) => {
  const { setCookie } = useReactiveCookiesNext();

  const params = useSearchParams();
  const urlPromotorAffiliate = params.get("promoter");

  console.log(urlPromotorAffiliate)

  useEffect(() => {
    if (urlPromotorAffiliate) {
      setCookie("promoterAffiliate", urlPromotorAffiliate, { path: "/", maxAge: 60 * 60 * 12 });
    }
  }, []);

  // const { selectedEvent, isEventLoading } = useClientEvent(eventId);
  // const { servedImages, isImagesLoading } = useClientEventServedImages(eventId);
  // const { eventTickets, isTicketsLoading } = useClientEventTickets(eventId);

  const selectedEvent = fakeDb.events.find(event => event.eventId === eventId);
  
  const servedImages = [{id: "1", url: "/images/flyer-1.png"}, {id: "2", url: "/images/flyer-2.png"}];

  return (
    <div className="min-h-screen bg-primary-black text-white pb-20 md:pt-[6.7rem]">
      <div className="max-w-7xl mx-auto pt-0 pb-20 md:px-6 md:py-8 animate-fade-in">
        {/* Web view */}
        <div className="hidden md:grid grid-cols-2 gap-x-8">
          {/* Title */}
          {
            false ? <HeaderSkeleton />
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
            <EventHero isImagesLoading={false} eventImages={servedImages} />
            <EventInfo
              description={selectedEvent?.description || ""}
              isLoading={ false }
              labels={selectedEvent?.labels}
              eventCategoryValues={selectedEvent?.eventCategoryValues}
              organizerName={null}
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {
              selectedEvent && <EventLocation isLoading={false} event={selectedEvent} />
            }
            <TicketSelector maxPurchase={selectedEvent?.maxPurchase} isLoading={false} tickets={fakeDb.ticketTypes} />
          </div>
        </div>

        {/* Mobile view */}
        <div className="grid md:hidden grid-cols-1 gap-x-8 relative">
          <GoBackButton className="absolute z-30 top-20 left-5 px-2 py-2" />
          <EventHero isImagesLoading={false} eventImages={servedImages} />

          {/* Title */}
          <div className='px-6'>
            <div className="mb-4 text-center">
              <h1 className="text-4xl font-semibold text-white mb-0.5 uppercase">{selectedEvent?.title}</h1>
              <p className="text-text-inactive">Extended set</p>
            </div>
            
            {/* Date */}
            <div className='mb-8'>
              <h3 className="text-lg mb-2">Fecha</h3>
              <p className="text-body capitalize bg-cards-container px-4 py-3 rounded-lg">
                {
                  selectedEvent?.date &&
                  <>{formatDateToColombiaTime(selectedEvent.date).formatted} {formatDateToColombiaTime(selectedEvent.date).time}hs (COL)</>
                }
              </p>
            </div>

            <TicketSelector maxPurchase={selectedEvent?.maxPurchase} isLoading={false} tickets={fakeDb.ticketTypes} />

            {
              selectedEvent && <EventLocation isLoading={false} event={selectedEvent} />
            }
            
            {selectedEvent && selectedEvent.eventCategoryValues.length > 0 && (
              <EventInfo
                description={selectedEvent?.description || ""}
                isLoading={false}
                labels={selectedEvent?.labels}
                eventCategoryValues={selectedEvent?.eventCategoryValues}
                organizerName={null}
              />
            )}            
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;