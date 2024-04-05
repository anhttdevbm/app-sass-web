import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Attachment } from "constant/types"
import { DataStatus, PayStatus } from "constant/enums";
import { getHomeBanner, getHomeExplore, getHomePower } from "./actions";
import { AN_ERROR_TRY_AGAIN, DEFAULT_PAGING } from "constant/index";

export interface ExploreData {
    title: string,
    tab_name: string,
    description: string,
    image: Attachment,
    linkCTA: string,
    imageUpload?: File | undefined
}

export interface ContentState {
    banner?: Attachment | null,
    contentStatus: DataStatus,
    contentError?: string,
    explores: ExploreData[]
    powers: ExploreData[]
}

const initialState: ContentState = {
    banner: null,
    contentStatus: DataStatus.IDLE,
    contentError: "",
    explores: [],
    powers: []
}

const contentSlice = createSlice({
    name: "content",
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => 
        builder
            // getHomeBanner
            .addCase(getHomeBanner.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getHomeBanner.fulfilled, (state, action: PayloadAction<Attachment>) => {
                const banner = action.payload;
        
                state.banner = banner
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getHomeBanner.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })
            // getHomeExplore
            .addCase(getHomeExplore.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getHomeExplore.fulfilled, (state, action: PayloadAction<ExploreData[]>) => {
                const explores = action.payload;
        
                state.explores = explores
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getHomeExplore.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })
            // get home power
            .addCase(getHomePower.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getHomePower.fulfilled, (state, action: PayloadAction<ExploreData[]>) => {
                const powers = action.payload;
        
                state.powers = powers
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getHomePower.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })
})

export const { reset } = contentSlice.actions;

export default contentSlice.reducer;