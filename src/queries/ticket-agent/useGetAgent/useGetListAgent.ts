import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { selectSearchTicket } from "store/ticket/selectors";
import { getListTicketApi } from "../api";
import { QUERY_AGENT_KEY } from "../keys";


const useGetListAgent = () => {
  const data = useSelector(selectSearchTicket);

  // console.log("check page", data);

  const params = {
    assign: data?.assingn || "",
    creator: "",
    code: data?.keySearch || "",
    stage: "",
    type: data?.ticketType || "",
    fromDate: "",
    createTime: "",
    toDate: "",
    priority: data?.priority || "",
    // page: page?.page,
    // size: page?.totalItems,
    // page: 1,
    // size: 2,
  };

  return useQuery({
    queryKey: [QUERY_AGENT_KEY.LIST_AGENT, params],
    queryFn: () => getListTicketApi(params),
    staleTime: 60,
    enabled: true,
  });
};

export default useGetListAgent;
