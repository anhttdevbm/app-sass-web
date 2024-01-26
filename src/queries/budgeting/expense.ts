/* eslint-disable @typescript-eslint/no-explicit-any */
import { Endpoint } from "api";
import { budgetExpenseUploadClient, client, saleClientInstance } from "api/client";
import { ExportFormData } from "components/sn-budgeting/TabDetail/Modals/ModalExportExpense";
import { ExpenseStatus } from "constant/enums";
import { UPLOAD_API_URL } from "constant/index";
import _ from "lodash";
import { useMutation, useQuery } from "react-query";
import { clearNullField, getPath } from "utils/index";

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

export type TBudgetExpense = TBudgetExpenseAdd & { id: string; };

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

export const budgetExpenseExport = (data: { expenseId: string, documentData: ExportFormData }) => {
  const url: string = getPath(Endpoint.BUDGET_EXPENSE_DETAIL_EXPORT, undefined, {
    expenseId: _.get(data, 'expenseId', ''),
  });

  return saleClientInstance.get(url, { params: clearNullField(data.documentData)});
}

export const useBudgetExpenseExport = () => {
  return useMutation({
    mutationFn: budgetExpenseExport,
  });
};

export const budgetUploadFile = (file: File) => {
  return client.get(
    `${Endpoint.UPLOAD_LINK}/${file.name}`,
    { type: file.type },
    {
      baseURL: UPLOAD_API_URL,
    },
  );
}

export const useBudgetUploadFile = () => {
  return useMutation({
    mutationFn: budgetUploadFile,
  });
};
