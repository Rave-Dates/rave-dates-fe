import React from 'react';
import ImagesSwiper from './ImagesSwiper';
import Link from 'next/link';
import CalendarSvg from '@/components/svg/CalendarSvg';
import LocationSvg from '@/components/svg/LocationSvg';
import BankSvg from '@/components/svg/BankSvg';

const EventCard: React.FC<IEventCard> = ({
  artist,
  name,
  date,
  location,
  venue,
  price,
  currency,
  images,
  hasPaymentOptions = false
}) => {
  return (
    <div className="bg-cards-container rounded-xs overflow-hidden shadow-2xl w-xl h-fit mx-auto">
      <ImagesSwiper images={images} className='w-full aspect-square object-cover h-[36rem]' />

      {/* Event Details */}
      <div className="p-3.5 pt-3">
        <h3 className="text-white text-subtitle font-semibold text-center border-b border-divider pb-2.5 mb-4">
          {artist}
        </h3>
        
        <div className="space-y-2 mb-4 text-text-inactive text-body">
          <div className="flex items-center gap-2">
            <CalendarSvg className='w-6 h-6' />
            {date}
          </div>
          
          <div className="flex items-center gap-2">
            <LocationSvg className='w-6 h-6' />
            {location} • {venue}
          </div>
          
          {hasPaymentOptions ? (
            <div className="flex items-center gap-2">
              <BankSvg className='w-6 h-6' />
              Pago con alcancía disponible
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <BankSvg className='w-6 h-6' />
              Pago con alcancía no disponible
            </div>
          )}
        </div>

        {/* Buy Button and Price */}
        <div className="flex items-center gap-6 justify-between">
          <Link href={`/event/${name}`} className="bg-primary text-center text-black font-medium text-body py-3 px-8 rounded-md hover:bg-primary/80 transition-all flex-1">
            Comprar tickets
          </Link>
          <div className="text-white sm:block hidden">
            <span className='text-xl font-semibold'>
              {currency}
              {price}
            </span>
            <span className="text-text-inactive text-xs font-normal">
              /persona
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;