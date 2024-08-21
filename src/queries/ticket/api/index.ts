import { Endpoint } from "api";
import { client, ticketInstance } from "api/client";
import { IFormTicket } from "components/sn-ticket/module/create-ticket/create-ticket-template";
import { BILLING_API_URL as TICKET_API_URL } from "constant/index";

export const createTicketApi = (data: IFormTicket) => {
  const { description, title, requestTicketType, status } = data;
  const formData = {
    description,
    title,
    requestTicketType,
    status,
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
