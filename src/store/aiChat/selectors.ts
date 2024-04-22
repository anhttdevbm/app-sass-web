import { DataStatus } from "constant/enums";
import { useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getExamplePrompt } from "./actions";
import { GetExamplePromptQueries } from "./type";

export const useAIChat = () => {
  const dispatch = useAppDispatch();
  const { examplePrompts, status, error, filters } = useAppSelector(
    (state) => state.aiChat,
    shallowEqual,
  );

  const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
  const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

  const onGetExamplePrompt = (queries: GetExamplePromptQueries) => {
    dispatch(getExamplePrompt(queries));
  };

  return {
    examplePrompts,
    status,
    error,
    filters,
    isIdle,
    isFetching,
    dispatch,
    onGetExamplePrompt,
  };
};
