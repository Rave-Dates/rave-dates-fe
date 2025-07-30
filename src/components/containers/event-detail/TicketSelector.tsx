import TicketButtons from "@/components/ui/buttons/TicketButtons";
import React from "react";
import TicketsChanger from "../tickets/TicketsChanger";
import TicketsSkeleton from "@/utils/skeletons/event-skeletons/TicketsSkeleton";
import { useTicketStore } from "@/store/useTicketStore";
import { useReactiveCookiesNext } from "cookies-next";
import { useMutation, useQuery } from "@tanstack/react-query";
import { purchaseFreeTicket } from "@/services/clients-tickets";
import { notifyError, notifySuccess } from "@/components/ui/toast-notifications";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { getClientEventById } from "@/services/clients-events";

type Props = {
  isTicketList?: boolean;
  ticketStatus?: "paid" | "pending";
  tickets?: IEventTicket[];
  isLoading?: boolean;
  maxPurchase?: number;
  eventInfo?: { date: string, title: string };
};

const TicketSelector = ({
  isTicketList = false,
  ticketStatus,
  tickets,
  isLoading,
  maxPurchase,
  eventInfo,
}: Props) => {
  const { selected } = useTicketStore();
  const { getCookie } = useReactiveCookiesNext();
  const tempToken = getCookie("tempToken");
  const clientToken = getCookie("clientToken");
  const router = useRouter();
  const params = useParams();
  const eventId = Number(params.eventId);

  const totalQuantity = Object.values(selected).reduce(
    (acc, curr) => acc + curr.quantity,
    0
  );
  const totalPrice = Object.values(selected).reduce(
    (acc, curr) => acc + curr.quantity * curr.stage.price,
    0
  );

  const { data: selectedEvent } = useQuery<IEvent>({
    queryKey: [`selectedEvent-${eventId}`],
    queryFn: () => getClientEventById(eventId),
    enabled: !!eventId,
  });
  
  const { mutate: purchaseFreeTicketMutation } = useMutation({
    mutationFn: purchaseFreeTicket,
    onSuccess: () => {
      notifySuccess("Compra gratuita realizada correctamente");
      router.push('/tickets');
    },
    onError: (e) => {
      console.log(e)
      notifyError("Error al realizar la compra gratuita");
    },
  });

  const handleClick = () => {
    if (selectedEvent?.type === "free") {
      if (!clientToken) return
      const decoded: {id: number, email: string, iat: number, exp: number} = jwtDecode(clientToken);
      
      purchaseFreeTicketMutation({
        ticketData: {
          clientId: decoded.id,
          eventId: eventId,
          tickets: Object.keys(selected).map((ticketTypeId) => ({
            quantity: selected[ticketTypeId].quantity,
            ticketTypeId: Number(ticketTypeId),
          })),
        },
        clientToken: clientToken,
      });
      return
    }
    router.push(tempToken || clientToken ? "/checkout" : "/personal-data");
  }

  return (
    <div>
      <h3
        className={`${
          isTicketList && "hidden"
        } text-lg font-semibold text-white mb-2`}
      >
        Entradas disponibles <span className="text-sm text-text-inactive">(Máximo {maxPurchase})</span>
      </h3>
      {isTicketList ? (
        <>
          { eventInfo && <TicketsChanger eventInfo={eventInfo} ticketStatus={ticketStatus} />}
        </>
      ) : (
        <>
          {isLoading ? (
            <TicketsSkeleton />
          ) : (
            <>
              {tickets?.map((ticket) => (
                <TicketButtons totalQuantity={totalQuantity} maxPurchase={maxPurchase} key={ticket.ticketTypeId} ticket={ticket} />
              ))}
            </>
          )}

          {/* Total */}
          <div className="w-full flex flex-col items-end mb-7 md:mb-0">
            <div className="w-full sm:w-1/2 mb-3">
              <div className="flex justify-between items-center text-white font-bold">
                <span>TOTAL</span>
                <span className="font-light tabular-nums">
                  {totalQuantity > 0
                    ? `$${totalPrice.toLocaleString()} COP`
                    : "0"}
                </span>
              </div>
            </div>

            <button
              tabIndex={totalQuantity === 0 ? -1 : undefined}
              aria-disabled={totalQuantity === 0}
              onClick={handleClick}
              className={`w-full md:w-1/2 text-center py-3 rounded-lg transition-colors ${
                totalQuantity > 0
                  ? "bg-primary hover:bg-primary/70 text-black"
                  : "bg-inactive text-text-inactive pointer-events-none"
              }`}
            >
              {totalQuantity > 0 ? "Comprar tickets" : "Selecciona tickets"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketSelector;
