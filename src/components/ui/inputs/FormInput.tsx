import React from "react";

const FormInput = ({
  title,
  type = "text",
  inputName,
  className = "",
  register
}: {
  type?: string;
  title: string;
  inputName: string;
  className?: string;
  register: any;
}) => {
  return (
    <div>
      <label htmlFor={inputName} className="text-xs">
        {title}
      </label>
      <input
        id={inputName}
        name={inputName}
        type={type}
        {...register}
        className={`${className} w-full mt-2 bg-main-container border outline-none border-main-container rounded-lg py-3 px-4 text-white`}
      />
    </div>
  );
};

export default FormInput;
