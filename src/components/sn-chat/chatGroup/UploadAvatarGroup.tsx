import { Box, Fab } from "@mui/material";
import { NS_CHAT_BOX } from "constant/index";
import UploadImageIcon from "icons/UploadImageIcon";
import { useTranslations } from "next-intl";
import { useSnackbar } from "store/app/selectors";
import { useChat } from "store/chat/selectors";

export const UploadAvatarGroup = () => {
  const { dataTransfer, onChangeGroupAvatar } = useChat();
  const commonChatBox = useTranslations(NS_CHAT_BOX);
  const { onAddSnackbar } = useSnackbar();
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "14px",
        right: "-10px",
        width: "32px",
        height: "32px",
        boxShadow: "2px 2px 24px 0px rgba(0, 0, 0, 0.10)",
        cursor: "pointer",
        borderRadius: "50%",
      }}
    >
      <label htmlFor="upload-photo">
        <input
          style={{ display: "none" }}
          id="upload-photo"
          name="upload-photo"
          type="file"
          onChange={async (e) => {
            if (e.currentTarget.files?.length) {
              await onChangeGroupAvatar(
                e.currentTarget.files[0],
                dataTransfer?._id,
              );
              onAddSnackbar(
                commonChatBox("chatBox.group.change_avatar_alert"),
                "success",
              );
            }
          }}
        />
        <Fab
          color="primary"
          size="small"
          component="span"
          aria-label="add"
          sx={{
            background: "#fff",
            padding: "10px",
            "&:hover": {
              background: "#fff",
            },
          }}
        >
          <UploadImageIcon />
        </Fab>
      </label>
    </Box>
  );
};
