import axios from "axios";
import { CookieValueTypes } from "cookies-next";

const BASE_URL = "http://localhost:3000";

export const getCategoryValues = async ({token, id}: { token: CookieValueTypes, id: number }) => {
  const res = await axios.get(`${BASE_URL}/admin/category-values/${id}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.data;
};