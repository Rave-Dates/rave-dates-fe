interface ICreatePayment {
  eventId: number;
  organizerId: number;
  promoterId?: number;
  paymentAmount: number;
  imageUrl: string;
}
interface IPaymentData {
  paymentId: number;
  eventId: number;
  organizerId: number;
  promoterId?: number;
  paymentAmount: number;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

interface IPaymentForm {
  eventId: number | string;
  organizerId: number;
  promoterId?: number;
  paymentAmount: number;
  image: File | undefined;
}
