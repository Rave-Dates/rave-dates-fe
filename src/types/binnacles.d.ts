interface IEventPaymentSummary {
  eventId: number;
  total: string;
  feePromoter: string;
  feeRD: string;
  feeOrganizer: string;
  stages: IStageDetail[][]; // <- array de arrays
  alreadyPaid: number;
  pendingPayment: number;
  movements: IPaymentMovement[];
}

interface IEventPromoterPaymentSummary {
  events: IEventPaymentSummary[];
  movements: IPaymentMovement[];
  total: number;
  alreadyPaid: number;
  pendingPayment: number;
}

interface IStageDetail {
  quantity: number;
  ticketTypeId: number;
  ticketType: string;
  dateMax: string;
  date: string;
  price: number;
}

interface ActiveStage {
  date: string;
  price: number;
  dateMax: string;
  feeType: "percentage" | "fixed";
  quantity: number;
  promoterFee: number;
}

interface IPaymentMovement {
  paymentId: number;
  eventId: number;
  organizerId: number;
  promoterId: number | null;
  userId: number;
  paymentAmount: number;
  reference: string | null;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}
