import axios from "axios";
import { CookieValueTypes } from "cookies-next";

const BASE_URL = "http://localhost:3000";

export const getAllClientEvents = async (page: number, limit: number) => {
  const res = await axios.get(`${BASE_URL}/app/events?page=${page}&limit=${limit}`, {
    headers: {
      "Accept": "application/json",
    },
  });

  console.log("res",res.data.data)
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