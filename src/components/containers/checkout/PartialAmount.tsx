import FormInput from "@/components/ui/inputs/FormInput";
import { UseFormRegister } from "react-hook-form";

type Props = {
  eventPBComission: number
  register: UseFormRegister<{ partialAmount: number, discountCode: string }>
  totalAmount: number
  partialAmount: number
  hasDiscountFlag: boolean
  watchedDiscountCode: number
  effectiveFeePercentage: number
  selectedMethod: "Nequi" | "Bold" | "Ninguno"
  minPartialPercentage?: number
};

export default function PartialAmount({ register, totalAmount, partialAmount, eventPBComission, hasDiscountFlag, watchedDiscountCode, effectiveFeePercentage, selectedMethod, minPartialPercentage } : Props) {
  console.log("eventPBComission", eventPBComission)

  const gatewayFee = selectedMethod === "Bold" ? totalAmount * (effectiveFeePercentage / 100) : 0;
  const actualDiscountValue = hasDiscountFlag ? totalAmount * (watchedDiscountCode / 100) : 0;
  const pbCommissionValue = totalAmount * (eventPBComission / 100);
  
  const totalToPay = totalAmount + gatewayFee - actualDiscountValue + pbCommissionValue;
  const pendingAmount = Math.max(totalToPay - partialAmount, 0);

  const MIN_AMOUNT = minPartialPercentage
    ? Math.ceil(totalToPay * (minPartialPercentage / 100))
    : 1000;

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
          })}
          onInput={(e) => {
            const input = e.currentTarget;
            const value = Number(input.value);
            if (value > totalToPay) {
              input.value = totalToPay.toString();
            }
          }}
        />    
      </div>
      <h3 className="text-xs text-primary-white/50 pt-2 pb-5">Cantidad mínima inicial: ${MIN_AMOUNT.toLocaleString()} COP{minPartialPercentage ? ` (${minPartialPercentage}%)` : ""}</h3>
      <h2 className="pb-1 text-sm">Saldo pendiente a pagar: ${pendingAmount.toLocaleString()} COP <span className="text-xs text-primary-white/50"></span></h2>
      <h3 className="text-xs text-primary-white/50 pb-3">Comisión de alcancía: {eventPBComission}% (${pbCommissionValue.toLocaleString()} COP)</h3>
      <h3 className="text-xs text-primary-white/50 pb-2">Deberás abonar el resto del pago antes del evento a través de &quot;Mis Tickets&quot;</h3>
    </div>
  );
}
