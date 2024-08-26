import { Endpoint } from "api";
import { client, ticketInstance } from "api/client";
import { IFormTicket } from "components/sn-ticket/module/create-ticket/create-ticket-template";
import { BILLING_API_URL as TICKET_API_URL } from "constant/index";

export const createTicketApi = (data: IFormTicket) => {
  const { description, title, type, priority } = data;
  const formData = {
    description,
    title,
    type,
    priority,
    ...data.files,
  };
  return client.post(Endpoint.TICKET, formData, {
    baseURL: TICKET_API_URL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getListTicketApi = (params) => {
  return client.get(Endpoint.TICKET, params, {
    baseURL: TICKET_API_URL,
  });
};

export const getTicketDetailApi = async (id) => {
  const response = await client.get(
    `${Endpoint.TICKET}/detail/${id}`,
    undefined,
    {
      baseURL: TICKET_API_URL,
    },
  );
  return response?.data?.data;
};

export const getListCommentApi = async (id) => {
  const response = await client.get(
    `${Endpoint.TICKET}/comment/${id}?page=0&size=10`,
    undefined,
    {
      baseURL: TICKET_API_URL,
    },
  );
  return response?.data;
};

export const createCommentApi = (data) => {
  return client.post(`${Endpoint.TICKET}/comment/${data?.ticketId}`, data, {
    baseURL: TICKET_API_URL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editCommentApi = (data) => {
  return client.post(
    `${Endpoint.TICKET}/${data?.ticketId}/comment/${data?.commentId}`,
    data,
    {
      baseURL: TICKET_API_URL,
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    },
  );
};

export const deleteCommentApi = (data) => {
  return client.delete(
    `${Endpoint.TICKET}/comment/${data?.ticketId}/${data?.commentId}`,
    {
      baseURL: TICKET_API_URL,
    },
  );
};

export const getListActivity = async ({ id, page, size, isAll }) => {
  const response = await client.get(
    `${Endpoint.TICKET}/activity/${id}`,
    {
      params: { page, size, isAll },
    },
    {
      baseURL: TICKET_API_URL,
    },
  );
  return response?.data;
};

export const updateTicketApi = async (payload) => {
  const mapData = {
    type: payload?.type,
    priority: payload?.priority,
    assign: payload?.assign,
    rootCause: payload?.rootCause,
  };
  console.log("check mapData", mapData);
  const response = await client.put(
    `${Endpoint.TICKET}/detail/${payload.id}`,
    mapData,
    {
      baseURL: TICKET_API_URL,
    },
  );
  return response;
};
