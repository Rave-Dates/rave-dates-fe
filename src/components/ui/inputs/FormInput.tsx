import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type FormInputProps = {
  title: string;
  type?: string;
  inputName: string;
  className?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
};

const FormInput = ({
  title,
  type = "text",
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
      <input
        id={inputName}
        placeholder={placeholder}
        type={type}
        {...register}
        className={`${className} w-full mt-2 bg-main-container border outline-none border-main-container rounded-lg py-3 px-4 text-white`}
      />
    </div>
  );
};

export default FormInput;
