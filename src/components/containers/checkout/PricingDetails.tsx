import { getEventClientTickets } from "@/services/clients-events";
import { useTicketStore } from "@/store/useTicketStore";
import { useQuery } from "@tanstack/react-query";

export default function PricingDetails() {
  const { selected, eventId } = useTicketStore();

  const { data: selectedTickets } = useQuery<IEventTicket[]>({
    queryKey: [`selectedTickets`, eventId],
    queryFn: () => getEventClientTickets(eventId),
    enabled: !!eventId,
  });

  const mergedTickets = Object.entries(selected).map(([ticketTypeIdStr, selectedData]) => {
    const ticketTypeId = Number(ticketTypeIdStr);

    const eventTicket = selectedTickets?.find(t => t.ticketTypeId === ticketTypeId);

    return {
      name: eventTicket?.name || 'Ticket',
      quantity: selectedData.quantity,
      price: selectedData.stage.price,
      total: selectedData.quantity * selectedData.stage.price,
    };
  });

  const totalAmount = mergedTickets.reduce((acc, t) => acc + t.total, 0);

  return (
    <div className="bg-cards-container rounded-lg p-4 space-y-3">
      {mergedTickets.map((ticket, index) => (
        <div key={index} className="flex justify-between border-dashed border-inactive border-b-2 pb-3">
          <span className="text-primary-white/50">{ticket.name} x {ticket.quantity}</span>
          <span className="text-end">${ticket.total.toLocaleString()} COP</span>
        </div>
      ))}

      <div className="flex justify-between">
        <span className="text-primary-white/50">Servicio</span>
        <span className="text-end">$0 COP</span> {/* Podés calcular comisiones si querés */}
      </div>
      <div className="flex justify-between">
        <span className="text-primary-white/50">Ya pagado</span>
        <span className="text-end">-$0 COP</span> {/* Cambiar si aplica */}
      </div>
      <div className="flex justify-between text-lg">
        <span className="text-primary-white/50">TOTAL</span>
        <span className="text-end">${totalAmount.toLocaleString()} COP</span>
      </div>

      <div className="flex">
        <input
          type="text"
          placeholder="Ingresa el cupón de descuento"
          className="w-full text-sm bg-inactive outline-none rounded-l-lg px-3"
        />
        <div className="bg-inactive p-2 rounded-r-lg">
          <button className="bg-[#c1ff00] text-black rounded px-4 py-2 text-sm">Aceptar</button>
        </div>
      </div>
    </div>
  );
}
