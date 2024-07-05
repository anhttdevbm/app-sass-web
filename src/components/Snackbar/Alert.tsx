"use client";

import { memo, useEffect } from "react";
import { Alert as MuiAlert } from "@mui/material";
import { IconButton } from "components/shared";
import { SnackbarItem } from "store/app/reducer";
import CloseIcon from "icons/CloseIcon";
import { useSnackbar } from "store/app/selectors";

const Alert = (props: SnackbarItem) => {
  const { severity = "info", message, expiredIn = 3000, id } = props;

  const { onRemoveSnackbar } = useSnackbar();

  const onRemove = () => {
    onRemoveSnackbar(id);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      onRemoveSnackbar(id);
    }, expiredIn);
    return () => {
      clearTimeout(timeout);
    };
  }, [expiredIn, id, onRemoveSnackbar]);

  return (
    <MuiAlert
      severity={severity}
      variant="filled"
      sx={{
        backgroundColor: ({ palette }) => palette[severity].light,
        color: ({ palette }) => palette[severity].main,
      }}
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
      {message}
    </MuiAlert>
  );
};

export default memo(Alert);
