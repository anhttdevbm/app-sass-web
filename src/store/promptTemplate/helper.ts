import { PromptTemplate, PromptTemplateDynamicState, PromptTemplateGroup } from "store/promptTemplate/types";

export const mapDynamicStateToTemplateArray = (dynamicState: PromptTemplateDynamicState): PromptTemplate[] => {
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
