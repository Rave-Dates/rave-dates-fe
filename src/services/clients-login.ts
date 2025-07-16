import { ClientForm } from "@/app/personal-data/page";
import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";

export const createClient = async (data: ClientForm) => {
  const res = await axios.post(`${BASE_URL}/app/clients`, data, {
    headers: {
      "Accept": "application/json",
    },
  });
  return res.data;
};
