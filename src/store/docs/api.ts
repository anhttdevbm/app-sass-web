"use client";

import { createApi } from "@reduxjs/toolkit/query/react";
import { AxiosRequestConfig } from "axios";
import { DOCS_API_URL } from "constant/index";
import { IDocument, IComment, TPagination } from "constant/types";
import axiosBaseQuery from "store/axiosBaseQuery";

const TagTypes = ["Documents", "Comments"] as const;

const documentApi = createApi({
  reducerPath: "docApi",
  tagTypes: TagTypes,
  keepUnusedDataFor: 5 * 60,
  refetchOnReconnect: true,
  baseQuery: axiosBaseQuery({ baseUrl: DOCS_API_URL }),
  endpoints: (build) => ({
    getDocs: build.query({
      query: (params: AxiosRequestConfig["params"]) => ({
        url: "/docs",
        method: "GET",
        params: params,
      }),
      providesTags: TagTypes,
    }),
    createDoc: build.mutation({
      query: (payload: any) => ({
        url: "/docs", // Đường dẫn API POST mới
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (_result, error) => (error ? [] : TagTypes),
    }),
    updateDoc: build.mutation({
      query: ({
                id,
                payload,
              }: {
        id: string;
        payload: Partial<IDocument>;
      }) => ({
        url: "/docs/" + id,
        data: payload,
        method: "PUT",
      }),
      invalidatesTags: (_result, error) => (error ? [] : TagTypes),
    }),
    getDocDetail: build.query({
      query: (id: string, params?: AxiosRequestConfig["params"]) => ({
        url: "/docs/detail/" + id,
        method: "GET",
        params: params,
      }),
      providesTags: TagTypes,
    }),
    getComments: build.query({
      query: (params: AxiosRequestConfig["params"]) => ({
        url: "/docs/get-comment",
        params,
        method: "GET",
      }),
      providesTags: TagTypes,
      transformResponse: (baseQueryReturnValue: TPagination<IComment>) => {
        return baseQueryReturnValue.docs;
      },
    }),
    postComment: build.mutation({
      query: (payload: {
        docId: string;
        position: string;
        content: string;
        replyCommentId?: string;
      }) => ({
        url: "/docs/create-comment",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: (_result, error) => (error ? [] : TagTypes),
    }),
  }),
});

const {
  useGetDocsQuery,
  useGetDocDetailQuery,
  useUpdateDocMutation,
  useGetCommentsQuery,
  usePostCommentMutation,
  useCreateDocMutation,
} = documentApi;

export {
  useGetDocsQuery,
  useGetDocDetailQuery,
  useUpdateDocMutation,
  useGetCommentsQuery,
  usePostCommentMutation,
  useCreateDocMutation,
  documentApi as default,
};
