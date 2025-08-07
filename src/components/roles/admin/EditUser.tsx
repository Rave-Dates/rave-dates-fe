"use client"

import React, { useEffect } from 'react';
import DefaultForm from '@/components/ui/forms/DefaultForm';
import FormInput from '@/components/ui/inputs/FormInput';
import { usePathname, useRouter } from 'next/navigation';
import FormDropDown from '@/components/ui/inputs/FormDropDown';
import Link from 'next/link';
import GoBackButton from '@/components/ui/buttons/GoBackButton';
import DefaultButton from '@/components/ui/buttons/DefaultButton';
import DeleteUserModal from '@/components/ui/modals/DeleteUserModal';
import { useReactiveCookiesNext } from 'cookies-next';
import { useMutation } from '@tanstack/react-query';
import { editUserById } from '@/services/admin-users';
import { useForm } from 'react-hook-form';
import { jwtDecode } from 'jwt-decode';
import { notifyError, notifySuccess } from '@/components/ui/toast-notifications';
import { useAdminAllRoles, useAdminUserById } from '@/hooks/admin/queries/useAdminData';

const EditUser = ({ userId } : { userId: number }) => {
  const pathname = usePathname();
  const { register, handleSubmit, reset} = useForm();
  const { getCookie } = useReactiveCookiesNext();
  const router = useRouter();

  const token = getCookie("token");

  const { data, isPending } = useAdminUserById({ token, userId });
  const { roles } = useAdminAllRoles({ token });

  // resetea los campos cuando llegan los datos
  useEffect(() => {
    if (data) {
      reset({
        name: data.name,
        phone: data.phone,
        email: data.email,
        roleId: data.roleId,
      });
    }
  }, [data, reset]);

  // editamos el usuario 
  const { mutate } = useMutation({
    mutationFn: editUserById,
    onSuccess: () => {
      const decoded: IUserLogin = jwtDecode(`${token}`);

      if (decoded.role !== 'ADMIN') {
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
    if (!data.password) {
      delete data.password
    }
    mutate({
      token,
      id: userId,
      formData: {
        name: data?.name,
        phone: data?.phone?.toString(),
        password: data?.password,
        email: data?.email,
        roleId: data?.roleId,
      },
    });
  };

  return (
    <div>
      <div className='absolute flex w-full px-5 gap-x-2 pt-10 items-center justify-between top-0 sm:top-20 z-20'>
        <GoBackButton className="px-3 rounded-xl py-3 sm:opacity-0" />
        <div className='flex items-center gap-x-3'>
          {
            (data?.role.name === "ORGANIZER" || data?.role.name === "PROMOTER") && (
              <DefaultButton className="px-12 rounded-xl py-3" text='Cuenta' href={`${pathname}/balance`} />
            )
          }
          {
            data?.role.name !== "ADMIN" &&
            <DeleteUserModal userId={userId} />
          }
        </div>
      </div>
      <DefaultForm isPending={isPending} goBackButton={false} handleSubmit={handleSubmit(onSubmit)} title={`${data?.name}`}>
        <FormInput
          title="Nombre completo*"
          inputName="name"
          register={register("name", { required: true, value: data?.name })}
        />
        <FormInput
          type='password'
          title="Contraseña*"
          inputName="password"
          register={register("password")}
        />
        {
          data?.role.name !== "ADMIN" &&
          <FormInput
            type='number'
            title="Número de celular*"
            inputName="phone"
            register={register("phone", { required: true, valueAsNumber: true })}
          />
        }
        <FormInput
          type="email"
          title="Mail*"
          inputName="email"
          register={register("email", { required: true, value: data?.email })}
        />
        <FormDropDown
          title="Rol*"
          register={register("roleId", { required: true, valueAsNumber: true })}
        >
          {
            roles?.map((role: IRole) => (
              <option key={role.roleId} value={role.roleId}>
                {role.name}
              </option>
            ))
          }
        </FormDropDown>
        {/* <FormInput
          type="number"
          title="Comisión (%)*"
          inputName="commission"
          register={register("commission")}
        /> */}
        {
          data?.role.name === "ORGANIZER" && 
          <FormInput
            type="number"
            title="Entradas cortesia (una cada)*" 
            inputName="tickets"
            register={register("tickets")}
          />
        }
        {
          data?.role.name !== "ADMIN" &&
          <Link
            href={`${pathname}/user-events`}
            className="text-primary-white mb-0 py-5 text-center w-full block"
          >
            Ver eventos asignados
          </Link>
        }
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