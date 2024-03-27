import { createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enums";
import { createTags, getTags } from "./actions";
import { Option } from "constant/types";

export interface Tag {
  id: string;
  name: string;
}

export interface TagState {
  tags: Tag[];
  tagsError: string | undefined | null;
  tagsStatus: DataStatus;
  tagsTotal: number;
}

const initState: TagState = {
  tags: [],
  tagsError: null,
  tagsStatus: DataStatus.IDLE,
  tagsTotal: 0,
};

const tagSlice = createSlice({
  name: "tag",
  initialState: initState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTags.pending, (state, action) => {
        state.tagsStatus = DataStatus.LOADING;
      })
      .addCase(createTags.fulfilled, (state, action) => {
        state.tagsStatus = DataStatus.SUCCEEDED;
        state.tags = [...state.tags, action.payload];
      })
      .addCase(createTags.rejected, (state, action) => {
        state.tagsStatus = DataStatus.FAILED;
        state.tagsError = action.error?.message;
      })
      .addCase(getTags.pending, (state, action) => {
        state.tagsStatus = DataStatus.LOADING;
      })
      .addCase(getTags.fulfilled, (state, action) => {
        state.tagsStatus = DataStatus.SUCCEEDED;
        state.tags = action.payload;
      })
      .addCase(getTags.rejected, (state, action) => {
        state.tagsStatus = DataStatus.FAILED;
        state.tagsError = action.error?.message;
      });
  },
});

export const tagsReducer = tagSlice.reducer;
