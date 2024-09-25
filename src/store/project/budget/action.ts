/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  formatDocResponseToItemResponse,
  refactorRawItemListResponse,
  serverQueries,
} from "utils/index";
import { Endpoint } from "../../../api";
import { HttpStatusCode } from "constant/enums";
import { AN_ERROR_TRY_AGAIN } from "constant/index";
import { BaseQueries } from "constant/types";
import { budgetClient } from "../../../api/client";
import StringFormat from "string-format";

export type TBudget = any;
export type TBudgets = TBudget[];

export type TBudgetCreateParam = {
  project_id: string;
  name: string;
  start_date: string;
  end_date: string;
  owner: string;
  client:string;
};

export type RecurringData = {
  interval: string;
  start_date: string;
  end_date: string;
  copy?: boolean;
};

export type TBudgetListQueries = BaseQueries & {
  sort?: string;
  group_by?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  project_id?: string;
  search_key?: string;
};

export type TBudgetListFilter = Omit<
  TBudgetListQueries,
  "pageIndex" | "pageSize"
>;

export const getProjectBudgetList = createAsyncThunk(
  "project/getProjectBudgetList",
  async (queries: TBudgetListQueries) => {
    queries = { ...queries };

    if (queries?.sort !== "updated_time=-1") {
      queries.sort = "created_time=-1";
    }

    if (queries.pageIndex) {
      queries.pageIndex = parseInt(String(queries.pageIndex)) + 1;
      // I don't know why in the serverQueries function, it's fetching pageIndex - 1.
      // I don't want to modify the logic there because the impact area is too extensive.
      // So, I added 1 here.
    }

    const listKeySearchInParam: string[] = [
      "group_by",
      "user_id",
      "start_date",
      "end_date",
      "project_id",
      "search_key",
    ];

    const dataSearchInParam: Record<
      (typeof listKeySearchInParam)[number],
      string | undefined | null
    > = {};

    for (const key in queries) {
      if (listKeySearchInParam.indexOf(key) === -1) {
        continue;
      }
      dataSearchInParam[key] = queries[key];
      delete queries[key];
    }

    const response = await budgetClient.get(Endpoint.BUDGET_ALL, {
      ...serverQueries(queries),
      ...dataSearchInParam,
    });

    if (response?.status !== HttpStatusCode.OK) {
      throw AN_ERROR_TRY_AGAIN;
    }

    const data = formatDocResponseToItemResponse(response.data);
    return refactorRawItemListResponse(data);
  },
);

export const createProjectBudget = createAsyncThunk(
  "project/createProjectBudget",
  async (param: TBudgetCreateParam) => {
    const url = Endpoint.BUDGET_CREATE;
    const response = await budgetClient.post(url, param);

    if (response?.status !== HttpStatusCode.CREATED) {
      throw AN_ERROR_TRY_AGAIN;
    }

    return response.data;
  },
);

export const deleteProjectBudget = createAsyncThunk(
  "project/deleteProjectBudget",
  async (budgetId:string) => {
    const url = StringFormat(Endpoint.BUDGET_DELETE_BY_ID, { budgetId });
    const response = await budgetClient.delete(url);

    if (response?.status !== HttpStatusCode.OK) {
      throw AN_ERROR_TRY_AGAIN;
    }

    return response.data;
  },
);
