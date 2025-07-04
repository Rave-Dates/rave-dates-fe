import React, { useEffect, useState } from 'react';
import TrashSvg from '@/components/svg/TrashSvg';
import { deleteUserById } from '@/services/admin-users';
import { useMutation } from '@tanstack/react-query';
import { notifyError, notifySuccess } from '../toast-notifications';
import { redirect } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { useReactiveCookiesNext } from 'cookies-next';

function DeleteUserModal({ userId } : { userId: IUser["userId"] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { getCookie } = useReactiveCookiesNext();

  const token = getCookie("token");

  // borramos el usuario 
  const { mutate } = useMutation({
    mutationFn: deleteUserById,
    onSuccess: () => {
      const decoded: IUserLogin = jwtDecode(`${token}`);

      if (decoded.role !== 'ADMIN') {
        notifyError("No tienes permiso para eliminar un usuario.");
        // setLoginError("No tienes permiso para acceder.");
        return
      }
      notifySuccess('Usuario eliminado correctamente');
      setIsModalOpen(false);
      redirect('/admin/users');
    },
    onError: (error: any) => {
      console.log(error)
      // setLoginError("Credenciales incorrectas.");
      notifyError("Error al eliminar usuario.");
    },
  });

  const handleDeleteUser = () => {
    mutate({
      token,
      id: userId,
    });
  };


  // no scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isModalOpen]);

  return (
    <>
      <button 
        className="bg-system-error text-primary-white active:bg-system-error/70 transition-all p-3 rounded-xl"
        onClick={() => setIsModalOpen(true)}
      >
        <TrashSvg />
      </button>
      {isModalOpen && (
        <div onClick={() => setIsModalOpen(false)} className="animate-fade-in fixed inset-0 bg-black/60 bg-opacity-75 flex items-center justify-center md:py-8 z-50">
          <div onClick={(e) => e.stopPropagation()} className="bg-cards-container mx-4 pt-5 text-primary-white flex flex-col justify-center items-center rounded-2xl w-sm overflow-hidden ">
            <h1>Va a eliminar este usuario</h1>
            <h1 className='mb-5'>¿está seguro?</h1>
            <div className='border-t border-divider w-full flex items-center justify-center'> 
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-1/2 border-r border-divider py-4 active:opacity-60"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteUser()}
                className="text-system-error w-1/2 py-4 active:opacity-60"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DeleteUserModal;