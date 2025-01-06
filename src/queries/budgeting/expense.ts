/* eslint-disable @typescript-eslint/no-explicit-any */
import { Endpoint } from "api";
import { budgetClient, client, fileClient, saleClientInstance } from "api/client";
import { ExportFormData } from "components/sn-budgeting/TabDetail/Modals/ModalExportExpense";
import { DocumentFormat } from "constant/enums";
import { UPLOAD_API_URL } from "constant/index";
import _ from "lodash";
import { useMutation, useQuery } from "react-query";
import { TBudgetExpense, TBudgetExpenseAdd } from "store/expense/actions";
import { clearNullField, getPath } from "utils/index";

export const BUDGET_GET_EXPENSE_QK = "budget_get_expense_query_key";
export const BUDGET_GET_EXPENSE_EXPORT_QK =
  "budget_get_expense_export_query_key";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

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
  return budgetClient.post(Endpoint.BUDGET_EXPENSE_CREATE, data);
};

export const useBudgetExpenseAdd = () => {
  return useMutation({
    mutationFn: budgetExpenseAdd,
  });
};

export const budgetExpenseUpdate = (data: TBudgetExpense) => {
  const url: string = getPath(
    Endpoint.BUDGET_EXPENSE_DETAIL_UPDATE,
    undefined,
    {
      expenseId: _.get(data, "id", ""),
    },
  );

  return budgetClient.put(url, data);
};

export const useBudgetExpenseUpdate = () => {
  return useMutation({
    mutationFn: budgetExpenseUpdate,
  });
};

export const budgetExpenseExport = (data: {
  expenseId: string;
  documentData: ExportFormData;
}) => {
  const url: string = getPath(
    Endpoint.BUDGET_EXPENSE_DETAIL_EXPORT,
    clearNullField(data.documentData as unknown as Record<string, unknown>),
    {
      expenseId: _.get(data, "expenseId", ""),
    },
  );

  return saleClientInstance.get(url, {
    responseType: (data.documentData.format == DocumentFormat.XLSX
      ? "blob"
      : data.documentData.format == DocumentFormat.CSV
        ? "text/csv"
        : "arraybuffer") as any,
  });
};

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
};

export const useBudgetUploadFile = () => {
  return useMutation({
    mutationFn: budgetUploadFile,
  });
};

export const budgetExpenseDelete = (expenseId: string) => {
  const url: string = getPath(
    Endpoint.BUDGET_EXPENSE_DETAIL_DELETE,
    undefined,
    {
      expenseId: expenseId,
    },
  );

  return budgetClient.delete(url);
};

export const useBudgetExpenseDelete = () => {
  return useMutation({
    mutationFn: budgetExpenseDelete,
  });
};

export const budgetExpenseDownloadFile = (fileIds: string[]) => {
  return fileClient.post(Endpoint.DOWNLOAD_LINK, fileIds, {
    responseType: "blob",
  });
};

export const useBudgetDownloadFile = () => {
  return useMutation({
    mutationFn: budgetExpenseDownloadFile,
  });
};
