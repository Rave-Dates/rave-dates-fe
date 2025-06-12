import React, { ChangeEvent } from "react";

const FormInput = ({
  handleFunc,
  title,
  formName,
  type = "text",
  inputName
}: {
  type?: string;
  handleFunc: (item: ChangeEvent<HTMLInputElement>) => void;
  title: string;
  formName: string;
  inputName: string;
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
        className="w-full mt-2 bg-main-container border outline-none border-main-container rounded-lg py-3 px-4 text-white"
      />
    </div>
  );
};

export default FormInput;
