// redux/ticketDetail/reducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  setDataTicketDetail,
  setDataListTicket,
  setKeySearchTicket,
} from "./actions";

interface TicketDetailState {
  keySearch: any;
  dataListTicket: any;
  dataTicketDetail: any;
}

// Initial state
const initialState: TicketDetailState = {
  keySearch: {
    keySearch: "",
    priority: "",
    assingn: "",
    ticketType: "",
    createTime: "",
    page: 1,
    size: 5,
    totalItems: 0,
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
      });
  },
});

export const ticketReducer = ticketSlice.reducer;
