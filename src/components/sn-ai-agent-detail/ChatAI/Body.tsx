import { Stack, useMediaQuery } from "@mui/material";
import { EmptyMessage } from "components/sn-ai-agent-detail/ChatAI/components/EmptyMesage";
import { HEADER_HEIGHT_AGENT_CHAT } from "components/sn-ai-agent-detail/ChatAI/Header";
import { MessageLayout, MessageList } from "components/sn-ai-chat/components/BoxChat/components/Message";
import { NS_AI_AGENT } from "constant/index";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useAIAgent } from "store/aiAgent/selectors";
import { File } from "store/aiChat/type";
import { useChatAIAgent } from "store/chatAIAgent/selectors";
import { ChatResponse } from "store/chatAIAgent/types";
import { HEADER_HEIGHT } from "../../../layouts/Header";
import { Textarea } from "../General/components";

export const Body = () => {
  const t = useTranslations(NS_AI_AGENT);
  const locale = useLocale();
  const isMobile = useMediaQuery("(max-width:600px)");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const {aiAgent} = useAIAgent();
  const {
    chatData,
    page,
    hasNextPage,
    onChat,
    onGetChat,
    isGetChatFetching,
    isChatFetching} = useChatAIAgent();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [data, setData] = useState<ChatResponse[]>([]);
  const [message, setMessage] = useState<string>("");

  const handleSubmitMessage = async (regenerateMessage?: string) => {
    if (!message && !regenerateMessage) {
      return;
    }
    if (aiAgent) {
      setIsSubmitting(true);
      await onChat({
        tone: aiAgent.tone,
        agentId: aiAgent.id,
        user_prompt: regenerateMessage || message,
        lang: locale,
      });
    }
    setMessage("");
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
    if (aiAgent) {
      setIsSubmitting(true)
      await onChat({
        tone: aiAgent.tone,
        agentId: aiAgent.id,
        user_prompt: editedMessage,
        lang: locale,
        files,
      });
    }
  }

  useEffect(() => {
      setData(chatData);
  }, [chatData]);

  useEffect(() => {
    if (aiAgent) {
      onGetChat({agentId: aiAgent.id, queries: {page: 1}});
    }
  }, [aiAgent]);

  useEffect(() => {
    if (!isChatFetching) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 500);
      setIsSubmitting(false);
    }
  }, [isChatFetching]);

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
        ref={textareaRef}
        placeholder={t("chatAIAgent.askMeAnything")}
        isCount={false}
        onSend={handleSubmitMessage}
        value={message}
        onChange={handleMsgChange}
        disabled={isSubmitting}
      />
    </Stack>
  );
};
