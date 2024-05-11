import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { GetAIAgentListQueries } from "./types";
import { actions } from "./reducer";

export const useAgents = () => {
  const dispatch = useAppDispatch();

  const {
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

  return {
    aiAgents,
    aiAgentFilters,
    isReady,
    totalAIAgents,
    onGetAgents,
    totalPages,
    page,
    limit,
  };
};
