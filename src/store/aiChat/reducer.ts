import { createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enums";
import { AN_ERROR_TRY_AGAIN } from "constant/index";
import { getExamplePrompt } from "./actions";
import { AIChatState } from "./type";
import { ItemListResponse } from "constant/types";

const initialState: AIChatState = {
  examplePrompts: [],
  status: DataStatus.IDLE,
  error: "",
  filters: {
    number_prompt: 6,
  },
};

const aiChatSlice = createSlice({
  name: "aiChat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getExamplePrompt.pending, (state) => {
        state.status = DataStatus.LOADING;
      })
      .addCase(getExamplePrompt.fulfilled, (state, { payload }) => {
        const data = payload;
        state.status = DataStatus.SUCCEEDED;
        state.examplePrompts = data;
      })
      .addCase(getExamplePrompt.rejected, (state, action) => {
        state.status = DataStatus.FAILED;
        state.error = action.error?.message ?? AN_ERROR_TRY_AGAIN;
      });
  },
});

export const aiChatReducer = aiChatSlice.reducer;
export default aiChatSlice.reducer;
