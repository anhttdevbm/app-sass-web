import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { GetAIAgentListQueries } from "./types";
import { actions } from "./reducer";

export const useAIAgent = () => {
  const dispatch = useAppDispatch();

  const {
    aiAgent,
    aiAgents,
    aiAgentFilters,
    isReady,
    totalAIAgents,
    totalPages,
    page,
    limit,
  } = useAppSelector((state) => state.aiAgent, shallowEqual);

  const onGetAgents = (queries: GetAIAgentListQueries) => {
    // dispatch(getAgents(queries));
    dispatch(actions.getAgents(queries));
  };

  const onGetAgent = (id: string) => {
    // dispatch(getAgent(id));
    dispatch(actions.getAgent(id));
  };

  return {
    aiAgents,
    aiAgentFilters,
    isReady,
    totalAIAgents,
    totalPages,
    page,
    limit,

    aiAgent,

    onGetAgents,
    onGetAgent,
  };
};
