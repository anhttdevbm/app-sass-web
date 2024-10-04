import { Endpoint } from "api";
import { client, ticketInstance } from "api/client";

import { BILLING_API_URL as TICKET_AGENT_API_URL } from "constant/index";

type PayloadCreate = {
  nameUser: string;
  username: string;
  email: string;
  phone: string;
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

  return client.post(Endpoint.TICKET_AGENT, formData, {
    baseURL: TICKET_AGENT_API_URL,
  });
};

export const getListAgent = (params) => {
  return client.get(Endpoint.TICKET_AGENT, params, {
    baseURL: TICKET_AGENT_API_URL,
  });
};

export const updateAgentApi = async (payload) => {
  const mapData = {
    nameUser : payload?.nameUser ,
    email : payload?.email ,
    phone : payload?.phone
  }
  console.log("check mapData", mapData)

  return await client.put(`${Endpoint.TICKET_AGENT}/${payload.id}`, mapData , {
    baseURL: TICKET_AGENT_API_URL,
  });
};

export const removeAgentApi = async (id) => {
  return await client.delete(`${Endpoint.TICKET_AGENT}/${id}` , {
    baseURL: TICKET_AGENT_API_URL,
  });
};


export const getDashBoardApi = async (params) => {
  return client.get(Endpoint.TICKET_DASHBOARD, params, {
    baseURL: TICKET_AGENT_API_URL,
  });
}