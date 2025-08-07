import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";
import { CookieValueTypes } from "cookies-next";

export const createPaymentImage = async (
  token: CookieValueTypes,
  data: { file: File }
) => {
  const formData = new FormData();
  if (!data.file) return;
  formData.append("file", data.file);

  const res = await axios.post(`${BASE_URL}/admin/images/movement`, formData, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return res.data.url;
};

export const servedMovementImage = async ({ token, url }: { token: CookieValueTypes, url: string }) => {
  const res = await axios.get(`${BASE_URL}/admin/images/movements/${encodeURIComponent(url)}`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    responseType: "blob",
  });

  const imageBlob = res.data;
  const imageObjectURL = URL.createObjectURL(imageBlob);
  return imageObjectURL;
};

export const createPayment = async (token: CookieValueTypes, data: ICreatePayment) => {
  const res = await axios.post(`${BASE_URL}/admin/payments`, data, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const getAllPayments = async ({token}: { token: CookieValueTypes }) => {
  const res = await axios.get(`${BASE_URL}/admin/payments`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.data;
};