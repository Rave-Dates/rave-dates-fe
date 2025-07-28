import Image from "next/image";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type FormInputProps = {
  title: string;
  type?: string;
  typeOfValue?: "%" | "min";
  inputName: string;
  className?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
};

const FormInput = ({
  title,
  type = "text",
  typeOfValue,
  inputName,
  className = "",
  placeholder,
  register,
}: FormInputProps) => {
  return (
    <div className="w-full">
      <label htmlFor={inputName} className="text-xs">
        {title}
      </label>
      <div className="flex relative items-center justify-center">
        {
          typeOfValue === "%" &&
          <span className="text-sm text-white absolute left-3 mt-2">%</span>
        }
        {
          typeOfValue === "min" &&
          <span className=" text-white flex flex-col items-center justify-center absolute left-2.5 mt-3">
            <Image src="/images/time.png" alt="clock" width={15} height={15} />
            <h2 className="text-[0.6rem]">min</h2>
          </span>
        }
        <input
          id={inputName}
          placeholder={placeholder}
          type={type}
          {...register}
          className={`${className} ${typeOfValue && "ps-8"} w-full mt-2 bg-main-container border outline-none border-main-container rounded-lg py-3 px-4 text-white`}
        />
      </div>
    </div>
  );
};

export default FormInput;
