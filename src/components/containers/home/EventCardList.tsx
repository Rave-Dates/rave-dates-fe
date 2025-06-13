import React from 'react';
import EventCard from './EventCard';
import { events } from '@/template-data';
import Link from 'next/link';

const EventCardList: React.FC = () => {

  return (
    <div className="py-8 pb-32 sm:pb-8 sm:pt-[7.5rem] bg-primary-black mx-auto px-6">
      <div className='flex flex-col justify-cente items-center gap-5 mb-4 text-sm'>
        <h3 className='text-white text-xs'>Links de prueba</h3>
        <Link className='bg-primary py-1 px-2 rounded-xl' href="admin/users">admin/users</Link>
        <Link className='bg-primary py-1 px-2 rounded-xl' href="admin/auth">admin/auth</Link>
        <Link className='bg-primary py-1 px-2 rounded-xl' href="admin/users/create-user">admin/users/create-user</Link>
      </div>
      <div className="space-y-4 animate-fade-in">
        {events.map((event) => (
          <div key={event.id} className="flex justify-center">
            <EventCard {...event} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCardList;