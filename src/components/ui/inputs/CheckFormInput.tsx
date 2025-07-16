import React from "react";
import CheckSvg from "../../svg/CheckSvg";

type Props = {
  register: any;
  name?: string;
  value?: boolean;
};

const CheckFormInput = ({ register, name = "receiveInfo", value }: Props) => {
  return (
    <label
      htmlFor={name}
      className="flex items-center w-fit select-none cursor-pointer gap-2"
    >
      {/* input oculto */}
      <input
        type="checkbox"
        id={name}
        {...register(name)}
        className="sr-only"
      />

      {/* checkbox */}
      <div
        className={`w-5 h-5 duration-100 rounded-md flex items-center justify-center transition-colors border
        ${value ? "bg-primary text-primary-black border-primary" : "border-inactive text-transparent"}`}
      >
        <CheckSvg />
      </div>

      <span className="text-xs text-text-inactive">
        Recordarme en este dispositivo
      </span>
    </label>
  );
};

export default CheckFormInput;
