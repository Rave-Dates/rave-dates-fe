import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useClientEventTickets } from "@/hooks/client/queries/useClientData";
import { useChangeTicketStore } from "@/store/useChangeTicketStore";
import { useTicketStore } from "@/store/useTicketStore";
import { useSearchParams } from "next/navigation";
import { UseFormRegister } from "react-hook-form";

type Props = {
  check: boolean;
  register: UseFormRegister<{ partialAmount: number, discountCode: string }>
  clientData: IClient | null | undefined;
  promoterBalance?: number;
  isPromoter?: boolean;
  selectedPayment: "Pago total" | "Abrir alcancía";
  partialAmount: number;
  totalAmount: number;
  eventDiscountCode: string | undefined;
  watchedDiscountCode: string;
  setHasDiscountFlag: React.Dispatch<React.SetStateAction<boolean>>;
  hasDiscountFlag: boolean;
  eventDiscountAmount: number | undefined;
  effectiveFeePercentage: number;
  selectedMethod: "Nequi" | "Bold" | "Ninguno";
};

export default function PricingDetails({check, clientData, promoterBalance, isPromoter = false, selectedPayment, partialAmount, totalAmount, register, eventDiscountCode, watchedDiscountCode, setHasDiscountFlag, hasDiscountFlag, eventDiscountAmount, effectiveFeePercentage, selectedMethod} : Props) {
  const { selected, eventId, pendingPaymentAmount } = useTicketStore();
  const { eventTickets } = useClientEventTickets(eventId);
  const searchParams = useSearchParams();
  const isChangeTickets = Boolean(searchParams.get("change-tickets"));
  const isPendingPayment = Boolean(searchParams.get("pp"));

  const { 
    oldSubtracted
  } = useChangeTicketStore();

  const mergedTickets = Object.entries(selected).map(([ticketTypeIdStr, selectedData]) => {
    const ticketTypeId = Number(ticketTypeIdStr);

    const eventTicket = eventTickets?.find(t => t.ticketTypeId === ticketTypeId);

    let promoterDiscount = 0;
    if (isPromoter && selectedData.stage.promoterFee) {
        if (selectedData.stage.feeType === "percentage") {
             promoterDiscount = (selectedData.stage.price * (selectedData.stage.promoterFee / 100)) * selectedData.quantity;
        } else {
             promoterDiscount = selectedData.stage.promoterFee * selectedData.quantity;
        }
    }

    return {
      name: eventTicket?.name || 'Ticket',
      quantity: selectedData.quantity,
      price: selectedData.stage.price,
      total: selectedData.quantity * selectedData.stage.price,
      promoterDiscount
    };
  });

  // const totalAmount = mergedTickets.reduce((acc, t) => acc + t.total, 0);

  const effectiveBalance = isPromoter ? (promoterBalance ?? 0) : (clientData?.balance ?? 0);

  let totalWithBalanceDiscount = totalAmount;

  // Restar balance si está marcado
  if (check && effectiveBalance) {
    totalWithBalanceDiscount -= effectiveBalance;
  }

  // Restar pago parcial si corresponde
  if (selectedPayment === "Abrir alcancía" && !check) {
    totalWithBalanceDiscount = partialAmount;
  }

  if (selectedPayment === "Abrir alcancía" && check && effectiveBalance) {
    totalWithBalanceDiscount = partialAmount - effectiveBalance ;
  }

  // No dejar que el total sea negativo
  totalWithBalanceDiscount = Math.max(totalWithBalanceDiscount, 0);

  let totalSubtracted = 0;

  for (const [key, value] of Object.entries(oldSubtracted)) {
    console.log(key)
    totalSubtracted += value.currentSubtracted * value.price;
  }

  const gatewayFee = selectedMethod === "Bold" ? totalAmount * (effectiveFeePercentage / 100) : 0;
  const actualDiscountValue = hasDiscountFlag ? totalAmount * ((eventDiscountAmount || 0) / 100) : 0;
  const totalPromoterDiscount = mergedTickets.reduce((acc, t) => acc + t.promoterDiscount, 0);

  // if (!clientData?.balance) return null;

  // if (check && clientData?.balance >= totalAmount) {
  //   totalWithBalanceDiscount = 0;
  // } else if (check && clientData?.balance < totalAmount) {
  //   totalWithBalanceDiscount = totalAmount - clientData?.balance;
  // }

  const handleClick = () => {
    if (eventDiscountCode && watchedDiscountCode !== eventDiscountCode) {
      notifyError("Código invalido");
      setHasDiscountFlag(false);
      return
    }
    if (eventDiscountCode && watchedDiscountCode === eventDiscountCode) {
      notifySuccess("Código de descuento correcto");
      setHasDiscountFlag(true);
      return
    }
  }

  console.log("pp", isPendingPayment)
  console.log("isChangeTickets", isChangeTickets)

  return (
    <div className="bg-cards-container rounded-lg p-4 space-y-3">
      {mergedTickets.map((ticket, index) => (
        <div key={index} className="flex justify-between border-dashed border-inactive border-b-2 pb-3">
          <span className="text-primary-white/50">{ticket.name} x {ticket.quantity}</span>
          <span className="text-end">${ticket.total.toLocaleString()} COP</span>
        </div>
      ))}
      {
        isPendingPayment &&
        <div className="flex justify-between border-dashed border-inactive border-b-2 pb-3">
          <span className="text-primary-white/50">Saldo pendiente total</span>
          <span className="text-end">${pendingPaymentAmount.toLocaleString()} COP</span>
        </div>
      }
      {
        selectedMethod === "Bold" &&
        <div className="flex justify-between">
          <span className="text-primary-white/50">Comisión Bold</span>
          <span className="text-end">${gatewayFee.toLocaleString()} COP</span>
        </div>
      }
      {
        isChangeTickets &&
        <div className="flex justify-between">
          <span className="text-primary-white/50">Ya pagado</span>
          <span className="text-end">- ${totalSubtracted.toLocaleString()} COP</span>
        </div>
      }
      {
        isPendingPayment && selectedPayment === "Abrir alcancía" && Number(partialAmount) > 0 &&
        <div className="flex justify-between border-dashed border-inactive border-b-2 pb-3">
          <span className="text-primary-white/50">Pago a realizar</span>
          <span className="text-end">${Number(partialAmount).toLocaleString()} COP</span>
        </div>
      }
      {
        hasDiscountFlag &&
        <div className="flex justify-between">
          <span className="text-primary-white/50">Descuento ({eventDiscountAmount}%)</span>
          <span className="text-end">- ${actualDiscountValue.toLocaleString()} COP</span>
        </div>
      }
      {
        isPromoter && totalPromoterDiscount > 0 &&
        <div className="flex justify-between">
          <span className="text-primary-white/50">Comisión promotor</span>
          <span className="text-end">- ${totalPromoterDiscount.toLocaleString()} COP</span>
        </div>
      }
      <div className="flex justify-between text-lg">
        <span className="text-primary-white/50">TOTAL</span>
        {
          !isPendingPayment ?
            <span className="text-end">
              ${ 
                (() => {
                  let finalTotal = 0;
                  if (!isChangeTickets) {
                    if (selectedPayment === "Abrir alcancía") {
                      finalTotal = Number(partialAmount) + gatewayFee;
                      if (check && effectiveBalance) {
                        finalTotal -= effectiveBalance;
                      }
                    } else {
                      finalTotal = totalAmount + gatewayFee - actualDiscountValue - totalPromoterDiscount;
                      if (check && effectiveBalance) {
                        finalTotal -= effectiveBalance;
                      }
                    }
                  } else {
                    finalTotal = totalAmount - totalSubtracted + gatewayFee - totalPromoterDiscount;
                  }
                  return Math.max(finalTotal, 0).toLocaleString();
                })()
              } COP
            </span>
            :
            <span className="text-end">
              ${ 
                (() => {
                  let finalTotal = selectedPayment === "Abrir alcancía" ? Number(partialAmount) : pendingPaymentAmount;
                  finalTotal += gatewayFee;
                  if (check && effectiveBalance) {
                    finalTotal -= effectiveBalance;
                  }
                  return Math.max(finalTotal, 0).toLocaleString();
                })()
              } COP
            </span>

        }
      </div>

      {
       !isChangeTickets && !isPendingPayment &&
        <div className="flex">
          <input
            type="text"
            placeholder="Ingresa el cupón de descuento"
            className="w-full text-sm bg-inactive outline-none rounded-l-lg px-3"
            {...register("discountCode")}
          />
          <div className="bg-inactive rounded-r-lg">
            <button onClick={handleClick} className="bg-primary hover:opacity-80 transition-opacity text-primary-white rounded m-2 px-4 py-2 text-sm">Aceptar</button>
          </div>
        </div>
      }
    </div>
  );
}
