import React, { useEffect } from "react";
import AddSvg from "@/components/svg/AddSvg";
import SubtractSvg from "@/components/svg/SubtractSvg";
import { useTicketStore } from "@/store/useTicketStore";
import { useParams } from "next/navigation";

type Props = {
  ticket: IEventTicket;
  maxPurchase?: number;
  totalQuantity: number;
};

const TicketButtons = ({ ticket, maxPurchase, totalQuantity }: Props) => {
  const { add, subtract, selected, setEventId } = useTicketStore();
  const params = useParams();
  const eventId = Number(params.eventId);
  
  let controlledMaxPurchase = maxPurchase ?? 1;
  const currentQuantity = selected[ticket.ticketTypeId || 0]?.quantity ?? 0;

  useEffect(() => {
    if (eventId) {
      setEventId(eventId);
    }
  }, [eventId]);

  const validStage = ticket.stages.find((stage) => {
    const now = Date.now();
    return new Date(stage.dateMax).getTime() > now && stage.quantity > 0;
  });

  if (validStage?.price === 0) {
    controlledMaxPurchase = 1;
  }

  if (typeof ticket.ticketTypeId !== "number") return null;

  return (
    <div className="space-y-2 mb-3">
      <div className="flex flex-wrap gap-x-5 gap-y-4 bg-cards-container px-3.5 py-3 rounded-lg items-center justify-center xs:justify-between">
        <div className="w-[100px] sm:w-[120px] lg:w-[250px]">
          <div className="font-semibold text-center xs:text-start text-body">{ticket.name}</div>
          <div className="text-body lg:text-subtitle text-primary-white/50">
            {validStage ? 
              validStage.price > 0 
                ?
                `$${validStage.price.toLocaleString()} COP` 
                :
                "Gratuito"
              : 
              "No disponible"
            }
          </div>
        </div>

        <div className="flex items-center font-light text-subtitle">
          <button
            onClick={() => subtract(ticket.ticketTypeId)}
            disabled={currentQuantity === 0}
            className={`p-3 rounded-l-xl transition-opacity ${
              currentQuantity > 0 ? "bg-primary-white text-black hover:opacity-75" : "bg-inactive text-text-inactive pointer-events-none"
            }`}
          >
            <SubtractSvg />
          </button>

          <span className="px-4 h-12 tabular-nums w-[63] sm:w-[76px] content-center bg-text-inactive/70 text-center">
            {currentQuantity}
          </span>

          <button
            onClick={() => validStage && add({ ticketTypeId: ticket.ticketTypeId, price: validStage.price, quantity: validStage.quantity })}
            disabled={
              !validStage ||
              currentQuantity >= validStage.quantity ||
              totalQuantity >= controlledMaxPurchase
            }            
            className={`p-3 rounded-r-xl flex items-center justify-center text-black transition-colors ${
              validStage &&
              currentQuantity < validStage.quantity &&
              totalQuantity < controlledMaxPurchase
                ? "bg-primary hover:bg-primary/70"
                : "bg-inactive text-text-inactive pointer-events-none"
            }`}
          >
            <AddSvg />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketButtons;
