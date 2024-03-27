import Box from "@mui/material/Box";
import { useChat } from "store/chat/selectors";
import ForwardHeader from "./ForwarHeader";
import ChatForward from "components/sn-chat/ChatForward";
import { useCallback, useEffect, useState } from "react";
import { ChatConventionItemRequest } from "store/chat/type";
import { client } from "api/client";
import { CHAT_API_URL } from "constant/index";
import { useAuth } from "store/app/selectors";
import { debounce } from "utils/index";

const ForwardLayout = () => {
  const { onSetDrawerType, onCloseDrawer } = useChat();
  const [param, setParam] = useState({
    text: "",
  });
  const [conversations, setConversation] = useState([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const onSearchTxt = debounce((value) => {
    setParam({
      text: value,
    });
  }, 1000);

  const handleGetAllConversation = async (
    paramReq: ChatConventionItemRequest,
  ) => {
    setLoading(true);
    const response = await client.post("getAllConversations", paramReq, {
      baseURL: CHAT_API_URL,
    });
    setLoading(false);
    setConversation(response.data);
  };

  useEffect(() => {
    const authToken = user?.["authToken"] ?? "";
    const userId = user?.["id_rocket"] ?? "";
    handleGetAllConversation({
      type: "a",
      text: param.text ?? "",
      offset: 0,
      count: 30,
      authToken,
      userId,
      company: user?.company,
    });
  }, [param, user]);

  return (
    <>
      <ForwardHeader
        onSearchTxt={onSearchTxt}
        onPrevious={() => onSetDrawerType("info")}
      />
      <Box
        display="flex"
        flexDirection="column"
        overflow="hidden"
        height="calc(500px - 77px)"
      >
        <ChatForward
          loading={loading}
          conversations={conversations}
          callbackCancel={() => onCloseDrawer("info")}
        />
      </Box>
    </>
  );
};

export default ForwardLayout;
