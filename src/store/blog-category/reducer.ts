import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { GetBlogCategoryListQueries, deleteCategoryBlogs, getAllBlogCategory, postBlogCategory, updateBlogCategory } from "./actions";
import { DataStatus } from "constant/enums";

export type Category = {
    id: string;
    name: string;
}
export type CategoryBlogData = {
    id?: string;
    name?: string;
    slug?: string;
    detail?: string;
    created_time?: Date;
}
export interface CategoryBlogState {
    categories: CategoryBlogData[];
    categoryError: string | undefined | null;
    categoryStatus: DataStatus;
    categoryTotal: number;
    category?: CategoryBlogData;
    categoryFilters: Omit<GetBlogCategoryListQueries, "pageIndex" | "pageSize">;
}

const initialState: CategoryBlogState = {
    categories: [],
    categoryError: null,
    categoryStatus: DataStatus.IDLE,
    categoryTotal: 0,
    categoryFilters: {},

}

export const categorySlice = createSlice({
    name: "blog-category",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder.addCase(
            getAllBlogCategory.pending, (state) => {
                state.categoryStatus = DataStatus.LOADING;
            }
        ).addCase(getAllBlogCategory.fulfilled, (state, { payload }) => {
            state.categoryStatus = DataStatus.SUCCEEDED;
            state.categories = payload;
        }).addCase(getAllBlogCategory.rejected, (state, action) => {
            state.categoryStatus = DataStatus.FAILED;
            state.categoryError = action.error?.message;
        }).addCase(
            postBlogCategory.fulfilled,
            (state, action: PayloadAction<CategoryBlogData>) => {
                state.categories.unshift(action.payload);
            },
        ).addCase(updateBlogCategory.fulfilled, (state, action: PayloadAction<CategoryBlogData>) => {
            const indexUpdated = state.categories.findIndex(
                (item) => item.id === action.payload.id,
            );

            if (indexUpdated !== -1) {
                state.categories[indexUpdated] = Object.assign(
                    state.categories[indexUpdated],
                    action.payload,
                );
            }

            if (state.category?.id === action.payload.id) {
                state.category = action.payload;
            }
        }).addCase(deleteCategoryBlogs.fulfilled,
            (state, action: PayloadAction<string>) => {
                const indexDeleted = state.categories.findIndex(
                    (item) => item.slug === action.payload,
                );
                if (indexDeleted !== -1) {
                    state.categories.splice(indexDeleted, 1);
                }
            },
        )
    },
});

export const categoryBlogReducer = categorySlice.reducer;
export default categorySlice.actions;
