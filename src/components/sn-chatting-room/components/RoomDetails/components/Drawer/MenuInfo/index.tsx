import { Box, Typography, Avatar, CircularProgress } from "@mui/material";
import { FC, useMemo } from "react";
import useTheme from "hooks/useTheme";
import { UploadAvatarGroup } from "components/sn-chat/chatGroup/UploadAvatarGroup";
import ChatDetailInfoHeader from "../../ChatDetailInfo/ChatDetailInfoHeader";
import ChatDetailInfoMenuItem from "../../ChatDetailInfo/ChatDetailInfoMenuItem";
import ChatDetailGroup from "../../ChatDetailInfo/ChatDetailGroup";
import { useActionGroupDetails } from "../../ChatDetailInfo/useActionGroupDetails";
import useGetScreenMode from "hooks/useGetScreenMode";
import { useChat } from "store/chat/selectors";
import { useChatDetailInfo } from "components/sn-chatting-room/hooks/useChatDetailInfo";
import { useAuth } from "store/app/selectors";
import { TYPE_POPUP } from "components/sn-chat/chatGroup/ChatDetailGroup";
import { useTranslations } from "next-intl";
import { NS_CHAT_BOX } from "constant/index";

const MenuInfo = () => {
  const { isDarkMode } = useTheme();
  const { extraDesktopMode } = useGetScreenMode();
  const {
    onCloseDrawer,
    dataTransfer: currentConversation,
    conversationInfo,
    groupMembers,
  } = useChat();

  const { user } = useAuth();

  const { menuItems } = useChatDetailInfo({
    currentConversation,
    conversationInfo,
  });

  const renderColorByType = useMemo(() => {
    if (currentConversation?.t === "d") {
      if (isDarkMode) return "#313130";
      return "var(--Gray0, #F7F7FD)";
    }
    if (isDarkMode) return "#313130";
    return "#ffffff";
  }, [isDarkMode, currentConversation?.t]);

  const propsActionGroupDetail = useActionGroupDetails();

  //check owner
  const owners = Object.values(groupMembers).filter((item) =>
    item.roles.includes("owner"),
  );
  const owner = owners.some((obj) => obj._id === user?.id_rocket);
  const commonChatBox = useTranslations(NS_CHAT_BOX);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        width: extraDesktopMode ? "424px" : "272px",
        // height: extraDesktopMode ? "948px" : "730px",
        backgroundColor: renderColorByType,
        gap: "12px",
        overflow: "auto",
        height: "100%",
      }}
    >
      <>
        <ChatDetailInfoHeader onClose={() => onCloseDrawer("info")} />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            position: "relative",
            paddingTop: "80px",
          }}
        >
          <Avatar
            src={currentConversation?.avatar}
            sx={{
              height: "80px",
              width: "80px",
              flexShrink: "0",
              borderRadius: "10px",
            }}
          />
          {currentConversation?.t !== "d" && <UploadAvatarGroup />}
        </Box>
        <Box>
          <Typography
            variant="h6"
            color={isDarkMode ? "white" : "var(--Black, #212121)"}
            sx={{ textAlign: "center" }}
          >
            {currentConversation?.t !== "d"
              ? currentConversation?.name?.replaceAll("_", " ")
              : currentConversation?.name}
          </Typography>
        </Box>{" "}
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            alignSelf: "stretch",
            flexDirection: "column",
            padding: "0px 12px",
          }}
        >
          {currentConversation?.t === "d" ? (
            menuItems.map((item, index) => (
              <ChatDetailInfoMenuItem
                key={index}
                text={item.text}
                icon={item.icon}
                callBackOpenDrawer={item.callback}
                type={item?.type}
              />
            ))
          ) : (
            <ChatDetailGroup
              currentName={currentConversation?.name?.replaceAll("_", " ")}
              menuItems={menuItems}
              {...propsActionGroupDetail}
            />
          )}
        </Box>
        {currentConversation?.t !== "d" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              alignItems: "center",
              flexDirection: "column",
              position: "fixed",
              bottom: "0px",
              maxWidth: "267px",
              background: "white",
              height: "60px",
              boxShadow: "rgba(0, 0, 0, 0.1) 0px 10px 50px;",
            }}
          >
            {owner && (
              <Box sx={{ marginBottom: 1 }}>
                <Typography
                  variant="caption"
                  color="#F64E60"
                  fontSize={14}
                  fontWeight={600}
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    propsActionGroupDetail?.setShowPopup((pre) => ({
                      ...pre,
                      type: TYPE_POPUP.DELETE,
                      statusPopup: true,
                      title: commonChatBox("chatBox.deleteGroup"),
                      content: <>{commonChatBox("chatBox.sureRemoveGroup")}</>,
                      actionType: 0,
                    }));
                  }}
                >
                  {commonChatBox("chatBox.deleteGroup")}
                </Typography>
              </Box>
            )}
            {groupMembers.length > 1 && (
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="caption"
                  color="#F64E60"
                  fontSize={14}
                  fontWeight={600}
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    if (owner) {
                      propsActionGroupDetail?.setShowPopup((pre) => ({
                        ...pre,
                        type: TYPE_POPUP.LEAVE_OWNER,
                        statusPopup: true,
                        title: commonChatBox("chatBox.leaveGroup"),
                        content: (
                          <Box
                            sx={{
                              textAlign: "center",
                            }}
                          >
                            <Typography>
                              {commonChatBox(
                                "chatBox.leaveGroupConfirm.text_1",
                              )}
                            </Typography>
                            <Typography>
                              {commonChatBox(
                                "chatBox.leaveGroupConfirm.text_2",
                              )}{" "}
                              <span
                                style={{
                                  color: "var(--brand-primary, #3699FF)",
                                  cursor: "pointer",
                                }}
                                onClick={propsActionGroupDetail?.handleNewAdd}
                              >
                                {commonChatBox("chatBox.selectAdminNew")}
                              </span>
                            </Typography>
                            <Typography>
                              {commonChatBox(
                                "chatBox.leaveGroupConfirm.text_3",
                              )}
                            </Typography>
                          </Box>
                        ),
                      }));
                    } else {
                      propsActionGroupDetail.setShowPopup((pre) => ({
                        ...pre,
                        type: TYPE_POPUP.LEAVE_MEMBER,
                        statusPopup: true,
                        title: commonChatBox("chatBox.leaveGroup"),
                        content: <>{commonChatBox("chatBox.sureLeaveGroup")}</>,
                      }));
                    }
                  }}
                >
                  {commonChatBox("chatBox.leaveGroup")}
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </>
    </Box>
  );
};

export default MenuInfo;
