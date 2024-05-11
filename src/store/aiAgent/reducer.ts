import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { AIAgent, AIAgentState, GetAIAgentListQueries } from "./types";

const exampleAIAgents: AIAgent[] = Array.from({ length: 20 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `AI Agent ${i + 1}`,
  creationDate: `2021-07-${String(i + 1).padStart(2, "0")}`,
  status: i % 2 === 0 ? "Active" : "Inactive",
}));

const initialState: AIAgentState = {
  aiAgents: [],
  totalAIAgents: 0,
  isReady: false,
  aiAgentFilters: {},
  totalPages: 0,
  page: 1,
  limit: 10,
};

const aiAgentSlice = createSlice({
  name: "aiAgent",
  initialState,
  reducers: {
    getAgents(state, action: PayloadAction<GetAIAgentListQueries>) {
      state.aiAgents = exampleAIAgents;
      state.totalAIAgents = exampleAIAgents.length;
      state.isReady = true;
      state.totalPages = Math.ceil(exampleAIAgents.length / state.limit);
    },
  },
  extraReducers: {},
});

export const aiAgentReducer = aiAgentSlice.reducer;
export default aiAgentSlice.reducer;
export const { actions } = aiAgentSlice;
