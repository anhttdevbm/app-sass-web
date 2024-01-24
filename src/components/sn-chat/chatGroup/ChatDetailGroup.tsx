/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import Avatar from "components/Avatar";
import {
  Box,
  Button,
  Fab,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import ItemMemberDetail from "./ItemMemberDetail";
import GroupNameIcon from "icons/GroupNameIcon";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import { useEffect, useState, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { NS_CHAT_BOX, NS_COMMON } from "constant/index";
import FileGroupIcon from "icons/FileGroupIcon";
import ArrowRightIcon from "icons/ArrowRightIcon";
import EditGroupNameIcon from "icons/EditGroupNameIcon";
import UploadImageIcon from "icons/UploadImageIcon";
import { IconButton } from "components/shared";
import { useChat } from "store/chat/selectors";
import { STEP, TYPE_LIST } from "store/chat/type";
import { DataStatus } from "constant/enums";
import { useAuth, useSnackbar } from "store/app/selectors";
import ItemDetail from "../components/ItemDetail";
import MediaFileIconGroup from "icons/MediaFileIconGroup";
import LinkIconGroup from "icons/LinkIconGroup";
import { uploadFile } from "store/chat/media/actionMedia";
import { useAppDispatch } from "store/hooks";
import useTheme from "hooks/useTheme";
import { UploadAvatarGroup } from "./UploadAvatarGroup";
import ForwardLayout from "components/sn-chatting-room/components/RoomDetails/components/Drawer/ChatForward/ForwardLayout";

export const TYPE_POPUP = {
  DELETE: "DELETE",
  LEAVE_AND_NEW_ADD: "LEAVE_AND_NEW_ADD",
  LEAVE_OWNER: "LEAVE_OWNER",
  LEAVE_MEMBER: "LEAVE_MEMBER",
  NEW_ADMIN: "NEW_ADMIN",
  RENAME_GROUP: "RENAME_GROUP",
  FORWARD_MESSAGE: "FORWARD_MESSAGE",
};

const ChatDetailGroup = (props) => {
  const dispatch = useAppDispatch();
  const { isDarkMode } = useTheme();

  const {
    typeList,
    dataTransfer,
    groupMembers,
    onSetStep,
    onLeftGroup,
    onRenameGroup,
    onSetTypeList,
    onSetDataTransfer,
    onFetchGroupMembersMember,
    onChangeGroupRole,
    onRemoveGroupMember,
    onDeleteConversationGroup,
    onGetAllConvention,
  } = useChat();
  const { user } = useAuth();
  //check owner
  const owners = Object.values(groupMembers).filter((item) =>
    item.roles.includes("owner"),
  );
  const owner = owners.some((obj) => obj._id === user?.id_rocket);

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
    setRenameGroup(dataTransfer?.name?.replaceAll("_", " "));
    setShowPopup(init);
  };

  useEffect(() => {
    setRenameGroup(dataTransfer?.name?.replaceAll("_", " "));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTransfer]);

  useEffect(() => {
    onFetchGroupMembersMember({
      roomId: dataTransfer?._id,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManageMember = async (action: "addAdmin" | "remove", member) => {
    if (action === "addAdmin") {
      const result = (await onChangeGroupRole({
        groupId: dataTransfer?._id,
        userIdToChange: member?._id,
        newRole: "addOwner",
      })) as any;
      if (result?.error) {
        return onAddSnackbar(result?.error?.message, "error");
      }
      // (await onChangeGroupRole({
      //   groupId: dataTransfer?._id,
      //   userIdToChange: user?.id_rocket ?? "",
      //   newRole: "removeOwner",
      // })) as any;
      onAddSnackbar(commonChatBox("chatBox.group.adminChange"), "success");
    } else {
      const result = (await onRemoveGroupMember({
        groupId: dataTransfer?._id,
        userIdToKick: member?._id,
      })) as any;
      if (result?.error) {
        return onAddSnackbar(result?.error?.message, "error");
      }
      onAddSnackbar(commonChatBox("chatBox.group.removeMember"), "success");
    }
    onFetchGroupMembersMember({
      roomId: dataTransfer?._id,
    });
  };

  const _renderNewAdmin = () => {
    return (
      <>
        <Box sx={{ width: "100%", margin: "0 50px" }}>
          {groupMembers?.length > 0
            ? groupMembers
                .filter((m) => m._id !== user?.id_rocket)
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
                        setUserId(item?._id);
                        setShowPopup((pre) => ({
                          ...pre,
                          type: TYPE_POPUP.LEAVE_AND_NEW_ADD,
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
  const handleSuccess = (result) => {
    if (result?.error) {
      onAddSnackbar(result?.error?.message, "error");
      return;
    }
    onAddSnackbar(commonT("success"), "success");
    onGetAllConvention({
      type: "a",
      text: "",
      offset: 0,
      count: 10,
    });
    onSetStep(STEP.CONVENTION);
  };

  const handlePopup = async () => {
    if (!renameGroup.trim()) {
      return onAddSnackbar("Invalid group name!", "error");
    }
    const renameGroupApi = async () => {
      const dataTransferNew = {
        ...dataTransfer,
        name: renameGroup.replace("_", " "),
        fname: renameGroup.replace("_", " "),
      };

      const renameResult = (await onRenameGroup({
        roomId: dataTransfer?._id,
        name: renameGroup.replace(" ", "_"),
      })) as any;

      if (renameResult?.error) {
        return onAddSnackbar(
          commonT("form.error.renameGroup", {
            name: renameResult?.meta?.arg?.name,
          }),
          "error",
        );
      } else {
        onGetAllConvention({
          type: "a",
          text: "",
          offset: 0,
          count: 10,
        });
        onSetDataTransfer(dataTransferNew);
        onAddSnackbar(commonChatBox("chatBox.group.rename_alert"), "success");
      }
    };
    const left = async () => {
      const leftResult = (await onLeftGroup({
        roomId: dataTransfer?._id,
      })) as any;
      if (leftResult?.error) {
        return onAddSnackbar(leftResult?.error?.message, "error");
      } else {
        handleSuccess(leftResult);
      }
    };
    const addAndRemove = async (add: string, remove: string) => {
      const addOwnerResult = (await onChangeGroupRole({
        groupId: dataTransfer?._id,
        userIdToChange: add,
        newRole: "addOwner",
      })) as any;
      if (addOwnerResult?.error) {
        return onAddSnackbar(addOwnerResult?.error?.message, "error");
      }
      const removeOwner = (await onChangeGroupRole({
        groupId: dataTransfer?._id,
        userIdToChange: remove,
        newRole: "removeOwner",
      })) as any;
      if (removeOwner?.error) {
        return onAddSnackbar(removeOwner?.error?.message, "error");
      }
    };
    switch (showPopup?.type) {
      case TYPE_POPUP.DELETE:
        //CALL API DELETE
        const result = onDeleteConversationGroup({
          type: "p",
          roomId: dataTransfer?._id,
        });
        onSetStep(STEP.CONVENTION);
        handleSuccess(result);
        break;
      case TYPE_POPUP.LEAVE_MEMBER:
        await left();
        break;
      case TYPE_POPUP.LEAVE_AND_NEW_ADD:
        await addAndRemove(userId, user?.id_rocket ?? "");
        await left();
        break;
      case TYPE_POPUP.LEAVE_OWNER:
        //NEW OWNER RANDOM
        const random = groupMembers
          ?.filter((m) => m._id !== user?.id_rocket)
          ?.pop()?._id;
        if (!random) return onAddSnackbar("Error!", "error"); // Handle delete group
        await addAndRemove(random, user?.id_rocket ?? "");
        await left();
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
            text={`${commonChatBox(
              "chatBox.groupName",
            )} ${dataTransfer?.name?.replaceAll("_", " ")}`}
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
            }}
          />
          <ItemDetail
            text={commonChatBox("chatBox.link")}
            icon={<LinkIconGroup />}
            iconClick={<ArrowRightIcon />}
            onClick={() => {
              onSetStep(STEP.LIST);
              onSetTypeList(TYPE_LIST.LINK_LIST);
            }}
          />

          <ItemDetail
            text={commonChatBox("chatBox.file")}
            icon={<FileGroupIcon />}
            iconClick={<ArrowRightIcon />}
            onClick={() => {
              onSetStep(STEP.LIST);
              onSetTypeList(TYPE_LIST.FILE_LIST);
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
                dataTransfer?.usersCount
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
            height: owner ? "30%" : "46%",
            // height: "180px",
            overflow: "auto",
          }}
        >
          {groupMembers?.map((member, index) => (
            <ItemMemberDetail
              key={index}
              data={member}
              callbackAddAdmin={() => {
                handleManageMember("addAdmin", member);
              }}
              callbackRemove={() => {
                handleManageMember("remove", member);
              }}
              admin={owner}
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
            {owner && (
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
                      setShowPopup((pre) => ({
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
                                onClick={handleNewAdd}
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
