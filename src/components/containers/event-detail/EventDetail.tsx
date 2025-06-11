"use client"

import React from 'react';
import EventHero from './EventHero';
import EventInfo from './EventInfo';
import EventLocation from './EventLocation';
import TicketSelector from './TicketSelector';
import { events } from '@/template-data';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import ArrowSvg from '@/components/svg/ArrowSvg';

const EventDetails = ({ eventName } : { eventName: IEventCard['name'] }) => {
  const selectedEvent = events.find(event => event.name === eventName);
  if (!selectedEvent) return redirect("/")
  
  return (
    <div className="min-h-screen bg-primary-black text-white pb-20 sm:pt-[6.7rem]">
      <div className="max-w-7xl mx-auto pt-0 pb-20 md:px-6 md:py-8">
        {/* Web view */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-x-8">
          {/* Title */}
          <div className="mb-4 col-span-2">
            <h1 className="text-4xl font-semibold text-white mb-0.5 uppercase">{selectedEvent.name}</h1>
            <p className="text-text-inactive">Extended set</p>
          </div>
          {/* Left Column */}
          <div className="space-y-8">
            <EventHero eventImages={selectedEvent.images} />
            <EventInfo artist={selectedEvent.artist} labels={selectedEvent.labels} genres={selectedEvent.genres} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <EventLocation event={selectedEvent} />
            <TicketSelector />
          </div>
        </div>

        {/* Mobile view */}
        <div className="grid md:hidden grid-cols-1 gap-x-8 relative">
          <Link className='absolute z-30 top-20 left-5 bg-primary text-primary-black px-2 py-2 rounded-xl' href="/">
            <ArrowSvg />
          </Link>
          <EventHero eventImages={selectedEvent.images} />

          {/* Title */}
          <div className='px-7'>
            <div className="mb-4 text-center">
              <h1 className="text-4xl font-semibold text-white mb-0.5 uppercase">{selectedEvent.name}</h1>
              <p className="text-text-inactive">Extended set</p>
            </div>
            
            {/* Date */}
            <div className='mb-8'>
              <h3 className="text-lg mb-2">Fecha</h3>
              <p className="text-body bg-cards-container px-4 py-3 rounded-lg">
                {selectedEvent.date}
              </p>
            </div>

            <TicketSelector />

            <EventLocation event={selectedEvent} />

            <EventInfo artist={selectedEvent.artist} labels={selectedEvent.labels} genres={selectedEvent.genres} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;