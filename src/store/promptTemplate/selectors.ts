import { useAppDispatch, useAppSelector } from "store/hooks";
import { shallowEqual } from "react-redux";
import { useCallback, useMemo } from "react";
import { getPromptTemplates } from "store/promptTemplate/actions";
import { DataStatus } from "constant/enums";

export const usePromptTemplate = () => {
  const dispatch = useAppDispatch();

  const {
    promptTemplates,
    getPromptTemplatesStatus,

  } = useAppSelector((state) => state.promptTemplate, shallowEqual);

  const onGetPromptTemplates = useCallback(() => {
      dispatch(getPromptTemplates());
  }, [dispatch]);
  const isFetchingPromptTemplates = useMemo(() => getPromptTemplatesStatus === DataStatus.LOADING, [getPromptTemplatesStatus]);

  return {
    promptTemplates,

    onGetPromptTemplates,
    isFetchingPromptTemplates
  };
}