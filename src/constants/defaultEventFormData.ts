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
    { ticketId: 1, ticketTypeId: 1, maxDate: yyyyMmDd, eventId: 1 , name: "Ticket 1", stages: [{ stageId: 1, date: yyyyMmDd, dateMax: yyyyMmDd, price: 0, quantity: 0, promoterFee: 0, feeType: "percentage" }] },
    { ticketId: 2, ticketTypeId: 2, maxDate: yyyyMmDd, eventId: 1 , name: "Ticket 2", stages: [{ stageId: 2, date: yyyyMmDd, dateMax: yyyyMmDd, price: 0, quantity: 0, promoterFee: 0, feeType: "percentage" }] },
    { ticketId: 3, ticketTypeId: 3, maxDate: yyyyMmDd, eventId: 1 , name: "Ticket 3", stages: [{ stageId: 3, date: yyyyMmDd, dateMax: yyyyMmDd, price: 0, quantity: 0, promoterFee: 0, feeType: "percentage" }] },
  ],
  feeRD: 0,
  feePB: 0,
  eventCategoryValues: [],
  oldCategories: {},
  transferCost: 0,
  discountCode: '',
  discount: 0,
  discountType: 'percentage',
  maxPurchase: 0,
  maxDate: yyyyMmDd,
  timeOut: 0,
  commission: 0,
  isActive: false,
  labels: [],
};
