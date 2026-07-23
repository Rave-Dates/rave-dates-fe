"use client";

import { useEffect } from "react";

interface GuestDetailModalProps {
  guest: IGuest | null;
  onClose: () => void;
}

const statusConfig = {
  PENDING: { label: "Pendiente", className: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  READ: { label: "Leído", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  DEFEATED: { label: "Vencido", className: "bg-red-500/20 text-red-400 border-red-500/30" },
};

export default function GuestDetailModal({ guest, onClose }: GuestDetailModalProps) {
  useEffect(() => {
    if (guest) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [guest]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!guest) return null;

  // Agrupar tickets por tipo para el resumen
  const ticketSummary = guest.purchaseTickets.reduce((acc, ticket) => {
    const name = ticket?.ticketType?.name;
    if (!name) return acc;
    if (!acc[name]) acc[name] = { total: 0, read: 0, pending: 0, defeated: 0 };
    acc[name].total++;
    if (ticket?.status === "READ") acc[name].read++;
    else if (ticket?.status === "PENDING") acc[name].pending++;
    else if (ticket?.status === "DEFEATED") acc[name].defeated++;
    return acc;
  }, {} as Record<string, { total: number; read: number; pending: number; defeated: number }>);

  return (
    <div
      onClick={onClose}
      className="fixed content-center justify-items-center inset-0 z-[100] px-5 sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-cards-container w-full sm:max-w-md max-h-[90dvh] flex flex-col overflow-hidden sm:rounded-2xl rounded-t-2xl border border-divider shadow-2xl"
        style={{ animation: "slideUp 0.25s ease-out" }}
      >
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-4 pb-3 border-b border-divider">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-white text-base">
                {guest.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-primary-white font-semibold text-base leading-tight">{guest.name}</h2>
              <p className="text-xs text-primary-white/50 mt-0.5">{guest.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-primary-white/40 hover:text-primary-white transition-colors p-1 rounded-lg hover:bg-white/5 mt-0.5"
            aria-label="Cerrar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">

          {/* Datos personales */}
          <section>
            <h3 className="text-[11px] font-semibold uppercase tracking-widest text-primary-white/40 mb-3">
              Información personal
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <InfoField label="WhatsApp" value={guest.whatsapp || "—"} icon="📱" />
              <InfoField label="Documento" value={guest.idCard || "—"} icon="🪪" />
              <InfoField
                label="Email verificado"
                value={guest.isEmailVerified ? "Sí" : "No"}
                icon="✉️"
                valueClass={guest.isEmailVerified ? "text-green-400" : "text-orange-400"}
              />
              <InfoField
                label="WhatsApp verificado"
                value={guest.isWhatsappVerified ? "Sí" : "No"}
                icon="💬"
                valueClass={guest.isWhatsappVerified ? "text-green-400" : "text-orange-400"}
              />
            </div>
          </section>

          {/* Resumen de tickets */}
          {Object.keys(ticketSummary).length > 0 && (
            <section>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-primary-white/40 mb-3">
                Resumen de entradas
              </h3>
              <div className="space-y-2">
                {Object.entries(ticketSummary).map(([name, counts]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between bg-black/20 rounded-xl px-4 py-3 border border-white/5"
                  >
                    <div>
                      <p className="text-sm font-medium text-primary-white">{name}</p>
                      <p className="text-[11px] text-primary-white/40 mt-0.5">
                        {counts.total} entrada{counts.total !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap justify-end">
                      {counts.read > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                          {counts.read} leída{counts.read !== 1 ? "s" : ""}
                        </span>
                      )}
                      {counts.pending > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          {counts.pending} pendiente{counts.pending !== 1 ? "s" : ""}
                        </span>
                      )}
                      {counts.defeated > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                          {counts.defeated} vencida{counts.defeated !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Detalle ticket a ticket */}
          {guest.purchaseTickets.length > 0 && (
            <section>
              <h3 className="text-[11px] font-semibold uppercase tracking-widest text-primary-white/40 mb-3">
                Detalle de entradas ({guest.purchaseTickets.length})
              </h3>
              <div className="space-y-2">
                {guest.purchaseTickets.map((ticket, idx) => {
                  if (!ticket) return null;
                  const status = ticket.status ? (statusConfig[ticket.status] ?? statusConfig.PENDING) : statusConfig.PENDING;
                  return (
                    <div
                      key={ticket.purchaseTicketId ?? idx}
                      className="bg-black/20 rounded-xl px-4 py-3 border border-white/5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-primary-white truncate">
                            {ticket.ticketType?.name ?? "Entrada"}
                          </p>
                          <p className="text-[11px] text-primary-white/40 mt-0.5">
                            #{ticket.purchaseTicketId}
                            {ticket.isTransferred && (
                              <span className="ml-2 text-blue-400">· Transferida</span>
                            )}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${status.className}`}>
                          {status.label}
                        </span>
                      </div>

                      {/* Método de pago si existe */}
                      {ticket.purchase?.paymentMethod && (
                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] text-primary-white/40">Método de pago:</span>
                          <span className="text-[11px] text-primary-white/70 font-medium">
                            {ticket.purchase.paymentMethod}
                          </span>
                          {ticket.purchase.paymentStatus && (
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${ticket.purchase.paymentStatus === "PAID" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                              {ticket.purchase.paymentStatus === "PAID" ? "Pagado" : ticket.purchase.paymentStatus}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {guest.purchaseTickets.length === 0 && (
            <div className="text-center py-6 text-primary-white/30 text-sm">
              Sin entradas registradas
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-divider px-5 py-4">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-primary/70 hover:bg-primary/20 text-primary font-semibold transition-colors text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @media (min-width: 640px) {
          @keyframes slideUp {
            from { transform: scale(0.95) translateY(0); opacity: 0; }
            to   { transform: scale(1)    translateY(0); opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
}

function InfoField({
  label,
  value,
  icon,
  valueClass = "text-primary-white/80",
}: {
  label: string;
  value: string;
  icon?: string;
  valueClass?: string;
}) {
  return (
    <div className="bg-black/20 rounded-xl px-3 py-2.5 border border-white/5">
      <p className="text-[10px] text-primary-white/40 mb-0.5">{icon} {label}</p>
      <p className={`text-sm font-medium truncate ${valueClass}`}>{value}</p>
    </div>
  );
}
