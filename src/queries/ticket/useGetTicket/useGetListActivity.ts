import { useQuery } from "react-query";
import { QUERY_TICKET_KEY } from "../keys";
import { useParams } from "next/navigation";
import { getListActivity } from "../api";

export const useGetListActivity = (isAll) => {
  const params = useParams();
  const id = params?.id as string;
  return useQuery({
    queryKey: [QUERY_TICKET_KEY.LIST_ACTIVITY, id],
    queryFn: () => getListActivity({ id, page: 1, size: 10, isAll }),
    enabled: !!id,
  });
};
