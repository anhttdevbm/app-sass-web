import DialogLayout, { DialogLayoutProps } from "components/DialogLayout";
import { Text } from "components/shared";
import { NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { Button } from "./Button";
import { Box } from "@mui/material";

export type DialogProps = Omit<DialogLayoutProps, "children" | "title"> & {
  title: React.ReactNode | string;
  content?: string;
  cancelText?: string;
  submitText?: string;
  pending?: boolean;
  children?: React.ReactNode;
  headerProps?: {};
  contentProps?: {};
};

export const Dialog = (props: DialogProps) => {
  const t = useTranslations(NS_COMMON);

  const {
    title,
    content,
    cancelText = t("form.cancel"),
    submitText = t("form.confirm"),
    onClose,
    onSubmit,
    pending,
    sx,
    children,
    headerProps,
    contentProps,
    ...rest
  } = props;
  return (
    <DialogLayout
      hasDialogClose={false}
      sx={{ ...defaultSx.root, ...sx }}
      renderHeader={title}
      headerProps={{
        sx: {
          ...defaultSx.header,
          ...headerProps,
        },
      }}
      bottomProps={{
        sx: defaultSx.bottom,
      }}
      contentProps={{ sx: { mt: 3, pr: 0, ...contentProps } }}
      renderBottom={
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
          }}
        >
          <Button
            type="outlined"
            onClick={onClose}
            text={cancelText}
            style={{ padding: "12px 52px" }}
          />
          <Button
            type="gradient"
            onClick={onSubmit}
            text={submitText}
            style={{ padding: "12px 52px" }}
          />
        </Box>
      }
      onClose={onClose}
      {...rest}
    >
      {content && (
        <Text variant="body2" textAlign="center">
          {content}
        </Text>
      )}
      {children}
    </DialogLayout>
  );
};

const defaultSx = {
  root: {
    minWidth: { sm: 500 },
    minHeight: 230,
    px: 3,
  },
  bottom: {
    p: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    mt: 3,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid",
    borderColor: "grey.100",
    pb: 3,
    mx: 0,
    "& > p": {
      textAlign: "center",
    },
    "& > button": {
      top: 0,
      transform: "unset",
    },
  },
};
