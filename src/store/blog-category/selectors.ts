import { configureStore } from "@reduxjs/toolkit";
import { CategoryBlogData, categoryBlogReducer } from "./reducer";
import { useCallback, useMemo } from "react";
import {  GetBlogCategoryListQueries, deleteCategoryBlogs, getAllBlogCategory, postBlogCategory, updateBlogCategory } from "./actions";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { shallowEqual } from "react-redux";
import { DataStatus } from "constant/enums";

export const useCategoryBlog = () => {
    const dispatch = useAppDispatch();
    const {
        categories: items,
        categoryStatus: status,
        categoryError: error,
        categoryFilters :filters
      } = useAppSelector((state) => state.categoryBlogs, shallowEqual);

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

    const onGetCategoryBlogs = useCallback(
        // async () => {
        //   await dispatch(getAllBlogCategory());
        // },
        // [dispatch],
        async (queries: GetBlogCategoryListQueries) => {
          await dispatch(getAllBlogCategory(queries));
        },
        [dispatch],
      );
    const onCreateNewCategory = useCallback(
        async (data: CategoryBlogData) => {
            return await dispatch(postBlogCategory(data)).unwrap();
        },
        [dispatch],
    );
    const onUpdateCategoryBlog = useCallback (
        async (id: string, category: CategoryBlogData) => {
            try {
                return await dispatch(updateBlogCategory({ id,category })).unwrap();
            } catch (error) {
                throw error;
            }
        },[dispatch]
    )

    const onDeleteCategoryBlog = useCallback(
        async (id: string) => {
          try {
            return await dispatch(deleteCategoryBlogs(id)).unwrap();
          } catch (error) {
            throw error;
          }
        },
        [dispatch],
      );

      const onGetOptions = useCallback(
        async (queries: GetBlogCategoryListQueries) => {
          await dispatch(getAllBlogCategory(queries));
        },
        [dispatch],
      );

    return {
        onCreateNewCategory,
        onUpdateCategoryBlog,
        onDeleteCategoryBlog,
        onGetCategoryBlogs,
        items,
        error,
        status,
        isIdle,
        isFetching,
        filters,
        onGetOptions
    };
}
