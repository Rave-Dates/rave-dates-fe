import FormInput from "@/components/ui/inputs/FormInput";
import { useEffect, useRef } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

type Props = {
  eventPBComission: number
  register: UseFormRegister<{ partialAmount: number, discountCode: string }>
  setValue: UseFormSetValue<{ partialAmount: number, discountCode: string }>
  totalAmount: number
  partialAmount: number
  hasDiscountFlag: boolean
  watchedDiscountCode: number
  effectiveFeePercentage: number
  selectedMethod: "Nequi" | "Bold" | "Ninguno"
  minPartialPercentage?: number
  isPendingPayment?: boolean
};

export default function PartialAmount({ register, setValue, totalAmount, partialAmount, eventPBComission, hasDiscountFlag, watchedDiscountCode, effectiveFeePercentage, selectedMethod, minPartialPercentage, isPendingPayment = false } : Props) {

  const gatewayFee = selectedMethod === "Bold" ? totalAmount * (effectiveFeePercentage / 100) : 0;
  const actualDiscountValue = hasDiscountFlag ? totalAmount * (watchedDiscountCode / 100) : 0;
  const pbCommissionValue = isPendingPayment ? 0 : totalAmount * (eventPBComission / 100);
  
  // Total base: sin fee de pasarela (usado para saldo pendiente y mínimo de alcancía)
  const totalBaseAmount = totalAmount - actualDiscountValue + pbCommissionValue;
  // Total con fee: usado solo para el tope del input
  const totalToPay = totalBaseAmount + gatewayFee;

  const pendingAmount = Math.max(totalBaseAmount - partialAmount, 0);

  const MIN_AMOUNT = minPartialPercentage
    ? Math.ceil(totalBaseAmount * (minPartialPercentage / 100))
    : 1000;

  const initialized = useRef(false);

  useEffect(() => {
    // Si el usuario aún no ha cambiado el valor y no se ha inicializado
    if (!initialized.current && partialAmount === 0 && MIN_AMOUNT > 0) {
      setValue("partialAmount", MIN_AMOUNT);
      initialized.current = true;
    }
  }, [MIN_AMOUNT, partialAmount, setValue]);

  return (
    <div className="bg-cards-container flex flex-col rounded-lg p-4">
      <div className="flex flex-col items-start">
        <FormInput 
          type="number"
          labelClassname="!text-sm"
          title="Pago inicial" 
          inputName="partialAmount" 
          typeOfValue="$"
          register={register("partialAmount", {
            setValueAs: (v) => v === "" ? undefined : Number(v),
            required: "La cantidad parcial es obligatoria",
            min: MIN_AMOUNT,
            value: MIN_AMOUNT,
          })}
          onInput={(e) => {
            const input = e.currentTarget;
            const value = Number(input.value);
            const maxAllowed = totalToPay - 1000;
            if (value > maxAllowed) {
              input.value = Math.max(0, maxAllowed).toString();
            }
          }}
        />    
      </div>
      {!isPendingPayment && (
        <h3 className="text-xs text-primary-white/50 pt-2 pb-5">Cantidad mínima inicial: ${MIN_AMOUNT.toLocaleString()} COP{minPartialPercentage ? ` (${minPartialPercentage}%)` : ""}</h3>
      )}
      <h2 className={`pb-1 ${!isPendingPayment ? "" : "pt-3"} text-sm`}>Saldo pendiente a pagar: ${pendingAmount.toLocaleString()} COP <span className="text-xs text-primary-white/50"></span></h2>
      {!isPendingPayment && (
        <h3 className="text-xs text-primary-white/50 pb-3">Comisión de alcancía: {eventPBComission}% (${pbCommissionValue.toLocaleString()} COP)</h3>
      )}
      <h3 className="text-xs text-primary-white/50 pb-2">Desde “Mis Tickets” puedes realizar varios abonos a tu alcancía hasta completar el total. Realiza el pago pendiente antes del evento</h3>
    </div>
  );
}
