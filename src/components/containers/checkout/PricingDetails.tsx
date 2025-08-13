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
  selectedPayment: "Pago total" | "Abonar a la alcancía";
  partialAmount: number;
  totalAmount: number;
  eventDiscountCode: string | undefined;
  watchedDiscountCode: string;
  setHasDiscountFlag: React.Dispatch<React.SetStateAction<boolean>>;
  hasDiscountFlag: boolean;
  eventDiscountAmount: number | undefined;
};

export default function PricingDetails({check, clientData, selectedPayment, partialAmount, totalAmount, register, eventDiscountCode, watchedDiscountCode, setHasDiscountFlag, hasDiscountFlag, eventDiscountAmount} : Props) {
  const { selected, eventId } = useTicketStore();
  const { eventTickets } = useClientEventTickets(eventId);
  const searchParams = useSearchParams();
  const isChangeTickets = searchParams.get("change-tickets");
  const { 
    oldSubtracted
  } = useChangeTicketStore();

  const mergedTickets = Object.entries(selected).map(([ticketTypeIdStr, selectedData]) => {
    const ticketTypeId = Number(ticketTypeIdStr);

    const eventTicket = eventTickets?.find(t => t.ticketTypeId === ticketTypeId);

    return {
      name: eventTicket?.name || 'Ticket',
      quantity: selectedData.quantity,
      price: selectedData.stage.price,
      total: selectedData.quantity * selectedData.stage.price,
    };
  });

  // const totalAmount = mergedTickets.reduce((acc, t) => acc + t.total, 0);

  let totalWithBalanceDiscount = totalAmount;

  // Restar balance si está marcado
  if (check && clientData?.balance) {
    totalWithBalanceDiscount -= clientData.balance;
  }

  // Restar pago parcial si corresponde
  if (selectedPayment === "Abonar a la alcancía" && !check) {
    totalWithBalanceDiscount = partialAmount;
  }

  if (selectedPayment === "Abonar a la alcancía" && check && clientData?.balance) {
    totalWithBalanceDiscount = partialAmount - clientData.balance ;
  }

  // No dejar que el total sea negativo
  totalWithBalanceDiscount = Math.max(totalWithBalanceDiscount, 0);

  let totalSubtracted = 0;

  for (const [key, value] of Object.entries(oldSubtracted)) {
    console.log(key)
    totalSubtracted += value.currentSubtracted * value.price;
  }

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

  return (
    <div className="bg-cards-container rounded-lg p-4 space-y-3">
      {mergedTickets.map((ticket, index) => (
        <div key={index} className="flex justify-between border-dashed border-inactive border-b-2 pb-3">
          <span className="text-primary-white/50">{ticket.name} x {ticket.quantity}</span>
          <span className="text-end">${ticket.total.toLocaleString()} COP</span>
        </div>
      ))}

      <div className="flex justify-between">
        <span className="text-primary-white/50">Servicio</span>
        <span className="text-end">$0 COP</span>
      </div>
      {
        isChangeTickets &&
        <div className="flex justify-between">
          <span className="text-primary-white/50">Ya pagado</span>
          <span className="text-end">- ${totalSubtracted.toLocaleString()} COP</span>
        </div>
      }
      {
        hasDiscountFlag &&
        <div className="flex justify-between">
          <span className="text-primary-white/50">Descuento</span>
          <span className="text-end">- ${eventDiscountAmount?.toLocaleString()} COP</span>
        </div>
      }
      <div className="flex justify-between text-lg">
        <span className="text-primary-white/50">TOTAL</span>
        <span className="text-end">
          ${ 
            !isChangeTickets 
              ? (totalWithBalanceDiscount - (hasDiscountFlag && totalWithBalanceDiscount !== 0 && eventDiscountAmount ? eventDiscountAmount : 0)).toLocaleString() 
              : (totalAmount - totalSubtracted).toLocaleString()
          } COP
        </span>
      </div>

      {
        !isChangeTickets &&
        <div className="flex">
          <input
            type="text"
            placeholder="Ingresa el cupón de descuento"
            className="w-full text-sm bg-inactive outline-none rounded-l-lg px-3"
            {...register("discountCode")}
          />
          <div className="bg-inactive rounded-r-lg">
            <button onClick={handleClick} className="bg-primary hover:opacity-80 transition-opacity text-black rounded m-2 px-4 py-2 text-sm">Aceptar</button>
          </div>
        </div>
      }
    </div>
  );
}
