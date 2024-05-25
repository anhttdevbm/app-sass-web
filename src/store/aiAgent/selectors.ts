import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { CreateAIAgentPayload, GetAIAgentListQueries } from "./types";
import { actions } from "./reducer";
import { createAgent, deleteAgent, getAgents } from "store/aiAgent/actions";
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

    getAgentsStatus,
    createAgentStatus,
    deleteAgentStatus

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
  const isDeletingAgent = useMemo(() => deleteAgentStatus === DataStatus.LOADING, [deleteAgentStatus]);

  const onCreateAgent = useCallback((data: CreateAIAgentPayload) => {
    dispatch(createAgent(data));
  }, [dispatch]);
  const isCreatingAgent = useMemo(() => createAgentStatus === DataStatus.LOADING, [createAgentStatus]);

  return {
    aiAgents,
    aiAgentFilters,
    isReady,
    totalAIAgents,
    totalPages,
    page,
    limit,

    aiAgent,
    onGetAgent,

    onGetAgents,
    isFetchingAgents,

    onDeleteAgent,
    isDeletingAgent,

    onCreateAgent,
    isCreatingAgent
  };
};
