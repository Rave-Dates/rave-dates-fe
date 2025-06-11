"use client"

import React from 'react';
import EventHero from './EventHero';
import EventInfo from './EventInfo';
import EventLocation from './EventLocation';
import TicketSelector from './TicketSelector';
import { events } from '@/template-data';
import { redirect } from 'next/navigation';

const EventDetails = ({ eventName } : { eventName: IEventCard['name'] }) => {
  const selectedEvent = events.find(event => event.name === eventName);
  if (!selectedEvent) return redirect("/")
  
  return (
    <div className="min-h-screen bg-primary-black text-white pt-50 pb-20 sm:pt-[7rem]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title */}
        <div className="mb-4">
          <h1 className="text-4xl font-semibold text-white mb-0.5 uppercase">{selectedEvent.name}</h1>
          <p className="text-text-inactive">Extended set</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
      </div>
    </div>
  );
};

export default EventDetails;