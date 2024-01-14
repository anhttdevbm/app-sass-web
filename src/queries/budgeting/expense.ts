/* eslint-disable @typescript-eslint/no-explicit-any */
import { Endpoint } from "api";
import { saleClientInstance } from "api/client";
import { PayStatus } from "constant/enums";
import { useMutation, useQuery } from "react-query";
import { getPath } from "utils/index";

export const BUDGET_GET_EXPENSE_QK = "budget_get_expense_query_key";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TBudgetExpense = any;
export type TBudgetExpenses = TBudgetExpense[];

export interface TBudgetExpenseAdd {
  date: string;
  owner: string;
  service: string;
  budget: string;
  qty: number;
  cost: number;
  currency: string;
  totalCost: number;
  markup: number;
  billable: number;
  description: string;
  company: string;
  reimbursement: {
    reimbursement: string;
    reimbursementDate: string;
  };
  payment: {
    dueDate: string;
    paymentDate: string;
    vendor: string;
  };
  status: PayStatus;
  attachment: string;
}

const budgetGetExpenseQuery = (budgetId: string) => {
  const url: string = getPath(Endpoint.BUDGET_EXPENSE_LIST, undefined, {
    budgetId: budgetId,
  });

  return saleClientInstance.get(url);
};

export const useBudgetGetExpenseQuery = (budgetId: string): any | undefined => {
  const { data, refetch } = useQuery({
    queryKey: [BUDGET_GET_EXPENSE_QK, budgetId],
    queryFn: () => budgetGetExpenseQuery(budgetId),
    retry: 0,
    staleTime: Infinity,
  });
  return { data, refetch };
};


export const budgetExpenseAdd = (data: TBudgetExpenseAdd) => {
  return saleClientInstance.post(Endpoint.BUDGET_EXPENSE_CREATE, data);
};

export const useBudgetExpenseAdd = () => {
  return useMutation({
    mutationFn: budgetExpenseAdd,
  });
};

