import React from 'react';
import ImagesSwiper from '@/components/containers/home/ImagesSwiper';
import SpinnerSvg from '@/components/svg/SpinnerSvg';
import Image from 'next/image';

import Link from 'next/link';
import { slugify } from '@/utils/formatText';

const EventHero = ({ eventImages, isImagesLoading, eventId, eventTitle } : { eventImages: { id: string, url: string }[] | undefined, isImagesLoading: boolean, eventId?: number, eventTitle?: string }) => {
  return (
    <div className="relative mb-4!">
      <div className="relative h-full md:h-1/2 rounded-sm overflow-hidden">
        {
          isImagesLoading ? 
          <div className="w-full aspect-[1080/1350] bg-cards-container flex items-center justify-center rounded">
            <SpinnerSvg className='fill-primary w-10 sm:w-20' />
          </div>
          :
          <ImagesSwiper href={eventId ? `/event/${eventId}${eventTitle ? `-${slugify(eventTitle)}` : ''}` : undefined} images={eventImages} className='w-full h-auto' />
        }
        {
          !eventImages && !isImagesLoading && (
            eventId ? (
              <Link href={`/event/${eventId}${eventTitle ? `-${slugify(eventTitle)}` : ''}`}>
                <Image
                  width={1000}
                  height={1000}
                  src="/images/event-placeholder.png"
                  alt="Sin imagen"
                  className="w-full h-auto"
                /> 
              </Link>
            ) : (
              <Image
                width={1000}
                height={1000}
                src="/images/event-placeholder.png"
                alt="Sin imagen"
                className="w-full h-auto"
              /> 
            )
          )
        }
      </div>
    </div>
  );
};

export default EventHero;