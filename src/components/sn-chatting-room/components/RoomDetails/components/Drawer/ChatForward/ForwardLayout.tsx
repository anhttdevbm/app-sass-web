import Box from "@mui/material/Box";
import { useChat } from "store/chat/selectors";
import ForwardHeader from "./ForwarHeader";
import ChatForward from "components/sn-chat/ChatForward";
import { useState } from "react";
import { debounce } from "utils/index";

const ForwardLayout = () => {
  const {
    onSetDrawerType,
    onCloseDrawer,
    convention: conversations,
  } = useChat();
  const [param, setParam] = useState({
    text: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const onSearchTxt = debounce((value) => {
    setParam({
      text: value,
    });
  }, 200);

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
        height="calc(500px - 30px)"
      >
        <ChatForward
          loading={loading}
          conversations={conversations}
          textFilter={param.text}
          callbackCancel={() => onCloseDrawer("info")}
        />
      </Box>
    </>
  );
};

export default ForwardLayout;
