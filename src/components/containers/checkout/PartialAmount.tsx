import FormInput from "@/components/ui/inputs/FormInput";
import { UseFormRegister } from "react-hook-form";

type Props = {
  eventPBComission: number
  register: UseFormRegister<{ partialAmount: number, discountCode: string }>
  totalAmount: number
  partialAmount: number
};

export default function PartialAmount({ register, totalAmount, partialAmount, eventPBComission }: Props) {
  const MIN_AMOUNT = 1000;

  console.log("eventPBComission", eventPBComission)

  const pendingAmount = Math.max(totalAmount - partialAmount, 0);

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
            valueAsNumber: true,
            required: "La cantidad parcial es obligatoria",
            min: MIN_AMOUNT,
          })}
          onInput={(e) => {
            const input = e.currentTarget;
            const value = Number(input.value);
            if (value > totalAmount) {
              input.value = totalAmount.toString();
            }
          }}
        />    
      </div>
      <h3 className="text-xs text-primary-white/50 pt-2 pb-5">Cantidad mínima inicial: ${MIN_AMOUNT.toLocaleString()} COP</h3>
      <h2 className="pb-1 text-sm">Saldo pendiente a pagar: ${pendingAmount.toLocaleString()} COP <span className="text-xs text-primary-white/50"></span></h2>
      <h3 className="text-xs text-primary-white/50 pb-3">Comisión de alcancía: ${eventPBComission.toLocaleString()} COP</h3>
      <h3 className="text-xs text-primary-white/50 pb-2">Deberás abonar el resto del pago antes del evento a través de &quot;Mis Tickets&quot;</h3>
    </div>
  );
}
