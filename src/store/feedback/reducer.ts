import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enums";
import { FeedbackData, GetFeedbackDataListQueries, getFeedbacks, respondToFeedback } from "./actions"; // Import respondToFeedback
import { Paging_Feedback } from "constant/types";
import { DEFAULT_PAGING_FEEDBACK } from "constant/index";



export interface FeedbackState {
  feedbacks: FeedbackData[];
  feedbacksError: string | undefined | null;
  feedbacksStatus: DataStatus;
  feedbackPaging: Paging_Feedback
  feedback?: FeedbackData;
  feedbacksFilters: Omit<GetFeedbackDataListQueries, "page" | "size">;
}

const initialState: FeedbackState = {
  feedbacks: [],
  feedbacksError: null,
  feedbacksStatus: DataStatus.IDLE,
  feedbackPaging: DEFAULT_PAGING_FEEDBACK,
  feedbacksFilters: {},
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedbacks.pending, (state, action) => {
        // console.log("Đã vào đây");
        // console.log(action.meta.arg.page);
        // console.log(action.meta.arg.size);
        state.feedbacksStatus = DataStatus.LOADING;
        state.feedbackPaging.page = Number(
          action.meta.arg.page ?? DEFAULT_PAGING_FEEDBACK.page,
        );
        state.feedbackPaging.size = Number(
          action.meta.arg.size ?? DEFAULT_PAGING_FEEDBACK.size,
        );
      })
      .addCase(getFeedbacks.fulfilled, (state, { payload }) => {
        // console.log(payload);
        // console.log(state.feedbacks);
        const { ...paging } = { page: payload.data.page, size: payload.data.size, total_page: payload.data.total_page, totalItems: payload.data.size };
        state.feedbacksStatus = DataStatus.SUCCEEDED;
        const sortedData = payload.data?.data?.sort((a, b) => {
          // Sử dụng toán tử so sánh để so sánh theo thời gian tạo mới nhất
          const timestampA = new Date(a.created_time).getTime();;
          const timestampB = new Date(b.created_time).getTime();
          return timestampB - timestampA;
        });
        state.feedbacks = sortedData;
        state.feedbackPaging = Object.assign(state.feedbackPaging, paging);
      })
      .addCase(getFeedbacks.rejected, (state, action) => {
        state.feedbacksStatus = DataStatus.FAILED;
        state.feedbacksError = action.error?.message;
      })
      .addCase(respondToFeedback.fulfilled, (state, action: PayloadAction<FeedbackData>) => {
        // // console.log("Đã vào đây");
        const indexUpdated = state.feedbacks.findIndex(
          (item) => item.id === action.payload.id,
        );
        // console.log(indexUpdated);

        if (indexUpdated !== -1) {
          state.feedbacks[indexUpdated] = Object.assign(
            state.feedbacks[indexUpdated],
            action.payload,
          );
        }

        if (state.feedback?.id === action.payload.id) {
          state.feedback = action.payload;
        }
      })
  },
});

export const feedbackReducer = feedbackSlice.reducer;
export default feedbackSlice.actions;