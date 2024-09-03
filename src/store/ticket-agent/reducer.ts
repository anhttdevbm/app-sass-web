// redux/ticketDetail/reducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  setKeySearchTicketAgent
} from "./actions";

interface AgentDetailState {
  keySearch: any;
}

// Initial state
const initialState: AgentDetailState = {
  keySearch: {
    position: "",
    keyword: "",
    status: "",
    page : 1,
    size: 4,
  },
};

const ticketAgentSlice = createSlice({
  name: "ticket-agent",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(setKeySearchTicketAgent, (state, action: PayloadAction<any>) => {
        state.keySearch = action.payload;
      })
  },
});

export const ticketAgentReducer = ticketAgentSlice.reducer;
