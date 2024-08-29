import { createAction } from "@reduxjs/toolkit";

export const setKeySearchTicketAgent = createAction<any>(
  "ticket-agent/setKeySearchTicketAgent",
);

export const setListAgentOnline = createAction<{ id: string }[]>(
  "ticket-agent/setListAgent",
);
