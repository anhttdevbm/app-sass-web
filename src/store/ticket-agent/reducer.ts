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
    fields : `["TICKETCREATE" , "TICKETUNSOLVED" , "TICKETSOLVED" , "AVGFIRSTREPLY" , "AGENTONLINE" , "AVGRATESTAR"]`,
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
      (state, action: PayloadAction<any>) => {
        state.keySearch = action.payload;
      },
    );
    builder.addCase(
      setParamsDashboard,
      (state, action: PayloadAction<any>) => {
        state.paramsDashboard = action.payload;
      },
    );
    builder.addCase(
      setListAgentOnline,
      (state, action: PayloadAction<IAgentOnline[]>) => {
        state.listOnline = action.payload;
      },
    );
    builder.addCase(getListAgent.pending, (state, action) => {});
    builder.addCase(getListAgent.fulfilled, (state, action) => {
      state.listAgent = action.payload;
    });
    builder.addCase(getListAgent.rejected, (state, action) => {
      state.listAgent = [];
    });
  },
});

export const ticketAgentReducer = ticketAgentSlice.reducer;
