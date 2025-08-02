import React from "react";
import { UseFormRegister } from "react-hook-form";

type FilterFormValues = {
  [key: string]: string;
};

type Props = {
  name: string;
  title: string;
  items: { label: string; value: string }[];
  register: UseFormRegister<FilterFormValues>;
  selected: string;
};

const CheckFilterInput = ({ name, title, items, register, selected }: Props) => {
  return (
    <div>
      <h3 className="text-white text-sm font-medium mb-4">
        {title}
      </h3>
      <div className="px-4 rounded-xl bg-cards-container">
        {items.map((item) => (
          <label
            key={item.value}
            className="flex items-center py-3 not-last:border-b not-last:border-divider justify-between cursor-pointer group"
          >
            <span className="text-primary-white group-hover:text-lime-200 transition-colors">
              {item.label}
            </span>
            <div className="relative">
              <input
                type="radio"
                value={item.value}
                {...register(name)}
                className="sr-only"
              />
              <div
                className={`w-6 h-6 rounded-full border-1 flex items-center justify-center transition-colors ${
                  selected === item.value
                    ? "border-inactive bg-primary-black"
                    : "border-inactive group-hover:border-primary/20"
                }`}
              >
                {selected === item.value && (
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

export default CheckFilterInput;
