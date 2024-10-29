import { Avatar, Box, Drawer, IconButton, Typography } from "@mui/material";
import GroupChatHeaderMobile from "./GroupChatHeaderMobile";
import { useGroupChat } from "./useGroupChat";
import EditGroupNameIcon from "icons/EditGroupNameIcon";
import GroupChatItemMobile from "./GroupChatItemMobile";
import MembersMobile from "../GroupDrawerMobile/MembersMobile";
import { IChatItemInfo } from "store/chat/type";
import GroupDrawerMobile from "../GroupDrawerMobile";
import { useChatDetailInfoReturns } from "../ChatDetailUserMobile/UseChatDetailUserMobile";

type GroupChatMobileProps = {
  isOpen: boolean;
  onClose: () => void;
  currentConversation: IChatItemInfo;
} & useChatDetailInfoReturns;

const GroupChatMobile: React.FC<GroupChatMobileProps> = ({
  isOpen,
  onClose,
  currentConversation,
}) => {
  const {
    onOpenDrawer,
    closeDrawer,
    isDrawerOpen,
    topMenuItems,
    midMenuItems,
    bottomMenuItems,
    typeDrawer,
    onChangeTypeDrawer,
  } = useGroupChat({ currentConversation });

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
          gap: "32px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center",
            height: "100%",
            gap: "10px",
          }}
        >
          <GroupChatHeaderMobile onClose={onClose} />
          <Box
            sx={{
              display: "inline-flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Avatar
                src={currentConversation.avatar}
                sx={{
                  height: "55px",
                  width: "55px",
                  flexShrink: "0",
                  borderRadius: "50%",
                }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Typography variant="h4">Group X</Typography>
              <IconButton
                sx={{
                  width: "16px",
                  height: "16px",
                }}
              >
                <EditGroupNameIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            padding: "0 16px",
            gap: "24px",
          }}
        >
          <Box
            sx={{
              borderRadius: "16px",
              backgroundColor: "#F7F7FD",
            }}
          >
            {topMenuItems.map((item, index) => (
              <GroupChatItemMobile
                key={index}
                icon={item.icon}
                text={item.text}
                stroke={item.stroke}
                handleOnClick={item.handleOnClick}
              />
            ))}
          </Box>
          <Box
            sx={{
              borderRadius: "16px",
              backgroundColor: "#F7F7FD",
            }}
          >
            {midMenuItems.map((item, index) => (
              <Box key={index}>
                <GroupChatItemMobile
                  key={index}
                  icon={item.icon}
                  text={item.text}
                  borderBottom={item.borderBottom}
                  stroke={item.stroke}
                  onOpenDrawer={onOpenDrawer}
                  isDrawerOpen={isDrawerOpen}
                  handleOnClick={item.handleOnClick}
                />
                {item.borderBottom && (
                  <Box
                    sx={{
                      width: "85%",
                      margin: "0 auto",
                      borderBottom: "1px solid #ECECF3",
                    }}
                  ></Box>
                )}
              </Box>
            ))}
          </Box>
          <Box
            sx={{
              borderRadius: "16px",
              backgroundColor: "#F7F7FD",
            }}
          >
            {bottomMenuItems.map((item, index) => (
              <Box key={index}>
                <GroupChatItemMobile
                  key={index}
                  icon={item.icon}
                  text={item.text}
                  stroke={item.stroke}
                  borderBottom={item.borderBottom}
                />
                {item.borderBottom && (
                  <Box
                    sx={{
                      width: "85%",
                      margin: "0 auto",
                      borderBottom: "1px solid #ECECF3",
                    }}
                  ></Box>
                )}
              </Box>
            ))}
          </Box>
        </Box>
        <GroupDrawerMobile
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          currentConversation={currentConversation}
          type={typeDrawer}
          onChangeTypeDrawer={onChangeTypeDrawer}
        />
      </Box>
    </Drawer>
  );
};

export default GroupChatMobile;
