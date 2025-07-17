import { ClientForm } from "@/app/personal-data/page";
import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";

export const createClient = async (data: ClientForm) => {
  const res = await axios.post(`${BASE_URL}/app/clients`, data, {
    headers: {
      "Accept": "application/json",
    },
  });
  return res.data.accessToken;
};

export const initLoginClient = async (email: {email: string}) => {
  const res = await axios.post(`${BASE_URL}/app/login/init`, email, {
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
