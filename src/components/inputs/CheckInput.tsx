import React from "react";
import { FilterState } from "../containers/navbar/FilterModal";

const CheckInput = ({ items, type, handleFunc, filters, title }: { items: string[], type: "location" | "eventType", handleFunc: (item: string) => void, filters: FilterState, title: string }) => {
  return (
    <div>
      <h3 className="text-white text-sm font-medium mb-4">
        {title} <span className="text-gray-500 text-xs">(2)</span>
      </h3>
      <div className="px-4 rounded-xl bg-cards-container">
        {items.map((item) => (
          <label
            key={item}
            className="flex items-center py-3 not-last:border-b not-last:border-divider justify-between cursor-pointer group"
          >
            <span className="text-primary-white group-hover:text-lime-200 transition-colors">
              {item}
            </span>
            <div className="relative">
              <input
                type="radio"
                name="location"
                checked={filters[type] === item}
                onChange={() => handleFunc(item)}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 rounded-full border-1 flex items-center justify-center transition-colors ${
                  filters[type] === item
                    ? "border-inactive bg-primary-black"
                    : "border-inactive group-hover:border-primary/20"
                }`}
              >
                {filters[type] === item && (
                  <div className="w-3.5 h-3.5 bg-primary rounded-full"></div>
                )}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default CheckInput;
