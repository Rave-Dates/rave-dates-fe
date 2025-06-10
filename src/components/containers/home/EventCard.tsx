"use client";

import Image from 'next/image';
import React, { useState } from 'react';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  return (
    <div className="bg-cards-container rounded-xs overflow-hidden shadow-2xl w-xl h-fit mx-auto">
      <div className="relative h-[36rem]">
        <img 
          src={images[currentImageIndex]} 
          alt={`${artist} - ${currentImageIndex + 1}`}
          className="w-full aspect-square h-full object-cover"
        />

         {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute cursor-pointer left-3 sm:left-6 top-1/2 transform -translate-y-1/2 bg-primary-white hover:opacity-70 rounded-xl p-3 transition-opacity"
            >
              <Image src="/icons/arrow.svg" width={24} height={24} alt="arrow icon" />
            </button>
            <button
              onClick={nextImage}
              className="absolute cursor-pointer right-3 sm:right-6 top-1/2 transform -translate-y-1/2 bg-primary-white hover:opacity-70 rounded-xl p-3 transition-opacity rotate-180"
            >
              <Image src="/icons/arrow.svg" width={24} height={24} alt="arrow icon" />
            </button>
          </>
        )}
        {images.length > 1 && (
            <div className="absolute bottom-4 w-full justify-center flex space-x-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-[7px] h-[7px] rounded-full transition-colors ${
                    index === currentImageIndex ? 'bg-white' : 'bg-red-200/40'
                  }`}
                />
              ))}
            </div>
          )}
      </div>


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