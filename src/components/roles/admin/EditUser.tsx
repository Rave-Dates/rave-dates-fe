"use client"

import React, { useEffect } from 'react';
import DefaultForm from '@/components/ui/forms/DefaultForm';
import FormInput from '@/components/ui/inputs/FormInput';
import { redirect, usePathname } from 'next/navigation';
import FormDropDown from '@/components/ui/inputs/FormDropDown';
import Link from 'next/link';
import GoBackButton from '@/components/ui/buttons/GoBackButton';
import DefaultButton from '@/components/ui/buttons/DefaultButton';
import DeleteUserModal from '@/components/ui/modals/DeleteUserModal';
import { useReactiveCookiesNext } from 'cookies-next';
import { useMutation, useQuery } from '@tanstack/react-query';
import { editUserById, getUserById } from '@/services/admin-users';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';
import CheckSvg from '@/components/svg/CheckSvg';
import { toast } from 'sonner';

const EditUser = ({ userId } : { userId: number }) => {
  const pathname = usePathname();
  const { register, handleSubmit, reset} = useForm();
  const { getCookie } = useReactiveCookiesNext();

  const token = getCookie("token");
  
  // obtenemos user por id
  const { data, isPending } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserById({ token, id: userId }),
    enabled: !!token, // solo se ejecuta si hay token
  });

  // resetea los campos cuando llegan los datos
  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        // idNumber: data.idNumber,
        email: data.email,
        role: data.role.name,
      });
    }
  }, [data, reset]);

  // editamos el usuario 
  const { mutate } = useMutation({
    mutationFn: editUserById,
    onSuccess: () => {
      const decoded: IUserLogin = jwtDecode(`${token}`);

      if (decoded.role !== 'ADMIN') {
        alert("No tienes permiso para acceder.");
        // setLoginError("No tienes permiso para acceder.");
        return
      }
      toast('Usuario editado correctamente', {
        className: 'bg-primary-black',
        style: {backgroundColor: '#151515', color: '#FFFFFF', borderColor: "#b3ff0020"},
        duration: 5000,
        icon: <CheckSvg className="text-primary text-xl" />,
      });
      redirect('/admin/users');
    },
    onError: () => {
      // setLoginError("Credenciales incorrectas.");
      alert("Credenciales incorrectas.");
    },
  });

  // editamos el usuario 
  const onSubmit = () => {
    mutate({
      token,
      id: userId,
      formData: {
        name: data?.name,
        // idNumber: data?.idNumber,
        email: data?.email,
        role: data?.role,
      },
    });
  };

  return (
    <div>
      <div className='absolute flex w-full px-5 gap-x-2 pt-10 items-center justify-between top-0 sm:top-20 z-20'>
        <GoBackButton className="px-3 rounded-xl py-3 sm:opacity-0" />
        <div className='flex items-center gap-x-3'>
          <DefaultButton className="px-12 rounded-xl py-3" text='Cuenta' href={`${pathname}/balance`} />
          <DeleteUserModal />
        </div>
      </div>
      <DefaultForm isPending={isPending} goBackButton={false} handleSubmit={handleSubmit(onSubmit)} title={`${data?.name}`}>
        <FormInput
          title="Nombre completo*"
          inputName="name"
          register={register("name", { required: true, value: data?.name })}
        />
        <FormInput
          title="Número de cédula*"
          inputName="idNumber"
          register={register("idNumber", { required: true })}
          />
        <FormInput
          type="email"
          title="Mail*"
          inputName="email"
          register={register("email", { required: true, value: data?.email })}
        />
        <FormDropDown
          title="Rol*"
          register={register("role", { required: true })}
        >
          <option value="ORGANIZER">Organizador</option>
          <option value="PROMOTER">Promotor</option>
          <option value="CONTROLLER">Controlador</option>
          <option value="ADMIN">Administrador</option>
        </FormDropDown>
        <FormInput
          type="number"
          title="Comisión (%)*"
          inputName="commission"
          register={register("commission", { required: true })}
        />
        <FormInput
          type="number"
          title="Entradas cortesia (una cada)*" 
          inputName="tickets"
          register={register("tickets", { required: true })}
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