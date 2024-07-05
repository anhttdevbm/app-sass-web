import { Endpoint } from "api";
import { saleClientInstance } from "../../api/client";
import { useMutation } from "react-query";
import { getPath } from "utils/index";

const BUDGET_SERVICE_UPDATE_MUTATION_QK = 'budget_service_update_mutation_query_key';

export type TBudgetServiceUpdateForm = {
  services: {
    id: string;
    name: string;
    desc: string;
    serviceType: string;
    billType: string;
    unit: string;
    estimate: number;
    qty: number;
    price: number;
    discount: number;
    markUp: number;
    tolBudget: number;
  }[],
  sections: {
    id: string;
    name: string;
    start_date: string;
  }[]
}

export const budgetServiceUpdate = (form: TBudgetServiceUpdateForm) => {
  const url: string = getPath(Endpoint.BUDGET_SERVICE_UPDATE, undefined, {
    id: form.sections[0].id,
  });
  return saleClientInstance.put(url, form);
}

export const useBudgetServiceUpdate = () => {
  return useMutation({
    mutationKey: [BUDGET_SERVICE_UPDATE_MUTATION_QK],
    mutationFn: budgetServiceUpdate
  });
}
