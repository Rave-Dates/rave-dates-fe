interface IEventCard {
  id: number;
  artist: string;
  date: string;
  location: string;
  venue: string;
  price: number;
  currency: string;
  images: string[];
  hasPaymentOptions?: boolean;
}