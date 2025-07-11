import React, { useEffect, useState } from 'react';
import ImagesSwiper from './ImagesSwiper';
import Link from 'next/link';
import CalendarSvg from '@/components/svg/CalendarSvg';
import LocationSvg from '@/components/svg/LocationSvg';
import BankSvg from '@/components/svg/BankSvg';
import DollarSvg from '@/components/svg/DollarSvg';
import { extractPlaceFromGeo } from '@/utils/formatGeo';
import { useQuery } from '@tanstack/react-query';
import { getClientEventImagesById, getClientImageById } from '@/services/clients-events';
import SpinnerSvg from '@/components/svg/SpinnerSvg';

const EventCard: React.FC<IEventCard & { href?: string, text?: string, isTicketList?: boolean}> = ({
  href = "/event/",
  text = "Comprar tickets",
  eventId,
  isTicketList = false,
  status,
  title,
  date,
  geo,
  piggyBank
}) => {
  const { data: eventImages } = useQuery({
    queryKey: [`eventImages-${eventId}`],
    queryFn: () => getClientEventImagesById(eventId),
  });

  const { data: servedImages, isLoading: loadingImages, isError: errorImages } = useQuery({
    queryKey: [`servedImages-${eventId}`, eventImages?.map(img => img.imageId)],
    queryFn: async () => {
      if (!eventImages) return [];
      const processedImages = await Promise.all(
        eventImages?.map(async (img) => {
          const blob = await getClientImageById(img.imageId);
          const url = URL.createObjectURL(blob);
          
          return {
            id: String(img.imageId),
            url,
          };
        })
      );

      return processedImages;
    },
  });

  return (
    <div className="bg-cards-container rounded-xs overflow-hidden shadow-2xl w-xl h-fit mx-auto">
      {
        loadingImages ?
        <div className='h-[36rem] flex items-center justify-center w-full bg-cards-container'>
          <SpinnerSvg className='fill-primary w-10 sm:w-14' />
        </div>
        :
        <ImagesSwiper images={servedImages} className='w-full aspect-square object-cover h-[36rem]' />
      }

      {/* Event Details */}
      <div className="p-3.5 pt-3">
        <h3 className="text-white text-subtitle font-semibold text-center border-b border-divider pb-2.5 mb-4">
          {title}
        </h3>
        
        <div className="space-y-2 mb-4 text-text-inactive text-body">
          <div className="flex items-center gap-2">
            <CalendarSvg className='w-6 h-6' />
            {date}
          </div>
          
          <div className="flex items-center gap-2">
            <LocationSvg className='w-6 h-6' />
            {extractPlaceFromGeo(geo) || geo}
          </div>
          
          {
            status === "pending" && isTicketList ?
              <div className="flex items-center text-system-error gap-2">
                <DollarSvg className='w-6 h-6' />
                Saldo pendiente
              </div>
              :
              piggyBank ? (
                <div className="flex items-center gap-2">
                  <BankSvg className='w-6 h-6' />
                  Pago con alcancía disponible
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <BankSvg className='w-6 h-6' />
                  Pago con alcancía no disponible
                </div>
              )
          }

        </div>

        {/* Buy Button and Price */}
        <div className={`${text === "Finalizado" && "hidden"} flex items-center gap-6 justify-between`}>
          <Link href={`${href}/${eventId}`} className="bg-primary text-center text-black font-medium text-body py-3 px-8 rounded-md hover:bg-primary/80 transition-all flex-1">
            {text}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;