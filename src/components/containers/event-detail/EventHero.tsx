import React from 'react';
import ImagesSwiper from '@/components/containers/home/ImagesSwiper';

const EventHero = ({ eventImages } : { eventImages: IEventCard['images'] }) => {
  
  return (
    <div className="relative !mb-4">
      <div className="relative h-1/2 rounded-sm overflow-hidden">
        <ImagesSwiper images={eventImages} className='w-full aspect-squuare object-cover h-[576px]' />
      </div>
    </div>
  );
};

export default EventHero;