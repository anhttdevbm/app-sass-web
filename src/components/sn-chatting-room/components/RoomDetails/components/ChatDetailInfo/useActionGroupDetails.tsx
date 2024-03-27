import { Box, Typography, TextField, Button } from "@mui/material";
import { STEP } from "store/chat/type";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import Avatar from "components/Avatar";
import { useChat } from "store/chat/selectors";
import { useAuth, useSnackbar } from "store/app/selectors";
import { TYPE_POPUP } from "components/sn-chat/chatGroup/ChatDetailGroup";
import { useTranslations } from "next-intl";
import { NS_CHAT_BOX, NS_COMMON } from "constant/index";
import useTheme from "hooks/useTheme";

const defaultSx = {
  buttonCancel: {
    minWidth: 120,
    mx: 1.5,
    borderRadius: "0.25rem",
    border: "1px solid var(--brand-primary, #3699FF)",
    color: "var(--brand-primary, #3699FF)",
  },
  buttonConfirm: {
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
};

export const useActionGroupDetails = () => {
  const {
    dataTransfer,
    groupMembers,
    onSetConversationInfo,
    onLeftGroup,
    onRenameGroup,
    onSetDataTransfer,
    onFetchGroupMembersMember,
    onChangeGroupRole,
    onRemoveGroupMember,
    onDeleteConversationGroup,
    onGetAllConvention,
    onChangeListConversations,
    convention,
    onCloseDrawer,
    onResetDataTransfer,
  } = useChat();

  const { user } = useAuth();

  const init = {
    type: "",
    statusPopup: false,
    title: "",
    content: <></>,
    actionType: 0,
    widthPopup: "500px",
  };

  const [userId, setUserId] = useState("");
  const { onAddSnackbar } = useSnackbar();
  const [showPopup, setShowPopup] = useState(init);
  const [renameGroup, setRenameGroup] = useState<string>();

  const { isDarkMode } = useTheme();

  const commonChatBox = useTranslations(NS_CHAT_BOX);
  const commonT = useTranslations(NS_COMMON);

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setRenameGroup(event.target.value);
  };

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
    onAddSnackbar(commonT("success"), "success");
    if (dataTransfer?._id !== "GENERAL") {
      onFetchGroupMembersMember({
        roomId: dataTransfer?._id,
      });
    }
  };

  useEffect(() => {
    if (dataTransfer?.t !== "d" && dataTransfer?._id) {
      if (dataTransfer?._id !== "GENERAL") {
        onFetchGroupMembersMember({
          roomId: dataTransfer?._id,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataTransfer]);

  useEffect(() => {
    setRenameGroup(dataTransfer.name.replaceAll("_", " "));
  }, [dataTransfer.name]);

  const handleNewAdd = () => {
    setShowPopup((pre) => ({
      ...pre,
      type: TYPE_POPUP.NEW_ADMIN,
      statusPopup: true,
      title: commonChatBox("chatBox.selectAdminNew"),
      content: <>{_renderNewAdmin()}</>,
    }));
  };

  const handleClosePopup = () => {
    setShowPopup({ ...showPopup, statusPopup: false });
    setRenameGroup(dataTransfer?.name);
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
        {showPopup?.type !== TYPE_POPUP.NEW_ADMIN && (
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
    onCloseDrawer("account");
  };

  const onChangeConversationWhenLeave = useCallback(() => {
    const newConversations = convention?.filter(
      (item) => item._id !== dataTransfer?._id,
    );
    onResetDataTransfer();
    onSetConversationInfo(null);
    onChangeListConversations(newConversations);
  }, [
    convention,
    dataTransfer?._id,
    onChangeListConversations,
    onSetConversationInfo,
    onResetDataTransfer,
  ]);

  const handlePopup = async () => {
    const renameGroupApi = async () => {
      if (!renameGroup) return;
      const dataTransferNew = {
        ...dataTransfer,
        name: renameGroup.replaceAll("_", " "),
        fname: renameGroup.replaceAll("_", " "),
      };
      const renameResult = (await onRenameGroup({
        roomId: dataTransfer?._id,
        name: renameGroup.replaceAll(" ", "_"),
      })) as any;

      if (renameResult?.error) {
        return onAddSnackbar(
          commonT("form.error.renameGroup", {
            name: renameResult?.meta?.arg?.name,
          }),
          "error",
        );
      } else {
        const newConversations = convention?.map((item) => {
          if (item._id === dataTransfer?._id) {
            return dataTransferNew;
          }
          return item;
        });
        onChangeListConversations(newConversations);
        onSetDataTransfer(dataTransferNew);
        onAddSnackbar(commonT("success"), "success");
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
      if (add) {
        const addOwnerResult = (await onChangeGroupRole({
          groupId: dataTransfer?._id,
          userIdToChange: add,
          newRole: "addOwner",
        })) as any;
        if (addOwnerResult?.error) {
          return onAddSnackbar(addOwnerResult?.error?.message, "error");
        }
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
        onChangeConversationWhenLeave();
        handleSuccess(result);
        break;
      case TYPE_POPUP.LEAVE_MEMBER:
        await left();
        onChangeConversationWhenLeave();
        break;
      case TYPE_POPUP.LEAVE_AND_NEW_ADD:
        await addAndRemove(userId, user?.id_rocket ?? "");
        await left();
        onChangeConversationWhenLeave();
        break;
      case TYPE_POPUP.LEAVE_OWNER:
        //NEW OWNER RANDOM
        const random = groupMembers
          ?.filter((m) => m._id !== user?.id_rocket)
          ?.filter((m) => m.roles.includes("member"))
          ?.pop()?._id;

        await addAndRemove(random, user?.id_rocket ?? "");
        await left();
        onChangeConversationWhenLeave();
        break;
      case TYPE_POPUP.RENAME_GROUP:
        await renameGroupApi();
        break;
      default:
        break;
    }
    setShowPopup(init);
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
                        size={42}
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

  return {
    handleNewAdd,
    handleChangeName,
    handleClosePopup,
    handleManageMember,
    _renderContentPopup,
    showPopup,
    setShowPopup,
  };
};
