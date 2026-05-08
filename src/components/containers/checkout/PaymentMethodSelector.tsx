import Image from "next/image";
import CheckSvg from "@/components/svg/CheckSvg";
import { SetStateAction } from "react";

type Props = {
  clientData: IClient | null | undefined;
  selected: string;
  check: boolean;
  isPromoter?: boolean;
  setSelected: React.Dispatch<SetStateAction<"Nequi" | "Bold" | "Ninguno">>;
  setCheck: (value: boolean) => void;
  isBalanceSufficient: boolean;
};

export default function PaymentMethodSelector({ clientData, selected, setSelected, check, setCheck, isPromoter = false, isBalanceSufficient }: Props) {
  const methods: ["Nequi", "Bold"] = ["Nequi", "Bold"];

  return (
    <div className="bg-cards-container rounded-lg p-4">
      <div className="flex flex-col items-start pb-4 border-b border-inactive">
        <div className="text-sm text-primary-white/45">Método de pago</div>
        <span>Pagar con</span>
      </div>
      {methods.map((item) => (
        <label
          key={item}
          className={`flex items-center w-full cursor-pointer group py-3 border-b border-inactive ${isBalanceSufficient && "pointer-events-none"}`}
        >
          <div className="relative">
            <input
              disabled={isBalanceSufficient}
              type="radio"
              name="paymentMethod"
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
          <div className={`flex w-full items-center justify-between px-4 ${isBalanceSufficient && "opacity-40"}`}>
            <div className="flex flex-col items-start justify-center">
              <span className="group-hover:text-primary font-light transition-colors">{item} {item === "Bold" && "(Tarjeta)"}</span>
            </div>
            <Image
              className="w-16 h-5 object-cover"
              src={item === "Nequi" && "/images/nequi.webp" || item === "Bold" && "/images/bold.png" || ""}
              width={100}
              height={100}
              alt="Método de pago"
            />
          </div>
        </label>
      ))}

      {isPromoter || !clientData ? (
        <div className="flex items-center pt-3 pb-1 select-none">
          <div className="w-5 h-5 duration-100 rounded-md flex items-center justify-center transition-colors border border-inactive pointer-events-none"></div>
          <label htmlFor="receiveInfo" className="w-full flex items-center justify-between px-4 select-none text-primary-white/60">
            <div className="flex font-light flex-col items-start justify-center">
              Usar crédito disponible
              <h3 className="text-sm text-primary-white/45">
                {!isPromoter ? "Verifica tu cuenta para desbloquear esta opción" : "No puedes usar esta opción siendo promotor"}
              </h3>
            </div>
          </label>
        </div>
      ) : clientData.balance > 0 ? (
        <div className="flex items-center pt-3 pb-1 select-none">
          <input
            type="checkbox"
            id="receiveInfo"
            checked={check}
            onChange={() => setCheck(!check)}
            className="hidden"
          />
          <div
            onClick={() => setCheck(!check)}
            className={`w-5 h-5 duration-100 rounded-md flex items-center justify-center transition-colors cursor-pointer border ${
              check ? "bg-primary text-primary-white border-primary" : "border-inactive text-transparent"
            }`}
          >
            <CheckSvg />
          </div>
          <label htmlFor="receiveInfo" className="w-full flex items-center justify-between px-4 select-none cursor-pointer">
            <div className="flex font-light flex-col items-start justify-center">
              Usar crédito disponible
              <h3 className="text-sm text-primary-white/45">
                Dinero disponible: ${clientData.balance.toLocaleString()}
              </h3>
            </div>
          </label>
        </div>
      ) : null}
    </div>
  );
}
