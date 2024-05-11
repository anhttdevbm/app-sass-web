import { createAsyncThunk } from "@reduxjs/toolkit";
import { GetAIAgentListQueries } from "./types";

export const getAgents = createAsyncThunk(
  "aiAgent/getAgents",
  async (queries: GetAIAgentListQueries) => {
    // Your code here
  },
);
