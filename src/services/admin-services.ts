import axios from "axios";
import { CookieValueTypes } from "cookies-next";

const BASE_URL = "http://localhost:3000";

export const loginAdmin = async (data: { email: string; password: string }) => {
  const res = await axios.post(`${BASE_URL}/admin/login`, data);
  return res.data.accessToken;
};

export const getAllUsers = async ({token}: { token: CookieValueTypes }) => {
  const res = await axios.get(`${BASE_URL}/admin/users?limit=20&page=1`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  const data: IUser[] = res.data.data;
  return data;
};
