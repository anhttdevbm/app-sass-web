/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "react-query";
import { getPath } from "utils/index";
import { Endpoint } from "../../api";
import { saleClientInstance } from "../../api/client";

export const BUDGET_GET_TIME_RANGES_QK = "budget_get_time_ranges_query_key";
export const BUDGET_GET_TIME_RANGES_DETAIL_QK = "budget_get_time_ranges_detail_query_key";
export const BUDGET_TIME_RANGES_UPDATE_MUTATION_QK = "budget_time_ranges_update_mutation_query_key";

export type TBudgetTimeRange = any;
export type TBudgetTimeRanges = TBudgetTimeRange[];
export interface TBudgetTimeAdd {
  budget: string;
  services: string;
  note: string;
  timeRanges: number;
  billableTime: number;
  date: string;
}

export interface TBudgetTimeUpdate {
  id: string;
  budget: string;
  services: string;
  note: string;
  timeRanges: number;
  billableTime: number;
  date: string;
}

export const budgetGetTimeRangeQuery = (id: string): Promise<any> => {
  const url: string = getPath(Endpoint.BUDGET_GET_TIME_RANGES, undefined, {
    id: id,
  });
  return saleClientInstance.get(url);
};

export const useBudgetGetTimeRangeQuery = (id: string): any | undefined => {
  const { data, refetch } = useQuery({
    queryKey: [BUDGET_GET_TIME_RANGES_QK, id],
    queryFn: () => budgetGetTimeRangeQuery(id),
    retry: 0,
    staleTime: 10000,
  });
  return { data, refetch };
};

export const budgetTimeRemove = (id: string) => {
  const url: string = getPath(Endpoint.BUDGET_DELETE_TIME_RANGES, undefined, {
    id: id,
  });
  return saleClientInstance.delete(url);
};

export const useBudgetTimeRemove = () => {
  return useMutation({
    mutationFn: budgetTimeRemove,
  });
};

export const budgetTimeAdd = (data: TBudgetTimeAdd) => {
  return saleClientInstance.post(Endpoint.BUDGET_TIME_RANGES, data);
};

export const useBudgetTimeAdd = () => {
  return useMutation({
    mutationFn: budgetTimeAdd,
  });
};

export const budgetTimeUpdate = (form: TBudgetTimeUpdate) => {
  const url: string = getPath(Endpoint.BUDGET_TIME_RANGES_UPDATE, undefined, {
    id: form.id,
  });
  const data: any = {...form};
  delete data.id;
  delete data.date;
  return saleClientInstance.put(url, data);
}

export const useBudgetTimeUpdate = () => {
  return useMutation({
    mutationKey: [BUDGET_TIME_RANGES_UPDATE_MUTATION_QK],
    mutationFn: budgetTimeUpdate
  });
}

export const budgetGetTimeDetail = (timeId: string) => {
  return saleClientInstance.post(Endpoint.BUDGET_TIME_RANGES_BY_ID, timeId);
};

export const useBudgetGetTimeDetail = (timeId: string) => {
  const { data, refetch } = useQuery({
    queryKey: [BUDGET_GET_TIME_RANGES_DETAIL_QK, timeId],
    queryFn: () => budgetGetTimeDetail(timeId),
    retry: 0,
    staleTime: 10000,
  });
  return { data, refetch };
};
