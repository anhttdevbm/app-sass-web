import { Endpoint } from "api";
import { saleClientInstance } from "../../api/client";
import { useMutation } from "react-query";

const BUDGET_SERVICE_ADD_MUTATION_QK = 'budget_service_add_mutation_query_key';

export type TBudgetServiceForm = {
  budget_id: string;
  start_date: string;
  sections: {
    name: string;
    services: {
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
    }[]
  }[]
}

export const budgetServiceAdd = (form: TBudgetServiceForm) => {
  return saleClientInstance.post(Endpoint.BUDGET_SERVICE_ADD, form);
}

export const useBudgetServiceAdd = () => {
  return useMutation({
    mutationKey: [BUDGET_SERVICE_ADD_MUTATION_QK],
    mutationFn: budgetServiceAdd
  });
}
