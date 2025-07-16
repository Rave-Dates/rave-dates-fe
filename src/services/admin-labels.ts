import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";
import { CookieValueTypes } from "cookies-next";

export const getAllLabels = async ({token}: { token: CookieValueTypes }) => {
  const res = await axios.get(`${BASE_URL}/label`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.data;
};