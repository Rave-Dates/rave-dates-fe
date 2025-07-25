"use client";

import DefaultForm from "@/components/ui/forms/DefaultForm";
import FormInput from "@/components/ui/inputs/FormInput";
import { onInvalid } from "@/utils/onInvalidFunc";
import React from "react";
import { useForm } from "react-hook-form";

export default function CreateUser() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: Partial<IUser>) => {
    console.log(data)
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit, onInvalid)}  title="Nuevo promotor">
      <FormInput
        title="Nombre completo*"
        inputName="name"
        register={register("name", { required: true })}
      />
      <FormInput
        type="email"
        title="Email*"
        inputName="email"
        register={register("email", { required: true })}
      />
      <FormInput
        type="number"
        title="Celular*"
        inputName="phone"
        register={register("phone", { required: true })}
      />

      <button
        type="submit"
        className="bg-primary text-black input-button"
      >
        Agregar
      </button>
    </DefaultForm>
  );
}
