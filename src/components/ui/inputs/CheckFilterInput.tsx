import React from "react";

type Props = {
  name: string;
  title: string;
  items: { label: string; value: string }[];
  selected: string[];
  onToggle: (value: string) => void;
};

const CheckFilterInput = ({ name, title, items, selected, onToggle }: Props) => {
  return (
    <div>
      <h3 className="text-white text-sm font-medium mb-4">
        {title}
      </h3>
      <div className="px-4 rounded-xl bg-cards-container">
        {items.map((item) => {
          const isChecked = selected.includes(item.value);
          return (
            <label
              key={item.value}
              className="flex items-center py-3 not-last:border-b not-last:border-divider justify-between cursor-pointer group"
            >
              <span className="text-primary-white group-hover:text-primary transition-colors">
                {item.label}
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => onToggle(item.value)}
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 rounded-md border-1 flex items-center justify-center transition-colors ${
                    isChecked
                      ? "border-primary bg-primary"
                      : "border-inactive group-hover:border-primary/20"
                  }`}
                >
                  {isChecked && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default CheckFilterInput;
