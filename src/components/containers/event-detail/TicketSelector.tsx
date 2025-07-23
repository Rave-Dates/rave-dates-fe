import TicketButtons from '@/components/ui/buttons/TicketButtons';
import Link from 'next/link';
import React from 'react';
import TicketsChanger from '../tickets/TicketsChanger';
import TicketsSkeleton from '@/utils/skeletons/event-skeletons/TicketsSkeleton';
import { useTicketStore } from '@/store/useTicketStore';
import { useReactiveCookiesNext } from 'cookies-next';

const TicketSelector = ({isTicketList = false, ticketStatus, tickets, isLoading} : { isTicketList?: boolean, ticketStatus?: "paid" | "pending", tickets?: IEventTicket[], isLoading: boolean }) => {
  const { selected } = useTicketStore();
  const { getCookie } = useReactiveCookiesNext();
  const tempToken = getCookie("tempToken");
  const clientToken = getCookie("clientToken");

  const totalQuantity = Object.values(selected).reduce((acc, curr) => acc + curr.quantity, 0);
  const totalPrice = Object.values(selected).reduce(
    (acc, curr) => acc + curr.quantity * curr.stage.price,
    0
  );

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
          { isLoading ?
            <TicketsSkeleton />
            :
            <>
              {
                tickets?.map((ticket) => (
                  <TicketButtons key={ticket.ticketTypeId} ticket={ticket} />
                ))
              }
            </>
          }

          {/* Total */}
         <div className="w-full flex flex-col items-end mb-7 md:mb-0">
        <div className="w-full sm:w-1/2 mb-3">
          <div className="flex justify-between items-center text-white font-bold">
            <span>TOTAL</span>
            <span className='font-light tabular-nums'>
              {totalQuantity > 0 ? `$${totalPrice.toLocaleString()} COP` : '0'}
            </span>
          </div>
        </div>

        <Link
          tabIndex={totalQuantity === 0 ? -1 : undefined}
          aria-disabled={totalQuantity === 0}
          href={(tempToken || clientToken) ? "/checkout" : "/personal-data"}
          className={`w-full md:w-1/2 text-center py-3 rounded-lg transition-colors ${
            totalQuantity > 0
              ? 'bg-primary hover:bg-primary/70 text-black'
              : 'bg-inactive text-text-inactive pointer-events-none'
          }`}
        >
          {totalQuantity > 0 ? "Comprar tickets" : "Selecciona tickets"}
        </Link>
      </div>
        </>
      }
    </div>
  );
};

export default TicketSelector;