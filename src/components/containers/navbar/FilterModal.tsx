import React, { useEffect, useState } from 'react';
import FilterSvg from '@/components/svg/FilterSvg';
import CheckInput from '@/components/inputs/CheckInput';
import FilterButton from '@/components/buttons/FilterButton';
import AddSvg from '@/components/svg/AddSvg';

export interface FilterState {
  location: string;
  eventType: string;
  organizers: string[];
  genres: string[];
}

function FilterModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    location: 'Bogotá',
    eventType: 'Rave',
    organizers: ['Organizador 1', 'Organizador 5'],
    genres: ['Hard Techno']
  });

  // no scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  const locations = ['Bogotá', 'Medellín'];
  const eventTypes = ['Rave', 'Club'];
  const organizers = ['Organizador 1', 'Organizador 2', 'Organizador 3', 'Organizador 4', 'Organizador 5'];
  const genres = ['Hard Techno', 'Melodic Techno', 'Drum & Bass', 'Raw Techno', 'Hardcore'];

  const handleLocationChange = (location: string) => {
    setFilters(prev => ({ ...prev, location }));
  };

  const handleEventTypeChange = (eventType: string) => {
    setFilters(prev => ({ ...prev, eventType }));
  };

  const handleOrganizerToggle = (organizer: string) => {
    setFilters(prev => ({
      ...prev,
      organizers: prev.organizers.includes(organizer)
        ? prev.organizers.filter(o => o !== organizer)
        : [...prev.organizers, organizer]
    }));
  };

  const handleGenreToggle = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      eventType: '',
      organizers: [],
      genres: []
    });
  };

  const applyFilters = () => {
    console.log('Applying filters:', filters);
    setIsModalOpen(false);
  };

  return (
    <>
      <button 
        className="bg-primary text-primary-black hover:bg-primary/70 transition-colors px-3.5 content-center mx-2 rounded-2xl"
        onClick={() => setIsModalOpen(true)}
      >
        <FilterSvg />
      </button>
      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 bg-opacity-75 flex items-center justify-center md:p-4 z-50">
          <div onClick={(e) => e.stopPropagation()}  className="bg-[#050505] flex flex-col justify-between rounded-2xl w-full md:h-fit max-h-full md:max-w-md overflow-y-scroll shadow-2xl">
            {/* Header */}
            <div className="flex flex-row-reverse md:flex-row justify-end gap-5 items-center md:justify-between pt-8 px-6"> 
              <h2 className="text-title">Filtros</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-primary text-primary-black transition-colors rounded-xl p-1.5"
              >
                <AddSvg className='rotate-45 w-7 h-7' />
              </button>
            </div>

            <div className="py-6 space-y-8 font-light px-6">
              {/* Location Filter */}
              <CheckInput
                items={locations}
                type="location"
                handleFunc={handleLocationChange}
                filters={filters}
                title="Ubicación"
              />

              {/* Event Type Filter */}
              <CheckInput
                items={eventTypes}
                type="eventType"
                handleFunc={handleEventTypeChange}
                filters={filters}
                title="Tipo de evento"
              />

              {/* Organizer Filter */}
              <FilterButton
                items={organizers}
                type="organizers"
                handleFunc={handleOrganizerToggle}
                filters={filters}
                title="Organizador"
              />

              {/* Genre Filter */}
              <FilterButton
                items={genres}
                type="genres"
                handleFunc={handleGenreToggle}
                filters={filters}
                title="Género"
              />
            </div>

            {/* Footer */}
            <div className="p-6 pt-2 border-t bg-main-container border-divider">
              <button
                onClick={clearFilters}
                className="w-full py-3 text-primary-white font-medium hover:opacity-85 transition-opacity"
              >
                Eliminar filtros
              </button>
              <button
                onClick={applyFilters}
                className="w-full bg-primary text-black py-3 rounded-lg font-medium hover:opacity-85 transition-opacity"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FilterModal;