"use client";
import React, { useRef, useEffect } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

type FormTextAreaProps = {
  title: string;
  inputName: string;
  className?: string;
  labelClassname?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  disabled?: boolean;
};

const FormTextArea = ({
  title,
  inputName,
  className = "",
  labelClassname,
  placeholder,
  register,
  disabled = false,
}: FormTextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const { ref, ...rest } = register;

  useEffect(() => {
    adjustHeight();
  }, []);

  return (
    <div className="w-full">
      <label htmlFor={inputName} className={`text-xs ${labelClassname}`}>
        {title}
      </label>
      <div className="flex relative items-center justify-center">
        <textarea
          {...rest}
          id={inputName}
          placeholder={placeholder}
          disabled={disabled}
          ref={(e) => {
            ref(e);
            textareaRef.current = e;
          }}
          onInput={() => {
            adjustHeight();
          }}
          className={`${className} w-full mt-2 bg-main-container border outline-none border-main-container rounded-lg py-3 px-4 text-white disabled:opacity-80 disabled:cursor-not-allowed disabled:select-none resize-none overflow-hidden min-h-[48px]`}
        />
      </div>
    </div>
  );
};

export default FormTextArea;
