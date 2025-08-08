import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";
import { CookieValueTypes } from "cookies-next";

export const readQr = async ({ token, qr, controllerId }: { token: CookieValueTypes, qr: string, controllerId: number }) => {
  const res = await axios.post(`${BASE_URL}/admin/tickets/readQr`, { qr, controllerId },{
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.data;
};