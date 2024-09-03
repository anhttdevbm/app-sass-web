import { Endpoint } from "api";
import { client, ticketInstance } from "api/client";
import { IFormTicket } from "components/sn-ticket/module/create-ticket/create-ticket-template";
import { BILLING_API_URL as TICKET_API_URL } from "constant/index";

export const createTicketApi = (data) => {
  return client.post(Endpoint.TICKET, data, {
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
    `${Endpoint.TICKET}/comment/${id}?page=0&size=50`,
    undefined,
    {
      baseURL: TICKET_API_URL,
    },
  );
  return response?.data;
};

export const createCommentApi = (data) => {
  const ticketId = data.get("ticketId"); // Get the value associated with the "name" key
  return client.post(`${Endpoint.TICKET}/comment/${ticketId}`, data, {
    baseURL: TICKET_API_URL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const editCommentApi = (data) => {
  return client.put(
    `${Endpoint.TICKET}/comment/${data?.ticketId}/${data?.commentId}`,
    { comment: data?.comment ?? "", isIternal: data?.isIternal },
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
  const params = { page, size, isAll };
  const response = await client.get(
    `${Endpoint.TICKET}/activity/${id}`,
    params,
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

  const response = await client.put(
    `${Endpoint.TICKET}/detail/${payload.id}`,
    mapData,
    {
      baseURL: TICKET_API_URL,
    },
  );
  return response;
};

export const sendReplyApi = (data) => {
  const formData = {
    email: data?.email,
    title: data?.title,
    content: data?.content,
    files: data?.files,
  };
  return client.post(`${Endpoint.TICKET}/reply/${data.id}`, formData, {
    baseURL: TICKET_API_URL,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getListReplyApi = async (id) => {
  const response = await client.get(
    `${Endpoint.TICKET}/reply/${id}`,
    {
      page: 1,
      size: 25,
    },
    {
      baseURL: TICKET_API_URL,
    },
  );
  return response;
};
