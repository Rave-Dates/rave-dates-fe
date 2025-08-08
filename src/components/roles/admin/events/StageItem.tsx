export function StageItem({stage, quantity}: { stage: ActiveStage, quantity: number }) {
  return (
    <div className="p-4 space-y-3 bg-cards-container rounded-lg">
      <span className="text-primary-white/60 text-base">Etapa activa</span>
      <div className="flex justify-between items-center ml-2 mt-3">
        <span className="text-text-inactive text-sm">Cantidad vendida</span>
        <div className="flex items-center gap-1">
          <span className="text-primary text-sm">{quantity}</span>
          <span className="text-primary text-[0.7rem]">(${stage.price.toLocaleString()})</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center ml-2">
          <span className="text-text-inactive text-sm">Comisión de promotor</span>
          <div className="flex items-center gap-2">
            <span className="text-primary text-sm">
              {stage.feeType === "percentage" ? `${stage.promoterFee}%` : `$${stage.promoterFee} COP`}
            </span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center ml-2">
          <span className="text-text-inactive text-sm">Fecha de inicio</span>
          <div className="flex items-center gap-2">
            <span className="text-primary text-sm tabular-nums">{stage.date}</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center ml-2">
          <span className="text-text-inactive text-sm">Fecha final</span>
          <div className="flex items-center gap-2">
            <span className="text-primary text-sm tabular-nums">{stage.dateMax}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
