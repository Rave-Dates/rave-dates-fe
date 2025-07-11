"use client"

import React, { useEffect } from 'react';
import EventCard from './EventCard';
import { events } from '@/template-data';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getAllClientEvents } from '@/services/clients-events';
import EventCardSkeleton from '@/utils/skeletons/event-skeletons/EventCardSkeleton';

const EventCardList: React.FC = () => {
  const { data: clientEvents, isLoading, isError } = useQuery({
    queryKey: ["clientEvents"],
    queryFn: () => getAllClientEvents(1, 10),
  });

  useEffect(() => {
    console.log(clientEvents)
  }, [clientEvents]);

  return (
    <div className="py-8 pb-32 sm:pb-8 sm:pt-[7.5rem] bg-primary-black mx-auto px-6">
      {/* <div className='flex flex-wrap justify-center items-center gap-3 mb-4 text-sm'>
        <h3 className='text-white text-xs'>Links de prueba</h3>
        <Link className='bg-primary py-1 px-2 rounded-xl' href="admin/users">admin/users</Link>
        <Link className='bg-primary py-1 px-2 rounded-xl' href="admin/auth">admin/auth</Link>
        <Link className='bg-primary py-1 px-2 rounded-xl' href="organizer/promoters">organizer/promoters</Link>
        <Link className='bg-primary py-1 px-2 rounded-xl' href="organizer/auth">organizer/auth</Link>
        <Link className='bg-primary py-1 px-2 rounded-xl' href="tickets/event-ticket/dyen/change-tickets">/change-tickets</Link>
        <Link className='bg-primary py-1 px-2 rounded-xl' href="/checkout">/checkout</Link>
        <Link className='bg-primary py-1 px-2 rounded-xl' href="/otp">/otp</Link>
      </div> */}
      <div className="space-y-4 animate-fade-in">
        {
          isLoading ?
            Array.from({ length: 3 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))
            :
            clientEvents.map((event) => (
              <div key={event.eventId} className="flex justify-center">
                <EventCard {...event} />
              </div>
            ))
        }
      </div>
    </div>
  );
};

export default EventCardList;