import TicketButtons from '@/components/ui/buttons/TicketButtons';
import Link from 'next/link';
import React from 'react';
import TicketsChanger from '../tickets/TicketsChanger';

const TicketSelector = ({isTicketList = false, ticketStatus, tickets} : { isTicketList?: boolean, ticketStatus?: "paid" | "pending", tickets?: any }) => {
  console.log(tickets)

  return (
    <div>
      <h3 className={`${isTicketList && "hidden"} text-lg font-semibold text-white mb-2`}>
        Entradas disponibles
      </h3>
      {
        isTicketList ? 
        <TicketsChanger ticketStatus={ticketStatus} />
        :
        <>
          {
            tickets?.map((ticket) => (
              <TicketButtons key={ticket.ticketTypeId} ticket={ticket} />
            ))
          }

          {/* Total */}
          <div className="w-full flex flex-col items-end mb-7 md:mb-0">
            {/* <div className="w-full sm:w-1/2 mb-3">
              <div className="flex justify-between items-center text-white font-bold text-">
                <span>TOTAL</span>
                <span className='font-light tabular-nums'>{totalTickets > 0 ? `$${total.toLocaleString()} COP` : '0'}</span>
              </div>
            </div> */}

            {/* Buy Button */}
            {/* <Link 
              tabIndex={totalTickets === 0 ? -1 : undefined}
              aria-disabled={totalTickets === 0} 
              href="/personal-data"
              className={`w-full md:w-1/2 text-center py-3 rounded-lg transition-colors ${
                totalTickets > 0 
                  ? 'bg-primary hover:bg-primary/70 text-black' 
                  : 'bg-inactive text-text-inactive pointer-events-none'
              }`}
            >
              {totalTickets > 0 ? "Comprar tickets" : "Selecciona tickets"}
            </Link> */}
          </div>
        </>
      }
    </div>
  );
};

export default TicketSelector;