/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { Box, Button, TextField, Typography } from "@mui/material";
import Avatar from "components/Avatar";
import ForwardLayout from "components/sn-chatting-room/components/RoomDetails/components/Drawer/ChatForward/ForwardLayout";
import { NS_CHAT_BOX, NS_COMMON } from "constant/index";
import useTheme from "hooks/useTheme";
import ArrowRightIcon from "icons/ArrowRightIcon";
import EditGroupNameIcon from "icons/EditGroupNameIcon";
import FileGroupIcon from "icons/FileGroupIcon";
import GroupNameIcon from "icons/GroupNameIcon";
import LinkIconGroup from "icons/LinkIconGroup";
import MediaFileIconGroup from "icons/MediaFileIconGroup";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import { useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useState } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";
import { isAdminGroup, isOwnerGroup, useChatHelpers } from "store/chat/helpers";
import { useChat } from "store/chat/selectors";
import { STEP, TYPE_LIST } from "store/chat/type";
import ItemDetail from "../components/ItemDetail";
import ItemMemberDetail from "./ItemMemberDetail";
import { UploadAvatarGroup } from "./UploadAvatarGroup";

export const TYPE_POPUP = {
  DELETE: "DELETE",
  LEAVE_AND_NEW_ADD: "LEAVE_AND_NEW_ADD",
  LEAVE_OWNER: "LEAVE_OWNER",
  LEAVE_OWNER_AND_ADD_ADMIN: "LEAVE_OWNER_AND_ADD_ADMIN",
  LEAVE_MEMBER: "LEAVE_MEMBER",
  NEW_ADMIN: "NEW_ADMIN",
  RENAME_GROUP: "RENAME_GROUP",
  FORWARD_MESSAGE: "FORWARD_MESSAGE",
};

const ChatDetailGroup = (props) => {
  const { isDarkMode } = useTheme();

  const { dataTransfer, onSetStep, onSetTypeList, onSetDataTransfer } =
    useChat();
  const { user } = useAuth();
  const {
    handleGetChatMedias,
    handleGetChatLinks,
    handleGetChatFiles,
    memberLeftGroup,
    deleteGroup,
    groupUpdateName,
    addNewAdmin,
    adminLeftGroup,
  } = useChatHelpers();
  //check owner
  const owner = isOwnerGroup(dataTransfer?.owner, user?.id);
  const admin = isAdminGroup(dataTransfer?.admins, user?.id);
  const isOwnerOrAdmin = owner || admin; // current user

  const commonT = useTranslations(NS_COMMON);
  const commonChatBox = useTranslations(NS_CHAT_BOX);

  const init = {
    type: "",
    statusPopup: false,
    title: "",
    content: <></>,
    actionType: 0,
    widthPopup: "500px",
  };

  const [showPopup, setShowPopup] = useState(init);
  const [renameGroup, setRenameGroup] = useState("");
  const [userId, setUserId] = useState("");
  const { onAddSnackbar } = useSnackbar();
  const handleClosePopup = () => {
    setRenameGroup(dataTransfer?.name);
    setShowPopup(init);
  };

  useEffect(() => {
    setRenameGroup(dataTransfer?.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTransfer]);

  const _renderNewAdmin = () => {
    return (
      <>
        <Box sx={{ width: "100%", margin: "0 50px" }}>
          {dataTransfer?.members?.length > 0
            ? dataTransfer?.members
                .filter((item) => item?.id != user?.id)
                .map((item, index) => {
                  return (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: 1,
                        // cursor: "pointer",
                        ":hover": {
                          backgroundColor: isDarkMode ? "#3a3b3c" : "#F7F7FD",
                        },
                      }}
                      p={1}
                      onClick={() => {
                        setUserId(item?.id);
                        setShowPopup((pre) => ({
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
                                {commonChatBox("chatBox.leaveGroupMsg.text_1")}{" "}
                                <span
                                  style={{
                                    color: "var(--brand-primary, #3699FF)",
                                  }}
                                >
                                  {item?.fullname}
                                </span>{" "}
                                {commonChatBox("chatBox.leaveGroupMsg.text_2")}
                              </Typography>
                            </Box>
                          ),
                        }));
                      }}
                      key={index}
                    >
                      <Avatar
                        src={item?.avatar}
                        alt="Avatar"
                        size={80}
                        style={{
                          borderRadius: "50%",
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography variant="inherit" fontWeight="bold">
                          {item?.fullname}
                        </Typography>
                        <Typography variant="caption" color="#999999">
                          {item?.email}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })
            : null}
        </Box>
      </>
    );
  };

  const _renderContentPopup = () => {
    return (
      <Box
        sx={{
          margin: "10px 0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            margin: "10px 0",
            justifyContent: "center",
          }}
        >
          {showPopup?.type === TYPE_POPUP.RENAME_GROUP ? (
            <TextField
              size="small"
              sx={{
                backgroundColor: "white",
                borderRadius: "10px",
                "& .MuiInputBase-root": {
                  color: "black",
                  borderRadius: "10px",
                  border: "1px solid transparent",
                },
                margin: "0 50px",
              }}
              placeholder="Enter name"
              fullWidth
              value={renameGroup}
              onChange={handleChangeName}
            />
          ) : (
            showPopup?.content
          )}
        </Box>
        {[TYPE_POPUP.FORWARD_MESSAGE].includes(showPopup?.type) && (
          <ForwardLayout />
        )}
        {![TYPE_POPUP.NEW_ADMIN].includes(showPopup?.type) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              padding: 2,
            }}
          >
            <Button
              type="button"
              variant="primaryOutlined"
              size="small"
              sx={defaultSx.buttonCancel}
              onClick={handleClosePopup}
            >
              {commonT("form.cancel")}
            </Button>
            <Button
              variant="primary"
              sx={defaultSx.buttonConfirm}
              type="button"
              size="small"
              onClick={handlePopup}
            >
              {commonT("form.confirm")}
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  const handlePopup = async () => {
    const renameGroupApi = async () => {
      if (!renameGroup.trim()) {
        return onAddSnackbar("Invalid group name!", "error");
      }
      const dataTransferNew = {
        ...dataTransfer,
        name: renameGroup,
      };
      groupUpdateName(renameGroup);
      onSetDataTransfer(dataTransferNew);
      onAddSnackbar(commonT("success"), "success");
    };

    const ownerLeftAndAddNewAdmin = () => {
      if (!userId) {
        onAddSnackbar("Please select a new admin!", "error");
        return;
      }
      // add new admin
      addNewAdmin(userId);

      // remove admin or owner
      if (dataTransfer?.admins?.find((item) => item === user?.id)) {
        adminLeftGroup(user?.id);
      } else {
        memberLeftGroup(user?.id);
      }

      setUserId("");
    };

    const ownerLeftGroup = () => {
      memberLeftGroup(user?.id);
    };

    switch (showPopup?.type) {
      case TYPE_POPUP.DELETE:
        deleteGroup();
        break;
      case TYPE_POPUP.LEAVE_MEMBER:
        memberLeftGroup(user?.id);
        break;
      case TYPE_POPUP.LEAVE_OWNER_AND_ADD_ADMIN:
        ownerLeftAndAddNewAdmin();
        break;
      case TYPE_POPUP.LEAVE_OWNER:
        ownerLeftGroup();
        break;
      case TYPE_POPUP.RENAME_GROUP:
        await renameGroupApi();
        break;
      default:
        break;
    }
    setShowPopup(init);
  };

  const handleNewAdd = () => {
    setShowPopup((pre) => ({
      ...pre,
      type: TYPE_POPUP.NEW_ADMIN,
      statusPopup: true,
      title: commonChatBox("chatBox.selectAdminNew"),
      content: <>{_renderNewAdmin()}</>,
    }));
  };

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setRenameGroup(event.target.value);
  };

  return (
    <>
      <Box
        sx={{
          margin: "16px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              position: "relative",
            }}
          >
            <Avatar
              alt="Avatar"
              src={dataTransfer?.avatar}
              size={80}
              style={{
                borderRadius: "50%",
                margin: "auto",
              }}
            />
            <UploadAvatarGroup />
          </Box>
        </Box>
        <Box
          sx={{
            borderBottom: "1px solid #ECECF3",
            paddingBottom: "10px",
          }}
        >
          <ItemDetail
            text={`${commonChatBox("chatBox.groupName")} ${dataTransfer?.name}`}
            icon={<GroupNameIcon />}
            iconClick={<EditGroupNameIcon />}
            onClick={() => {
              setShowPopup((pre) => ({
                ...pre,
                type: TYPE_POPUP.RENAME_GROUP,
                statusPopup: true,
                title: commonChatBox("chatBox.changeName"),
                content: <></>,
                actionType: 0,
              }));
            }}
          />
          <ItemDetail
            text={commonChatBox("chatBox.media")}
            icon={<MediaFileIconGroup />}
            iconClick={<ArrowRightIcon />}
            onClick={() => {
              onSetStep(STEP.LIST);
              onSetTypeList(TYPE_LIST.MEDIA_LIST);
              handleGetChatMedias(1);
            }}
          />
          <ItemDetail
            text={commonChatBox("chatBox.link")}
            icon={<LinkIconGroup />}
            iconClick={<ArrowRightIcon />}
            onClick={() => {
              onSetStep(STEP.LIST);
              onSetTypeList(TYPE_LIST.LINK_LIST);
              handleGetChatLinks(1);
            }}
          />

          <ItemDetail
            text={commonChatBox("chatBox.file")}
            icon={<FileGroupIcon />}
            iconClick={<ArrowRightIcon />}
            onClick={() => {
              onSetStep(STEP.LIST);
              onSetTypeList(TYPE_LIST.FILE_LIST);
              handleGetChatFiles(1);
            }}
          />
        </Box>
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
                dataTransfer?.members?.length || 0
              })`}
            </Typography>
          </Box>
          <Box>
            {/* <Typography variant="caption" color="#3699FF" fontSize={14} fontWeight={600} sx={{ cursor: "pointer" }}>
              See more
            </Typography> */}
          </Box>
        </Box>
        <Box
          sx={{
            height: isOwnerOrAdmin ? "24%" : "42%",
            // height: "180px",
            overflow: "auto",
          }}
        >
          {dataTransfer?.members?.map((member, index) => (
            <ItemMemberDetail
              key={index}
              data={member}
              admin={isOwnerOrAdmin}
            />
          ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box>
            {isOwnerOrAdmin && (
              <Box sx={{ marginBottom: 1 }}>
                <Typography
                  variant="caption"
                  color="#F64E60"
                  fontSize={14}
                  fontWeight={600}
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    setShowPopup((pre) => ({
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
            {dataTransfer?.members?.length > 1 && (
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="caption"
                  color="#F64E60"
                  fontSize={14}
                  fontWeight={600}
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    if (isOwnerOrAdmin) {
                      if (dataTransfer?.admins?.length > 1) {
                        setShowPopup((pre) => ({
                          ...pre,
                          type: TYPE_POPUP.LEAVE_OWNER,
                          statusPopup: true,
                          title: commonChatBox("chatBox.leaveGroup"),
                          content: (
                            <>{commonChatBox("chatBox.sureLeaveGroup")}</>
                          ),
                        }));
                      } else {
                        setShowPopup((pre) => ({
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
                                  onClick={handleNewAdd}
                                >
                                  {commonChatBox("chatBox.selectAdminNew")}
                                </span>
                              </Typography>
                            </Box>
                          ),
                        }));
                      }
                    } else {
                      setShowPopup((pre) => ({
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
        </Box>
      </Box>
      {showPopup?.statusPopup && (
        <DefaultPopupLayout
          title={showPopup?.title}
          content={_renderContentPopup()}
          open={showPopup?.statusPopup}
          onClose={handleClosePopup}
          sx={{ width: showPopup?.widthPopup }}
        />
      )}
    </>
  );
};

const defaultSx = {
  buttonCancel: {
    minWidth: 120,
    mx: 1.5,
    borderRadius: "0.25rem",
    background: "var(--brand-primary, #3699FF)",
    color: "#fff",
    border: "1px solid var(--brand-primary, #3699FF)",
    "&:hover": {
      background: "var(--brand-primary, #3699FF)",
    },
  },
  buttonConfirm: {
    minWidth: 120,
    mx: 1.5,
    borderRadius: "0.25rem",
    border: "1px solid var(--brand-primary, #3699FF)",
    color: "var(--brand-primary, #3699FF)",
  },
};

export default ChatDetailGroup;
