import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AIAgent, AIAgentState, GetAIAgentListQueries, GetAIAgentsPayload } from "./types";
import { createAgent, deleteAgent, getAgents, updateAgent, uploadAvatar } from "store/aiAgent/actions";
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
  createAgentStatus: DataStatus.IDLE,
  updateAgentStatus: DataStatus.IDLE,

  aiAgent: undefined
};

const aiAgentSlice = createSlice({
  name: "aiAgent",
  initialState,
  reducers: {
    getAgent: (state, action: PayloadAction<string>) => {
      state.aiAgent = state.aiAgents.find((aiAgent) => aiAgent.id === action.payload);
      console.log("aiAgent", state.aiAgent);
    }
  },
  extraReducers: (builder) => {
    // Get ai agents
    builder.addCase(getAgents.pending, (state) => {
      state.getAgentsStatus = DataStatus.LOADING;
    });
    builder.addCase(getAgents.fulfilled,(state, action: PayloadAction<GetAIAgentsPayload>) => {
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
    builder.addCase(deleteAgent.fulfilled, (state) => {
      state.deleteAgentStatus = DataStatus.SUCCEEDED;
    });
    builder.addCase(deleteAgent.rejected, (state) => {
      state.deleteAgentStatus = DataStatus.FAILED;
    });

    // Create ai agent
    builder.addCase(createAgent.pending, (state) => {
      state.createAgentStatus = DataStatus.LOADING;
    });
    builder.addCase(createAgent.fulfilled, (state) => {
      state.createAgentStatus = DataStatus.SUCCEEDED;
    });
    builder.addCase(createAgent.rejected, (state) => {
      state.createAgentStatus = DataStatus.FAILED;
    });

    // Upload avatar
    builder.addCase(uploadAvatar.pending, (state) => {
      state.createAgentStatus = DataStatus.LOADING;
    });
    builder.addCase(uploadAvatar.fulfilled, (state) => {
      state.createAgentStatus = DataStatus.SUCCEEDED;
    });
    builder.addCase(uploadAvatar.rejected, (state) => {
      state.createAgentStatus = DataStatus.FAILED;
    });

    // Update ai agent
    builder.addCase(updateAgent.pending, (state) => {
      state.updateAgentStatus = DataStatus.LOADING;
    });
    builder.addCase(updateAgent.fulfilled, (state, action: PayloadAction<AIAgent>) => {
      state.updateAgentStatus = DataStatus.SUCCEEDED;
      state.aiAgent = action.payload;
    });
    builder.addCase(updateAgent.rejected, (state) => {
      state.updateAgentStatus = DataStatus.FAILED;
    });
  },
});

export const aiAgentReducer = aiAgentSlice.reducer;
export default aiAgentSlice.reducer;
