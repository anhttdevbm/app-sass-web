import { Stack, useMediaQuery } from "@mui/material";
import { Textarea } from "../General/components";
import { useTranslations } from "next-intl";
import { NS_AI_AGENT } from "constant/index";
import { EmptyMessage } from "components/sn-ai-agent-detail/ChatAI/components/EmptyMesage";
import { useEffect, useState } from "react";
import { MessageLayout, MessageList } from "components/sn-ai-chat/components/BoxChat/components/Message";
import { useChatAIAgent } from "store/chatAIAgent/selectors";
import { ChatResponse } from "store/chatAIAgent/types";

export const Body = () => {
  const t = useTranslations(NS_AI_AGENT);

  const isMobile = useMediaQuery("(max-width:600px)");

  const {chatData, page, isGetChatFetching, onChat, onGetChat} = useChatAIAgent();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [data, setData] = useState<ChatResponse[]>([]);
  const [message, setMessage] = useState<string>("");

  const handleSubmitMessage = () => {
    console.log("Send Message");
    setMessage("");
  };

  const onLoadMoreChat = () => {
    console.log("Load More Chat");
  }

  const handleMsgChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  }

  const handleClickCommand = (prompt: string) => {
    setMessage(prompt);
  }

  useEffect(() => {
      setData(chatData);
  }, [chatData]);

  useEffect(() => {
    if (!isGetChatFetching) {
      onGetChat({page: page});
    }
  }, [isGetChatFetching, onGetChat, page]);

  return (
    <Stack
      padding={3}
      alignItems={"center"}
      justifyContent={"space-between"}
      spacing={3}
      width={"100%"}
    >
      {chatData.length > 0 ? (
          <MessageLayout>
            <MessageList
              mobileMode={isMobile}
              isSubmitting={isSubmitting}
              regenerateResponse={handleSubmitMessage}
              onLoadMore={onLoadMoreChat}
              chatData={chatData}
              page={page}
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
