import GroupNameIcon from "icons/GroupNameIcon";
import { TYPE_POPUP } from "components/sn-chat/chatGroup/ChatDetailGroup";
import ItemMemberDetail from "components/sn-chat/chatGroup/ItemMemberDetail";

import { Box, styled, Typography } from "@mui/material";
import ChatDetailInfoMenuItem from "./ChatDetailInfoMenuItem";
import { useTranslations } from "next-intl";
import { NS_CHAT_BOX } from "constant/index";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import { useChat } from "store/chat/selectors";
import { useAuth } from "store/app/selectors";
import { ChangeEvent, FC } from "react";
import { ChatDetailInfoProps } from ".";
import EditGroupNameIcon from "icons/EditGroupNameIcon";
import useTheme from "hooks/useTheme";
import { isOwnerGroup } from "store/chat/helpers";

interface ChatDetailGroupProps extends Partial<ChatDetailInfoProps> {
  handleNewAdd: () => void;
  handleChangeName: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClosePopup: () => void;
  handleManageMember: (action: "addAdmin" | "remove", member: any) => any;
  _renderContentPopup: () => JSX.Element;
  showPopup: any;
  setShowPopup: any;
  currentName?: string;
}

const ChatDetailGroup: FC<ChatDetailGroupProps> = (props) => {
  const commonChatBox = useTranslations(NS_CHAT_BOX);

  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const { dataTransfer: currentConversation } = useChat();

  //check owner
  const owner = isOwnerGroup(currentConversation?.userCreate?.id, user?.id);
  const admin = currentConversation?.lstMember?.find((item) => item === user?.id);
  const isOwnerOrAdmin = owner || admin;

  return (
    <>
      <ChatDetailInfoMenuItem
        text={"Group Name: " + currentConversation?.name}
        icon={GroupNameIcon}
        callBackOpenDrawer={() =>
          props?.setShowPopup((pre) => ({
            ...pre,
            type: TYPE_POPUP.RENAME_GROUP,
            statusPopup: true,
            title: commonChatBox("chatBox.changeName"),
            content: <></>,
            actionType: 0,
          }))
        }
        callBackIcon={EditGroupNameIcon}
        dontOpenDrawer={true}
      />
      <Box
        sx={{
          padding: "12px 0",
          border: "1px solid #ECECF3",
          borderRight: "none",
          borderLeft: "none",
          width: "100%",
          margin: "24px 0",
        }}
      >
        {(props?.menuItems as any[])
          .filter((item) => item.type !== "account")
          .map((item, index) => (
            <ChatDetailInfoMenuItem
              key={index}
              text={item.text}
              icon={item.icon}
              callBackOpenDrawer={item.callback}
              type={item?.type}
            />
          ))}
      </Box>
      <CustomBox height={"50%"}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            margin: "10px 0",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              color={isDarkMode ? "white" : "#212121"}
              fontSize={16}
              fontWeight={600}
            >
              {`${commonChatBox("chatBox.members")} (${
                currentConversation?.lstMember?.length || 0
              })`}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            overflow: "auto",
            height: "80%",
          }}
        >
          {currentConversation?.lstMember?.map((member, index) => (
            <ItemMemberDetail
              key={index}
              data={member}
              admin={isOwnerOrAdmin}
            />
          ))}
        </Box>
      </CustomBox>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        {isOwnerOrAdmin && (
          <Box sx={{ marginBottom: 1 }}>
            <Typography
              variant="caption"
              color="#F64E60"
              fontSize={14}
              fontWeight={600}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                props?.setShowPopup((pre) => ({
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
        {currentConversation?.members?.length > 1 && (
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="caption"
              color="#F64E60"
              fontSize={14}
              fontWeight={600}
              sx={{ cursor: "pointer" }}
              onClick={() => {
                if (isOwnerOrAdmin) {
                  if (currentConversation?.admins?.length > 1) {
                    props?.setShowPopup((pre) => ({
                      ...pre,
                      type: TYPE_POPUP.LEAVE_OWNER,
                      statusPopup: true,
                      title: commonChatBox("chatBox.leaveGroup"),
                      content: <>{commonChatBox("chatBox.sureLeaveGroup")}</>,
                    }));
                  } else {
                    props?.setShowPopup((pre) => ({
                      ...pre,
                      type: TYPE_POPUP.LEAVE_OWNER_AND_ADD_ADMIN,
                      statusPopup: true,
                      title: commonChatBox("chatBox.leaveGroup"),
                      content: (
                        <Box
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <Typography>
                            {commonChatBox("chatBox.leaveGroupConfirm.text_1")}
                          </Typography>
                          <Typography>
                            {commonChatBox("chatBox.leaveGroupConfirm.text_2")}{" "}
                            <span
                              style={{
                                color: "var(--brand-primary, #3699FF)",
                                cursor: "pointer",
                              }}
                              onClick={props?.handleNewAdd}
                            >
                              {commonChatBox("chatBox.selectAdminNew")}
                            </span>
                          </Typography>
                        </Box>
                      ),
                    }));
                  }
                } else {
                  props?.setShowPopup((pre) => ({
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
      {props?.showPopup?.statusPopup && (
        <DefaultPopupLayout
          title={props?.showPopup?.title}
          content={props?._renderContentPopup()}
          open={props?.showPopup?.statusPopup}
          onClose={props?.handleClosePopup}
          sx={{ width: props?.showPopup?.widthPopup }}
        />
      )}
    </>
  );
};

export default ChatDetailGroup;

const CustomBox = styled(Box)`
  overflow: auto;
  width: 100%;
  padding-bottom: 5%;
`;
