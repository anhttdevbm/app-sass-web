import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { selectCurrentPage, selectSearchTicket } from "store/ticket/selectors";
import { getListTicketApi } from "../api";

export const LIST_TICKET = "LIST_TICKET";

const useGetListTicket = () => {
  const data = useSelector(selectSearchTicket);
  const page = useSelector(selectCurrentPage);

  console.log("check page", data);

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
    page: page?.page,
    size: page?.totalItems,
    // page: 1,
    // size: 2,
  };

  return useQuery({
    queryKey: [LIST_TICKET, params],
    queryFn: () => getListTicketApi(params),
    staleTime: 60,
    enabled: true,
  });
};

export default useGetListTicket;
