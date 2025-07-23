import { BASE_URL } from "@/utils/envHelper";
import axios from "axios";
import { CookieValueTypes } from "cookies-next";

export const loginAdmin = async (data: { email: string; password: string }) => {
  console.log(data)
  const res = await axios.post(`${BASE_URL}/admin/login`, data);
  return res.data.accessToken;
};

export const getAllUsers = async ({token}: { token: CookieValueTypes }) => {
  const res = await axios.get(`${BASE_URL}/admin/users?limit=20&page=1&isActive=true`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  const data: IUser[] = res.data.data;
  return data;
};

export const getUserById = async ({token, id}: { token: CookieValueTypes, id: IUser["userId"] }) => {
  const res = await axios.get(`${BASE_URL}/admin/users/${id}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  const data: IUser = res.data;
  return data;
};

export const createUser = async ({token, formData}: { token: CookieValueTypes, formData: Partial<ICreateUser> }) => {
  const res = await axios.post(`${BASE_URL}/admin/users`, formData, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });

  return res.data;
};

export const editUserById = async ({token, id, formData}: { token: CookieValueTypes, id: IUser["userId"], formData: Partial<IUser> }) => {
  const res = await axios.put(`${BASE_URL}/admin/users/${id}`, formData, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteUserById = async ({token, id}: { token: CookieValueTypes, id: IUser["userId"] }) => {
  console.log(id)
  const res = await axios.delete(`${BASE_URL}/admin/users/${id}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  return res.data;
};


