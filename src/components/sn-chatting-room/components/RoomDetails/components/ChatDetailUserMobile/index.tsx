import { Avatar, Box, Drawer, Typography } from "@mui/material";
import ChatDetailUserHeaderMobile from "./ChatDetailUserHeaderMobile";
import { IChatItemInfo } from "store/chat/type";
import ChatDetailUserMenuItemMobile from "./ChatDetailUserMenuItemMobile";
import DeleteChatIcon from "icons/DeleteChatIcon";
import SearchDetailChatUser from "../SearchDetailChatUser";
import { useChatDetailUserMobile } from "./UseChatDetailUserMobile";
import { useChatDetailInfoReturns } from "components/sn-chatting-room/hooks/useChatDetailInfo";
import DrawerMobile from "../DrawerMobile";

type ChatDetailUserMobileProps = {
  isOpen: boolean;
  onClose: () => void;
  currentConversation: IChatItemInfo;
} & useChatDetailInfoReturns;

const ChatDetailUserMobile: React.FC<ChatDetailUserMobileProps> = ({
  isOpen,
  onClose,
  currentConversation,
}) => {
  const {
    menuItems,
    accountInfoShow,
    searchConversationShow,
    handleCloseAccountInfoMobile,
    handleSearchConversation,
    typeDrawer,
    onChangeTypeDrawer,
  } = useChatDetailUserMobile({ currentConversation });

  const styleDrawerOpen = isOpen ? { width: "100%" } : { width: "0" };

  return (
    <Drawer
      sx={{
        flexShrink: 0,
        ...styleDrawerOpen,
        "& .MuiDrawer-paper": {
          width: "100%",
          boxSizing: "border-box",
          border: "none",
        },
      }}
      variant="persistent"
      anchor="right"
      open={isOpen}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          position: "relative",
          height: "100%",
          gap: "12px",
        }}
      >
        <ChatDetailUserHeaderMobile onClose={onClose} />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            marginBottom: "18px",
          }}
        >
          <Avatar
            src={currentConversation?.avatar}
            sx={{
              height: "80px",
              width: "80px",
              flexShrink: "0",
              borderRadius: "50%",
            }}
          />
          <Box>
            <Typography
              variant="h4"
              color="var(--Black, #212121)"
              sx={{ textAlign: "center" }}
            >
              {currentConversation?.name}
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "12px 24px",
              marginX: "16px",
              gap: "8px",
              borderRadius: "16px",
              backgroundColor: "#F7F7FD",
            }}
          >
            {menuItems.map((item, index) => (
              <ChatDetailUserMenuItemMobile
                key={index}
                text={item.text}
                icon={item.icon}
                stroke={item.stroke}
                borderBottom={item.borderBottom}
                handleOnClick={() =>
                  item?.handleOnClick && item.handleOnClick()
                }
              />
            ))}
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "12px 24px",
              marginX: "16px",
              gap: "8px",
              borderRadius: "16px",
              backgroundColor: "#F7F7FD",
            }}
          >
            <ChatDetailUserMenuItemMobile
              text="Delete chat"
              icon={DeleteChatIcon}
            />
          </Box>
        </Box>
        <SearchDetailChatUser
          isOpen={searchConversationShow}
          onClose={handleSearchConversation}
          currentConversation={currentConversation}
        />
        <DrawerMobile
          isOpen={accountInfoShow}
          onClose={handleCloseAccountInfoMobile}
          currentConversation={currentConversation}
          onChangeTypeDrawer={onChangeTypeDrawer}
          type={typeDrawer}
        />
      </Box>
    </Drawer>
  );
};

export default ChatDetailUserMobile;
