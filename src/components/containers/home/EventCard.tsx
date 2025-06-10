import Image from 'next/image';
import React from 'react';
import ImagesSwiper from './ImagesSwiper';

const EventCard: React.FC<IEventCard> = ({
  artist,
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
      
        <ImagesSwiper  images={images} />
      

      {/* Event Details */}
      <div className="p-3.5 pt-3">
        <h3 className="text-white text-subtitle font-semibold text-center border-b border-divider pb-2.5 mb-4">
          {artist}
        </h3>
        
        <div className="space-y-2 mb-4 text-text-inactive text-body">
          <div className="flex items-center gap-2">
            <Image className='text-amber-300' src="/icons/calendar.svg" width={24} height={24} alt="logo" />
            {date}
          </div>
          
          <div className="flex items-center gap-2">
            <Image src="/icons/location.svg" width={24} height={24} alt="logo" />
            {location} • {venue}
          </div>
          
          {hasPaymentOptions ? (
            <div className="flex items-center gap-2">
              <Image src="/icons/bank.svg" width={24} height={24} alt="logo" />
              Pago con alcancía disponible
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Image src="/icons/calendar.svg" width={24} height={24} alt="logo" />
              Pago con alcancía no disponible
            </div>
          )}
        </div>

        {/* Buy Button and Price */}
        <div className="flex items-center gap-6 justify-between">
          <button className="bg-primary text-black font-medium text-body py-3 px-8 rounded-md hover:bg-primary/80 transition-all flex-1">
            Comprar tickets
          </button>
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