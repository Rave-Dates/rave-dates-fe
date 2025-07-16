const EventCardSkeleton = () => {
  return (
    <div className="bg-cards-container rounded-xs overflow-hidden shadow-2xl w-xl h-fit mx-auto">
      <div className='h-[36rem] flex items-center justify-center w-full bg-cards-container'>
      </div>
      {/* Event Details */}
      <div className="p-3.5 pt-3">
        <div className="border-b w-full border-divider pb-3 mb-4">
          <div className="bg-inactive justify-self-center animate-pulse h-9 w-2/3 rounded"></div>
        </div>
        
        <div className="space-y-2 mb-4 text-text-inactive text-body">
          {
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="bg-inactive animate-pulse h-6 w-6 rounded"></div>
                <div className="bg-inactive animate-pulse h-3 w-20 rounded"></div>
              </div>
            ))
          }
        </div>

        {/* Buy Button and Price */}
        <div className="flex items-center gap-6 justify-between">
          <div className="bg-primary w-full h-11 py-3 px-8 rounded-md flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;