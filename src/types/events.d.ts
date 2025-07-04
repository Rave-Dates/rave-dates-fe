// provisorio
interface IEventCard {
  id: number;
  name: string;
  artist: string;
  date: string;
  location: string;
  venue: string;
  price: number;
  currency: string;
  labels: string[];
  genres: string[];
  images: string[];
  hasPaymentOptions?: boolean;
  status: "paid" | "pending";
}

interface IEvent {
  eventId: number;
  title: string;
  date: string;
  piggyBank: boolean;
  geo: string;
  description: string;
  type: "paid" | "free";
  feeRD: number;
  transferCost: number;
  feePB: number;
  discountCode: string;
  discountType: "percentage" | "fixed";
  discount: number;
  maxPurchase: number;
  timeOut: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: string[];
  labels: number[];
  tickets: IEventCard[];
}
