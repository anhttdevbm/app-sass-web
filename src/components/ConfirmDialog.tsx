import { memo } from "react";
import DialogLayout, { DialogLayoutProps } from "./DialogLayout";
import { Button, Text } from "./shared";
import { NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";

export type ConfirmDialogProps = Omit<DialogLayoutProps, "children"> & {
  title: string;
  content: string;
  cancelText?: string;
  submitText?: string;
  pending?: boolean;
  children?: React.ReactNode;
};

const ConfirmDialog = (props: ConfirmDialogProps) => {
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
    ...rest
  } = props;
  return (
    <DialogLayout
      hasDialogClose={false}
      sx={{ ...defaultSx.root, ...sx }}
      renderHeader={title}
      headerProps={{
        sx: defaultSx.header,
      }}
      bottomProps={{
        sx: defaultSx.bottom,
      }}
      contentProps={{ sx: { mt: 3 } }}
      renderBottom={
        <>
          <Button
            type="button"
            variant="primaryOutlined"
            size="small"
            sx={defaultSx.button}
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            sx={defaultSx.button}
            type="button"
            size="small"
            onClick={onSubmit}
            pending={pending}
          >
            {submitText}
          </Button>
        </>
      }
      onClose={onClose}
      {...rest}
    >
      <Text variant="body2" textAlign="center">
        {content}
      </Text>
      {children}
    </DialogLayout>
  );
};

export default memo(ConfirmDialog);

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
  },
  header: {
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
  button: {
    minWidth: 120,
    mx: 1.5,
  },
};
