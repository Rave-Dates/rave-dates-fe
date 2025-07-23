import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";
import { CookieValueTypes } from "cookies-next";

export const getTicketsFromClient = async (clientId: number, token: CookieValueTypes) => {
  const res = await axios.get(`${BASE_URL}/app/tickets/client/${clientId}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  
  const data: IPurchaseTicket[] = res.data;
  return data;
};

export const initTicketPurchase = async ({ticketData, clientToken}: { ticketData: IClientPurchaseTicket, clientToken: CookieValueTypes }) => {
  const { data } = await axios.post(`${BASE_URL}/app/tickets`, ticketData, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${clientToken}`,
    },
  });
  return data;
};

export const transferTickets = async ({ticketData, purchaseTicketId, clientToken}: { ticketData: ITransferUser, purchaseTicketId: number, clientToken: CookieValueTypes }) => {
  const { data } = await axios.post(`${BASE_URL}/app/tickets/transfer/${purchaseTicketId}`, ticketData, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${clientToken}`,
    },
  });
  return data;
};
