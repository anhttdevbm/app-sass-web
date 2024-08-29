// redux/ticketDetail/reducer.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setKeySearchTicketAgent, setListAgentOnline } from "./actions";

interface AgentDetailState {
  keySearch: any;
  listOnline: IAgentOnline[];
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
    size: 4,
  },
  listOnline: [],
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
      setListAgentOnline,
      (state, action: PayloadAction<IAgentOnline[]>) => {
        state.listOnline = action.payload;
      },
    );
  },
});

export const ticketAgentReducer = ticketAgentSlice.reducer;
