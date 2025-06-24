import React from "react";
import { FilterState } from "../modals/FilterModal";

const FilterTagButton = ({
  items,
  type,
  handleFunc,
  filters,
  title,
}: {
  items: string[];
  type: "organizers" | "genres";
  handleFunc: (item: string) => void;
  filters: FilterState;
  title: string;
}) => {
  return (
    <div>
      <h3 className="text-white text-sm font-medium mb-2">
        {title}{" "}
        <span className="text-gray-500">({filters[type].length})</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => handleFunc(item)}
            className={`px-2.5 py-1.5 rounded-xl border text-sm font-normal transition-all duration-200 ${
              filters[type].includes(item)
                ? "bg-primary text-primary-black hover:opacity-80"
                : "bg-transparent text-text-inactive border-inactive hover:bg-inactive hover:text-primary-white/60"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterTagButton;
