import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { CreateAIAgentPayload, GetAIAgentListQueries, UpdateAIAgentPayload } from "./types";
import {
  createAgent,
  deleteAgent,
  getAgent,
  getAgents,
  getAvatarLink,
  updateAgent,
  uploadAvatar,
} from "store/aiAgent/actions";
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
    deleteAgentStatus,
    updateAgentStatus,
  } = useAppSelector((state) => state.aiAgent, shallowEqual);

  const onGetAgents = useCallback((queries: GetAIAgentListQueries) => {
      dispatch(getAgents(queries));
  }, [dispatch]);
  const isFetchingAgents = useMemo(() => getAgentsStatus === DataStatus.LOADING, [getAgentsStatus]);

  const onGetAgent = (id: string) => {
    dispatch(getAgent(id));
  };

  const onDeleteAgent = useCallback((id: string) => {
    dispatch(deleteAgent(id));
  }, [dispatch]);
  const isDeletingAgent = useMemo(() => deleteAgentStatus === DataStatus.LOADING, [deleteAgentStatus]);

  const onCreateAgent = useCallback((data: CreateAIAgentPayload) => {
    dispatch(createAgent(data));
  }, [dispatch]);
  const isCreatingAgent = useMemo(() => createAgentStatus === DataStatus.LOADING, [createAgentStatus]);

  const onUploadAvatar = useCallback(async (file: File): Promise<string | undefined> => {
    try {
      const result = await dispatch(uploadAvatar(file));
      return result.payload;
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  const onGetAvatarLink = useCallback(async (id: string) => {
    try {
      const result = await dispatch(getAvatarLink(id));
      return result.payload[0].link;
    } catch (error) {
    }
  }, [dispatch])

  const onUpdateAgent = useCallback((id: string, data: UpdateAIAgentPayload) => {
    dispatch(updateAgent({ id, data }));
  }, [dispatch])
  const isUpdatingAgent = useMemo(() => updateAgentStatus === DataStatus.LOADING, [updateAgentStatus]);

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
    isCreatingAgent,

    onUploadAvatar,
    onGetAvatarLink,

    onUpdateAgent,
    isUpdatingAgent,
  };
};
