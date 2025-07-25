"use client"

import React from 'react';
import { useForm } from 'react-hook-form';
import DefaultForm from '@/components/ui/forms/DefaultForm';
import FormInput from '@/components/ui/inputs/FormInput';
import { onInvalid } from '@/utils/onInvalidFunc';

const EditPromoter = ({ userId } : { userId: number }) => {
  const { register, handleSubmit } = useForm();

  console.log(userId)

  const onSubmit = (data: Partial<IUser>) => {
    console.log(data)
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit, onInvalid)} title={`Nombre - Rol`}>
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
        Guardar
      </button>
    </DefaultForm>
  );
}

export default EditPromoter;