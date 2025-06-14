import AddSvg from '@/components/svg/AddSvg';
import SubtractSvg from '@/components/svg/SubtractSvg';
import Link from 'next/link';
import React, { useState } from 'react';

interface TicketType {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const TicketSelector: React.FC = () => {
  const [tickets, setTickets] = useState<TicketType[]>([
    { id: 'general', name: 'GENERAL', price: 50000, quantity: 0 },
    { id: 'vip', name: 'VIP', price: 105000, quantity: 0 },
    { id: 'backstage', name: 'BACKSTAGE', price: 330000, quantity: 0 }
  ]);

  const updateQuantity = (id: string, increment: boolean) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === id 
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
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">Entradas disponibles</h3>
      <div className="space-y-2 mb-6">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="flex flex-wrap gap-x-5 gap-y-4 bg-cards-container px-3.5 py-3 rounded-lg items-center justify-between">
            <div className='w-[100px] sm:w-[170px]'>
              <div className="font-semibold text-body">{ticket.name}</div>
              <div className="text-body lg:text-subtitle text-primary-white/50">${ticket.price.toLocaleString()} COP</div>
            </div>
            
            <div className="flex items-center font-light text-subtitle">
              <button
                onClick={() => updateQuantity(ticket.id, false)}
                className={`${ticket.quantity > 0 && "bg-primary-white"} p-3 bg-inactive text-text-inactive hover:opacity-85 rounded-l-xl flex items-center justify-center transition-opacity`}
                disabled={ticket.quantity === 0}
              >
                <SubtractSvg />
              </button>
              
              <span className="px-4 h-12 tabular-nums w-[76px] content-center bg-text-inactive/70 text-center">{ticket.quantity}</span>
              
              <button
                onClick={() => updateQuantity(ticket.id, true)}
                className="p-3 bg-primary hover:bg-primary/70 rounded-r-xl flex items-center justify-center text-black transition-colors"
              >
                <AddSvg />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="w-full flex flex-col items-end mb-7 md:mb-0">
        <div className="w-full sm:w-1/2 mb-3">
          <div className="flex justify-between items-center text-white font-bold text-">
            <span>TOTAL</span>
            <span className='font-light tabular-nums'>{totalTickets > 0 ? `$${total.toLocaleString()} COP` : '0'}</span>
          </div>
        </div>

        {/* Buy Button */}
        <Link 
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
        </Link>
      </div>
    </div>
  );
};

export default TicketSelector;