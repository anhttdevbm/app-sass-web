/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery } from "react-query";
import { getPath } from "utils/index";
import { Endpoint } from "../../api";
import { saleClientInstance } from "../../api/client";

export const BUDGET_RECURRING_ADD_MUTATION_QK = "budget_recurring_add_mutation_query_key";

export type TRecurring = any;
export type TRecurrings = TRecurring[];
export interface TRecurringAdd {
  recurring: string;
  from: string;
  to: string;
  copyPO?: boolean;
  budgetId: string;
}

export const budgetRecurringAdd = (data: TRecurringAdd) => {
  return saleClientInstance.post(Endpoint.BUDGET_RECURRING_ADD, data);
};

export const useBudgetRecurringAdd = () => {
  return useMutation({
    mutationFn: budgetRecurringAdd,
  });
};