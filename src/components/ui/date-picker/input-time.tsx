"use client"

import React, { type ChangeEventHandler } from "react";

interface InputTimeProps {
  value?: string;
  onChange?: (value: string) => void;
  title?: string;
}

export function InputTime({ value = "00:00", onChange, title = "Hora (COL)*" }: InputTimeProps) {
  const handleTimeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const time = e.target.value;
    onChange?.(time);
  };

  return (
    <div className="w-full flex flex-col gap-y-2">
      <label className="text-primary-white text-body font-medium">
        {title}
      </label>
      <input 
        className="w-full cursor-pointer bg-main-container hover:bg-input transition-all py-4 px-4 rounded-lg text-primary-white border-none outline-none focus:ring-1 focus:ring-primary h-[56px] scheme-dark" 
        type="time" 
        value={value} 
        onChange={handleTimeChange} 
        onClick={(e) => e.currentTarget.showPicker()}
      />
    </div>
  );
}