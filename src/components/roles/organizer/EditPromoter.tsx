"use client"

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import DefaultForm from '@/components/ui/forms/DefaultForm';
import FormInput from '@/components/ui/inputs/FormInput';
import { onInvalid } from '@/utils/onInvalidFunc';
import { useMutation } from '@tanstack/react-query';
import { editUserById } from '@/services/admin-users';
import { jwtDecode } from 'jwt-decode';
import { notifyError, notifySuccess } from '@/components/ui/toast-notifications';
import { useAdminUserById } from '@/hooks/admin/queries/useAdminData';
import { useReactiveCookiesNext } from 'cookies-next';
import { useRouter } from 'next/navigation';

const EditPromoter = ({ userId } : { userId: number }) => {
  const { register, handleSubmit, reset} = useForm();
  const { getCookie } = useReactiveCookiesNext();
  const router = useRouter();

  const token = getCookie("token");

  const { data: userById } = useAdminUserById({ token, userId });

  // resetea los campos cuando llegan los datos
  useEffect(() => {
    if (userById) {
      reset({
        name: userById.name,
        phone: userById.phone,
        email: userById.email,
      });
    }
  }, [userById, reset]);

  // editamos el usuario 
  const { mutate } = useMutation({
    mutationFn: editUserById,
    onSuccess: () => {
      const decoded: IUserLogin = jwtDecode(`${token}`);

      if (decoded.role !== 'ORGANIZER') {
        notifyError("No tienes permiso para editar un usuario.");
        // setLoginError("No tienes permiso para acceder.");
        return
      }
      notifySuccess('Usuario editado correctamente');
      router.back();
    },
    onError: (error) => {
      console.log(error)
      // setLoginError("Credenciales incorrectas.");
      notifyError("Credenciales incorrectas.");
    },
  });

  // editamos el usuario 
  const onSubmit = (data: Partial<IUser>) => {
    console.log(data)
    mutate({
      token,
      id: userId,
      formData: {
        name: data?.name,
        phone: data?.phone?.toString(),
        email: data?.email,
      },
    });
  };

  return (
    <DefaultForm handleSubmit={handleSubmit(onSubmit, onInvalid)} title={`${userById?.name}`}>
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