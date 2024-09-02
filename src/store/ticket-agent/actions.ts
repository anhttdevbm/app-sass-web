import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { client, Endpoint } from "api";
import { HttpStatusCode } from "constant/enums";
import {
  AN_ERROR_TRY_AGAIN,
  BILLING_API_URL as TICKET_AGENT_API_URL,
} from "constant/index";

export const setKeySearchTicketAgent = createAction<any>(
  "ticket-agent/setKeySearchTicketAgent",
);

export const setListAgentOnline = createAction<{ id: string }[]>(
  "ticket-agent/setListAgent",
);

export const getListAgent = createAsyncThunk(
  "ticket-agent/getAgents",
  async () => {
    try {
      const response = await client.get(
        Endpoint.TICKET_AGENT,
        { page: 1, size: 50, keyword: "" },
        {
          baseURL: TICKET_AGENT_API_URL,
        },
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
);
