import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import { selectSearchTicket } from "store/ticket/selectors";
import { getListTicketApi } from "../api";

export const LIST_TICKET = "LIST_TICKET";

const useGetListTicket = () => {
  const data = useSelector(selectSearchTicket);

  return useQuery({
    queryKey: [LIST_TICKET, data],
    queryFn: () => getListTicketApi(data),
    staleTime: 60,
    enabled: true,
  });
};

export default useGetListTicket;
