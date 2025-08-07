interface IEventPaymentSummary {
  eventId: number;
  total: string;
  feePromoter: string;
  feeRD: string;
  feeOrganizer: string;
  stages: IStageGroup;
  alreadyPaid: number;
  pendingPayment: number;
  movements: IPaymentMovement[];
}

interface IStageGroup {
  eventId: number;
  stages: IStageDetail[];
}

interface IStageDetail {
  quantity: number;
  ticketTypeId: number;
  activeStage: ActiveStage;
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
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}
