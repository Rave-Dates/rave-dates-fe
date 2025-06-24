import React, { ChangeEvent } from "react";

const FormInput = ({
  handleFunc,
  title,
  formName,
  type = "text",
  inputName,
  className = ""
}: {
  type?: string;
  handleFunc: (item: ChangeEvent<HTMLInputElement>) => void;
  title: string;
  formName: string;
  inputName: string;
  className?: string;
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
        required
        value={formName}
        onChange={handleFunc}
        className={`${className} w-full mt-2 bg-main-container border outline-none border-main-container rounded-lg py-3 px-4 text-white`}
      />
    </div>
  );
};

export default FormInput;
