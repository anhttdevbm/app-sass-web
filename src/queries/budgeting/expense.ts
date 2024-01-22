/* eslint-disable @typescript-eslint/no-explicit-any */
import { Endpoint } from "api";
import { saleClientInstance } from "api/client";
import { ExpenseStatus, PayStatus } from "constant/enums";
import _ from "lodash";
import { useMutation, useQuery } from "react-query";
import { getPath } from "utils/index";

export const BUDGET_GET_EXPENSE_QK = "budget_get_expense_query_key";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export type TBudgetExpenseAdd = {
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

export type TBudgetExpense = Omit<TBudgetExpenseAdd, 'id' & { id: string; }>

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

export const budgetExpenseUpdate = (data: TBudgetExpense) => {
  const url: string = getPath(Endpoint.BUDGET_EXPENSE_DETAIL_UPDATE, undefined, {
    expenseId: _.get(data, 'id', ''),
  });

  return saleClientInstance.put(url, data);
};

export const useBudgetExpenseUpdate = () => {
  return useMutation({
    mutationFn: budgetExpenseUpdate,
  });
};

export const budgetExpenseExport = (data: TBudgetExpense) => {
  const url: string = getPath(Endpoint.BUDGET_EXPENSE_DETAIL_EXPORT, undefined, {
    expenseId: _.get(data, 'id', ''),
  });

  return saleClientInstance.get(url, { data: data, params: { format: 'pdf' } });
}

export const useBudgetExpenseExport = () => {
  return useMutation({
    mutationFn: budgetExpenseExport,
  });
};
