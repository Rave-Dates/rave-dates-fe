"use client"

import { useState } from "react"

interface StageCardProps {
  stageNumber: number,
  stageName: string
  stagePrice: number
}

export function UserStageInfo({
  stageName,
  stageNumber,
  stagePrice,
}: StageCardProps) {
  const [formData] = useState({
    commission: "",
  });

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="bg-main-container rounded-lg p-4 space-y-4 h-fit transition-all duration-400">
      {/* Header */}
      <div className="flex flex-col font-medium items-start gap-y-2">
        <h3 className="text-xl">{stageName}</h3>
        <div className="flex items-center justify-between w-full">
          <h3 className="text-xs">Etapa {stageNumber}</h3>
          <p className="text-sm">${stagePrice.toLocaleString("es-ES")}</p>
        </div>
      </div>

      {/* Input Fields */}
      <div onSubmit={handleSubmit} className="gap-3">
        {/* <FormInput
          className="!bg-cards-container"
          handleFunc={handleChange}
          title="Comisión promotor"
          formName={formData.commission}
          inputName="commission"
        /> */}
      </div>

    </div>
  )
}
