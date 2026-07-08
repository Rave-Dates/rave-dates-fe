import TicketButtons from "@/components/ui/buttons/TicketButtons";
import React from "react";
import TicketsChanger from "../tickets/TicketsChanger";
import TicketsSkeleton from "@/utils/skeletons/event-skeletons/TicketsSkeleton";
import { useTicketStore } from "@/store/useTicketStore";
import { useReactiveCookiesNext } from "cookies-next";
import { useMutation } from "@tanstack/react-query";
import { purchaseFreeTicket } from "@/services/clients-tickets";
import {
  notifyError,
  notifySuccess,
} from "@/components/ui/toast-notifications";
import { useParams, useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useClientEvent } from "@/hooks/client/queries/useClientData";

type Props = {
  isTicketList?: boolean;
  tickets?: IEventTicket[];
  isLoading?: boolean;
  maxPurchase?: number;
  eventInfo?: { date?: string; title?: string; piggyBank?: boolean };
};

const TicketSelector = ({
  isTicketList = false,
  tickets,
  isLoading,
  maxPurchase,
  eventInfo,
}: Props) => {
  const { selected } = useTicketStore();
  const { getCookie, deleteCookie } = useReactiveCookiesNext();
  const tempToken = getCookie("tempToken");
  const clientToken = getCookie("clientToken");
  const router = useRouter();
  const params = useParams();
  const eventId = parseInt(params.eventId as string, 10);
  const { selectedEvent } = useClientEvent(eventId);
  const [isVisible, setIsVisible] = React.useState(false);

  console.log("eventInfo", eventInfo);

  React.useEffect(() => {
    const handleScroll = () => {
      // Aparecer después de 300px de scroll (pasando el hero y el header)
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Verificar posición inicial
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalQuantity = Object.values(selected).reduce(
    (acc, curr) => acc + curr.quantity,
    0,
  );
  const totalPrice = Object.values(selected).reduce(
    (acc, curr) => acc + curr.quantity * curr.stage.price,
    0,
  );

  const { mutate: purchaseFreeTicketMutation } = useMutation({
    mutationFn: purchaseFreeTicket,
    onSuccess: () => {
      deleteCookie("promoterAffiliate", { path: "/" });
      notifySuccess("Compra gratuita realizada correctamente");
      router.push("/tickets");
    },
    onError: (e) => {
      console.log(e);
      notifyError("Error al realizar la compra gratuita");
    },
  });

  const handleClick = () => {
    if (selectedEvent?.type === "free") {
      if (!clientToken) {
        router.push("/personal-data");
        return;
      }
      const decoded: { id: number; email: string; iat: number; exp: number } =
        jwtDecode(clientToken);

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
      return;
    }
    router.push(tempToken || clientToken ? "/checkout" : "/personal-data");
  };

  return (
    <div>
      <h3
        className={`${
          isTicketList && "hidden"
        } ${!eventInfo?.piggyBank && "mb-2"} text-lg font-semibold text-white`}
      >
        Entradas{" "}
        <span className="text-sm text-text-inactive">
          (Máximo {maxPurchase})
        </span>
      </h3>
      {eventInfo?.piggyBank && (
        <p className="text-sm text-text-inactive mb-2">
          *Pago con alcancía disponible
        </p>
      )}
      {isTicketList ? (
        <>{eventInfo && <TicketsChanger eventInfo={eventInfo} />}</>
      ) : (
        <>
          {isLoading ? (
            <TicketsSkeleton />
          ) : (
            <>
              {tickets?.map((ticket) => (
                <TicketButtons
                  totalQuantity={totalQuantity}
                  maxPurchase={maxPurchase}
                  key={ticket.ticketTypeId}
                  ticket={ticket}
                />
              ))}
            </>
          )}

          {/* Total y Botón - Desktop */}
          <div className="hidden md:flex w-full flex-col items-end">
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
                  ? "bg-primary hover:bg-primary/70 text-primary-white"
                  : "bg-inactive text-text-inactive pointer-events-none"
              }`}
            >
              {totalQuantity > 0 ? "Comprar tickets" : "Selecciona tickets"}
            </button>
          </div>

          {/* Total y Botón - Mobile Flotante */}
          <div
            className={`md:hidden fixed bottom-[100px] left-0 right-0 px-6 z-30 transition-all duration-500 ease-in-out ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-20 opacity-0 pointer-events-none"
            }`}
          >
            <div className="bg-[#0D0D0D]/90 backdrop-blur-md border border-divider p-4 rounded-2xl shadow-2xl flex flex-col gap-3">
              <div className="flex justify-between items-center text-white font-bold px-1">
                <span className="text-sm">TOTAL</span>
                <span className="font-light tabular-nums text-lg">
                  {totalQuantity > 0 ? (
                    <div>
                      <span>$</span>
                      <span className="tabular-nums text-primary-white">
                        {totalPrice.toLocaleString()} COP
                      </span>
                    </div>
                  ) : (
                    "0"
                  )}
                </span>
              </div>

              <button
                tabIndex={totalQuantity === 0 ? -1 : undefined}
                aria-disabled={totalQuantity === 0}
                onClick={handleClick}
                className={`w-full text-center py-4 rounded-xl font-bold transition-all active:scale-95 ${
                  totalQuantity > 0
                    ? "bg-primary text-primary-white shadow-lg shadow-primary/20"
                    : "bg-inactive text-text-inactive pointer-events-none"
                }`}
              >
                {totalQuantity > 0 ? "Comprar tickets" : "Selecciona tickets"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TicketSelector;
