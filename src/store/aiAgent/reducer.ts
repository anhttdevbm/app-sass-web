import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AIAgent, AIAgentState, GetAIAgentListQueries, GetAIAgentsPayload } from "./types";
import { deleteAgent, getAgents } from "store/aiAgent/actions";
import { DataStatus } from "constant/enums";

const initialState: AIAgentState = {
  aiAgents: [],
  totalAIAgents: 0,
  isReady: false,
  aiAgentFilters: {},
  totalPages: 0,
  page: 1,
  limit: 10,

  getAgentsStatus: DataStatus.IDLE,
  deleteAgentStatus: DataStatus.IDLE,

  aiAgent: null,
};

const aiAgentSlice = createSlice({
  name: "aiAgent",
  initialState,
  reducers: {
    // getAgent(state, action: PayloadAction<string>) {
    //   state.aiAgent =
    //     exampleAIAgents.find((aiAgent) => aiAgent.id === action.payload) ||
    //     null;
    // },
  },
  extraReducers: (builder) => {
    // Get ai agents
    builder.addCase(getAgents.pending, (state) => {
      state.getAgentsStatus = DataStatus.LOADING;
    });
    builder.addCase(getAgents.fulfilled, (state, action: PayloadAction<GetAIAgentsPayload>) => {
      const { data, page, size, total_page } = action.payload;

      state.getAgentsStatus = DataStatus.SUCCEEDED;

      state.aiAgents = data;
      state.page = page;
      state.limit = size;
      state.totalPages = total_page;
    });
    builder.addCase(getAgents.rejected, (state) => {
      state.getAgentsStatus = DataStatus.FAILED;
    });

    // Delete ai agent
    builder.addCase(deleteAgent.pending, (state) => {
      state.deleteAgentStatus = DataStatus.LOADING;
    });
    builder.addCase(deleteAgent.fulfilled, (state, action: PayloadAction<string>) => {
      state.deleteAgentStatus = DataStatus.SUCCEEDED;
    });
    builder.addCase(deleteAgent.rejected, (state) => {
      state.deleteAgentStatus = DataStatus.FAILED;
    });
  },
});

export const aiAgentReducer = aiAgentSlice.reducer;
export default aiAgentSlice.reducer;
export const { actions } = aiAgentSlice;
