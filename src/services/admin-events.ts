import axios from "axios";
import { CookieValueTypes } from "cookies-next";

const BASE_URL = "http://localhost:3000";

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


export const createEvent = async (token: CookieValueTypes ,data: any) => {
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

export const createTicketTypes = async (token: CookieValueTypes ,ticket: any) => {
  const res = await axios.post(`${BASE_URL}/admin/ticket-types`, ticket, {
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

export const createImage = async (
  token: CookieValueTypes,
  data: { eventId: number; file: File }
) => {
  const formData = new FormData();
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