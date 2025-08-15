interface IUser {
  userId: number;
  name: string;
  email: string;
  isActive: boolean;
  password: string;
  phone: string;
  roleId: number;
  role: {
    roleId: number;
    name: "ADMIN" | "ORGANIZER" | "PROMOTER";
    createdAt: string;
    updatedAt: string;
  };
  checker?: {
    checkerId: number;
    ticketTypeIds: {
      name: string;
      ticketTypeId: number;
      eventId: number;
    }[]
  }
  promoter?: {
    userId: number;
    promoterId?: number;
    organizerId: null;
    fee: number;
    feeType: "fixed" | "percentage";
    events: IPromoterEvent[];
  };
  organizer?: {
    userId: number;
    promoterId?: number;
    organizerId: number | null;
    events: IOrganizerEvent[];
  };
}

type FormValues = {
  [key: `assignedEvent-${number}`]: string;
};

interface ICreateUser {
  userId: number;
  name: string;
  email: string;
  phone: string;
  isActive: boolean;
  password: string;
  roleId: number;
  organizerId?: number;
}

interface IClient {
  clientId?: number;
  name: string;
  email: string;
  whatsapp: string;
  idCard: string;
  balance: number;
  firstLogin: boolean;
}

interface IGuest extends IClient {
  purchaseTickets: Partial<IPurchaseTicket[]>;
  clientId: number;
}

interface ICreateGuest {
  ticketTypeId: number;
  quantity: number;
  clientId: number;
}

interface IFormGuest extends IClient {
  ticketTypeId: number;
  quantity: number;
}

interface IOrganizerEvent extends Partial<IEvent> {
  OrganizerEvent: {
    organizerId: number;
    eventId: number;
  }
}
interface IPromoterEvent extends Partial<IEvent> {
  PromoterEvent: {
    promoterId: number;
    eventId: number;
    url: string | null;
  }
}

interface IUserLogin {
  id: number;
  email: string;
  exp: number;
  iat: number;
  role: string ;
  eventId?: number;
  organizerId?: number | null;
  promoterId?: number | null;
  checkerId?: number | null;
}
