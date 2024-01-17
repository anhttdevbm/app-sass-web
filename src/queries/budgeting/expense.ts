/* eslint-disable @typescript-eslint/no-explicit-any */
import { Endpoint } from "api";
import { saleClientInstance } from "api/client";
import { ExpenseStatus, PayStatus } from "constant/enums";
import { useMutation, useQuery } from "react-query";
import { getPath } from "utils/index";

export const BUDGET_GET_EXPENSE_QK = "budget_get_expense_query_key";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TBudgetExpense = any;
export type TBudgetExpenses = TBudgetExpense[];

export interface TBudgetExpenseAdd {
  date: string | null;
  owner: string;
  service: string;
  budget: string | string[];
  qty: number;
  cost: number;
  currency: string;
  totalCost: number;
  markUp: number;
  billable: number;
  description: string;
  company: string;
  reimbursement: {
    reimbursement: string;
    reimbursementDate: string | null;
  };
  payment: {
    dueDate: string | null;
    paymentDate: string | null;
    vendor: string;
  };
  status: ExpenseStatus;
  attachment: any[];
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

