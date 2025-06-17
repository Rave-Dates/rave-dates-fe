import AddSvg from "@/components/svg/AddSvg";
import SubtractSvg from "@/components/svg/SubtractSvg";
import React from "react";

const TicketButtons = ({ tickets, updateQuantity }: { tickets: TicketType[], updateQuantity: (id: string, increment: boolean) => void }) => {
  return (
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
  );
};

export default TicketButtons;