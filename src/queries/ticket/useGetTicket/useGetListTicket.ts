import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { selectSearchTicket } from "store/ticket/selectors";
import { getListTicketApi } from "../api";
import { QUERY_TICKET_KEY } from "../keys";

const useGetListTicket = () => {
  const data = useSelector(selectSearchTicket);

  console.log("check data stroe" , data)

  const params = {
    assign: data?.assingn || "",
    creator: "",
    code: data?.keySearch || "",
    stage: data?.stage || "",
    type: data?.ticketType || "",
    fromDate: "",
    createTime: "",
    toDate: "",
    priority: data?.priority || "",
    page: data?.page,
    size: data?.totalItems,
  };

  return useQuery({
    queryKey: [QUERY_TICKET_KEY.LIST_TICKET, params],
    queryFn: () => getListTicketApi(params),
    staleTime: 60,
    enabled: true,
  });
};

export default useGetListTicket;
