import { useMutation } from "react-query";
import { removeAgentApi } from "../api";

const useRemoveAgent = () => {
  const removeAgent = useMutation({
    mutationFn: removeAgentApi,
  });
  return { removeAgent };
};
export default useRemoveAgent;
