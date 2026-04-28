"use client";

import React, { useEffect, useState } from "react";
import { useCityStore } from "@/store/useCityStore";
import { useClientAllCategories } from "@/hooks/client/queries/useClientData";
import { useEventStore } from "@/store/useEventStore";
import LocationSvg from "@/components/svg/LocationSvg";
import SpinnerSvg from "@/components/svg/SpinnerSvg";

const CitySelectorModal: React.FC = () => {
  const { selectedCity, setSelectedCity, isModalOpen, setIsModalOpen, hydrate, clearCity } = useCityStore();
  const { filters, setFilters } = useEventStore();
  const { clientCategories, isCategoriesLoading } = useClientAllCategories();
  const [locationCategory, setLocationCategory] = useState<IEventCategories | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (clientCategories) {
      const found = clientCategories.find(c => 
        c.name.toLowerCase().includes("ubicacion") || 
        c.name.toLowerCase().includes("ubicación") ||
        c.name.toLowerCase().includes("ciudad")
      );
      if (found) {
        setLocationCategory(found);
      }
    }
  }, [clientCategories]);

  // Evitar scroll del body cuando está abierto el modal
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen]);

  useEffect(() => {
    if (locationCategory && selectedCity) {
      const filterKey = `category-${locationCategory.categoryId}`;
      // Solo actualizamos si el filtro no está ya puesto para evitar bucles o sobreescrituras innecesarias
      if (filters[filterKey] !== selectedCity) {
        setFilters({
          ...filters,
          [filterKey]: selectedCity
        });
      }
    }
  }, [locationCategory, selectedCity, filters, setFilters]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    
    // Also update global event filters
    if (locationCategory) {
      const filterKey = `category-${locationCategory.categoryId}`;
      setFilters({
        ...filters,
        [filterKey]: city
      });
    }
    
    setIsModalOpen(false);
  };

  const handleClear = () => {
    clearCity();
    if (locationCategory) {
      const filterKey = `category-${locationCategory.categoryId}`;
      const newFilters = { ...filters };
      delete newFilters[filterKey];
      setFilters(newFilters);
    }
    setIsModalOpen(false);
  };

  if (!isModalOpen) return null;

  const cities = locationCategory?.values.map(v => v.value) || [];

  return (
    <div 
      onClick={() => setIsModalOpen(false)}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-fade-in px-4"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0E0E0E] border border-divider rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
      >
        <div className="p-8 text-center">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <LocationSvg className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Selecciona tu ciudad</h2>
          <p className="text-text-inactive mb-8">
            Para mostrarte los mejores eventos cerca de ti, cuéntanos en qué ciudad te encuentras.
          </p>

          {isCategoriesLoading ? (
            <div className="flex justify-center py-12">
              <SpinnerSvg className="w-12 h-12 fill-primary" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar mb-6">
                {cities.length > 0 ? (
                  cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCitySelect(city)}
                      className={`
                        py-4 px-6 rounded-2xl text-left transition-all duration-200 border
                        ${
                          selectedCity === city
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                            : "bg-cards-container border-divider text-primary-white hover:border-primary/50 hover:bg-primary/5"
                        }
                      `}
                    >
                      <span className="font-medium text-lg">{city}</span>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-text-inactive italic">
                    {locationCategory ? "No se encontraron ciudades disponibles" : "Cargando opciones de ubicación..."}
                  </div>
                )}
              </div>

              {selectedCity && (
                <button
                  onClick={handleClear}
                  className="w-full py-4 rounded-2xl border border-divider text-system-error hover:bg-system-error/5 transition-colors font-medium mb-4"
                >
                  Limpiar selección actual
                </button>
              )}
            </>
          )}
          
          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 text-text-inactive hover:text-white transition-colors text-sm underline underline-offset-4"
          >
            Omitir por ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitySelectorModal;
