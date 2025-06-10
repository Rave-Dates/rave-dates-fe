import React from 'react';
import EventCard from './EventCard';
import { events } from '@/template-data';

const EventCardList: React.FC = () => {

  return (
    <div className="py-8 pt-[7.5rem] bg-primary-black mx-auto px-6">
      <div className="space-y-4">
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