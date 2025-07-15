import { ClientForm } from "@/app/personal-data/page";
import axios from "axios";

const BASE_URL = "http://localhost:3000";

export const createClient = async (data: ClientForm) => {
  const res = await axios.post(`${BASE_URL}/app/clients`, data, {
    headers: {
      "Accept": "application/json",
    },
  });
  return res.data;
};
