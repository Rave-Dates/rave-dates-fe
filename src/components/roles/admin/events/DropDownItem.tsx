"use client";

import ArrowDownSvg from "@/components/svg/ArrowDown";
import type React from "react";

interface DropdownItemProps {
  title: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export function DropdownItem({
  title,
  isExpanded = false,
  onToggle,
  children,
  className,
}: DropdownItemProps) {
  return (
    <>
      <button
        onClick={onToggle}
        className={`${
          isExpanded ? "rounded-t-lg" : "rounded-lg"
        } ${className} w-full mt-3 flex items-center justify-between py-3 px-4 text-left bg-main-container transition-colors`}
      >
        <div className="flex items-center gap-2">
          <span className="text-primary-white">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {onToggle &&
            (isExpanded ? (
              <ArrowDownSvg className="rotate-180 transition-transform duration-300" />
            ) : (
              <ArrowDownSvg className="transition-transform duration-300" />
            ))}
        </div>
      </button>

      <div
        className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px]" : "max-h-0"
        }`}
      >
        {children}
      </div>
    </>
  );
}
