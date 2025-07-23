export interface EventPaymentSummary {
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

export interface StageGroup {
  eventId: number;
  stages: StageDetail[];
}

export interface StageDetail {
  quantity: number;
  ticketTypeId: number;
  activeStage: ActiveStage;
}

export interface ActiveStage {
  date: string; // formato YYYY-MM-DD
  price: number;
  dateMax: string; // formato YYYY-MM-DD
  feeType: "percentage" | "fixed"; // suponiendo estos tipos
  quantity: number;
  promoterFee: number;
}

export interface Movement {
  paymentId: number;
  eventId: number;
  organizerId: number;
  promoterId: number;
  userId: number;
  paymentAmount: number;
  imageUrl: string;
  createdAt: string; // formato ISO
  updatedAt: string; // formato ISO
}
