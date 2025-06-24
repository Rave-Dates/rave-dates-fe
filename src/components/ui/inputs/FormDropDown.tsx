import React, { ChangeEvent } from "react";
import ArrowDownSvg from "../../svg/ArrowDown";

const FormDropDown = ({
  children,
  handleFunc,
  title,
}: {
  children: React.ReactNode;
  handleFunc: (item: ChangeEvent<HTMLSelectElement>) => void;
  title: string;
}) => {
  return (
    <div className="relative">
      <label
        htmlFor="countries"
        className="block mb-2 text-xs"
      >
        {title}
      </label>
      <div className="relative">
        <select
          onChange={handleFunc}
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
