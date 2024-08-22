// redux/ticketDetail/reducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  setDataTicketDetail,
  setDataListTicket,
  setKeySearchTicket,
  setCurrentPage,
} from "./actions";

interface TicketDetailState {
  keySearch: any;
  dataListTicket: any;
  dataTicketDetail: any;
  pagination: any;
}

// Initial state
const initialState: TicketDetailState = {
  pagination: {
    page: 0,
    totalItems : 2
  },
  keySearch: {
    keySearch: "",
    priority: "",
    assingn: "",
    ticketType: "",
    createTime: "",
  },
  dataListTicket: null,
  dataTicketDetail: {},
};

const ticketSlice = createSlice({
  name: "ticket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setDataListTicket, (state, action: PayloadAction<any>) => {
        state.dataListTicket = action.payload;
      })
      .addCase(setDataTicketDetail, (state, action: PayloadAction<any>) => {
        state.dataTicketDetail = action.payload;
      })
      .addCase(setKeySearchTicket, (state, action: PayloadAction<any>) => {
        state.keySearch = action.payload;
      })
      .addCase(setCurrentPage, (state, action: PayloadAction<any>) => {
        state.pagination = action.payload;
      })
  },
});

export const ticketReducer = ticketSlice.reducer;
