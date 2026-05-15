import Link from "next/link";

const SearchGuestItem = ({ guest, onClick, isLink = true }: { guest: IGuest; onClick: () => void, isLink?: boolean }) => {
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
        </div>
      }
    </li>
  );
};

export default SearchGuestItem;
