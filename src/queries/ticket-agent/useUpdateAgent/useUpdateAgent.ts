import { useMutation } from "react-query";
import { updateAgentApi } from "../api";

const useAgentUpdate = () => {
  const updateAgent = useMutation({
    mutationFn: updateAgentApi,
  });
  return { updateAgent };
};
export default useAgentUpdate;
