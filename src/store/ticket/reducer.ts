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
    assign: "",
    creator: "",
    code: "",
    stage: "",
    type: "",
    fromDate: "",
    createTime: "",
    toDate: "",
    priority: "",
    page: 0,
    size: 10,
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
