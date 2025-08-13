import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";
import { CookieValueTypes } from "cookies-next";

export const readQr = async ({ token, qr, controllerId }: { token: CookieValueTypes | Promise<CookieValueTypes>, qr: string, controllerId: number }) => {
  const res = await axios.post(`${BASE_URL}/admin/tickets/readQr`, { qr, controllerId },{
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.data;
};

export const generateCheckerLink = async ({ eventId, checkerEmail }: { eventId: number, checkerEmail: string }) => {
  const res = await axios.post(`${BASE_URL}/admin/login/generate-checker-link`, { eventId, email: checkerEmail },{
    headers: {
      "Accept": "application/json",
    },
  });
  return res.data;
};

export const updateCheckerTicketTypes = async ({ checkerId, ticketTypeIds, token }: { checkerId: number, ticketTypeIds : number[] , token: CookieValueTypes }) => {
  const res = await axios.put(`${BASE_URL}/admin/users/assign-ticket-type/${checkerId}`, { ticketTypeIds },{
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.data;
};
