// redux/ticketDetail/selectors.ts

export const selectTicketDetailData = (state: any) => state.ticket.dataTicketDetail;

export const selectTicketListTicket = (state: any) => state.ticket.dataListTicket;

export const selectSearchTicket = (state: any) => state.ticket.keySearch;

export const selectCurrentPage = (state: any) => state.ticket.pagination;

