type Props = {
  selected: "Pago total" | "Abonar a la alcancía";
  setSelected: (value: "Pago total" | "Abonar a la alcancía") => void;
  isPromoter?: boolean;
};

export default function PaymentTypeSelector({ selected, setSelected, isPromoter = false }: Props) {
  const payments: ["Pago total", "Abonar a la alcancía"] = ["Pago total", "Abonar a la alcancía"];
  const promoterPayments: ["Pago total"] = ["Pago total"];

  const paymentsToShow = isPromoter ? promoterPayments : payments;

  return (
    <div className="bg-cards-container rounded-lg p-4 pb-1">
      <div className="flex flex-col items-start pb-4 border-b border-inactive">
        <div className="text-sm text-primary-white/45">Tipo de pago</div>
        <span>{selected}</span>
      </div>
      {paymentsToShow.map((item) => (
        <label
          key={item}
          className="flex items-center w-full cursor-pointer group py-4 not-last:border-b border-inactive"
        >
          <div className="relative">
            <input
              type="radio"
              name="paymentType"
              value={item}
              checked={selected === item}
              onChange={() => setSelected(item)}
              className="sr-only"
            />
            <div
              className={`w-6 h-6 rounded-full border-1 flex items-center justify-center transition-colors ${
                selected === item
                  ? "border-inactive bg-primary-black"
                  : "border-inactive group-hover:border-primary/30"
              }`}
            >
              {selected === item && <div className="w-3.5 h-3.5 bg-primary rounded-full" />}
            </div>
          </div>
          <span className="group-hover:text-lime-200 font-light px-4 transition-colors">{item}</span>
        </label>
      ))}
    </div>
  );
}
