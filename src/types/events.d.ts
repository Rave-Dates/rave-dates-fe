interface IEvent {
  eventId: number;
  title: string;
  date: string;
  place: string;
  piggyBank: boolean;
  geo: string;
  eventCategoryValues: IEventCategoryValue[];
  description: string;
  type: string;
  feeRD: number;
  transferCost: number;
  feePB: number;
  discountCode: string;
  discountType: string;
  discount: number;
  maxPurchase: number;
  timeOut: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  images: string[];
  labels: IEventLabel[];
  tickets: IEventTicket[];
}

interface IEventImages {
  eventId: number;
  imageId: number;
}

interface IEventLabel {
  labelId: number;
  name: string;
  icon?: string | null
}

interface IEventCategoryValue {
  eventId: number;
  categoryId: number;
  valueId: number;
  value: {
    categoryId: number;
    valueId: number;
    value: string;
  };
  category: {
    categoryId: number;
    name: string;
  };
}

interface IEventTicket {
  ticketTypeId: number;
  eventId: number;
  name: string;
  maxDate: string;
  stages: {
    stageId?: string;
    date: string;
    dateMax: string;
    price: number;
    quantity: number;
  }[];
  count?: number;
  limit?: number;
}
