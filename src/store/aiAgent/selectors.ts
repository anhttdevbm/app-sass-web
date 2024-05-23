import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { GetAIAgentListQueries } from "./types";
import { actions } from "./reducer";
import { deleteAgent, getAgents } from "store/aiAgent/actions";
import { useCallback, useMemo } from "react";
import { DataStatus } from "constant/enums";

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

    getAgentsStatus
  } = useAppSelector((state) => state.aiAgent, shallowEqual);

  const onGetAgents = useCallback((queries: GetAIAgentListQueries) => {
      dispatch(getAgents(queries));
  }, [dispatch]);
  const isFetchingAgents = useMemo(() => getAgentsStatus === DataStatus.LOADING, [getAgentsStatus]);

  const onGetAgent = (id: string) => {
    // dispatch(getAgent(id));
    // dispatch(actions.getAgent(id));
  };

  const onDeleteAgent = useCallback((id: string) => {
    dispatch(deleteAgent(id));
  }, [dispatch]);
  const isDeletingAgent = useMemo(() => getAgentsStatus === DataStatus.LOADING, [getAgentsStatus]);

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
    isFetchingAgents,
    onGetAgent,
    onDeleteAgent,
    isDeletingAgent
  };
};
