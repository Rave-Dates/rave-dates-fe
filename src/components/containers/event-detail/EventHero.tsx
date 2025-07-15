import React from 'react';
import ImagesSwiper from '@/components/containers/home/ImagesSwiper';
import SpinnerSvg from '@/components/svg/SpinnerSvg';

const EventHero = ({ eventImages, isImagesLoading } : { eventImages: { id: string, url: string }[] | undefined, isImagesLoading: boolean }) => {
  
  return (
    <div className="relative !mb-4">
      <div className="relative h-full md:h-1/2 rounded-sm overflow-hidden">
        {
          isImagesLoading ? 
          <div className="w-full h-[576px] bg-cards-container flex items-center justify-center rounded">
            <SpinnerSvg className='fill-primary w-10 sm:w-20' />
          </div>
          :
          <ImagesSwiper images={eventImages} className='w-full aspect-square object-cover h-[576px]' />
        }
      </div>
    </div>
  );
};

export default EventHero;