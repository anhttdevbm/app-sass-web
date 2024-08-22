import { createAction } from '@reduxjs/toolkit';

export const setDataTicketDetail = createAction<any>('ticket/setDataTicketDetail');

export const setDataListTicket = createAction<any>('ticket/setDataListTicket');

export const setKeySearchTicket = createAction<any>('ticket/setKeySearchTicket');

export const setCurrentPage = createAction<any>('ticket/setCurrentPage');


