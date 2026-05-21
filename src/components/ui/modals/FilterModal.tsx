import React, { useEffect, useState } from 'react';
import FilterSvg from '@/components/svg/FilterSvg';
import AddSvg from '@/components/svg/AddSvg';
import { useClientAllCategories } from '@/hooks/client/queries/useClientData';
import CheckFilterInput from '@/components/ui/inputs/CheckFilterInput';
import { useEventStore } from '@/store/useEventStore';
import { useCityStore } from '@/store/useCityStore';

type Filters = { [key: string]: string[] };

function FilterModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clientCategories } = useClientAllCategories();
  const { filters, setFilters } = useEventStore();
  const { selectedCity } = useCityStore();

  // Local copy of filters for editing within the modal
  const [localFilters, setLocalFilters] = useState<Filters>({});

  // Evitar scroll del body cuando está abierto el modal
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      // Sync local state with store when opening
      setLocalFilters({ ...filters });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModalOpen]);

  const handleToggle = (categoryKey: string, value: string) => {
    setLocalFilters((prev) => {
      const current = prev[categoryKey] ?? [];
      const exists = current.includes(value);
      const updated = exists
        ? current.filter((v) => v !== value)
        : [...current, value];
      
      // Remove key entirely if empty
      if (updated.length === 0) {
        const { [categoryKey]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [categoryKey]: updated };
    });
  };

  const applyFilters = () => {
    // Si tenemos una ciudad seleccionada, nos aseguramos de no perderla
    const finalFilters = { ...localFilters };
    if (selectedCity) {
      const cityKey = Object.entries(filters).find(
        ([, v]) => Array.isArray(v) && v.includes(selectedCity)
      );
      if (cityKey) {
        finalFilters[cityKey[0]] = [selectedCity];
      }
    }
    setFilters(finalFilters);
    setIsModalOpen(false);
  };

  const clearFilters = () => {
    // Preservar solo el filtro de ciudad
    let newFilters: Filters = {};
    if (selectedCity) {
      const cityKey = Object.entries(filters).find(
        ([, v]) => Array.isArray(v) && v.includes(selectedCity)
      );
      if (cityKey) {
        newFilters = { [cityKey[0]]: [selectedCity] };
      }
    }
    setLocalFilters(newFilters);
    setFilters(newFilters);
  };

  // Count total selected filters (excluding city)
  const activeFilterCount = Object.entries(localFilters).reduce((count, [key, values]) => {
    // Skip city filter in count
    if (selectedCity && values.includes(selectedCity) && values.length === 1) return count;
    return count + values.length;
  }, 0);

  const filteredCategories = clientCategories
    ?.filter((category) =>
      !category.name.toLowerCase().includes("ubicacion") &&
      !category.name.toLowerCase().includes("ubicación") &&
      !category.name.toLowerCase().includes("ciudad")
    );

  return (
    <>
      <button 
        className="relative bg-primary text-primary-white hover:bg-primary/70 transition-colors px-3.5 py-3.5 content-center mx-2 rounded-2xl"
        onClick={() => setIsModalOpen(true)}
      >
        <FilterSvg />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="animate-fade-in fixed inset-0 bg-black/60 flex items-center justify-center md:py-8 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#050505] flex flex-col rounded-2xl w-full md:max-w-md max-h-[85vh] shadow-2xl"
          >
            {/* Header */}
            <div className="flex w-full flex-row-reverse md:flex-row justify-end gap-5 items-center md:justify-between pt-8 px-6">
              <h2 className="text-title">Filtros</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-primary text-primary-white rounded-xl p-1.5"
              >
                <AddSvg className="rotate-45 w-7 h-7" />
              </button>
            </div>

            {/* Contenido con scroll */}
            <div className="flex-1 overflow-y-auto py-6 px-6 space-y-8 font-light">
              {filteredCategories?.map((category) => {
                const categoryKey = `category-${category.categoryId}`;
                return (
                  <CheckFilterInput
                    key={category.categoryId}
                    name={categoryKey}
                    title={category.name}
                    items={category.values.map((v) => ({
                      label: v.value,
                      value: v.value,
                    }))}
                    selected={localFilters[categoryKey] ?? []}
                    onToggle={(value) => handleToggle(categoryKey, value)}
                  />
                );
              })}
            </div>

            {/* Footer fijo abajo */}
            <div className="border-t rounded-b-2xl border-divider pt-2 px-6 py-4 bg-[#050505] sticky bottom-0">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full py-3 text-primary-white font-medium hover:opacity-85 transition-opacity mb-2"
              >
                Eliminar filtros
              </button>
              <button
                type="button"
                className="w-full bg-primary text-primary-white py-3 rounded-lg font-medium hover:opacity-85 transition-opacity"
                onClick={applyFilters}
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
