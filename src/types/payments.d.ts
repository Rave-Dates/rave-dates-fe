interface EventPaymentSummary {
  eventId: number;
  total: string;
  feePromoter: string;
  feeRD: string;
  feeOrganizer: string;
  stages: StageGroup;
  alreadyPaid: number;
  pendingPayment: number;
  movements: Movement[];
}

interface StageGroup {
  eventId: number;
  stages: StageDetail[];
}

interface StageDetail {
  quantity: number;
  ticketTypeId: number;
  activeStage: ActiveStage;
}

interface ActiveStage {
  date: string; // formato YYYY-MM-DD
  price: number;
  dateMax: string; // formato YYYY-MM-DD
  feeType: "percentage" | "fixed"; // suponiendo estos tipos
  quantity: number;
  promoterFee: number;
}

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
