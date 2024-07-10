import { createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enums";
import { PromptTemplateState } from "store/promptTemplate/types";
import { getPromptTemplates } from "store/promptTemplate/actions";

const initialState: PromptTemplateState = {
  promptTemplates: {},
  getPromptTemplatesStatus: DataStatus.IDLE,
};

const promptTemplateSlice = createSlice({
  name: "promptTemplate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get prompt templates
    builder.addCase(getPromptTemplates.pending, (state) => {
      state.getPromptTemplatesStatus = DataStatus.LOADING;
    });
    builder.addCase(getPromptTemplates.fulfilled, (state, action) => {
      state.getPromptTemplatesStatus = DataStatus.SUCCEEDED;
      state.promptTemplates = action.payload;
    });
    builder.addCase(getPromptTemplates.rejected, (state) => {
      state.getPromptTemplatesStatus = DataStatus.FAILED;
    });
  },
});

export const promptTemplateReducer = promptTemplateSlice.reducer;
export default promptTemplateSlice.reducer;
