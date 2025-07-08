import { formatDate } from "@/utils/formatDate";

const today = new Date();
const yyyyMmDd = formatDate(today);

export const defaultEventFormData = {
  title: '',
  date: '',
  geo: '',
  place: '',
  description: '',
  type: 'paid',
  images: [],
  tickets: [
    { ticketId: 1, eventId: '' , name: "Ticket 1", stages: [{ stageId: 1, date: yyyyMmDd, dateMax: 0, price: 0, quantity: 0 }] },
    { ticketId: 2, eventId: '' , name: "Ticket 2", stages: [{ stageId: 2, date: yyyyMmDd, dateMax: 0, price: 0, quantity: 0 }] },
    { ticketId: 3, eventId: '' , name: "Ticket 3", stages: [{ stageId: 3, date: yyyyMmDd, dateMax: 0, price: 0, quantity: 0 }] },
  ],
  feeRD: 0,
  feePB: 100,
  transferCost: 0,
  discountCode: '',
  discount: 0,
  discountType: 'percentage',
  maxPurchase: 0,
  maxDate: 0,
  timeOut: 0,
  commission: 0,
  isActive: false,
  labels: [],
};
