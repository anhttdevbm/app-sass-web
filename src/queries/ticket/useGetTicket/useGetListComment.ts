import { useQuery } from "react-query";
import { QUERY_TICKET_KEY } from "../keys";
import { useParams } from "next/navigation";
import { getListCommentApi } from "../api";

export const useGetListComment = () => {
  const params = useParams();
  const id = params?.id as string;
  return useQuery({
    queryKey: [QUERY_TICKET_KEY.LIST_COMMENT, id],
    queryFn: () => getListCommentApi(id),
    enabled: !!id,
  });
};
