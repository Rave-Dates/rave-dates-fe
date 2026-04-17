import React, { useEffect, useState, useRef } from "react";
import { Control, Controller, FieldValues, Path, UseControllerProps } from "react-hook-form";
import ArrowDownSvg from "../../svg/ArrowDown";

export const countryCodes = [
  { code: "57", label: "COL", iso: "co" },
  { code: "54", label: "ARG", iso: "ar" },
  { code: "52", label: "MEX", iso: "mx" },
  { code: "56", label: "CHL", iso: "cl" },
  { code: "51", label: "PER", iso: "pe" },
  { code: "58", label: "VEN", iso: "ve" },
  { code: "593", label: "ECU", iso: "ec" },
  { code: "55", label: "BRA", iso: "br" },
  { code: "507", label: "PAN", iso: "pa" },
  { code: "506", label: "CRI", iso: "cr" },
  { code: "1", label: "USA", iso: "us" },
  { code: "34", label: "ESP", iso: "es" },
];

type PhoneInputProps<T extends FieldValues> = {
  title: string;
  name: Path<T>;
  control: Control<T>;
  rules?: UseControllerProps<T, Path<T>>['rules'];
  className?: string;
  labelClassname?: string;
  placeholder?: string;
};

export default function PhoneInput<T extends FieldValues>({
  title,
  name,
  control,
  rules,
  className = "",
  labelClassname = "",
  placeholder = "Número",
}: PhoneInputProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Extraer valor de forms
  const parseInitialValue = (val: string) => {
    if (!val) return { code: "57", number: "" };
    const foundCode = countryCodes.find((c) => val.startsWith(c.code));
    if (foundCode) {
      return { code: foundCode.code, number: val.slice(foundCode.code.length) };
    }
    return { code: "57", number: val };
  };

  return (
    <div className="w-full">
      <label htmlFor={name} className={`block mb-2 text-xs ${labelClassname}`}>
        {title}
      </label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field: { onChange, onBlur, value, ref } }) => {
          const parsed = parseInitialValue(value || "");
          const selectedCode = parsed.code;
          const phoneNumber = parsed.number;

          const handleCodeChange = (newCode: string) => {
            onChange(`${newCode}${phoneNumber}`);
          };

          const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newNumber = e.target.value.replace(/\D/g, ""); // Solo números
            onChange(`${selectedCode}${newNumber}`);
          };

          const selectedCountry = countryCodes.find((c) => c.code === selectedCode);

          return (
            <div className="flex relative items-center w-full mt-2">
              {/* Dropdown personalizado */}
              <div className="relative w-28 shrink-0 h-[46px]" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full h-full flex items-center justify-between bg-main-container border-y border-l outline-none border-main-container rounded-l-lg py-3 px-3 text-white text-sm"
                >
                  <div className="flex items-center gap-x-2">
                    {selectedCountry && (
                      <img
                        src={`https://flagcdn.com/w20/${selectedCountry.iso}.png`}
                        width="20"
                        alt="flag"
                        className="rounded-sm"
                      />
                    )}
                    <span>{selectedCode}</span>
                  </div>
                  <ArrowDownSvg className="text-gray-500 w-3" />
                </button>

                {isOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-40 bg-cards-container border border-main-container rounded-lg shadow-xl z-50 max-h-48 overflow-y-auto"
                    style={{ scrollbarWidth: "thin", scrollbarColor: "#555 transparent" }}
                  >
                    {countryCodes.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        className="w-full text-left px-3 py-2 flex items-center gap-x-3 hover:bg-main-container text-white text-sm transition-colors"
                        onClick={() => {
                          handleCodeChange(c.code);
                          setIsOpen(false);
                        }}
                      >
                        <img
                          src={`https://flagcdn.com/w20/${c.iso}.png`}
                          width="20"
                          alt="flag"
                          className="rounded-sm"
                        />
                        <span>
                          {c.label} {c.code}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Input de texto */}
              <input
                id={name}
                ref={ref}
                type="tel"
                placeholder={placeholder}
                value={phoneNumber}
                onChange={handleNumberChange}
                onBlur={onBlur}
                className={`${className} w-full bg-main-container border outline-none border-main-container rounded-r-lg py-3 pr-4 pl-2 text-white`}
              />
            </div>
          );
        }}
      />
    </div>
  );
}
