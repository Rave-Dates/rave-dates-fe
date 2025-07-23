interface IEvent {
  eventId?: number;
  title: string;
  subtitle: string;
  date: string;
  piggyBank: boolean;
  geo: string;
  eventCategoryValues: IEventCategoryValue[];
  description: string;
  type: 'free' | 'paid';
  feeRD: number;
  transferCost: number;
  feePB: number;
  commission?: number;
  discountCode: string;
  discountType: string;
  discount: number;
  maxDate: string;
  maxPurchase: number;
  timeOut: number;
  isActive: boolean;
  labels: IEventLabel[];
  organizer?: {
    userId: number;
    organizerId: number;
    events: IOrganizerEvent[];
  };
  promoters?: {
    promoterId?: number;
    userId: number;
    organizerId: null;
    fee: number;
    feeType: "fixed" | "percentage";
    events: IPromoterEvent[];
  }[];
}

interface IEventFormData extends Partial<IEvent> {
  categories?: [];
  time?: string;
  editPlace?: string;
  categoriesToUpdate?: ({ categoryId: number; oldCategoryValueId: number; newCategoryValueId: number } | null)[];
  place?: string;
  images: IImageData[];
  oldCategories?: {
    [key: string]: string; // o más estrictamente: Record<number, string>
  };
  tickets: IEventTicket[]; // solo para el form
}

interface IEventForUpdate extends Partial<IEventFormData>, Omit<IEventFormData, 'labels'> {
  labels: number[];
}

interface IEventImages {
  eventId: number;
  imageId: number;
}

interface IImageData {
  id: string;
  url: string;
  file?: File;
}

interface IEventLabel {
  labelId: number;
  name?: string;
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
  ticketId?: number; // para uso interno
  ticketTypeId?: number;
  eventId?: number;
  name: string;
  maxDate: string;
  stages: IEventStages[];
  count?: number;
  limit?: number;
}

interface IEventStages {
  stageId?: number;
  date: string;
  dateMax: string;
  price: number;
  quantity: number;
  promoterFee: number;
  feeType?: "percentage" | "fixed";
}

interface IEventCategories {
  categoryId: number;
  name: string;
  values: {
    valueId: number;
    categoryId: number;
    value: string;
  }[];
}
