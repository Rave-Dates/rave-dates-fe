import React, { useEffect } from 'react';
import ImagesSwiper from './ImagesSwiper';
import Link from 'next/link';
import CalendarSvg from '@/components/svg/CalendarSvg';
import LocationSvg from '@/components/svg/LocationSvg';
import { useQuery } from '@tanstack/react-query';
import { getClientEventImagesById, getClientImageById } from '@/services/clients-events';
import SpinnerSvg from '@/components/svg/SpinnerSvg';
import { formatDateToColombiaTime } from '@/utils/formatDate';
import { extractPlaceFromGeo } from '@/utils/formatGeo';
import { useTicketStore } from '@/store/useTicketStore';

const EventCard: React.FC<IEvent & { href: string, text?: string, isTicketList?: boolean}> = ({
  href,
  text = "Comprar tickets",
  eventId,
  // isTicketList = false,
  title,
  subtitle,
  date,
  geo,
  externalUrl,
  // piggyBank
}) => {
  const { resetSelected } = useTicketStore();

  useEffect(() => {
    resetSelected()
  }, []);

  const { data: eventImages } = useQuery<IEventImages[]>({
    queryKey: [`eventImages-${eventId}`],
    queryFn: () => getClientEventImagesById(Number(eventId)),
  });

  const { data: servedImages, isLoading: loadingImages } = useQuery({
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
    <div className="bg-cards-container rounded-none sm:rounded-sm overflow-hidden shadow-2xl w-full sm:w-xl h-fit mx-0 sm:mx-auto pb-5 sm:pb-0 sm:mb-5">
      {
        loadingImages ?
        <div className='aspect-[1080/1350] flex items-center justify-center w-full bg-cards-container'>
          <SpinnerSvg className='fill-primary w-10 sm:w-14' />
        </div>
        :
        <ImagesSwiper images={servedImages} className='w-full h-auto' />
      }

      {/* Event Details */}
      <div className="p-3.5 pt-3">
        <h3 className="text-white text-subtitle font-semibold text-center border-b border-divider pb-1 mb-1">
          {title}
        </h3>
        <p className="text-text-inactive text-center mb-3">{subtitle}</p>

        
        <div className="space-y-2 mb-4 text-text-inactive text-body">
          <div className="flex items-center capitalize gap-2">
            <CalendarSvg className='w-6 h-6' />
            {formatDateToColombiaTime(date).formatted} {formatDateToColombiaTime(date).time}hs (COL)
          </div>
          
          <div className="flex items-center gap-2">
            <LocationSvg className='w-6 h-6' />
            {extractPlaceFromGeo(geo)}
          </div>
          
          {/* {
            status === "pending" && isTicketList ?
              <div className="flex items-center text-primary gap-2">
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
          } */}

        </div>

        {/* Buy Button and Price */}
        <div className={`${text === "Finalizado" && "hidden"} flex items-center gap-6 justify-between`}>
          {externalUrl ? (
            <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="bg-primary text-center text-primary-white font-medium text-body py-3 px-8 rounded-md hover:bg-primary/80 transition-all flex-1">
              {text}
            </a>
          ) : (
            <Link href={`${href}/${eventId}`} className="bg-primary text-center text-primary-white font-medium text-body py-3 px-8 rounded-md hover:bg-primary/80 transition-all flex-1">
              {text}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;