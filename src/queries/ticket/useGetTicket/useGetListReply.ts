import { useQuery } from "react-query";
import { getListReplyApi, getTicketDetailApi } from "../api";
import { useParams } from "next/navigation";
import { QUERY_TICKET_KEY } from "../keys";

export const useGetListReply = () => {
  const params = useParams();
  const id = params?.id as string;
  return useQuery({
    queryKey: [QUERY_TICKET_KEY.LIST_REPLY, id],
    queryFn: () => getListReplyApi(id),
    enabled: !!id,
  });
};
