import InfoSkeleton from '@/utils/skeletons/event-skeletons/InfoSkeleton';
import React, { useMemo } from 'react';

type Props = {
  labels?: IEventLabel[];
  eventCategoryValues?: IEventCategoryValue[];
  isLoading?: boolean;
  description: string;
  organizerName: string | null | undefined;
};

const EventInfo= ({ labels, eventCategoryValues, isLoading, description, organizerName } : Props) => {
  const categories = useMemo(() => {
    if (!eventCategoryValues || !Array.isArray(eventCategoryValues)) return [];

    return eventCategoryValues.map((category) => ({
      categoryName: category?.category?.name ?? "",
      categoryValue: category?.value?.value ?? "",
    }));
  }, [eventCategoryValues]);

  const genre = categories.find(
    (category) => category.categoryName.toLowerCase() === "género"
  );
  
  return (
    <>
      {
        isLoading ? <InfoSkeleton />
        :
        <div className="space-y-6 mb-8">
          {/* About Event */}
          <div>
            <h2 className="text-small-title font-bold text-white mb-3">Acerca del evento</h2>
            <p className="text-text-inactive text-body">
              {description}
            </p>
          </div>

          {/* Additional Information */}
          <div>
            <h3 className="text-small-title font-semibold text-white mb-3">Información adicional</h3>
            <div className="flex flex-wrap gap-2">
              {labels?.map((label, index) => (
                <span key={index} className="bg-primary text-black px-3 py-1.5 rounded-xl text-sm">
                  {label.name}
                </span>
              ))}
            </div>
          </div>

          {/* Organizer */}
          <div>
            <h3 className="text-small-title font-semibold text-white mb-2">Organizador</h3>
              <span className="bg-primary text-black px-3 py-1.5 rounded-xl text-sm">
                {organizerName || "Organizador no disponible"}
              </span>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-small-title font-semibold text-white mb-3">Géneros</h3>
            <div className="flex gap-2">
              <span className="bg-primary text-black px-3 py-1.5 rounded-xl text-sm">
                {genre?.categoryValue || "Genero no disponible"}
              </span>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default EventInfo;