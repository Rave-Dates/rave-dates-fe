import axios from "axios";
import { CookieValueTypes } from "cookies-next";

const BASE_URL = "http://localhost:3000";

export const getAllEvents = async ({token}: { token: CookieValueTypes }) => {
  const res = await axios.get(`${BASE_URL}/admin/events`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  const data: IEvent[] = res.data;
  return data;
};