"use client";

import { memo, useEffect } from "react";
import { Alert as MuiAlert } from "@mui/material";
import AlertTitle from "@mui/material/AlertTitle";
import { IconButton } from "components/shared";
import CloseIcon from "icons/CloseIcon";
import { useSnackbar } from "store/app/selectors";
import { useChatHelpers } from "store/chat/helpers";
import { MESSAGE_TYPE } from "store/chat/type";

const AlertMessage = (props: any) => {
  const { id, msg, room, sender } = props;
  const { isGroup } = useChatHelpers();
  const { onRemoveNotification } = useSnackbar();

  const onRemove = () => {
    onRemoveNotification(id);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      onRemoveNotification(id);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [id, onRemoveNotification]);

  const getContentMsg = () => {
    if (isGroup(room?.type))
      return `${sender?.fullname}: ${msg?.content?.replace(/<[^>]*>/g, "")}`;
    return msg?.content?.replace(/<[^>]*>/g, "");
  };

  return (
    <MuiAlert
      severity="info"
      variant="outlined"
      sx={{
        minWidth: "300px",
        backgroundColor: "#e5f6fd",
        color: "#014361",
        [` .MuiSvgIcon-root`]: {
          color: "#014361",
        },
      }}
      // icon={false}
      action={
        <IconButton
          aria-label="close"
          color="inherit"
          sx={{ p: 0.5 }}
          onClick={onRemove}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    >
      <AlertTitle>
        {isGroup(room?.type) ? room?.name : sender?.fullname}
      </AlertTitle>
      {msg?.type === MESSAGE_TYPE.TEXT ? getContentMsg() : "Sent a file"}
    </MuiAlert>
  );
};

export default memo(AlertMessage);
