import React from "react";
import CheckSvg from "../../svg/CheckSvg";

const CheckFormInput = ({
  handleFunc,
  inputData,
}: {
  inputData: boolean;
  handleFunc: (item: boolean) => void;
}) => {
  return (
    <div className="flex items-center w-fit select-none">
      {/* Invisible real checkbox (for accessibility if needed) */}
      <input
        type="checkbox"
        id="receiveInfo"
        name="receiveInfo"
        checked={inputData}
        onChange={() => handleFunc(!inputData)}
        className="hidden cursor-pointer"
      />

      {/* Visual representation */}
      <div
        onClick={() => handleFunc(!inputData)}
        className={`w-5 h-5 duration-100 rounded-md flex items-center justify-center transition-colors cursor-pointer border
        ${inputData ? "bg-primary text-primary-black border-primary" : "border-inactive text-transparent"}`}
      >
        <CheckSvg />
      </div>

      <label
        htmlFor="receiveInfo"
        className="text-xs ps-2 h-full text-text-inactive select-none cursor-pointer"
      >
        Recordarme en este dispositivo
      </label>
    </div>
  );
};

export default CheckFormInput;