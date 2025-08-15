import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";
import { CookieValueTypes } from "cookies-next";

export const getAllEvents = async ({token}: { token: CookieValueTypes }) => {
  const res = await axios.get(`${BASE_URL}/admin/events`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  const data: IEvent[] = res.data;
  return data;
};

export const getEventById = async ({token, id}: { token: CookieValueTypes, id: IEvent["eventId"] }) => {
  const res = await axios.get(`${BASE_URL}/admin/events/${id}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.data;
};


export const createEvent = async (token: CookieValueTypes, data: Partial<IEventForUpdate>) => {
  console.log(data)
  const res = await axios.post(`${BASE_URL}/admin/events`, data, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const editEvent = async (token: CookieValueTypes, id: number, data: Partial<IEventForUpdate>) => {
  const res = await axios.put(`${BASE_URL}/admin/events/${id}`, data, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const createTicketTypes = async (token: CookieValueTypes ,ticket: IEventTicket) => {
  const res = await axios.post(`${BASE_URL}/admin/ticket-types`, ticket, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const editTicketTypes = async (token: CookieValueTypes ,ticket: IEventTicket, id: number) => {
  console.log("ticket",ticket)
  console.log("id",id)
  console.log("token",token)
  const res = await axios.put(`${BASE_URL}/admin/ticket-types/${id}`, ticket, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const getTicketTypesById = async (token: CookieValueTypes, id: number) => {
  const res = await axios.get(`${BASE_URL}/admin/ticket-types/event/${id}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const getTicketMetrics = async (token: CookieValueTypes, eventId: number) => {
  const res = await axios.get(`${BASE_URL}/admin/tickets/metrics/${eventId}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const getPromoterTicketMetrics = async (token: CookieValueTypes, eventId: number, promoterId: number) => {
  const res = await axios.get(`${BASE_URL}/admin/tickets/metrics/${eventId}/promoter/${promoterId}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const getCheckerTicketMetrics = async ({token, eventId}: { token: CookieValueTypes, eventId: number }) => {
  const res = await axios.get(`${BASE_URL}/admin/tickets/metrics/${eventId}/checker`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const createEventCategories = async (token: CookieValueTypes, categoryValueId: { categoryValueId: number; }, eventId: number) => {
  const res = await axios.post(`${BASE_URL}/admin/events/${eventId}/category-value`, categoryValueId, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const editEventCategories = async (token: CookieValueTypes, data: { categoryId: number; oldCategoryValueId: number; newCategoryValueId: number; }, eventId: number) => {
  const res = await axios.put(`${BASE_URL}/admin/events/${eventId}/category-value`, data, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const getEventCategoriesById = async (token: CookieValueTypes, id: number) => {
  const res = await axios.get(`${BASE_URL}/admin/category-values/event/${id}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const createImage = async (
  token: CookieValueTypes,
  data: { eventId: number; file: File }
) => {
  const formData = new FormData();
  if (!data.file) return;
  formData.append("file", data.file);
  formData.append("eventId", String(data.eventId));

  const res = await axios.post(`${BASE_URL}/admin/images`, formData, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return res.data;
};

export const getEventImages = async ({ token, eventId }: { token: CookieValueTypes, eventId: number }) => {
  const res = await axios.get(`${BASE_URL}/admin/images/findByEventId/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getImageById = async ({
  token,
  imageId,
}: {
  token: CookieValueTypes;
  imageId: number;
}) => {
  const res = await axios.get(`${BASE_URL}/admin/images/${imageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  });

  return res.data as Blob;
};

export const assignOrganizerToEvent = async (token: CookieValueTypes, data: { organizerId: number | null | undefined }, eventId: number) => {
  const res = await axios.put(`${BASE_URL}/admin/events/${eventId}/organizer`, data, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const assignPromoterToEvent = async (token: CookieValueTypes, data: { promoters: { promoterId: number }[] }, eventId: number) => {
  const res = await axios.put(`${BASE_URL}/admin/events/${eventId}/promoter`, data, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const deletePromoterEvent = async (token: CookieValueTypes, data: { promoters: { promoterId: number }[] }, eventId: number) => {
  const res = await axios.delete(`${BASE_URL}/admin/events/${eventId}/promoter`, {
    data,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const deleteOrganizerEvent = async (token: CookieValueTypes, data: { organizerId: number | null | undefined }, eventId: number) => {
  const res = await axios.delete(`${BASE_URL}/admin/events/${eventId}/organizer`, {
    data,
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const getOrganizerByEventId = async ({token, eventId}: { token: CookieValueTypes, eventId: number }) => {
  const res = await axios.get(`${BASE_URL}/admin/users/organizer/event/${eventId}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  const data: { organizerId: number | undefined, eventId: number } = res.data;
  return data;
}

export const purchaseComplimentaryTicket = async ({ ticketData, token }: { ticketData: IComplimentaryPurchase, token: CookieValueTypes }) => {
  const { data } = await axios.post(`${BASE_URL}/admin/tickets/purchase/promoter/complimentary`, ticketData, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return data;
}

export const getComplimentaryAvailable = async (token: CookieValueTypes, eventId: number, promoterId: number) => {
  const res = await axios.get(`${BASE_URL}/admin/tickets/complimentary-available?eventId=${eventId}&promoterId=${promoterId}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}
