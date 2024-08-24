import { useQuery } from "react-query";
import { selectSearchTicket } from "store/ticket/selectors";
import { getListTicketApi } from "../api";
import { QUERY_TICKET_KEY } from "../keys";
import { useAppSelector } from "store/hooks";

const useGetListTicket = () => {
  const data = useAppSelector(selectSearchTicket);

  console.log("check data stroe" , data)

  const params = {
    assign: data?.assingn || "",
    creator: "",
    code: data?.keySearch || "",
    stage: data?.stage || "",
    type: data?.ticketType || "",
    fromDate: "",
    createTime: "2023-08-23T17:35:58.123731",
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
