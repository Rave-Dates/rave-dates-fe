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