import { PayloadAction } from "@reduxjs/toolkit";
import { DataStatus } from "constant/enums";
import { useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import {
  addSource,
  createAgent,
  createCommand,
  deleteAgent,
  deleteSource,
  getAgent,
  getAgents,
  getAvatarLink,
  getCommands, getSources, resyncSource,
  setAgent,
  setAgents,
  updateAgent,
  uploadFile,
} from "store/aiAgent/actions";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  AddSourceInput,
  CreateAIAgentPayload,
  CreateCommandInput,
  DeleteSourceInput,
  GetAIAgentListQueries,
  GetAIAgentsPayload,
  UpdateAIAgentPayload,
} from "./types";

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

    listKnowledge,
    listCommand
  } = useAppSelector((state) => state.aiAgent, shallowEqual);

  const onGetAgents = useCallback(async (queries: GetAIAgentListQueries) => {
    const action = await dispatch(getAgents(queries)) as PayloadAction<GetAIAgentsPayload>;

    const { data, page, size, total_page , total_agents} = action.payload || { data: [], page: 0, size: 0, total_page: 0 };

    const agents = await Promise.all(data.map(async (agent) => {
      if (agent.avatar) {
        const result = await dispatch(getAvatarLink(agent.avatar));
        if (result.payload) {
          agent.avatar = result.payload[0].link
        }
      }
      return agent;
    }));

    dispatch(setAgents({data: agents, page, size, total_page, total_agents}));
  }, [dispatch]);

  const onGetAgent = useCallback(async (id: string) => {
    const result = await dispatch(getAgent(id));

    if (result.payload?.avatar) {
      const avatar = await dispatch(getAvatarLink(result.payload.avatar));
      if (avatar.payload) {
        result.payload.avatar = avatar.payload[0].link;
      }
    }
    dispatch(setAgent(result.payload));
  }, [dispatch]);

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
      console.log(result);
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

  const onGetSources = useCallback((agentId: string) => {
    dispatch(getSources(agentId));
  }, [dispatch]);

  const onResyncSource = useCallback((agentId: string, knowledgeId: string) => {
    dispatch(resyncSource({
      agentId,
      knowledgeId
    }));
  }, [dispatch]);

  const onDeleteSource = useCallback(({agentId, knowledgeId}: DeleteSourceInput) => {
    dispatch(deleteSource({agentId, knowledgeId}));
  }, [dispatch]);

  const onCreateCommand = useCallback((data: CreateCommandInput) => {
    dispatch(createCommand(data));
  }, [dispatch]);

  const onGetCommands = useCallback((agentId: string) => {
    dispatch(getCommands(agentId));
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
    listKnowledge,
    listCommand,

    onGetAgent,
    onGetAgents,
    onDeleteAgent,
    onCreateAgent,
    onUploadFile,
    onUpdateAgent,
    onAddSource,
    onGetSources,
    onResyncSource,
    onDeleteSource,
    onGetCommands,
    onCreateCommand,

    isDeletingAgent,
    isCreatingAgent,
    isUpdatingAgent
  };
};
