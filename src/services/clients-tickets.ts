import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";
import { CookieValueTypes } from "cookies-next";

export const getTicketsFromClient = async (clientId: number, token: CookieValueTypes) => {
  console.log("service",token)
  console.log("service",clientId)
  const res = await axios.get(`${BASE_URL}/app/tickets/client/${clientId}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  console.log("response",res.data)
  const data: IPurchaseTicket[] = res.data;
  return data;
};

export const verifyBoldTransaction = async (transactionId: string, token: CookieValueTypes) => {
  const { data } = await axios.post("/api/verify-transaction", transactionId, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return data;
};
