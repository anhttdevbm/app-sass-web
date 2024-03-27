import { Box } from "@mui/material";
import React from "react";
import RoomHeader from "./components/RoomHeader";
import Conversation from "components/sn-chat/components/conversation/Conversation";
import useGetScreenMode from "hooks/useGetScreenMode";
import RoomHeaderMobile from "./components/RoomHeaderMobile";
import { useChat } from "store/chat/selectors";

export const DrawerChatIgnore = ["forward", "group-modal"];
const RoomDetails = () => {
  const { mobileMode, extraDesktopMode } = useGetScreenMode();
  const { isOpenInfoChat, typeDrawerChat, dataTransfer } = useChat();

  return (
    <Box
      width="100%"
      height="94vh"
      display="flex"
      justifyContent="space-between"
      flexDirection="column"
    >
      {mobileMode ? <RoomHeaderMobile /> : <RoomHeader />}
      <Conversation
        key={dataTransfer?._id}
        wrapperInputSx={{
          ...(isOpenInfoChat && !DrawerChatIgnore?.includes(typeDrawerChat)
            ? {
                width: `calc(100% - ${extraDesktopMode ? "424px" : "272px"})`,
              }
            : {}),
        }}
      />
    </Box>
  );
};

export default RoomDetails;
