import { useQuery } from "react-query";
import { getTicketDetailApi } from "../api";
import { useParams } from "next/navigation";
import { QUERY_TICKET_KEY } from "../keys";

export const useGetTicketDetail = () => {
  const params = useParams();
  const id = params?.id as string;
  return useQuery({
    queryKey: [QUERY_TICKET_KEY.DETAIL_TICKET, id],
    queryFn: () => getTicketDetailApi(id),
    enabled: !!id,
  });
};
