"use client";

import { memo } from "react";
import Alert from "./Alert";
import AlertMessage from "./AlertMessage";
import { Stack } from "@mui/material";
import { useSnackbar } from "store/app/selectors";

const Snackbar = () => {
  const { snackbarList, notificationList } = useSnackbar();

  if (notificationList.length) {
    return (
      <Stack
        spacing={1}
        position="fixed"
        zIndex={99999}
        top={40}
        right={10}
        minWidth={{ xs: "calc(100vw - 24px)", md: "auto" }}
      >
        <>
          {notificationList.map((item) => (
            <AlertMessage key={item.id} {...item} />
          ))}
        </>
      </Stack>
    );
  }
  if (!snackbarList.length) return null;

  return (
    <Stack
      spacing={1}
      position="fixed"
      zIndex={99999}
      top={24}
      left="50%"
      sx={{ transform: "translateX(-50%)" }}
      minWidth={{ xs: "calc(100vw - 24px)", md: "auto" }}
    >
      <>
        {snackbarList.map((item) => (
          <Alert key={item.id} {...item} />
        ))}
      </>
    </Stack>
  );
};

export default memo(Snackbar);
