import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";
import { CookieValueTypes } from "cookies-next";

export const createClient = async (data: IClient) => {
  const res = await axios.post(`${BASE_URL}/app/clients`, data, {
    headers: {
      "Accept": "application/json",
    },
  });
  return res.data.accessToken;
};

export const initLoginClient = async ({email, method}: {email: string, method: "EMAIL" | "WHATSAPP"}) => {
  const res = await axios.post(`${BASE_URL}/app/login/init`, {email, method}, {
    headers: {
      "Accept": "application/json",
    },
  });
  return res.data.accessToken;
};

export const verifyLoginClient = async (data: { email: string; pin: string }) => {
  const res = await axios.post(`${BASE_URL}/app/login`, data, {
    headers: {
      "Accept": "application/json",
    },
  });
  return res.data.accessToken;
};

export const getClientById = async ({id, token}: {id: number, token: CookieValueTypes}) => {
  const res = await axios.get(`${BASE_URL}/app/clients/${id}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.data;
};

export const editClient = async ({id, formData, token}: {id: number, formData: Partial<IClient>, token: CookieValueTypes}) => {
  const res = await axios.put(`${BASE_URL}/app/clients/${id}`, formData, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.data;
};

export const forgotPasswordAdmin = async (email: string) => {
  const res = await axios.post(`${BASE_URL}/admin/login/forgot-password`, { email }, {
    headers: { "Accept": "application/json" },
  });
  return res.data;
};

export const recoverPasswordAdmin = async (data: { email: string; pin: string; newPassword: string }) => {
  const res = await axios.post(`${BASE_URL}/admin/login/recover-password`, data, {
    headers: { "Accept": "application/json" },
  });
  return res.data;
};

export const changePasswordAdmin = async (data: { email: string; oldPassword: string; newPassword: string }) => {
  const res = await axios.post(`${BASE_URL}/admin/login/change-password`, data, {
    headers: { "Accept": "application/json" },
  });
  return res.data;
};