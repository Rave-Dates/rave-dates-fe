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

export const getAllCheckerUsers = async ({token, eventId}: { token: CookieValueTypes | Promise<CookieValueTypes>, eventId: number }) => {
  const res = await axios.get(`${BASE_URL}/admin/clients/checker-list/${eventId}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  const data: IGuest[] = res.data;
  return data;
};

export const getAllPromoters = async ({token, organizerId}: { token: CookieValueTypes, organizerId: number }) => {
  const res = await axios.get(`${BASE_URL}/admin/users/promoters?organizerId=${organizerId}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  const data: IUser[] = res.data;
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

export const getGuests = async ({ token, eventId }: { token: CookieValueTypes, eventId: number }) => {
  const res = await axios.get(`${BASE_URL}/admin/clients/invites/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const createGuest = async ({token, ticketTypeId, quantity, clientId}: ICreateGuest & { token: CookieValueTypes }) => {
  const res = await axios.post(`${BASE_URL}/admin/tickets/invite`, { ticketTypeId, quantity, clientId }, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const updateGuest = async ({token, data, clientId}: { token: CookieValueTypes, data: Partial<IClient>, clientId: number }) => {
  const res = await axios.put(`${BASE_URL}/admin/clients/invite/${clientId}`, data, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const getPromoterLink = async ({ token, eventId, promoterId }: { token: CookieValueTypes, eventId: number, promoterId: number }) => {
  const res = await axios.get(`${BASE_URL}/admin/tickets/promoter-link?promoterId=${promoterId}&eventId=${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getAllCheckers = async ({ token }: { token: CookieValueTypes }) => {
  const res = await axios.get(`${BASE_URL}/admin/users/checkers`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const resendTicketGuest = async ({token, clientId, eventId}: { token: CookieValueTypes, clientId: number, eventId: number }) => {
  const res = await axios.post(`${BASE_URL}/admin/tickets/resend-tickets`, { clientId, eventId }, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  return res.data;
}

export const getCheckerById = async ({token, id}: { token: CookieValueTypes, id: IUser["userId"] }) => {
  const res = await axios.get(`${BASE_URL}/admin/users/checkers/${id}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  const data: IUser = res.data;
  return data;
};

export const getClientByEmail = async ({token, email}: { token: CookieValueTypes, email: string }) => {
  const res = await axios.get(`${BASE_URL}/admin/clients/find?search=${email}`, {
    headers: {
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  const data: IClient = res.data;
  return data;
};