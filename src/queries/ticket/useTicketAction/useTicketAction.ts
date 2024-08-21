import { useMutation } from "react-query";
import { createTicketApi } from "../api";

const useTicketAction = () => {
  const createTicket = useMutation({
    mutationFn: createTicketApi,
  });
  return { createTicket };
};
export default useTicketAction;
