import Image from 'next/image';
import React from 'react';

const EventLocation = ({ event } : { event: IEventCard }) => {
  return (
    <div className="space-y-6 mb-5">
      {/* Date */}
      <div className='md:block hidden'>
        <h3 className="text-lg mb-2">Fecha</h3>
         <p className="text-body bg-cards-container px-4 py-3 rounded-lg">
          {event?.date}
        </p>
      </div>

      {/* Location */}
      <h3 className="text-lg text-white mb-2">Ubicación</h3>

      <div className='bg-cards-container rounded-lg px-2 font-light'>
        <h2 className="text-body px-2 py-3">
          {event?.geo} 
        </h2>
        
        {/* Map */}
        <div className="relative h-[256px] bg-neutral-800 rounded-lg overflow-hidden">
          <Image src="/images/map-example.png" alt="map" fill className="absolute inset-0 w-full h-full object-cover" />
        </div>

        {/* View on Google Maps */}
        <button className="text-center w-full text-body px-4 pt-4 pb-5 underline underline-offset-4 decoration-primary-white/70"> 
          Ver en Google Maps
        </button>
      </div>
    </div>
  );
};

export default EventLocation;