import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";
import { CookieValueTypes } from "cookies-next";

export const createCategory = async ({token, name}: { token: CookieValueTypes, name: string }) => {
  const res = await axios.post(`${BASE_URL}/admin/categories`, {name}, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createCategoryValue = async ({token, value, categoryId}: { token: CookieValueTypes, value: string, categoryId: number }) => {
  const res = await axios.post(`${BASE_URL}/admin/category-values`, {value, categoryId}, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createLabel = async ({token, name, icon}: { token: CookieValueTypes, name: string, icon: string | null }) => {
  const res = await axios.post(`${BASE_URL}/label`, {name, icon}, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createTicketType = async ({token, data}: { token: CookieValueTypes, data: IEventTicket }) => {
  const res = await axios.post(`${BASE_URL}/admin/ticket-types`, data, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  return res.data;
};