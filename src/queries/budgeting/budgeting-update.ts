import { Endpoint } from "api";
import { saleClientInstance } from "../../api/client";
import { useMutation } from "react-query";
import { getPath } from "utils/index";

const BUDGET_UPDATE_MUTATION_QK = "budge_update_mutation_query_key";

export type TBudgetUpdateForm = {
  id: string;
  name?: string;
  start_date?: Date | null;
  end_date?: Date | null;
  owner?: string;
  currency?: string;
  budget_number?: number;
  po_number?: number;
  client?: string;
};

export const budgetUpdate = (form: TBudgetUpdateForm) => {
  const url: string = getPath(Endpoint.BUDGET_UPDATE, undefined, {
    budgetId: form.id,
  });
  const data: Partial<TBudgetUpdateForm> = { ...form };
  delete data.id;
  
  return saleClientInstance.put(url, form);
};

export const useBudgetUpdate = () => {
  return useMutation({
    mutationKey: [BUDGET_UPDATE_MUTATION_QK],
    mutationFn: budgetUpdate,
  });
};
