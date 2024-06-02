import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  AddSourceInput,
  CreateAIAgentPayload,
  DeleteSourceInput,
  GetAIAgentListQueries, GetAIAgentsPayload,
  UpdateAIAgentPayload,
} from "./types";
import {
  addSource,
  createAgent,
  deleteAgent, deleteSource,
  getAgent,
  getAgents, getAvatarLink,
  setAgents,
  updateAgent,
  uploadFile,
} from "store/aiAgent/actions";
import { useCallback, useMemo } from "react";
import { DataStatus } from "constant/enums";
import { PayloadAction } from "@reduxjs/toolkit";

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

    createAgentStatus,
    deleteAgentStatus,
    updateAgentStatus,

    listKnowledge
  } = useAppSelector((state) => state.aiAgent, shallowEqual);

  const onGetAgents = useCallback(async (queries: GetAIAgentListQueries) => {
    const action = await dispatch(getAgents(queries)) as PayloadAction<GetAIAgentsPayload>;

    const { data, page, size, total_page } = action.payload;

    const agents = await Promise.all(data.map(async (agent) => {
      if (agent.avatar) {
        const result = await dispatch(getAvatarLink(agent.avatar));
        if (result.payload) {
          agent.avatar = result.payload[0].link
        }
      }
      return agent;
    }));

    dispatch(setAgents({data: agents, page, size, total_page}));
  }, [dispatch]);

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

  const onUploadFile = useCallback(async (file: File): Promise<string | undefined> => {
    try {
      const result = await dispatch(uploadFile(file));
      return result.payload;
    } catch (error) {
    }
  }, [dispatch]);

  const onUpdateAgent = useCallback((id: string, data: UpdateAIAgentPayload) => {
    dispatch(updateAgent({ id, data }));
  }, [dispatch])
  const isUpdatingAgent = useMemo(() => updateAgentStatus === DataStatus.LOADING, [updateAgentStatus]);

  const onAddSource = useCallback((data: AddSourceInput) => {
    dispatch(addSource(data));
  }, [dispatch]);

  const onDeleteSource = useCallback(({agentId, knowledgeId}: DeleteSourceInput) => {
    dispatch(deleteSource({agentId, knowledgeId}));
  }, [dispatch]);

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

    onDeleteAgent,
    isDeletingAgent,

    onCreateAgent,
    isCreatingAgent,

    onUploadFile,
    // onGetAvatarLink,

    onUpdateAgent,
    isUpdatingAgent,

    onAddSource,
    onDeleteSource,
    listKnowledge
  };
};
