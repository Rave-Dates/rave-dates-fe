import Image from 'next/image';
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

  const total = tickets.reduce((sum, ticket) => sum + (ticket.price * ticket.quantity), 0);
  const totalTickets = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);

  return (
    <div className="">
      <h3 className="text-lg font-semibold text-white mb-2">Entradas disponibles</h3>
      
      <div className="space-y-2 mb-6">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="flex bg-cards-container px-4 py-3 rounded-lg items-center justify-between">
            <div>
              <div className="font-semibold text-body">{ticket.name}</div>
              <div className="text-subtitle text-primary-white/50">${ticket.price.toLocaleString()} COP</div>
            </div>
            
            <div className="flex items-center font-light text-subtitle">
              <button
                onClick={() => updateQuantity(ticket.id, false)}
                className="p-3 bg-inactive hover:bg-inactive/70 rounded-l-xl flex items-center justify-center text-white transition-colors"
                disabled={ticket.quantity === 0}
              >
                <Image src="/icons/subtract.svg" width={24} height={24} alt="subtract icon" />
              </button>
              
              <span className="px-4 h-12 tabular-nums w-[76px] py-2 bg-text-inactive/70 text-center">{ticket.quantity}</span>
              
              <button
                onClick={() => updateQuantity(ticket.id, true)}
                className="p-3 bg-primary hover:bg-primary/70 rounded-r-xl flex items-center justify-center text-black transition-colors"
              >
                <Image src="/icons/add.svg" width={24} height={24} alt="subtract icon" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="w-full flex flex-col items-end">
        <div className="w-1/2 mb-3">
          <div className="flex justify-between items-center text-white font-bold text-">
            <span>TOTAL</span>
            <span className='font-light tabular-nums'>{totalTickets > 0 ? `$${total.toLocaleString()} COP` : '0'}</span>
          </div>
        </div>

        {/* Buy Button */}
        <button 
          className={`w-1/2 py-3 rounded-lg transition-colors ${
            totalTickets > 0 
              ? 'bg-primary hover:bg-primary/70 text-black' 
              : 'bg-inactive text-text-inactive cursor-not-allowed'
          }`}
          disabled={totalTickets === 0}
        >
          {totalTickets > 0 ? "Comprar tickets" : "Selecciona tickets"}
        </button>
      </div>
    </div>
  );
};

export default TicketSelector;