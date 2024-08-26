import { useMutation } from "react-query";
import { createAgentApi } from "../api";

const useAgentAction = () => {
  const createAgent = useMutation({
    mutationFn: createAgentApi,
  });
  return { createAgent };
};
export default useAgentAction;
