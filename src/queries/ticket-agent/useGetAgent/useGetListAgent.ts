import { useQuery } from "react-query";
import { getListAgent } from "../api";
import { QUERY_AGENT_KEY } from "../keys";
import { selectSearchTicketAgent } from "store/ticket-agent/selectors";
import { useAppSelector } from "store/hooks";


const useGetListAgent = () => {
  const data = useAppSelector(selectSearchTicketAgent)


  // console.log("check page", data);

  const params = {
    position: data?.position || "",
    keyword: data?.keyword || "",
    status: data?.status || "",
    page: data?.page || "",
    size: data?.size || "",
  };

  return useQuery({
    queryKey: [QUERY_AGENT_KEY.LIST_AGENT, params],
    queryFn: () => getListAgent(params),
    staleTime: 60,
    enabled: true,
  });
};

export default useGetListAgent;
