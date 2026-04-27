"use client";

import FormInput from "@/components/ui/inputs/FormInput";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useAdminGetConfig } from "@/hooks/admin/queries/useAdminData";
import { updateAdminConfig } from "@/services/admin-parameters";
import { useMutation } from "@tanstack/react-query";
import { useReactiveCookiesNext } from "cookies-next";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

import ConfirmationModal from "@/components/ui/modals/ConfirmationModal";

export default function BoldFeePorcentage() {
  const { register, handleSubmit, reset } = useForm<{ boldFeePorcentage: number }>();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");

  const { adminConfig } = useAdminGetConfig({ token });

  useEffect(() => {
    if (adminConfig && adminConfig.boldFeePorcentage !== undefined){
      reset({
        boldFeePorcentage: adminConfig.boldFeePorcentage
      })
    }
  }, [adminConfig, reset])

  const { mutate } = useMutation({
    mutationFn: updateAdminConfig,
    onSuccess: () => {
      notifySuccess('Porcentaje de Bold actualizado correctamente');
    },
    onError: (error) => {
      notifyError("Error al actualizar porcentaje de Bold.");
      console.log(error)
    },
  });

  const onSubmit = ({ boldFeePorcentage }: { boldFeePorcentage: number }) => {
    mutate({
      token,
      data: {
        boldFeePorcentage: Number(boldFeePorcentage),
      },
    });
  };

  return (
    <form autoComplete="off" className="w-full mt-5">

      <h2 className="text-system-error text-lg font-medium">
        ¡Precaución!
      </h2>
      <p className="text-primary-white/60 text-sm mb-2">Modificar este campo afectará el cálculo de las comisiones para todos los pagos con Bold.</p>
      <h1 className="text-2xl font-semibold mb-3">Actualizar Comisión de Bold</h1>

      <FormInput
        title="Porcentaje Comisión Bold*"
        inputName="boldFeePorcentage"
        type="number"
        typeOfValue="%"
        register={register("boldFeePorcentage", { required: true, valueAsNumber: true })}
      />

      <ConfirmationModal
        title="¿Actualizar Fee Bold?"
        description="Esta acción modificará el porcentaje que se aplica a los pagos realizados a través de Bold. ¿Deseas continuar?"
        confirmText="Actualizar"
        variant="danger"
        onConfirm={handleSubmit(onSubmit)}
        trigger={
          <button
            type="button"
            className="text-primary border border-primary input-button"
          >
            Actualizar porcentaje
          </button>
        }
      />
    </form>
  );
}
