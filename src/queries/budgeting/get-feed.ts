import { useQuery } from "react-query";
import { saleClientInstance } from "../../api/client";
import { getPath } from "utils/index";
import { Endpoint } from "../../api";

export const BUDGET_GET_FEED_QK: string = "budget_get_feed_query_key";

export type TBudgetFeed = any;
export type TBudgetFeeds = TBudgetFeed[];

export const budgetGetFeedQuery = (id: string): Promise<any> => {
  const url: string = getPath(Endpoint.BUDGET_GET_FEED, undefined, { id: id });
  return saleClientInstance.get(url);
};

export const useBudgetGetFeedQuery = (id: string): any | undefined => {
  const { data } = useQuery({
    queryKey: [BUDGET_GET_FEED_QK, id],
    queryFn: () => budgetGetFeedQuery(id),
    retry: 0,
    staleTime: 10000,
  });
  return data;
};
