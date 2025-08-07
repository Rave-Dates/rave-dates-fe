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

export const getClientTicketTypesByEventId = async ({eventId, clientToken}: { eventId: number, clientToken: CookieValueTypes }) => {
  const res = await axios.get(`${BASE_URL}/app/ticket-types/event/${eventId}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${clientToken}`,
    },
  });
  
  const data: IEventTicket[] = res.data;
  return data;
};

export const getTicketFromClientById = async ({pruchaseTicketId, token}: { pruchaseTicketId: number, token: CookieValueTypes }) => {
  const res = await axios.get(`${BASE_URL}/app/tickets/${pruchaseTicketId}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  
  const data: IPurchaseTicket = res.data;
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

export const purchaseFreeTicket = async ({ticketData, clientToken}: { ticketData: IClientPurchaseFreeTicket, clientToken: CookieValueTypes }) => {
  const res = await axios.post(`${BASE_URL}/app/tickets/free`, ticketData, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${clientToken}`,
    },
  });
  return res.data.accessToken;
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

export const getTicketsByPurchaseId = async ({pruchaseId, clientId, clientToken}: { pruchaseId: number, clientId: number, clientToken: CookieValueTypes }) => {
  const res = await axios.get(`${BASE_URL}/app/tickets/change/${pruchaseId}/client/${clientId}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${clientToken}`,
    },
  });
  const data: { ticketType: string, price: number, quantity: number }[] = res.data;
  return data;
};

export const changeTicketPurchase = async ({ticketData, clientToken}: { ticketData: Omit<IClientPurchaseTicket, 'isPartial'>, clientToken: CookieValueTypes }) => {
  const { data } = await axios.post(`${BASE_URL}/app/tickets`, ticketData, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${clientToken}`,
    },
  });
  return data;
};


export const partialPurchase = async ({ticketData, clientToken, purchaseId}: { ticketData: { method: string, boldMethod: string, returnUrl: string }, clientToken: CookieValueTypes, purchaseId: number }) => {
  const { data } = await axios.post(`${BASE_URL}/app/tickets/partial/${purchaseId}`, ticketData, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${clientToken}`,
    },
  });
  return data;
};



