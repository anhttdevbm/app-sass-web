import { useMutation } from "react-query";

const useTicketAction = () => {
  const createTicket = useMutation({
    // mutationFn:()=> {},
    onSuccess: (data) => {},
  });
};
export default useTicketAction;
