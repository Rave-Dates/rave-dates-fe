import AddSvg from "@/components/svg/AddSvg";
import SubtractSvg from "@/components/svg/SubtractSvg";
import React from "react";

const TicketsSkeleton = () => {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex flex-wrap gap-x-5 gap-y-4 bg-cards-container px-3.5 py-3 rounded-lg items-center justify-center xs:justify-between">
          <div className="w-[100px] sm:w-[170px]">
            <div className="bg-inactive animate-pulse h-5 mb-1 w-14 rounded"></div>
            <div className="bg-inactive animate-pulse h-9 w-32 rounded"></div>
          </div>

          <div className="flex items-center font-light text-subtitle">
            <button
              disabled
              className="p-3 bg-inactive text-text-inactive rounded-l-xl"
            >
              <SubtractSvg />
            </button>
            <div className="px-4 h-12 flex items-center justify-center tabular-nums w-[76px] bg-text-inactive/70">
              <div className="h-8 w-8 rounded bg-inactive animate-pulse"></div>
            </div>
            <button className="p-3 rounded-r-xl flex items-center justify-center text-black bg-primary">
              <AddSvg />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketsSkeleton;
