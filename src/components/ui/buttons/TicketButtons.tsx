import AddSvg from "@/components/svg/AddSvg";
import SubtractSvg from "@/components/svg/SubtractSvg";
import React from "react";

const TicketButtons = ({ ticket }: { ticket: any }) => {
  console.log("ticket",ticket)
  const validStage = ticket.stages.find((stage) => {
    const stageDate = new Date(stage.dateMax).getTime();
    const now = new Date().getTime();
    return stageDate > now && stage.quantity > 0;
  });
  console.log("valid stage",validStage)
  return (
    <div className="space-y-2 mb-6">
      <div
        className="flex flex-wrap gap-x-5 gap-y-4 bg-cards-container px-3.5 py-3 rounded-lg items-center justify-center xs:justify-between"
      >
        <div className="w-[100px] sm:w-[170px]">
          <div className="font-semibold text-center xs:text-start text-body">{ticket.name}</div>
          <div className="text-body lg:text-subtitle text-primary-white/50">
            {validStage ? `$${validStage.price.toLocaleString()} COP` : "No disponible"}
          </div>
        </div>

        <div className="flex items-center font-light text-subtitle">
          <button disabled className="p-3 bg-inactive text-text-inactive rounded-l-xl">
            <SubtractSvg />
          </button>

          <span className="px-4 h-12 tabular-nums w-[76px] content-center bg-text-inactive/70 text-center">
            {validStage ? validStage.quantity : 0}
          </span>

          <button
            disabled={!validStage}
            className={`p-3 rounded-r-xl flex items-center justify-center text-black transition-colors ${
              validStage ? "bg-primary hover:bg-primary/70" : "bg-inactive text-text-inactive"
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