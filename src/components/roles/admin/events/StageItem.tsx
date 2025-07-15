export function StageItem({ items }: { items: IEventTicket["stages"] }) {
  const stageData = [
    { label: "Ventas por página", value: "500", amount: "$750.000" },
    { label: "Ventas de promotores", value: "611", amount: "$750.000" },
    { label: "Entradas de cortesía", value: "100" },
  ];

  const formattedData = items.map((item) => {
    return {
      ...item,
      stageData,
    };
  });

  return (
    <>
      {formattedData.map((stage, index) => (
        <div
          key={index}
          className="p-4 space-y-3 bg-cards-container rounded-lg"
        >
          <div key={index} className="flex justify-between items-center">
            <span className="text-text-inactive text-sm">
              Etapa {index + 1}
            </span>
            <div className="flex items-center gap-2">
              {stage.price ? (
                <span className="text-primary text-sm">
                  ${stage.price.toLocaleString()}
                </span>
              ) : (
                <span className="text-primary text-sm">Gratuito</span>
              )}
              <span className="text-primary text-sm">({stage.quantity})</span>
            </div>
          </div>
          <div className="space-y-2 ml-4">
            {stage.stageData.map((stage, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-text-inactive text-sm">
                  {stage.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-primary/70 text-sm">{stage.value}</span>
                  {stage.amount && (
                    <span className="text-primary/70 text-xs">
                      ({stage.amount})
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
