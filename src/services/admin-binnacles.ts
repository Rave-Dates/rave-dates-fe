import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";
import { CookieValueTypes } from "cookies-next";

export const getAllBinnaclesFromOrganizer = async ({token, organizerId}: { token: CookieValueTypes, organizerId: number }) => {
  const res = await axios.get(`${BASE_URL}/admin/binnacles/organizer/${organizerId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  const data: IEventPaymentSummary[] = res.data;
  return data;
};

export const getAllBinnaclesFromPromoter = async ({token, promoterId}: { token: CookieValueTypes, promoterId: number }) => {
  const res = await axios.get(`${BASE_URL}/admin/binnacles/promoter/${promoterId}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  const data: IEventPaymentSummary[] = res.data;
  return data;
};