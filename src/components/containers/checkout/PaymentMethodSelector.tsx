import Image from "next/image";
import CheckSvg from "@/components/svg/CheckSvg";
import { SetStateAction } from "react";

type Props = {
  clientData: IClient | null | undefined;
  selected: string;
  setSelected: React.Dispatch<SetStateAction<"Nequi" | "Bold">>;
  check: boolean;
  setCheck: (value: boolean) => void;
};

export default function PaymentMethodSelector({ clientData, selected, setSelected, check, setCheck }: Props) {
  const methods: ["Nequi", "Bold"] = ["Nequi", "Bold"];

  if (!clientData) return null;

  return (
    <div className="bg-cards-container rounded-lg p-4">
      <div className="flex flex-col items-start pb-4 border-b border-inactive">
        <div className="text-sm text-primary-white/45">Método de pago</div>
        <span>Pagar con</span>
      </div>
      {methods.map((item) => (
        <label
          key={item}
          className="flex items-center w-full cursor-pointer group py-3 border-b border-inactive"
        >
          <div className="relative">
            <input
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
          <div className="flex w-full items-center justify-between px-4">
            <div className="flex flex-col items-start justify-center">
              <span className="group-hover:text-lime-200 font-light transition-colors">{item} {item === "Bold" && "(Tarjeta)"}</span>
            </div>
            <Image
              className="w-16 h-5 object-cover"
              src={item === "Nequi" && "/images/nequi.webp" || item === "Bold" && "/images/bold.png" || ""}
              width={100}
              height={100}
              alt="logo"
            />
          </div>
        </label>
      ))}

      <div className="flex items-center pt-3 pb-1 select-none">
        <input 
          disabled={clientData?.balance <= 0}
          type="checkbox" 
          id="receiveInfo" 
          checked={check} 
          onChange={() => setCheck(!check)} 
          className="hidden" 
        />
        <div
          onClick={() => setCheck(!check)}
          className={`w-5 h-5 duration-100 rounded-md flex items-center justify-center transition-colors cursor-pointer border
            ${check ? "bg-primary text-primary-black border-primary" : "border-inactive text-transparent"}
            ${clientData?.balance <= 0 && "pointer-events-none"}
          `}
        >
          <CheckSvg />
        </div>
        <label htmlFor="receiveInfo" className={`w-full flex items-center justify-between px-4 select-none cursor-pointer ${clientData?.balance <= 0 && "pointer-events-none text-primary-white/50"}`}>
          <div className="flex font-light flex-col items-start justify-center">
            Usar crédito disponible
            {
              clientData?.balance && clientData.balance < 0 ?
              <div className="flex text-sm text-primary-white/40 font-light items-end justify-center">
                Tienes saldo pendiente. Balance: ${clientData?.balance.toLocaleString()}
              </div>
              : clientData?.balance === 0 ?
              <div className="flex text-sm text-primary-white/40 font-light flex-col items-start justify-center">
                No tienes crédito disponible
              </div>
              : 
              <h3 className="text-sm text-primary-white/45">
                Dinero disponible: ${clientData?.balance.toLocaleString()}
              </h3>
            }
          </div>
        </label>
      </div>
    </div>
  );
}
