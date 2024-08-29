// redux/ticketDetail/selectors.ts

export const selectSearchTicketAgent = (state: any) =>
  state.ticketAgent.keySearch;

export const selectListAgentOnline = (state) => state?.ticketAgent.listOnline;
