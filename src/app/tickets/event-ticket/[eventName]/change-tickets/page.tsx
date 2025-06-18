"use client"

import TicketButtons from '@/components/ui/buttons/TicketButtons';
import Link from 'next/link';
import React, { useState } from 'react';
import { myTickets } from '@/template-data';
import GoBackButton from '@/components/ui/buttons/GoBackButton';

const ChangeTicketsView = ({isTicketList = false} : { isTicketList?: boolean }) => {
  const [tickets, setTickets] = useState<Ticket[]>(myTickets)

  const updateQuantity = (type: string, increment: boolean) => {
    setTickets(prev => prev.map(ticket => 
      ticket.type === type 
        ? { ...ticket, quantity: increment ? ticket.quantity + 1 : Math.max(0, ticket.quantity - 1) }
        : ticket
    ));
  };

  let total = 0;
  let totalTickets = 0;

  tickets.forEach(ticket => {
    total += ticket.price * ticket.quantity;
    totalTickets += ticket.quantity;
  });

  return (
    <div className="min-h-screen bg-primary-black flex sm:justify-center sm:items-center text-primary-white">
      <GoBackButton className="absolute z-30 top-10 left-5 px-3 py-3 animate-fade-in" />
      <div className="w-full sm:h-full px-6 sm:pt-32 pt-28 pb-20 flex flex-col items-center justify-between sm:justify-center max-w-2xl relative animate-fade-in overflow-y-scroll">
        <div className='w-full pb-5'>
          <h3 className={`${isTicketList && "hidden"} text-subtitle font-semibold mb-2`}>
            Entradas disponibles
          </h3>
          <TicketButtons tickets={tickets} updateQuantity={updateQuantity} />
          <h1 className="sm:hidden block text-start w-full text-primary mt-6">
            Crédito disponible $1000 COP
          </h1>
        </div>

        {/* Total */}
        <div className="w-full flex flex-col items-end mb-7 md:mb-0">
          <div className="w-full mb-3">
            <div className="flex justify-between items-center font-bold text-">
              <span>TOTAL</span>
              <span className='font-light tabular-nums'>{totalTickets > 0 ? `$${total.toLocaleString()} COP` : '0'}</span>
            </div>
          </div>

          {/* Buy Button */}
          <Link 
            tabIndex={totalTickets === 0 ? -1 : undefined}
            aria-disabled={totalTickets === 0} 
            href="/checkout"
            className={`w-full text-center py-3 rounded-lg transition-colors ${
              totalTickets > 0 
                ? 'bg-primary hover:bg-primary/70 text-black' 
                : 'bg-inactive text-text-inactive pointer-events-none'
            }`}
          >
            {totalTickets > 0 ? "Confirmar pedido" : "Selecciona tickets"}
          </Link>
          <h1 className="sm:block hidden text-start w-full text-primary mt-6">
            Crédito disponible $1000 COP
          </h1>
        </div>
      </div>
    </div>
  );
};

export default ChangeTicketsView;
