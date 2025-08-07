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
  purchase: IPurchaseData;
  qr: string;
  transferredClientId: number | null;
  ticketType: {
    count: number;
    ticketTypeId: number;
    eventId: number;
    name: string;
    maxDate?: string;
    limit?: number;
    stages: IEventStages[];
  };
}

interface IPurchaseData {
  purchaseId: number;
  clientId: number;
  promoterId: number | null;
  transferredClientId: number | null;
  paymentMethod: 'BOLD' | 'NEQUI' | string;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | string;
  totalAmount: number;
  partialAmount: number | null;
  quantity: number;
  isPartial: boolean;
  referenceId: string;
  purchaseDate: string;
  createdAt: string;
  updatedAt: string;
  meta: {
    event: IEvent
  }
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
  boldMethod: string | string[];
  payWithBalance: boolean;
  returnUrl: string;
}

interface IClientPurchaseFreeTicket {
  clientId: number;
  eventId: number;
  tickets: {
    quantity: number;
    ticketTypeId: number;
  }[];
}

interface ITransferUser {
  name: string;
  email: string;
  whatsapp: string;
  idCard: string;
}
