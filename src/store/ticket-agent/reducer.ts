/* eslint-disable @typescript-eslint/no-explicit-any */
// redux/ticketDetail/reducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  getListAgent,
  setKeySearchTicketAgent,
  setListAgentOnline,
  setParamsDashboard,
} from "./actions";

interface AgentDetailState {
  keySearch: any;
  listOnline: IAgentOnline[];
  listAgent: any[];
  paramsDashboard: any
}

export interface IAgentOnline {
  id: string;
}

// Initial state
const initialState: AgentDetailState = {
  keySearch: {
    position: "",
    keyword: "",
    status: "",
    page: 1,
    size: 5,
  },
  paramsDashboard : {
    createTime : "year" ,
    fromDate : "" ,
    toDate : "" ,
    startDate : "",
    startDateAvgTicket : "" ,
    fields : "",

  },
  listOnline: [],
  listAgent: [],

};

const ticketAgentSlice = createSlice({
  name: "ticket-agent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      setKeySearchTicketAgent,
      (state, action: PayloadAction<{ position: string; keyword: string; status: string; page: number; size: number }>) => {
        state.keySearch = action.payload;
      },
    );
    builder.addCase(
      setParamsDashboard,
      (state, action: PayloadAction<{ createTime: string; fromDate: string; toDate: string; startDate: string; startDateAvgTicket: string; fields: string }>) => {
        state.paramsDashboard = action.payload;
      },
    );
    builder.addCase(
      setListAgentOnline,
      (state, action: PayloadAction<IAgentOnline[]>) => {
        state.listOnline = action.payload;
      },
    );
    builder.addCase(getListAgent.pending, (state, action) => {
      // Handle pending state if needed
    });
    builder.addCase(getListAgent.fulfilled, (state, action) => {
      state.listAgent = action.payload;
    });
    builder.addCase(getListAgent.rejected, (state, action) => {
      state.listAgent = [];
    });
  },
});

export const ticketAgentReducer = ticketAgentSlice.reducer;
