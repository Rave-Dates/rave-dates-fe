import { formatDate } from "@/utils/formatDate";

const today = new Date();
const yyyyMmDd = formatDate(today);

export const defaultEventFormData: IEventFormData = {
  title: '',
  subtitle: '',
  date: "",
  time: "",
  geo: '',
  place: '',
  description: '',
  type: "paid",
  images: [],
  tickets: [
    { ticketId: 1, ticketTypeId: 1, maxDate: yyyyMmDd, eventId: 1 , name: "Ticket 1", stages: [{ stageId: 1, date: yyyyMmDd, dateMax: yyyyMmDd, price: undefined, quantity: undefined, promoterFee: undefined, feeType: "fixed" }] },
  ],
  feeRD: undefined,
  feePB: undefined,
  eventCategoryValues: [],
  oldCategories: {},
  transferCost: undefined,
  discountCode: '',
  discount: undefined,
  discountType: 'fixed',
  maxPurchase: undefined,
  maxDate: yyyyMmDd,
  timeOut: undefined,
  commission: undefined,
  isActive: false,
  quantityComplimentaryTickets: undefined,
  labels: [],
  formPromoters: [],
  promoters: [],
};
