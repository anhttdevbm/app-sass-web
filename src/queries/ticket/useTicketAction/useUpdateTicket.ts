import { useMutation } from "react-query";
import { updateTicketApi } from "../api";

const useUpdateTicket = () => {
  const updateTicket = useMutation({
    mutationFn: updateTicketApi,
  });
  return { updateTicket };
};
export default useUpdateTicket;
