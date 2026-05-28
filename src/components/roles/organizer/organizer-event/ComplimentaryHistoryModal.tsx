"use client";

import React, { useEffect, useState } from "react";
import AddSvg from "@/components/svg/AddSvg";

// No es necesario importar la interfaz si no la exportamos o si es global, pero la definiremos aquí por si acaso, 
// o podemos usar `any` si la interfaz ya está globalmente en ticket.d.ts.
// En `ticket.d.ts` definimos estas interfaces.

interface Props {
  ticketHistory?: IComplimentaryHistory[];
}

export default function ComplimentaryHistoryModal({ ticketHistory = [] }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Evitar scroll del body cuando está abierto el modal
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
      setCurrentPage(1); // Reset page on open
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  const totalPages = Math.ceil(ticketHistory.length / itemsPerPage);
  const paginatedHistory = ticketHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full mb-2 bg-divider border border-inactive/20 hover:bg-white/5 transition-colors text-primary-white py-2.5 rounded-lg text-sm font-medium"
      >
        Ver historial
      </button>

      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 md:py-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#050505] flex flex-col rounded-2xl border border-inactive/70 w-full md:max-w-md max-h-[85vh] shadow-2xl animate-in zoom-in-95 duration-200"
          >
            {/* Header */}
            <div className="flex w-full relative justify-center items-center pt-4 px-6 pb-4 border-b border-divider">
              <h2 className="text-2xl w-[140px] text-center font-semibold text-primary-white">Historial de cortesías</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-primary text-primary-white absolute right-3 top-3 rounded-xl p-1 hover:opacity-80 transition-opacity"
              >
                <AddSvg className="rotate-45 w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-4 px-4 xs:px-6 space-y-3">
              {paginatedHistory.length > 0 ? (
                paginatedHistory.map((data, index) => (
                  <div key={index} className="flex flex-col xs:flex-row justify-start xs:justify-between items-start xs:items-center bg-[#1C1C1E] border border-inactive/20 p-2 xs:p-3 rounded-lg w-full overflow-hidden gap-y-1">
                    {/* Vista móvil: ticketName y quantity arriba en row */}
                    <div className="flex items-center gap-x-1 xs:hidden">
                      <span className="text-primary-white font-medium">{data.ticketName}</span>
                      <span className="text-primary font-medium">x{data.quantity}</span>
                    </div>

                    {/* Información del cliente (con truncate para textos largos) */}
                    <div className="flex flex-col min-w-0 w-full xs:w-auto flex-1">
                      <span className="text-primary-white font-medium truncate">{data.client.name}</span>
                      <span className="text-sm text-primary-white/70 truncate">{data.client.email}</span>
                    </div>

                    {/* Vista escritorio: ticketName y quantity a la derecha */}
                    <div className="hidden xs:flex flex-col items-end shrink-0 ml-2">
                      <span className="text-primary-white">{data.ticketName}</span>
                      <span className="text-primary">x{data.quantity}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-neutral-400 w-full">
                  Aún no se han entregado entradas de cortesía
                </div>
              )}
            </div>

            {/* Pagination Footer */}
            {totalPages > 1 && (
              <div className="border-t rounded-b-2xl border-divider px-6 py-4 bg-[#050505] sticky bottom-0 flex justify-between items-center">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-[#1C1C1E] border border-inactive/20 rounded-lg text-primary-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors text-sm"
                >
                  Anterior
                </button>
                <div className="text-sm flex gap-1 justify-center items-center flex-wrap text-primary-white/70">
                  <span>Página</span>
                  <span>{currentPage} de {totalPages}</span>
                </div>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-[#1C1C1E] border border-inactive/20 rounded-lg text-primary-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors text-sm"
                >
                  Siguiente
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
