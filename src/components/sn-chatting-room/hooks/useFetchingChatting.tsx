import { useState } from "react";
import { ParamState } from "../type";

const defaultParam = {
  count: 12,
  offset: 0,
  text: "",
  type: "a",
  company: "fpt",
};

export interface useFetchingChattingReturns {
  onFilterConversation: (name: string, value: string) => void;
  onChangeParamsConversation: (params: ParamState) => void;
}

const useFetchingChatting = (): useFetchingChattingReturns => {
  const [params, setParams] = useState<ParamState>(defaultParam as ParamState);

  const onChangeParamsConversation = (params: ParamState) => {
    setParams(params);
  };

  return {
    onFilterConversation: (name: string, value: string) =>
      setParams({ ...params, [name]: value as string }),
    onChangeParamsConversation,
  };
};

export default useFetchingChatting;
