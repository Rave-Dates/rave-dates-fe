import { Dispatch, SetStateAction } from "react";

type Props = {
  selected: string;
  setSelected: Dispatch<SetStateAction<"Email" | "Whatsapp">>
};

export default function VerificationTypeSelector({ selected, setSelected }: Props) {
  const methods: ["Email", "Whatsapp"] = ["Email", "Whatsapp"];

  return (
    <div className="bg-cards-container rounded-lg">
      {methods.map((item) => (
        <label
          key={item}
          className="flex items-center w-full justify-between cursor-pointer group py-4 not-last:border-b border-inactive"
        >
          <div className="order-last relative pe-4">
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
          <span className="group-hover:text-lime-200 font-light ps-4 transition-colors">{item}</span>
        </label>
      ))}
    </div>
  );
}
