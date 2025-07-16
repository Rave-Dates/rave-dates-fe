import { extractLatAndLng, extractPlaceFromGeo } from '@/utils/formatGeo';
import React from 'react';
import EventMap from './EventMap';

const EventLocation = ({ event, isLoading } : { event: IEvent, isLoading: boolean }) => {
  const geoParts = extractLatAndLng(event.geo).split(",").map(Number);
  const position = geoParts.length === 2 ? geoParts as [number, number] : undefined;

  return (
    <div className="space-y-6 mb-5">
      {/* Date */}
      <div className='md:block hidden'>
        <h3 className="text-lg mb-2">Fecha</h3>
        {
          isLoading ?
          <div className="bg-cards-container animate-pulse h-[45px] w-full px-4 py-3 rounded-lg">
          </div>
          :
          <p className="text-body bg-cards-container px-4 py-3 rounded-lg">
            {event?.date}
          </p>
        }
      </div>

      {/* Location */}
      <h3 className="text-lg text-white mb-2">Ubicación</h3>

      <div className='bg-cards-container flex flex-col rounded-lg px-2 font-light'>
        {
          isLoading ?
          <div className="bg-inactive animate-pulse my-2 h-[29px] w-32 px-4  rounded-lg">
          </div>
          :
          <h2 className="text-body px-2 py-3">
            {
              event?.geo && extractPlaceFromGeo(event.geo)
            }
          </h2>
        }
        
        {/* Map */}
        {
          isLoading ?
            <div className="bg-cards-container h-[357px] w-full px-4 py-3 rounded-lg">
              <div className="h-[256px] w-full bg-inactive animate-pulse rounded"></div>
            </div>
            :
            <>
              {
                position &&
                <EventMap place={extractPlaceFromGeo(event?.geo)} position={position} />
              }
            </>
        }
        {/* <div className="relative h-[256px] bg-neutral-800 rounded-lg overflow-hidden">
          <Image src="/images/map-example.png" alt="map" fill className="absolute inset-0 w-full h-full object-cover" />
        </div> */}
      </div>
    </div>
  );
};

export default EventLocation;