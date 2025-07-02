import axios from "axios";
import { CookieValueTypes } from "cookies-next";

const BASE_URL = "http://localhost:3000";

export const getAllRoles = async ({token}: { token: CookieValueTypes }) => {
  const res = await axios.get(`${BASE_URL}/admin/roles`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.data;
};