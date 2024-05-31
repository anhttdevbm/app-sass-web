import { useAppDispatch, useAppSelector } from "store/hooks";
import { shallowEqual } from "react-redux";
import { useCallback, useMemo } from "react";
import { getPromptTemplates } from "store/promptTemplate/actions";
import { DataStatus } from "constant/enums";
import { PromptTemplate, PromptTemplateDynamicState, PromptTemplateGroup } from "store/promptTemplate/types";

export const usePromptTemplate = () => {
  const dispatch = useAppDispatch();

  const {
    promptTemplates,
    getPromptTemplatesStatus,

  } = useAppSelector((state) => state.promptTemplate, shallowEqual);

  const mapDynamicStateToTemplateArray = (dynamicState: PromptTemplateDynamicState): PromptTemplate[] => {
    let result: PromptTemplate[] = [];

    for (const category in dynamicState) {
      const group: PromptTemplateGroup = dynamicState[category];

      const templates: PromptTemplate[] = group.data ? group.data.map(template => ({
        ...template,
        category: category
      })) : [];

      result = [...result, ...templates];
    }

    return result;
  }

  const onGetPromptTemplates = useCallback(() => {
      dispatch(getPromptTemplates());
  }, [dispatch]);
  const isFetchingPromptTemplates = useMemo(() => getPromptTemplatesStatus === DataStatus.LOADING, [getPromptTemplatesStatus]);

  return {
    promptTemplates,

    onGetPromptTemplates,
    isFetchingPromptTemplates,

    mapDynamicStateToTemplateArray
  };
}