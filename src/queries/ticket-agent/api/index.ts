import { Endpoint } from "api";
import { client, ticketInstance } from "api/client";

import { BILLING_API_URL as TICKET_AGENT_API_URL } from "constant/index";

type PayloadCreate = {
  nameUser: string;
  username: string;
  email: string;
  phone: number;
  password: string;

}
export const createAgentApi = (data : PayloadCreate) => {
  const { nameUser, username, email, phone ,  password} = data;

  const formData = {
    nameUser,
    username,
    email,
    phone,
    password,
  };
  console.log("check formData" , formData)
  return client.post(Endpoint.TICKET_AGENT, formData, {
    baseURL: TICKET_AGENT_API_URL,
  });
};

export const getListTicketApi = (params) => {
  return client.get(Endpoint.TICKET_AGENT, params, {
    baseURL: TICKET_AGENT_API_URL,
  });
};
