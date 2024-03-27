import { DataStatus } from "constant/enums";
import { CareerData, GetCareerListQueries, getAllCareer, getCareerBySlug, postCareer, upadteCareer, updateStatusCareer } from "./action";
import { Paging_Career } from "constant/types";
import { AN_ERROR_TRY_AGAIN, DEFAULT_PAGING_CAREER } from "constant/index";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


export interface FeedbackState {
    careers: CareerData[];
    careersError: string | undefined | null;
    careersStatus: DataStatus;
    careersPaging: Paging_Career;
    career?: CareerData;
    careersFilters: Omit<GetCareerListQueries, "page" | "size">;
}

const initialState: FeedbackState = {
    careers: [],
    careersError: null,
    careersStatus: DataStatus.IDLE,
    careersPaging: DEFAULT_PAGING_CAREER,
    careersFilters: {},
};

const careerSlice = createSlice({
    name: "career",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAllCareer.pending, (state, action) => {
                // console.log("Đã vào đây");
                // console.log(action.meta.arg.page);
                // console.log(action.meta.arg.size);
                state.careersStatus = DataStatus.LOADING;
                state.careersPaging.page = Number(
                    action.meta.arg.page ?? DEFAULT_PAGING_CAREER.page,
                );
                state.careersPaging.size = Number(
                    action.meta.arg.size ?? DEFAULT_PAGING_CAREER.size,
                );
            })
            .addCase(getAllCareer.fulfilled, (state, { payload }) => {
                // console.log(payload);
                // console.log(state.feedbacks);
                const { ...paging } = { page: payload.data.page, size: payload.data.size, total_page: payload.data.total_page, totalItems: payload.data.size };
                state.careersStatus = DataStatus.SUCCEEDED;
                const sortedData = payload.data?.data?.sort((a, b) => {
                    // Sử dụng toán tử so sánh để so sánh theo thời gian tạo mới nhất
                    const timestampA = new Date(a.created_time).getTime();;
                    const timestampB = new Date(b.created_time).getTime();
                    return timestampB - timestampA;
                });
                state.careers = sortedData;
                state.careersPaging = Object.assign(state.careersPaging, paging);
            })
            .addCase(getAllCareer.rejected, (state, action) => {
                state.careersStatus = DataStatus.FAILED;
                state.careersError = action.error?.message;
            })
            .addCase(postCareer.fulfilled, (state, { payload }) => {
                // console.log(payload);
                state.careers.unshift(payload);
            })
            .addCase(upadteCareer.fulfilled, (state, action: PayloadAction<CareerData>) => {
                // // console.log("Đã vào đây");
                const indexUpdated = state.careers.findIndex(
                    (item) => item.id === action.payload.id,
                );
                // console.log(indexUpdated);

                if (indexUpdated !== -1) {
                    state.careers[indexUpdated] = Object.assign(
                        state.careers[indexUpdated],
                        action.payload,
                    );
                }

                if (state.career?.id === action.payload.id) {
                    state.career = action.payload;
                }
            }).addCase(getCareerBySlug.fulfilled, (state, action: PayloadAction<CareerData>) => {
                if (state?.career?.id === action.payload.id) {
                    state.career = action.payload;
                }
            }).addCase(updateStatusCareer.rejected, (state, action) => {
                state.careersStatus = DataStatus.FAILED;
              }).addCase(updateStatusCareer.fulfilled, (state, action) => {
                state.careersStatus = DataStatus.SUCCEEDED;
                const updatedList = action.payload;
                state.careers = state.careers.map((career) => {
                  const updatedCareer = updatedList.find((updated) => updated.id === career.id);
                  if (updatedCareer) {
                    return {
                      ...career,
                      ...updatedCareer,
                    };
                  }
                  return career;
                });
              })
              
    },
});


export const CareerReducer = careerSlice.reducer;
export default careerSlice.actions;