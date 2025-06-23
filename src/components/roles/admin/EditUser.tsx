"use client"

import React, { useState } from 'react';
import { users } from '@/template-data';
import DefaultForm from '@/components/ui/forms/DefaultForm';
import FormInput from '@/components/ui/inputs/FormInput';
import { redirect, usePathname } from 'next/navigation';
import FormDropDown from '@/components/ui/inputs/FormDropDown';
import Link from 'next/link';
import GoBackButton from '@/components/ui/buttons/GoBackButton';
import TrashButton from '@/components/ui/buttons/TrashButton';
import DefaultButton from '@/components/ui/buttons/DefaultButton';

const EditUser = ({ userId } : { userId: number }) => {
  const selectedUser = users.find(user => user.id === userId);
  const pathname = usePathname();
  
  if (!selectedUser) {
    alert("No se encontró el usuario")
    redirect("/")
  }

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    idNumber: "",
    role: "",
    commission: "",
    tickets: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div>
      <div className='absolute flex w-full px-5 gap-x-2 pt-10 items-center justify-between top-0 sm:top-20 z-20'>
        <GoBackButton className="px-3 rounded-xl py-3 sm:opacity-0" />
        <div className='flex items-center gap-x-2'>
          <DefaultButton className="px-12 rounded-xl py-3" text='Cuenta' href={`${pathname}/balance`} />
          <TrashButton className='p-3' />
        </div>
      </div>
      <DefaultForm goBackButton={false} handleSubmit={handleSubmit} title={`${selectedUser?.name} - ${selectedUser?.role}`}>
        <FormInput
          handleFunc={handleChange}
          title="Nombre completo*"
          formName={formData.name}
          inputName="name"
        />
        <FormInput
          handleFunc={handleChange}
          title="Número de cédula*"
          formName={formData.idNumber}
          inputName="idNumber"
        />
        <FormInput
          type="email"
          handleFunc={handleChange}
          title="Mail*"
          formName={formData.email}
          inputName="email"
        />
        <FormDropDown
          title="Rol*"
          handleFunc={handleChange}
        >
          <option value="organizador">Organizador</option>
          <option value="promotor">Promotor</option>
          <option value="controlador">Controlador</option>
        </FormDropDown>
        <FormInput
          type="number"
          handleFunc={handleChange}
          title="Comisión (%)*"
          formName={formData.commission}
          inputName="commission"
        />
        <FormInput
          type="number"
          handleFunc={handleChange}
          title="Entradas cortesia (una cada)*" 
          formName={formData.tickets}
          inputName="tickets"
        />

        <Link
          href={`${pathname}/user-events`}
          className="text-primary-white mb-0 py-5 text-center w-full block"
        >
          Ver eventos asignados
        </Link>
        <button
          type="submit"
          className="bg-primary text-black input-button"
        >
          Editar
        </button>
      </DefaultForm>
    </div>
  );
}

export default EditUser;