import { useQuery } from "react-query";
import { saleClientInstance } from "../../api/client";
import { getPath } from "utils/index";
import { Endpoint } from "../../api";

export const BUDGET_GET_BY_ID_QK: string = "budget_get_by_id_query_key";

export const budgetByIdQuery = (id: string): Promise<any> => {
  const url: string = getPath(Endpoint.BUDGET_GET_BY_ID, undefined, { id: id });
  return saleClientInstance.get(url);
};

export const useBudgetByIdQuery = (id: string): any | undefined => {
  const { data, refetch } = useQuery({
    queryKey: [BUDGET_GET_BY_ID_QK, id],
    queryFn: () => budgetByIdQuery(id),
    retry: 0,
    staleTime: Infinity,
  });
  return { data, refetch };
};
