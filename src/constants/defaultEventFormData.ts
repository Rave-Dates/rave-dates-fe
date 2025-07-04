const today = new Date();
const yyyyMmDd = today.toISOString().split('T')[0];

export const defaultEventFormData = {
  title: '',
  date: '',
  geo: '',
  description: '',
  type: 'paid',
  tickets: [
    { ticketId: 1, eventId: '' , name: null, stages: [{ stageId: 1, date: yyyyMmDd, dateMax: 0, price: 0, quantity: 0 }] },
    { ticketId: 2, eventId: '' , name: null, stages: [{ stageId: 2, date: yyyyMmDd, dateMax: 0, price: 0, quantity: 0 }] },
    { ticketId: 3, eventId: '' , name: null, stages: [{ stageId: 3, date: yyyyMmDd, dateMax: 0, price: 0, quantity: 0 }] },
  ],
  feeRD: 0,
  feePB: 100,
  transferCost: 0,
  discountCode: '',
  discount: 0,
  discountType: 'percentage',
  maxPurchase: 0,
  timeOut: 0,
  commission: null,
  isActive: false,
  labels: [],
};
