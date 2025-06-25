"use client"

import TrashSvg from "@/components/svg/TrashSvg"
import FormInput from "@/components/ui/inputs/FormInput"
import { useState } from "react"

interface StageCardProps {
  stageNumber: number,
  onDelete?: () => void
}

export function StageCard({
  stageNumber,
  onDelete,
}: StageCardProps) {
  const [formData, setFormData] = useState({
    stageNumber: 0,
    quantity: "",
    price: "",
    date: "",
    commission: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-main-container rounded-lg p-4 space-y-4 h-fit transition-all duration-400">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-white font-medium">Etapa {stageNumber}</h3>
        <button onClick={onDelete} className="text-text-inactive active:text-system-error">
          <TrashSvg />
        </button>
      </div>

      {/* Input Fields */}
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
        <FormInput
          className="!bg-cards-container"
          handleFunc={handleChange}
          title="Cantidad"
          formName={formData.quantity}
          inputName="quantity"
        />
        <FormInput
          className="!bg-cards-container"
          handleFunc={handleChange}
          title="Hasta fecha"
          formName={formData.date}
          inputName="date"
        />
        <FormInput
          type="number"
          className="!bg-cards-container"
          handleFunc={handleChange}
          title="Precio"
          formName={formData.price}
          inputName="price"
        />
        <FormInput
          className="!bg-cards-container"
          handleFunc={handleChange}
          title="Comisión promotor (%)"
          formName={formData.commission}
          inputName="commission"
        />
      </form>

    </div>
  )
}
