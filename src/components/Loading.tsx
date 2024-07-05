import { memo } from "react";
import {
  CircularProgress,
  Dialog,
  DialogProps,
  Stack,
  dialogClasses,
} from "@mui/material";
import { Text } from "./shared";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";

const Loading = (props: DialogProps & { message?: string }) => {
  const t = useTranslations(NS_COMMON);
  const { children, message = `${t("processing")}...`, ...rest } = props;
  return (
    <Dialog
      sx={{
        [`& .${dialogClasses.paper}`]: {
          backgroundColor: "transparent",
          backgroundImage: "none",
          boxShadow: "none",
        },
      }}
      {...rest}
    >
      <Stack alignItems="center" spacing={1}>
        <CircularProgress size={24} color="primary" />
        <Text variant="body2" fontWeight={600} color="text.primary">
          {message}
        </Text>
        {children}
      </Stack>
    </Dialog>
  );
};

export default memo(Loading);
