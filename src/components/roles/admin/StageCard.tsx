"use client"

import TrashSvg from "@/components/svg/TrashSvg"
import FormInput from "@/components/ui/inputs/FormInput"
import { FieldValues, UseFormRegister } from "react-hook-form";

interface StageCardProps {
  index: number,
  onDelete?: () => void,
  register: UseFormRegister<FieldValues>,
}

export function StageCard({
  index,
  onDelete,
  register,
}: StageCardProps) {

  console.log(index)

  return (
    <div className="bg-main-container rounded-lg p-4 space-y-4 h-fit transition-all duration-400">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Etapa {index + 1}</h3>
        <button onClick={onDelete} className="text-text-inactive active:text-system-error">
          <TrashSvg />
        </button>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-2 gap-3">
        <FormInput
          className="!bg-cards-container"
          title="Cantidad"
          inputName="quantity"
          register={register(`stages.${index}.quantity`, { required: true, valueAsNumber: true })}
        />
        <FormInput
          type="number"
          className="!bg-cards-container"
          title="Precio"
          inputName="price"
          register={register(`stages.${index}.price`, { required: true, valueAsNumber: true })}
        />
        <FormInput
          className="!bg-cards-container"
          title="Fecha inicio"
          placeholder="yyyy-mm-dd"
          inputName="date"
          register={register(`stages.${index}.date`, { required: true, valueAsDate: true })}
        />
        <FormInput
          className="!bg-cards-container"
          title="Fecha máx."
          placeholder="yyyy-mm-dd"
          inputName="dateMax"
          register={register(`stages.${index}.dateMax`, { required: true })}
        />
        <FormInput
          className="!bg-cards-container"
          title="Comisión promotor (%)"
          inputName="commission"
          register={register(`stages.${index}.commission`, { required: true, valueAsNumber: true })}
        />
      </div>
    </div>
  )
}
