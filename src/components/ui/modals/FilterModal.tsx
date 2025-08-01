import React, { useEffect, useState } from 'react';
import FilterSvg from '@/components/svg/FilterSvg';
import AddSvg from '@/components/svg/AddSvg';
import { useForm } from 'react-hook-form';
import { useClientAllCategories } from '@/hooks/client/queries/useClientData';
import CheckFilterInput from '@/components/ui/inputs/CheckFilterInput';
import { useEventStore } from '@/store/useEventStore';

function FilterModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { clientCategories } = useClientAllCategories();
  const { setFilters } = useEventStore();
  const { register, handleSubmit, reset, watch } = useForm();

  // Evitar scroll del body cuando está abierto el modal
  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  const applyFilters = handleSubmit((data) => {
    setFilters(data); // guarda los valores seleccionados por categoría
    setIsModalOpen(false);
  });

  const clearFilters = () => {
    reset(); // limpia los campos
    setFilters({});
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
                className="bg-primary text-primary-black rounded-xl p-1.5"
              >
                <AddSvg className="rotate-45 w-7 h-7" />
              </button>
            </div>

            {/* Contenido con scroll */}
            <form
              onSubmit={applyFilters}
              className="flex-1 overflow-y-auto py-6 px-6 space-y-8 font-light"
            >
              {clientCategories?.map((category) => (
                <CheckFilterInput
                  key={category.categoryId}
                  name={`category-${category.categoryId}`}
                  title={category.name}
                  items={category.values.map((v) => ({
                    label: v.value,
                    value: v.value,
                  }))}
                  register={register}
                  selected={watch(`category-${category.categoryId}`)}
                />
              ))}
            </form>

            {/* Footer fijo abajo */}
            <div className="border-t rounded-b-2xl border-divider px-6 py-4 bg-[#050505] sticky bottom-0">
              <button
                type="button"
                onClick={clearFilters}
                className="w-full py-3 text-primary-white font-medium hover:opacity-85 transition-opacity mb-2"
              >
                Eliminar filtros
              </button>
              <button
                type="submit"
                form="filter-form"
                className="w-full bg-primary text-black py-3 rounded-lg font-medium hover:opacity-85 transition-opacity"
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
