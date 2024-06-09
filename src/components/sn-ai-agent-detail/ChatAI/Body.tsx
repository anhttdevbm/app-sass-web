import { Stack, useMediaQuery } from "@mui/material";
import { Textarea } from "../General/components";
import { useLocale, useTranslations } from "next-intl";
import { NS_AI_AGENT } from "constant/index";
import { EmptyMessage } from "components/sn-ai-agent-detail/ChatAI/components/EmptyMesage";
import { useEffect, useState } from "react";
import { MessageLayout, MessageList } from "components/sn-ai-chat/components/BoxChat/components/Message";
import { useChatAIAgent } from "store/chatAIAgent/selectors";
import { ChatResponse } from "store/chatAIAgent/types";
import { useAIAgent } from "store/aiAgent/selectors";
import { HEADER_HEIGHT } from "../../../layouts/Header";
import { HEADER_HEIGHT_AGENT_CHAT } from "components/sn-ai-agent-detail/ChatAI/Header";
import { File } from "store/aiChat/type";

export const Body = () => {
  const t = useTranslations(NS_AI_AGENT);
  const locale = useLocale();
  const isMobile = useMediaQuery("(max-width:600px)");

  const {aiAgent} = useAIAgent();
  const {chatData, page, isGetChatFetching, onChat, onGetChat, hasNextPage} = useChatAIAgent();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [data, setData] = useState<ChatResponse[]>([]);
  const [message, setMessage] = useState<string>("");

  const handleSubmitMessage = async (regenerateMessage?: string) => {
    if (!message && !regenerateMessage) {
      return;
    }
    setIsSubmitting(true);
    if (aiAgent) {
      await onChat({
        tone: aiAgent.tone,
        agentId: aiAgent.id,
        user_prompt: regenerateMessage || message,
        lang: locale,
      });
    }
    setMessage("");
    setIsSubmitting(false);
  };

  const onLoadMoreChat = () => {
    if (page > 1 && aiAgent) {
      onGetChat({agentId: aiAgent.id, queries: {page}});
    }
  }

  const handleMsgChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }

  const handleClickCommand = (prompt: string) => {
    setMessage(prompt);
  }

  const handleEditUserMessage = async (editedMessage: string, files: File[]) => {
    setIsSubmitting(true);
    if (aiAgent) {
      await onChat({
        tone: aiAgent.tone,
        agentId: aiAgent.id,
        user_prompt: editedMessage,
        lang: locale,
        files,
      });
    }
    setIsSubmitting(false);
  }

  useEffect(() => {
      setData(chatData);
  }, [chatData]);

  useEffect(() => {
    if (aiAgent) {
      onGetChat({agentId: aiAgent.id, queries: {page: 1}});
    }
  }, [aiAgent]);

  return (
    <Stack
      padding={3}
      alignItems={"center"}
      justifyContent={"flex-end"}
      direction={"column"}
      spacing={3}
      width={"100%"}
      height={`calc(100vh - ${HEADER_HEIGHT}px - ${HEADER_HEIGHT_AGENT_CHAT}px)`}
    >
      {data?.length > 0 ? (
          <MessageLayout>
            <MessageList
              mobileMode={isMobile}
              isSubmitting={isSubmitting}
              regenerateResponse={handleSubmitMessage}
              onLoadMore={onLoadMoreChat}
              chatData={data}
              page={hasNextPage}
              onEditUserMessage={handleEditUserMessage}
            />
          </MessageLayout>
        ) :
        (
          <EmptyMessage onClick={handleClickCommand} />
        )}
      <Textarea
        placeholder={t("chatAIAgent.askMeAnything")}
        isCount={false}
        onSend={handleSubmitMessage}
        value={message}
        onChange={handleMsgChange}
      />
    </Stack>
  );
};
