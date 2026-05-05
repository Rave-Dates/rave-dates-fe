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
 
export default function MinFeeRdPlain() {
  const { register, handleSubmit, reset } = useForm<{ minFeeRdPlain: number }>();
  const { getCookie } = useReactiveCookiesNext();
  const token = getCookie("token");
 
  const { adminConfig } = useAdminGetConfig({ token });
 
  useEffect(() => {
    if (adminConfig && adminConfig.minFeeRdPlain !== undefined){
      reset({
        minFeeRdPlain: adminConfig.minFeeRdPlain
      })
    }
  }, [adminConfig, reset])
 
  const { mutate } = useMutation({
    mutationFn: updateAdminConfig,
    onSuccess: () => {
      notifySuccess('Comisión mínima de Rave Dates actualizada correctamente');
    },
    onError: (error) => {
      notifyError("Error al actualizar comisión mínima de Rave Dates.");
      console.log(error)
    },
  });
 
  const onSubmit = ({ minFeeRdPlain }: { minFeeRdPlain: number }) => {
    mutate({
      token,
      data: {
        minFeeRdPlain: Number(minFeeRdPlain),
      },
    });
  };
 
  return (
    <form autoComplete="off" className="w-full mt-5">
 
      <h2 className="text-primary text-lg font-medium">
        ¡Precaución!
      </h2>
      <p className="text-primary-white/60 text-sm mb-2">Modificar este campo afectará el valor mínimo de comisión que Rave Dates cobra por entrada.</p>
      <h1 className="text-2xl font-semibold mb-3">Actualizar Comisión Mínima RD</h1>
 
      <FormInput
        title="Comisión Mínima RD*"
        inputName="minFeeRdPlain"
        type="number"
        typeOfValue="$"
        register={register("minFeeRdPlain", { required: true, valueAsNumber: true })}
      />
 
      <ConfirmationModal
        title="¿Actualizar Comisión Mínima?"
        description="Esta acción modificará el valor mínimo que Rave Dates cobra por cada entrada vendida. ¿Deseas continuar?"
        confirmText="Actualizar"
        variant="danger"
        onConfirm={handleSubmit(onSubmit)}
        trigger={
          <button
            type="button"
            className="text-primary border border-primary input-button"
          >
            Actualizar comisión
          </button>
        }
      />
    </form>
  );
}
