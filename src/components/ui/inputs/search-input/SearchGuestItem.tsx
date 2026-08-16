import Link from "next/link";

const SearchGuestItem = ({ guest, onClick, isLink = true, onGuestSelect }: { guest: IGuest; onClick: () => void, isLink?: boolean, onGuestSelect?: (guest: IGuest) => void }) => {
  return (
    <li className="hover:bg-cards-container transition-colors">
      {
        isLink ?
        <Link
          href={`/event/${guest.clientId}`}
          onClick={onClick}
          className="flex flex-col gap-3 items-start px-4 py-2 text-white text-sm"
        >
          <div>
            <h2>{guest.name}</h2>
            <h3 className="text-sm text-text-inactive">{guest.email}</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {guest.purchaseTickets.map((ticket: any) => (
                <div key={ticket.purchaseTicketId} className="flex items-center gap-2 bg-primary-black/30 px-2 py-1 rounded-md border border-white/5">
                  <span className="text-[11px] font-medium text-primary-white/80">{ticket.ticketType?.name}</span>
                  <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${ticket.status === 'READ' ? 'bg-system-success/20 text-system-success' : 'bg-orange-500/20 text-orange-400'}`}>
                    {ticket.status === 'READ' ? 'Leído' : 'Pendiente'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Link>
        :
        <div
          className="flex items-center justify-between px-4 py-2 text-white text-sm"
        >
          <div className="flex flex-col gap-3 items-start">
            <div>
              <h2>{guest.name}</h2>
              <h3 className="text-sm text-text-inactive">{guest.email}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {guest.purchaseTickets.map((ticket: any) => (
                  <div key={ticket.purchaseTicketId} className="flex items-center gap-2 bg-primary-black/30 px-2 py-1 rounded-md border border-white/5">
                    <span className="text-[11px] font-medium text-primary-white/80">{ticket.ticketType?.name}</span>
                    <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${ticket.status === 'READ' ? 'bg-system-success/20 text-system-success' : 'bg-orange-500/20 text-orange-400'}`}>
                      {ticket.status === 'READ' ? 'Leído' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {onGuestSelect && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onGuestSelect(guest);
                onClick();
              }}
              className="ml-3 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-primary hover:bg-primary/70 text-primary-white transition-colors"
              aria-label="Ver detalles"
            >
              <svg className="rotate-180" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </button>
          )}
        </div>
      }
    </li>
  );
};

export default SearchGuestItem;
