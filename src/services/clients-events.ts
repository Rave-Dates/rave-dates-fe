import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";

export const getAllClientEvents = async (
  page: number,
  limit: number,
  filters?: { [key: string]: string }
) => {
  const filterValues = filters ? Object.values(filters).filter(Boolean) : [];
  const filterQuery = filterValues.length > 0 ? `&filters=${filterValues.join(",")}` : "";

  const res = await axios.get(
    `${BASE_URL}/app/events?page=${page}&limit=${limit}${filterQuery}`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  return res.data.data;
};

export const getClientEventById = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/app/events/${id}`, {
    headers: {
      "Accept": "application/json",
    },
  });
  return res.data;
};

export const getEventClientTickets = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/app/ticket-types/event/${id}`, {
    headers: {
      "Accept": "application/json",
    },
  });
  return res.data;
};

export const getClientEventImagesById = async (eventId: number): Promise<IEventImages[]> => {
  const res = await axios.get(`${BASE_URL}/app/images/findByEventId/${eventId}`, {
    headers: {
      "Accept": "application/json",
    },
  });
  return res.data;
};

export const getClientImageById = async (imageId: number) => {
  const res = await axios.get(`${BASE_URL}/app/images/${imageId}`, {
    responseType: "blob",
  });

  return res.data as Blob;
};

export const getAllClientCategories = async () => {
  const res = await axios.get(`${BASE_URL}/app/categories`, {
    headers: {
      "Accept": "application/json",
    },
  });
  
  return res.data;
};

