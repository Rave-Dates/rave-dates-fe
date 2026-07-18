import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";

export const getAllClientEvents = async (
  page: number,
  limit: number,
  filters?: { [key: string]: string[] },
) => {
  const filterValues = filters
    ? Object.values(filters).flat().filter(Boolean)
    : [];

  // Creamos el objeto de parámetros básicos
  const queryParams: any = {
    page,
    limit,
  };

  // Si hay filtros, los unimos por coma. Axios los codificará automáticamente por ti.
  if (filterValues.length > 0) {
    queryParams.filters = filterValues.join(",");
  }

  const res = await axios.get(`${BASE_URL}/app/events`, {
    params: queryParams, // <--- Axios se encarga de codificar el & en %26 de manera segura
    headers: {
      Accept: "application/json",
    },
  });

  return res.data.data;
};

export const getClientEventById = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/app/events/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });
  return res.data;
};

export const getEventClientTickets = async (id: number) => {
  const res = await axios.get(`${BASE_URL}/app/ticket-types/event/${id}`, {
    headers: {
      Accept: "application/json",
    },
  });
  return res.data;
};

export const getClientEventImagesById = async (
  eventId: number,
): Promise<IEventImages[]> => {
  const res = await axios.get(
    `${BASE_URL}/app/images/findByEventId/${eventId}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );
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
      Accept: "application/json",
    },
  });

  return res.data;
};
