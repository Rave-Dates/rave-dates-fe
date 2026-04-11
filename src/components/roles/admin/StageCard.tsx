"use client"

import TrashSvg from "@/components/svg/TrashSvg"
import DatePicker from "@/components/ui/date-picker/date-picker";
import FormInput from "@/components/ui/inputs/FormInput"
import { validateDateYyyyMmDd } from "@/utils/formatDate";
import { Control, Controller, UseFormRegister } from "react-hook-form";

interface StageCardProps {
  index: number,
  onDelete?: () => void,
  register: UseFormRegister<IEventTicket>,
  control: Control<IEventTicket>,
}

export function StageCard({
  index,
  onDelete,
  register,
  control,
}: StageCardProps) {

  return (
    <div className="bg-main-container rounded-lg p-4 space-y-4 h-fit transition-all duration-400">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Etapa {index + 1}</h3>
        <button type="button" onClick={onDelete} className="text-text-inactive active:text-system-error">
          <TrashSvg />
        </button>
      </div>

      {/* Input Fields */}
      <div className="flex flex-col gap-3">
        <div className="flex w-full justify-center items-center gap-x-3">
          <FormInput
            type="number"
            className="bg-cards-container!"
            title="Cantidad"
            inputName="quantity"
            register={register(`stages.${index}.quantity`, { 
              required: true, 
              setValueAs: (v) => v === "" ? undefined : Number(v) 
            })}
          />
          <FormInput
            type="number"
            className="bg-cards-container!"
            title="Precio"
            inputName="price"
            register={register(`stages.${index}.price`, { 
              required: true, 
              setValueAs: (v) => v === "" ? undefined : Number(v) 
            })}
          />
          <FormInput
            type="number"
            className="bg-cards-container!"
            title="Comisión de promotor"
            typeOfValue="$"
            inputName="promoterFee"
            register={register(`stages.${index}.promoterFee`, { 
              required: true, 
              setValueAs: (v) => v === "" ? undefined : Number(v) 
            })}
          />
        </div>
        <div className="flex w-full justify-center items-center gap-x-3">

          <Controller
            name={`stages.${index}.date`}
            control={control}
            rules={{ required: "La fecha de inicio es obligatoria", validate: validateDateYyyyMmDd }}
            render={({ field }) => (
              <DatePicker
                value={field.value as string} 
                onChange={field.onChange} 
                title="Fecha inicio*" 
                className="h-13 bg-cards-container"
              />
            )}
          />
          <Controller
            name={`stages.${index}.dateMax`}
            control={control}
            rules={{ required: "La fecha máx. es obligatoria", validate: validateDateYyyyMmDd }}
            render={({ field }) => (
              <DatePicker
                value={field.value as string} 
                onChange={field.onChange} 
                title="Fecha máx.*" 
                className="h-13 bg-cards-container"
              />
            )}
          />
        </div>
      </div>
    </div>
  )
}
