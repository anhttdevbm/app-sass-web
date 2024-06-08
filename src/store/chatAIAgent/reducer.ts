import { ChatAIAgentState } from "store/chatAIAgent/types";
import { DataStatus } from "constant/enums";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ChatAIAgentState = {
  chatData: [],
  chatAIStatus: DataStatus.IDLE,
};

const chatAIAgent = createSlice({
  name: "chatAIAgent",
  initialState,
  reducers: {
    setChatData: (state, action) => {
      state.chatData = action.payload;
    },
    setChatAIStatus: (state, action) => {
      state.chatAIStatus = action.payload;
    },
  },
});

export const chatAIAgentReducer = chatAIAgent.reducer;
export default chatAIAgent.reducer;
