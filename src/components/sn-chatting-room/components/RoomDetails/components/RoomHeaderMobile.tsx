import React, { useMemo, useState } from "react";
import { Avatar, Box, IconButton, ImageList, Typography } from "@mui/material";
import VideoCallIcon from "icons/VideoCallIcon";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CallIcon from "icons/CallIcon";
import ChatDetailUserMobile from "./ChatDetailUserMobile";
import GroupChatMobile from "./GroupChatMobile";
import ComponentAvatar from "components/Avatar";
import { useChat } from "store/chat/selectors";

const RoomHeaderMobile = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { conversationInfo: currentConversation, onResetConversationInfo } =
    useChat();
  // Handler to open the drawer.
  const openDrawer = () => {
    setIsDrawerOpen(true);
  };

  // Handler to close the drawer.
  const closeDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const PrivateChatLayout = () => {
    if (currentConversation?.usersCount === 2) {
      return ChatDetailUserMobile;
    } else {
      return GroupChatMobile;
    }
  };

  const ObjectLayout = {
    c: GroupChatMobile,
    d: ChatDetailUserMobile,
    p: PrivateChatLayout(),
  };
  const styleIcon = { color: "white", fontSize: "24px", cursor: "pointer" };
  const typeOfChat = currentConversation?.t;
  const RenderedComponent = ObjectLayout[typeOfChat];

  const isGroup = useMemo(
    () => currentConversation?.t !== "d",
    [currentConversation],
  );

  const groupAvatar = useMemo(() => {
    if (isGroup && currentConversation?.usersCount > 3) {
      return (
        <ImageList
          sx={{
            width: 52,
            height: 52,
            margin: 0,
            alignItems: "center",
            alignContent: "center",
            gap: "2px!important",
          }}
          cols={2}
          rowHeight={164}
        >
          <ComponentAvatar
            alt="Avatar"
            size={22}
            style={{
              borderRadius: "5px",
            }}
          />
          <ComponentAvatar
            alt="Avatar"
            size={22}
            style={{
              borderRadius: "5px",
            }}
          />
          <ComponentAvatar
            alt="Avatar"
            size={22}
            style={{
              borderRadius: "5px",
            }}
          />
          {currentConversation.usersCount - 3 > 0 ? (
            <Box
              sx={{
                textAlign: "center",
                borderRadius: "5px",
                backgroundColor: "#3078F1",
                color: "white",
                width: "22px",
                height: "22px",
                lineHeight: "22px",
              }}
            >
              <Typography variant="caption">
                +{currentConversation.usersCount - 3}
              </Typography>
            </Box>
          ) : null}
        </ImageList>
      );
    } else {
      return (
        <Avatar
          src={currentConversation?.avatar}
          sx={{
            width: "32px",
            height: "32px",
            borderRadius: "9999px",
          }}
        />
      );
    }
  }, [isGroup, currentConversation?.usersCount, currentConversation?.avatar]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "54px",
        padding: "0 16px",
        flexShrink: 0,
        backgroundColor: "#3699FF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <ArrowBackIosNewIcon
          style={styleIcon}
          onClick={onResetConversationInfo}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onClick={openDrawer}
        >
          {groupAvatar}
          <Box display="flex" flexDirection="column" gap="4px">
            <Typography variant="h6" color="#FFF">
              {currentConversation?.t !== "d"
                ? currentConversation?.name?.replaceAll("_", " ")
                : currentConversation?.name}
            </Typography>
            <Typography variant="body2" color="rgba(255, 255, 255, 0.60)">
              {currentConversation?.status}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton
          sx={{
            color: "transparent",
          }}
        >
          <CallIcon />
        </IconButton>
        <IconButton
          sx={{
            color: "transparent",
          }}
        >
          <VideoCallIcon stroke={"#FFF"} />
        </IconButton>
        {RenderedComponent && (
          <RenderedComponent
            isOpen={isDrawerOpen}
            onClose={closeDrawer}
            currentConversation={currentConversation}
          />
        )}
      </Box>
    </Box>
  );
};

export default RoomHeaderMobile;
