import React from "react";
import ArrowDownSvg from "../../svg/ArrowDown";

type SelectRegister = {
  name: string;
  onBlur: (event: React.FocusEvent<HTMLSelectElement>) => void;
  ref: (instance: HTMLSelectElement | null) => void;
};

type Props = {
  value?: string;
  register: SelectRegister;
  title: string;
  children: React.ReactNode;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

const FormDropDown = ({ register, title, children, value, onChange }: Props) => {
  return (
    <div className="relative w-full">
      <label
        htmlFor="countries"
        className="block mb-2 text-xs"
      >
        {title}
      </label>
      <div className="relative">
        <select
          {...register}
          value={value}
          onChange={onChange}
          id="countries"
          className="w-full appearance-none mt-2 bg-main-container border outline-none border-main-container rounded-lg py-3 px-4 text-white relative"
        >
          {children}
        </select>
        <ArrowDownSvg className="pointer-events-none absolute right-4 top-1/2 mt-1 -translate-y-1/2 text-gray-500" />
      </div>
    </div>
  );
};

export default FormDropDown;
