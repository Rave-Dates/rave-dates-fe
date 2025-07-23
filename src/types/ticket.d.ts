// PROVISIONAL BORRAR interface Ticket
interface Ticket {
  id: number
  type: string
  userName: string
  actions: ("send" | "download" | "view")[]
  transferred: boolean
  price: number;
  quantity: number;
}

/** Purchased ticket interface */
interface IPurchaseTicket {
  purchaseTicketId: number;
  purchaseId: number;
  ticketTypeId: number;
  status: 'PENDING' | 'READ' | 'DEFEATED';
  checkerId: number | null;
  isTransferred: boolean;
  clientId: number;
  createdAt: string;
  updatedAt: string;
  ticketType: {
    ticketTypeId: number;
    eventId: number;
    name: string;
    stages: IEventStages[];
    event: IEvent;
  };
}

interface IClientPurchaseTicket {
  method: "NEQUI" | "BOLD";
  clientId: number;
  tickets: {
    quantity: number;
    ticketTypeId: number;
  }[];
  isPartial: boolean;
  amount?: number;
  promoterId?: number;
  eventId: number;
  boldMethod: string;
  returnUrl: string;
}
